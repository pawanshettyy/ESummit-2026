import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Award, Users, Mail, Phone, ExternalLink, Trophy, Sparkles, Star, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Particles } from "../magicui/particles";
import { GradientText } from "../magicui/gradient-text";
import { Navigation } from "../navigation";
import { motion } from "motion/react";
import { EventRegistrationModal } from "../event-registration-modal";

export function TenMinuteMillionPage() {
  const { user, isSignedIn } = useUser();
  const [isDark, setIsDark] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationModal, setRegistrationModal] = useState<{
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
  }>({
    isOpen: false,
    eventId: "",
    eventTitle: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(savedTheme === "dark" || (!savedTheme && systemPrefersDark));
  }, []);

  const toggleDark = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const eventData = {
    id: 1,
    title: "The Ten Minute Million",
    tagline: "Pitch Your Vision, Secure Your Future",
    category: "Pitching Event",
    description: "A high-energy pitching event where founders get just 10 minutes to present their startup to investors and industry leaders, aiming to secure funding, partnerships, and validation on the spot.",
    date: "February 2-3, 2026",
    time: "10:00 AM – 5:00 PM (Both days)",
    venue: "SH-1",
    prize: "Seed Funding Opportunity",
    eligibility: "Quantum Pass required",
  };

  const speakers = [
    {
      name: "Rajesh Kumar",
      title: "Managing Partner",
      company: "Sequoia Capital India",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      bio: "15+ years in venture capital with $500M+ deployed across 50+ startups"
    },
    {
      name: "Priya Sharma",
      title: "Investment Director",
      company: "Accel Partners",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Former entrepreneur turned VC, specializing in early-stage SaaS investments"
    },
    {
      name: "Arjun Mehta",
      title: "General Partner",
      company: "Matrix Partners",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Led investments in 10+ unicorns, expert in deep tech and AI startups"
    },
    {
      name: "Sneha Iyer",
      title: "Principal",
      company: "Lightspeed Ventures",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Focus on consumer tech and fintech, mentor to 100+ startups"
    }
  ];

  const perks = [
    { icon: Trophy, text: "Direct pitch to top VCs and angel investors" },
    { icon: Star, text: "Seed funding opportunity for winning pitch" },
    { icon: Users, text: "Networking with 50+ investors and founders" },
    { icon: Award, text: "Certificate of participation and pitch deck review" },
    { icon: Sparkles, text: "Media coverage and PR opportunities" },
    { icon: CheckCircle2, text: "Access to exclusive investor database" }
  ];

  const primaryContacts: Array<{ name: string; role: string; phone?: string; email?: string }> = [
    { name: "Aman Pandey", role: "Core Member" },
    { name: "Yask Khatri", role: "Core Member" },
    { name: "Ashita Sharma", role: "Junior Core Member" },
    { name: "Vedant Singh", role: "OC Member" },
    { name: "Pratik Verma", role: "OC Member" },
    { name: "Roshni Joshi", role: "OC Member" },
    { name: "Niyatee Thakur", role: "OC Member" },
  ];

  const seniorContacts = [
    {
      name: "Dr. Vikram Desai",
      role: "Faculty Coordinator",
      phone: "+91 98765 43200",
      email: "vikram.desai@tcet.edu"
    },
    {
      name: "Prof. Anjali Reddy",
      role: "E-Cell Head",
      phone: "+91 98765 43201",
      email: "anjali.reddy@tcet.edu"
    }
  ];

  const venueDetails = {
    location: "Thakur College of Engineering and Technology",
    address: "Kandivali East, Mumbai - 400101, Maharashtra, India",
    room: "SH-4 (Seminar Hall 4)",
    directions: "Main campus building, easily accessible via Western Express Highway",
    parking: "Available on campus - Free for participants",
    accessibility: "Wheelchair accessible with ramps and elevators"
  };

  const handleRegistration = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to register for this event");
      return;
    }

    // Open registration modal
    setRegistrationModal({
      isOpen: true,
      eventId: "d1-ten-minute-million",
      eventTitle: "The Ten Minute Million",
    });
  };

  const handleNavigate = (page: string) => {
    // Direct navigation on same page
    if (window.location.pathname !== `/${page}`) {
      window.history.pushState({}, '', `/${page}`);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Particles className="absolute inset-0 pointer-events-none" quantity={50} />
      
      {/* Main Website Navigation */}
      <Navigation 
        currentPage="events" 
        onNavigate={handleNavigate}
        isDark={isDark}
        toggleDark={toggleDark}
      />

      {/* Main Content - Add top padding to account for fixed navigation */}
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-28 md:pt-32">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.setItem('navigateTo', 'events');
              window.location.href = '/';
            }}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowRight className="rotate-180 h-4 w-4" />
            Back to Events
          </Button>
        </div>
        {/* HERO SECTION WITH EVENT BRIEF */}
        <section id="event-brief" className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background mb-12 sm:mb-16">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
          
          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto space-y-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
              </motion.div>

              <GradientText className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6">
                The Ten Minute Million
              </GradientText>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                Pitch Your Vision, Secure Your Future
              </h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                Pitch your startup to Venture Capitalists and compete for seed funding opportunities. This is your chance to turn your vision into reality with backing from top investors.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-6 pt-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">{eventData.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{eventData.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">{eventData.venue}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="pt-6"
              >
                <Button 
                  size="lg" 
                  onClick={handleRegistration}
                  disabled={isRegistering}
                  className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    {isRegistering ? "Registering..." : "Register Now"}
                    {!isRegistering && <ArrowRight className="w-5 h-5" />}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Event Description */}
        <Card className="mb-8 sm:mb-10 md:mb-12">
          <CardHeader>
            <h2 className="text-2xl sm:text-3xl font-bold">About the Event</h2>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">{eventData.description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Prize</h4>
                <p className="text-muted-foreground text-sm sm:text-base">{eventData.prize}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Eligibility</h4>
                <p className="text-muted-foreground text-sm sm:text-base">{eventData.eligibility}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You'll Gain */}
        <Card className="mb-8 sm:mb-10 md:mb-12">
          <CardHeader>
            <h2 className="text-2xl sm:text-3xl font-bold">What You'll Gain</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {perks.map((perk, index) => (
                <div key={index} className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <perk.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-xs sm:text-sm">{perk.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Speakers/Judges */}
        <Card className="mb-8 sm:mb-10 md:mb-12">
          <CardHeader>
            <h2 className="text-2xl sm:text-3xl font-bold">Meet the VCs</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Pitch to leading Venture Capitalists</p>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-6">Will be announced soon</div>
            {/**
             * The VC panel grid is intentionally commented out per instruction.
             * Do not delete this code. Uncomment when panel details are ready.
             */}
            {/**
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
              {speakers.map((speaker, index) => (
                <div key={index} className="text-center">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 object-cover"
                  />
                  <h4 className="font-semibold text-sm sm:text-base">{speaker.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{speaker.title}</p>
                  <p className="text-xs sm:text-sm text-primary">{speaker.company}</p>
                  <p className="text-xs text-muted-foreground mt-2 hidden sm:block">{speaker.bio}</p>
                </div>
              ))}
            </div>
            */}
          </CardContent>
        </Card>

        {/* Venue Details */}
        <Card className="mb-8 sm:mb-10 md:mb-12">
          <CardHeader>
            <h2 className="text-2xl sm:text-3xl font-bold">Venue Information</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Location
                </h4>
                <p className="text-muted-foreground mb-1 text-sm sm:text-base">{venueDetails.location}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{venueDetails.address}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">{venueDetails.room}</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Directions</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{venueDetails.directions}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Parking</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{venueDetails.parking}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Accessibility</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{venueDetails.accessibility}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-xl sm:text-2xl font-bold">Event Coordinators</h3>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {primaryContacts.map((contact, index) => (
                  <div key={index} className="space-y-1 p-3 border rounded-lg bg-muted/20">
                    <h4 className="font-semibold text-sm sm:text-base">{contact.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{contact.role}</p>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                        <a href={`tel:${contact.phone}`} className="hover:text-primary break-all">{contact.phone}</a>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                        <a href={`mailto:${contact.email}`} className="hover:text-primary break-all">{contact.email}</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl sm:text-2xl font-bold">Faculty Coordinators</h3>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {seniorContacts.map((contact, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-semibold text-sm sm:text-base">{contact.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{contact.role}</p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    <a href={`tel:${contact.phone}`} className="hover:text-primary break-all">{contact.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    <a href={`mailto:${contact.email}`} className="hover:text-primary break-all">{contact.email}</a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <EventRegistrationModal
        isOpen={registrationModal.isOpen}
        onClose={() => setRegistrationModal({ isOpen: false, eventId: "", eventTitle: "" })}
        eventId={registrationModal.eventId}
        eventTitle={registrationModal.eventTitle}
        onSuccess={() => {
          setRegistrationModal({ isOpen: false, eventId: "", eventTitle: "" });
        }}
      />
    </div>
  );
}
