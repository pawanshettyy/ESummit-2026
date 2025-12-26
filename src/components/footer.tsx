import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react";
import { Logo } from "./ui/logo";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { isSignedIn, user, isLoaded } = useUser();
  
  // Determine admin role (same logic as AdminPanel)
  let isAdmin = false;
  if (isLoaded && isSignedIn && user) {
    const adminRole = user.publicMetadata?.adminRole;
    const orgRole = user.organizationMemberships?.[0]?.role;
    // Fix: check for string equality, not reference
    if (adminRole && ["core", "jc", "oc"].includes(String(adminRole).toLowerCase())) {
      isAdmin = true;
    } else if (orgRole && ["org:admin", "admin"].includes(String(orgRole).toLowerCase())) {
      isAdmin = true;
    }
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="logo-wrapper">
                <Logo 
                  className="h-10 md:h-12 lg:h-14 w-auto object-contain"
                  alt="E-Summit 2026 Logo"
                />
              </div>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              India's premier entrepreneurship summit bringing together students, entrepreneurs, and investors.
            </p>
            <div className="flex gap-2">
              {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button> */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => window.open('https://www.instagram.com/tcet_axios_ecell/', '_blank')}
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => window.open('https://www.linkedin.com/company/axios-edic-tcet-mumbai/', '_blank')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                <Youtube className="h-4 w-4" />
              </Button> */}
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
            </ul>
          </div>

          {/* Booking & Info */}
          <div>
            <h4 className="mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
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
              <li>
                <button
                  onClick={() => onNavigate("venue")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Venue
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
                <div className="flex flex-col gap-1">
                  <a href="tel:+918766536270" className="hover:text-foreground transition-colors">Ayush Pardeshi (CEO): +91 87665 36270</a>
                  <a href="tel:+918928352406" className="hover:text-foreground transition-colors">Ahana Kulkarni (CTO): +91 89283 52406</a>
                  <a href="tel:+919004724466" className="hover:text-foreground transition-colors">Hredey Chaand (CMO): +91 90047 24466</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Thakur College of Engineering and Technology, Kandivali East, Mumbai - 400101</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <p>© 2026 E-Summit TCET. All rights reserved.</p>
            {/* Admin Access Link */}
            {isAdmin && (
              <button
                onClick={() => onNavigate("admin")}
                className="ml-4 underline text-primary hover:text-primary/80 transition-colors"
                aria-label="Admin access"
                title="Admin access"
              >
                Admin Access
              </button>
            )}
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