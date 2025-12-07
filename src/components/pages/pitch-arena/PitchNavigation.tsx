import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, ArrowLeft, User, Ticket, LogIn } from "lucide-react";

import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Logo } from "../../ui/logo";



interface PitchNavProps {
  onBack: () => void;
  onHome: () => void;
  onDashboard: () => void;
  onNavigate: (id: string) => void;
  userHasPass?: boolean;
  isUserAuthenticated?: boolean;
}

export function PitchNavigation({
  onBack,
  onHome,
  onDashboard,
  onNavigate,
  userHasPass = false,
  isUserAuthenticated = false,
}: PitchNavProps) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { id: "event-brief", label: "Event Brief" },
    { id: "speakers", label: "Speakers & Judges" },
    { id: "perks", label: "Perks" },
    { id: "contacts", label: "Contact Info" },
    { id: "senior-contacts", label: "Senior Contacts" },
    { id: "venue", label: "Venue" },
  ];

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-x-0 top-0 z-50 px-4 py-3"
      aria-label="Pitch Navigation"
    >
      <div className="mx-auto max-w-6xl">
        <div
          className={`relative rounded-full border bg-background/70 backdrop-blur-md px-4 py-2 flex items-center justify-between shadow-md`}
        >
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-full h-10 w-auto px-3 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline"></span>
            </Button>
          </div>

          {/* CENTER: Logo */}
          
          <div className="absolute left-[48%] top-1/2 -translate-y-1/2 pointer-events-none">


            <button
              onClick={onHome}
              aria-label="Go to home"
              className="pointer-events-auto"
            >
              <Logo className="h-10 w-auto" />
            </button>
          </div>

          {/* RIGHT: Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("event-brief")}
              className="rounded-full h-10 px-3"
            >
              Event 
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("speakers")}
              className="rounded-full h-10 px-3"
            >
             Speakers & Judges
            </Button>

             <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("perks")}
              className="rounded-full h-10 px-3"
            >
              Perks 
            </Button>
             <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("venue")}
              className="rounded-full h-10 px-3"
            >
              Venue
            </Button>

           <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("contacts")}
              className="rounded-full h-10 px-3"
            >
            Contacts
            </Button>
   
            <Button
              variant="ghost"
              size="sm"
              onClick={onDashboard}
              className="rounded-full h-10 px-3"
            >
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
     
            {!userHasPass && (
              <Button
                size="sm"
                onClick={() => onNavigate("auth")}
                className="rounded-full h-10 px-4 bg-gradient-to-r from-primary to-primary/90 shadow-sm"
              >
                <Ticket className="mr-2 h-4 w-4" />
                Register
              </Button>
            )}
          </div>

          {/* MOBILE: Menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-full h-10 w-10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <Logo className="h-8 w-auto" />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          setOpen(false);
                          onNavigate("auth");
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    {navItems.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          onNavigate(n.id);
                          setOpen(false);
                        }}
                        className="w-full text-left rounded-lg px-4 py-3 hover:bg-muted/50 transition flex items-center gap-3"
                      >
                        <span className="font-medium">{n.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="px-4 py-4 border-t flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full h-11"
                      onClick={() => {
                        setOpen(false);
                        onNavigate("contacts");
                      }}
                    >
                      Contact
                    </Button>
                    {!userHasPass ? (
                      <Button
                        className="flex-1 rounded-full h-11 bg-gradient-to-r from-primary to-primary/90"
                        onClick={() => {
                          setOpen(false);
                          onNavigate("booking");
                        }}
                      >
                        Register
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 rounded-full h-11"
                        onClick={() => {
                          setOpen(false);
                          onDashboard();
                        }}
                      >
                        Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
