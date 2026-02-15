import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { makeApiRequest } from "./apis";
import { resolve } from "path";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

interface ImageKitAuthData {
  token: string;
  expire: number;
  signature: string;
}

interface ImageKitAuthResponse {
  status: boolean;
  message: string;
  data: ImageKitAuthData;
}

export async function uploadImage(file: File, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const auth = (await makeApiRequest("api/v1/imagekit-auth", "GET"))
        .data as ImageKitAuthResponse;
      const value = auth.data as ImageKitAuthData;
      console.log(value.token);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("token", value.token);
      formData.append("expire", value.expire.toString());
      formData.append("signature", value.signature);
      formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);

      const res = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      return res.json();
    } catch (error) {
      if (attempt === retries) {
        throw new Error(error);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

export async function uploadWithLimit(files: File[], limit = 5) {
  const results: any[] = [];
  
  for (let i = 0; i < files.length; i += limit) {
    const batch = files.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(file => uploadImage(file)));
    results.push(...batchResults);
  }
  
  return results;
}

export async function urlToFile(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], "image.jpg", { type: blob.type });
}

export function getTimeAgo(publishedDate: string): string {
  const now = new Date();
  const published = new Date(publishedDate);
  const diffInMs = now.getTime() - published.getTime();
  
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  console.log(`${Math.floor(days / 365)}y`)
  return `${Math.floor(days / 365)}y`;
}

// Add these functions to your frontend/src/lib/utils.ts file

// Cookie and token utilities for client-side auth checking
export const getAuthToken = (): string | null => {
  try {
    // Get token from cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('access_token=')
    );
    
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      return token ? decodeURIComponent(token) : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const token = getAuthToken();
    console.log('Token found:', !!token); // Debug log
    
    if (!token) {
      return false;
    }
    
    // Basic JWT token validation (check if it's not expired)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    console.log('Token payload:', payload); // Debug log
    console.log('Token expires at:', new Date(payload.exp * 1000)); // Debug log
    console.log('Current time:', new Date(currentTime * 1000)); // Debug log
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token expired');
      removeAuthToken(); // Clean up expired token
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    removeAuthToken(); // Clean up invalid token
    return false;
  }
};

export const removeAuthToken = (): void => {
  try {
    // Remove from cookies with multiple attempts to ensure cleanup
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export const getUserFromToken = (): any | null => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return null;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.userId || payload.id || payload.sub,
      name: payload.name,
      username: payload.username,
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};