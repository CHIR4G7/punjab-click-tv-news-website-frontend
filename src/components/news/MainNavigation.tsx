import { useState } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Trending", href: "/trending" },
  { label: "Chandigarh", href: "/chandigarh" },
  { label: "Punjab", href: "/punjab" },
  { label: "India", href: "/india" },
  { label: "World", href: "/world" },
  { label: "Business", href: "/business" },
  { label: "Sports", href: "/sports" },
  { label: "Technology", href: "/technology" },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "HI", label: "हिंदी" },
  { code: "PA", label: "ਪੰਜਾਬੀ" },
];

const MainNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex flex-row">
            <img
              src="/logo.png"
              style={{
                width: "70px",
                height: "70px",
              }}
            />
            <a href="/" className="flex items-center gap-2">
              {/* <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
              <span className="text-accent-foreground font-headline font-bold text-xl">ਖ਼</span>
            </div> */}
              <div className="hidden sm:block">
                <h1 className="font-headline font-bold text-sm sm:text-lg md:text-xl lg:text-sm text-foreground leading-none">
                  Punjab Click TV
                </h1>
                {/* <p className="text-[10px] text-muted-foreground">ਪੰਜਾਬ ਦੀ ਆਵਾਜ਼</p> */}
              </div>
            </a>
          </div>
          {/* Logo */}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search news..."
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-48 md:w-64 h-9 px-3 pr-9 bg-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent animate-fade-in"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2 gap-1">
                  {selectedLang}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Subscribe Button - Desktop */}
            <Button
              variant="default"
              size="sm"
              className="hidden md:flex h-9 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Subscribe
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link py-3 px-0 border-b border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button
                variant="default"
                className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Subscribe
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default MainNavigation;
