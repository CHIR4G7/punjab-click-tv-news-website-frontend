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