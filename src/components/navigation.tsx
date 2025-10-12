import { useState, useEffect } from "react";
import { Menu, Calendar, Users, MapPin, Trophy, Ticket, LogIn, Moon, Sun, User, LogOut, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion, AnimatePresence } from "motion/react";
import { GradientText } from "./magicui/gradient-text";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
  toggleDark: () => void;
  isUserAuthenticated?: boolean;
  userData?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export function Navigation({ 
  currentPage, 
  onNavigate, 
  isDark, 
  toggleDark,
  isUserAuthenticated = false,
  userData = null,
  onLogout = () => {},
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn, user } = useUser();

  // Check if user has any valid admin role (Core, JC, or OC)
  const VALID_ADMIN_ROLES = ['Core', 'JC', 'OC'];
  const userRole = user?.publicMetadata?.role as string;
  const isAdmin = userRole && VALID_ADMIN_ROLES.includes(userRole);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Base nav items always visible
  const baseNavItems = [
    { id: "home", label: "Home", icon: null },
    { id: "events", label: "Events", icon: Trophy },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "speakers", label: "Speakers", icon: Users },
    { id: "venue", label: "Venue", icon: MapPin },
    { id: "sponsors", label: "Sponsors", icon: null },
    { id: "team", label: "Team", icon: null },
  ];

  // Add Dashboard to nav items if user is signed in
  const navItems = isSignedIn 
    ? [
        ...baseNavItems,
        { id: "dashboard", label: "Dashboard", icon: User },
      ]
    : baseNavItems;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto">
        <motion.div
          className={`relative overflow-hidden rounded-full border transition-all duration-300 ${
            isScrolled
              ? "bg-background/80 backdrop-blur-md shadow-lg shadow-primary/5"
              : "bg-background/60 backdrop-blur-sm"
          }`}
          animate={{
            boxShadow: isScrolled
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative flex h-16 items-center justify-between px-6">
            {/* Logo */}
            <motion.button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 transition-colors hover:text-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >

              <div className="hidden sm:block">
                <div className="logo-wrapper">
                  <img 
                    src="/assets/esummit-logo.png"
                    alt="E-Summit 2026 Logo" 
                    className="h-10 md:h-12 lg:h-14 w-auto object-contain"
                  />
                </div>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-4 py-2 rounded-full transition-all ${
                    currentPage === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{item.label}</span>
                  <AnimatePresence>
                    {currentPage === item.id && (
                      <motion.div
                        layoutId="navPill"
                        className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDark}
                  className="hidden sm:inline-flex rounded-full hover:bg-primary/10"
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Use Clerk UserButton if signed in with Clerk, otherwise use custom auth */}
              {isSignedIn ? (
                <div className="hidden sm:block">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </div>
              ) : isUserAuthenticated && userData ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden sm:block">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full hover:bg-primary/10 gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getUserInitials(userData.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="max-w-[100px] truncate">{userData.name}</span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userData.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userData.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate("booking")}>
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>Book Pass</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:block"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate("auth")}
                    className="rounded-full hover:bg-primary/10"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Button
                  size="sm"
                  onClick={() => onNavigate("booking")}
                  className="rounded-full bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Book Pass
                </Button>
              </motion.div>

              {/* Mobile menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] p-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigate to different sections of E-Summit 2026
                  </SheetDescription>
                  <div className="flex flex-col h-full">
                    {/* Header - with extra padding-right to avoid close button overlap */}
                    <div className="flex items-center gap-2 border-b px-6 py-4 pr-14">
                      <img 
                        src="/assets/esummit-logo.png"
                        alt="E-Summit 2026 Logo" 
                        className="h-8 md:h-10 lg:h-12 w-auto object-contain -my-1 md:-my-1.5"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleDark} 
                        className="rounded-full h-9 w-9 flex-shrink-0"
                      >
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* User Profile Section - Show Clerk or custom auth */}
                    {isSignedIn ? (
                      <div className="border-b px-4 py-4">
                        <div className="flex items-center gap-3">
                          <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                              elements: {
                                avatarBox: "h-10 w-10",
                              },
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Clerk Account</p>
                            <p className="text-xs text-muted-foreground">
                              Signed in with Clerk
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : isUserAuthenticated && userData && (
                      <div className="border-b px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getUserInitials(userData.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{userData.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {userData.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                          <Button
                            key={item.id}
                            variant={currentPage === item.id ? "default" : "ghost"}
                            className="w-full justify-start rounded-full h-11"
                            onClick={() => {
                              onNavigate(item.id);
                              setIsOpen(false);
                            }}
                          >
                            <span>{item.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t px-4 py-4 flex flex-col gap-2">
                      {isUserAuthenticated ? (
                        <>
                          <Button
                            variant="outline"
                            className="w-full rounded-full h-11"
                            onClick={() => {
                              onNavigate("dashboard");
                              setIsOpen(false);
                            }}
                          >
                            <span>Dashboard</span>
                          </Button>
                          <Button
                            className="w-full rounded-full h-11 bg-gradient-to-r from-primary to-primary/90"
                            onClick={() => {
                              onNavigate("booking");
                              setIsOpen(false);
                            }}
                          >
                            <span>Book Pass</span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            className="w-full rounded-full h-11"
                            onClick={() => {
                              onNavigate("auth");
                              setIsOpen(false);
                            }}
                          >
                            <span>Login</span>
                          </Button>
                          <Button
                            className="w-full rounded-full h-11 bg-gradient-to-r from-primary to-primary/90"
                            onClick={() => {
                              onNavigate("booking");
                              setIsOpen(false);
                            }}
                          >
                            <span>Book Pass</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}