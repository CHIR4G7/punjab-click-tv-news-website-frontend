import { socialMediaLinks } from "@/data/constants";
import { MapPin, Calendar, Twitter, Facebook, Instagram, Youtube } from "lucide-react";

const TopUtilityBar = () => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getIcon = {
    "Facebook":<Facebook/>,
    "Instagram":<Instagram/>,
    "Youtube":<Youtube/>,
    "Twitter":<Twitter/>
  }

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container flex items-center justify-between py-2 text-xs">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span>Chandigarh, India</span>
        </div>
        
        <div className="hidden md:flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{currentDate}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* <a href="#" className="hover:text-accent transition-colors" aria-label="Twitter">
            <Twitter className="h-4 w-4" />
          </a>
          <a href="#" className="hover:text-accent transition-colors" aria-label="Facebook">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="#" className="hover:text-accent transition-colors" aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="#" className="hover:text-accent transition-colors" aria-label="YouTube">
            <Youtube className="h-4 w-4" />
          </a> */}

          {socialMediaLinks.map((social,index)=>{
            return (
              <a href={social.url} className="hover:text-accent transition-colors" aria-label="Twitter" target="_blank" key={index}>
            {getIcon[social.name]}
          </a>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default TopUtilityBar;
