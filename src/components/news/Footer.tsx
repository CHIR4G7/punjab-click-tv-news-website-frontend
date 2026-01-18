import { socialMediaLinks } from "@/data/constants";
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Advertise With Us", href: "/advertise" },
  ],
  sections: [
    { label: "Chandigarh", href: "/chandigarh" },
    { label: "Punjab", href: "/punjab" },
    { label: "India", href: "/india" },
    { label: "World", href: "/world" },
    { label: "Sports", href: "/sports" },
    { label: "Business", href: "/business" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

const getIcon = {
  Facebook: <Facebook />,
  Instagram: <Instagram />,
  Youtube: <Youtube />,
  Twitter: <Twitter />,
};

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-12">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              {/* <div className="w-12 h-12 bg-accent rounded-sm flex items-center justify-center">
                <span className="text-accent-foreground font-headline font-bold text-2xl">
                  ਖ਼
                </span>
              </div> */}
              <img src="public/logo.png" style={{
                width:"70px",
                height:"70px"
              }}/>
              <div>
                <h2 className="font-headline font-bold text-xl leading-none">
                  Punjab Click TV
                </h2>
                <p className="text-xs text-primary-foreground/70">
                  ਪੰਜਾਬ ਦੀ ਆਵਾਜ਼
                </p>
              </div>
            </a>
            <p className="text-sm text-primary-foreground/70 mb-4 leading-relaxed">
              Your trusted source for the latest news from Punjab, Chandigarh,
              and beyond. Delivering accurate, timely, and comprehensive
              coverage in English, Hindi, and Punjabi.
            </p>
            <div className="flex items-center gap-3">
              {socialMediaLinks.map((social, index) => {
                return (
                  <a
                    href={social.url}
                    className="hover:text-accent transition-colors"
                    aria-label="Twitter"
                    target="_blank"
                  >
                    {getIcon[social.name]}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-headline font-semibold text-lg mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections Links */}
          <div>
            <h3 className="font-headline font-semibold text-lg mb-4">
              Sections
            </h3>
            <ul className="space-y-2">
              {footerLinks.sections.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-headline font-semibold text-lg mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Sector 17, Chandigarh, India - 160017</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 172 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contact@punjabkhabar.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-sm text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-sm hover:bg-accent/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Punjab Khabar. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-primary-foreground/60 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
