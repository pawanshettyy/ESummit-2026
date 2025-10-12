import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { isSignedIn } = useUser();
  
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="logo-wrapper">
                <img 
                  src="/assets/esummit-logo.png"
                  alt="E-Summit 2026 Logo" 
                  className="h-10 md:h-12 lg:h-14 w-auto object-contain"
                />
              </div>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              India's premier entrepreneurship summit bringing together students, entrepreneurs, and investors.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate("home")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("events")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("schedule")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("speakers")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Speakers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("sponsors")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sponsors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("team")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Team
                </button>
              </li>
            </ul>
          </div>

          {/* Booking & Info */}
          <div>
            <h4 className="mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate("booking")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Book Pass
                </button>
              </li>
              {isSignedIn && (
                <li>
                  <button
                    onClick={() => onNavigate("dashboard")}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onNavigate("venue")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Venue
                </button>
              </li>
              <li>
                <button className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="mailto:tcetedic@tcetmumbai.in" className="hover:text-foreground transition-colors">
                  tcetedic@tcetmumbai.in
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="tel:+912228471000" className="hover:text-foreground transition-colors">
                  +91 22 2847 1000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Thakur College of Engineering and Technology, Kandivali East, Mumbai - 400101</span>
              </li>
            </ul>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Office Hours:</p>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-4">
            <p>© 2026 E-Summit TCET. All rights reserved.</p>
            <button 
              onClick={() => onNavigate("admin-dashboard")}
              className="text-xs opacity-30 hover:opacity-100 transition-opacity"
              title="Admin Access"
            >
              •
            </button>
          </div>
          <div className="flex gap-6">
            <button 
              onClick={() => onNavigate("privacy-policy")}
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onNavigate("terms-of-service")}
              className="transition-colors hover:text-foreground"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => onNavigate("cookie-policy")}
              className="transition-colors hover:text-foreground"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}