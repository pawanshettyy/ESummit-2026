import { TextReveal } from "../magicui/text-reveal";
import { GradientText } from "../magicui/gradient-text";
import { AuroraText } from "../magicui/aurora-text";
import { HoverGlow } from "../accentricity/hover-glow";
import { FloatingCard } from "../accentricity/floating-card";
import { GlowCard } from "../accentricity/glow-card";
import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Trophy, Lightbulb, Users, Rocket, Calendar, MapPin, Target, Mail, Phone, Sparkles, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { API_BASE_URL } from "../../lib/api";
import { toast } from "sonner";

export function PitchArenaPage() {
  const { user, isSignedIn } = useUser();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [participantPhone, setParticipantPhone] = useState("");

  const eventId = "d1-pitch-arena"; // Pitch Arena event ID (Day 1)

  // Check if user is already registered for this event
  useEffect(() => {
    const checkRegistration = async () => {
      if (!isSignedIn || !user?.id) {
        setIsCheckingRegistration(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/events/registered/${user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.registeredEventIds) {
            setIsRegistered(data.data.registeredEventIds.includes(eventId));
          }
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [isSignedIn, user?.id, eventId]);

  // Handle opening registration form
  const handleRegisterClick = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to register for events");
      return;
    }
    
    // Pre-fill form with user data
    setParticipantName(user?.fullName || "");
    setParticipantEmail(user?.primaryEmailAddress?.emailAddress || "");
    setShowRegistrationForm(true);
  };

  // Handle event registration with booking ID
  const handleRegister = async () => {
    if (!bookingId.trim()) {
      toast.error("Booking ID Required", {
        description: "Please enter your booking ID to register",
      });
      return;
    }

    if (!participantName.trim() || !participantEmail.trim() || !participantPhone.trim()) {
      toast.error("All Fields Required", {
        description: "Please fill in all the required fields",
      });
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/events/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user?.id,
          eventId: eventId,
          bookingId: bookingId.trim(),
          participantName: participantName.trim(),
          participantEmail: participantEmail.trim(),
          participantPhone: participantPhone.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsRegistered(true);
        setShowRegistrationForm(false);
        toast.success("Successfully registered for Pitch Arena!", {
          description: "Check your dashboard to see this event in your schedule",
        });
      } else {
        // Handle specific error cases
        if (data.error === "INVALID_BOOKING_ID") {
          toast.error("Invalid Booking ID", {
            description: "The booking ID you entered is not valid or not found in our system",
          });
        } else if (data.error === "BOOKING_NOT_VERIFIED") {
          toast.error("Booking Not Verified", {
            description: "Your booking has not been verified yet. Please wait for admin verification.",
          });
        } else if (data.error === "INSUFFICIENT_PASS") {
          const errorData = data.data || {};
          toast.error("Pass Tier Insufficient", {
            description: errorData.message || "This event requires a higher tier pass. Please upgrade your pass.",
          });
        } else if (data.error === "Already registered for this event") {
          setIsRegistered(true);
          setShowRegistrationForm(false);
          toast.info("Already Registered", {
            description: "You're already registered for this event",
          });
        } else {
          toast.error("Registration Failed", {
            description: data.error || "Something went wrong. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration Failed", {
        description: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // --- SPEAKERS / JUDGES DATA ---
  // const speakers = [
  //   {
  //     name: "Judge 1",
  //     role: "Investor",
  //     image: "/placeholder-user.jpg",
  //   },
  //   {
  //     name: "Judge 2",
  //     role: "VC Panelist",
  //     image: "/placeholder-user.jpg",
  //   },
  //   {
  //     name: "Speaker 1",
  //     role: "Startup Mentor",
  //     image: "/placeholder-user.jpg",
  //   },
  // ];

  // --- PERKS DATA ---
  const perks = [
    { label: "Mentorship from Founders", desc: "Get guidance from industry experts", icon: Lightbulb },
    { label: "Funding Opportunities", desc: "Connect with investors & VCs", icon: Trophy },
    { label: "Networking Sessions", desc: "Meet founders & investors", icon: Users },
    { label: "Participation Certificate", desc: "Recognition for all participants", icon: Rocket },
  ];

  const contacts = [
    {
      name: "Akshay Upadhyay",
      role: "OC Member",
      number: "+91 XXXXXXXXXX",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      name: "Saloni Suthar",
      role: "OC Member",
      number: "+91 XXXXXXXXXX",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      name: "Shruti Jadhav",
      role: "OC Member",
      number: "+91 XXXXXXXXXX",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      name: "Sakshi Thakur",
      role: "OC Member",
      number: "+91 XXXXXXXXXX",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
  ];

  const coreTeam = [
    {
      name: "Sayyam Lohade",
      role: "Core Member - Secretary",
      number: "+91 XXXXXXXXXX",
      email: "sayyam.lohade@example.com",
    },
    {
      name: "Rudransh Puthan",
      role: "Junior Core - Operating JC",
      number: "+91 XXXXXXXXXX",
      email: "rudransh.puthan@example.com",
    },
  ];

  const facultyCoordinators = [
    {
      name: "Mr. Vinayak Bachel",
      role: "Faculty Coordinator",
      duty: "Pitching Events",
      email: "vinayak.bachel@thakureducation.org",
    },
    {
      name: "Ms. Apeksha Waghmare",
      role: "Faculty Coordinator",
      duty: "Pitching Events",
      email: "apeksha.waghmare@thakureducation.org",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        {/* HERO SECTION WITH EVENT BRIEF */}
        <section id="event-brief" className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
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
                Pitch Arena
              </GradientText>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-primary via-red-500 to-red-400 bg-clip-text text-transparent">
                Transform Your Idea Into Reality
              </h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                A premier platform for first-time founders to pitch their innovative ideas to industry experts, investors, and mentors. Get shortlisted for the next round and turn your startup dreams into reality.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-6 pt-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">January 23, 2026</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">10:00 AM - 1:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">SH-3, 532, 533, 504</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="pt-6"
              >
                {isCheckingRegistration ? (
                  <Button
                    disabled
                    className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-primary to-red-500 text-white shadow-lg"
                  >
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Checking...
                  </Button>
                ) : isRegistered ? (
                  <Button
                    disabled
                    style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                    className="px-12 py-4 text-lg font-bold shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Registered Successfully
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegisterClick}
                    className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-primary to-red-500 hover:from-primary/90 hover:to-red-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      Register Now
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Registration Form Dialog */}
        <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Register for Pitch Arena</DialogTitle>
              <DialogDescription>
                Please fill in your details and provide your booking ID to register for this event.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="booking-id" className="text-base font-semibold">
                  Booking ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="booking-id"
                  placeholder="Enter your KonfHub booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  You received this ID when you booked your pass on KonfHub
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant-name" className="text-base font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="participant-name"
                  placeholder="Enter your full name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participant-email" className="text-base font-semibold">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="participant-email"
                  type="email"
                  placeholder="Enter your email"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participant-phone" className="text-base font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="participant-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={participantPhone}
                  onChange={(e) => setParticipantPhone(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRegistrationForm(false)}
                className="flex-1"
                disabled={isRegistering}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRegister}
                disabled={isRegistering}
                className="flex-1 bg-gradient-to-r from-primary to-red-500 hover:from-primary/90 hover:to-red-500/90"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* SPEAKERS & JUDGES */}
        <section id="speakers" className="bg-muted/10 px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              <Users className="w-4 h-4 mr-2" />
              Expert Panel
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Speakers & Judges</GradientText>
            </h2>
            <p className="text-2xl md:text-3xl font-semibold text-primary mt-8">
              Will be announced soon
            </p>
            <p className="text-muted-foreground mt-4">
              Stay tuned for updates on our expert panel of industry leaders and successful entrepreneurs
            </p>
          </motion.div>
        </section>

        {/* PERKS*/}
        <section id="perks" className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              <Trophy className="w-4 h-4 mr-2" />
              Benefits
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Why Participate?</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlock exclusive opportunities and resources for your startup journey
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {perks.map((perk, index) => (
              <motion.div
                key={perk.label}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <FloatingCard>
                  <HoverGlow glowColor="#dc2626">
                    <GlowCard glowColor="#dc2626">
                      <Card className="text-center transition-all border-primary/20 h-full group">
                        <CardContent className="flex flex-col items-center p-8">
                          <motion.div
                            className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-red-500/10 flex items-center justify-center"
                            whileHover={{ scale: 1.15, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <perk.icon className="h-8 w-8 text-primary" />
                          </motion.div>

                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{perk.label}</h3>

                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {perk.desc}
                          </p>
                        </CardContent>
                      </Card>
                    </GlowCard>
                  </HoverGlow>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT INFO */}
        <section id="contacts" className="bg-muted/10 px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              <Phone className="w-4 h-4 mr-2" />
              Get In Touch
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Organizing Committee</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet our dedicated team making Pitch Arena a success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {contacts.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex justify-center"
              >
                <FloatingCard>
                  <GlowCard glowColor="#dc2626">
                    <Card className="w-full border-primary/20 h-full">
                      <CardContent className="flex flex-col items-center p-6">
                        <motion.div
                          className="relative mb-4"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-red-500/20 rounded-full blur-lg" />
                          <img
                            src={person.image}
                            alt={person.name}
                            className="relative h-24 w-24 rounded-full object-cover border-4 border-primary/40"
                          />
                        </motion.div>

                        <h3 className="text-lg font-bold mb-1 text-center">{person.name}</h3>
                        <Badge variant="secondary" className="mb-3 text-xs">
                          {person.role}
                        </Badge>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-xs">{person.number}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </GlowCard>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CORE TEAM */}
        <section id="core-team" className="bg-muted/10 px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              <Users className="w-4 h-4 mr-2" />
              Leadership Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              <GradientText>Core Team</GradientText>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center max-w-4xl mx-auto">
            {coreTeam.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex justify-center"
              >
                <FloatingCard>
                  <GlowCard glowColor="#dc2626">
                    <Card className="w-full max-w-[380px] border-primary/20">
                      <CardContent className="flex flex-col items-center p-8 space-y-3">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-red-500/20 flex items-center justify-center mb-2">
                          <Users className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-center">{person.name}</h3>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {person.role}
                        </Badge>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm">{person.number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm break-all">{person.email}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </GlowCard>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/*  FACULTY COORDINATORS */}
        <section id="faculty" className="bg-muted/10 px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              <Target className="w-4 h-4 mr-2" />
              Faculty Guidance
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              <GradientText>Faculty Coordinators</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Expert faculty members guiding the Pitch Arena event
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center max-w-4xl mx-auto">
            {facultyCoordinators.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex justify-center"
              >
                <FloatingCard>
                  <GlowCard glowColor="#dc2626">
                    <Card className="w-full max-w-[380px] border-primary/20">
                      <CardContent className="flex flex-col items-center p-8 space-y-3">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-red-500/20 flex items-center justify-center mb-2">
                          <Target className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-center">{person.name}</h3>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {person.role}
                        </Badge>
                        <p className="text-sm text-muted-foreground text-center">
                          <strong>Duty:</strong> {person.duty}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm break-all">{person.email}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </GlowCard>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* VENUE */}
        <section id="venue" className="py-20 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                <GradientText>Event Venue</GradientText>
              </h2>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <FloatingCard>
                  <GlowCard glowColor="#dc2626">
                    <Card className="border-primary/20 overflow-hidden">
                      <CardContent className="p-12 text-center">
                        <motion.div
                          className="mb-6 h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-red-500/10 flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <MapPin className="w-10 h-10 text-primary" />
                        </motion.div>

                        <h3 className="text-2xl font-bold mb-4">Thakur College of Engineering and Technology</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          SH-3, 532, 533, 504
                        </p>
                      </CardContent>
                    </Card>
                  </GlowCard>
                </FloatingCard>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}