import { useState, type ElementType } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Particles } from "../magicui/particles";
import { GradientText } from "../magicui/gradient-text";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Calendar, Clock, MapPin, Mail, Phone, ArrowRight, ArrowLeft } from "lucide-react";

type EventData = {
  title: string;
  tagline?: string;
  description: string;
  date?: string;
  time?: string;
  venue?: string;
  prize?: string;
  eligibility?: string;
};

type Perk = { icon?: ElementType; text: string };

type Contact = {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
};

type PanelMember = {
  name: string;
  title?: string;
  company?: string;
  image?: string;
  bio?: string;
};

interface EventPageTemplateProps {
  event: EventData;
  perks?: Perk[];
  panelTitle?: string;
  panelSubtitle?: string;
  panelMembers?: PanelMember[]; // kept for future use
  primaryContacts?: Contact[];
  seniorContacts?: Contact[];
}

export function EventPageTemplate({
  event,
  perks = [],
  panelTitle = "Speakers / Judges",
  panelSubtitle,
  panelMembers,
  primaryContacts = [],
  seniorContacts = [],
}: EventPageTemplateProps) {
  const { isSignedIn } = useUser();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleBackToEvents = () => {
    window.location.href = "/events";
  };

  const handleRegistration = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to register for this event");
      return;
    }
    setIsRegistering(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Registration successful! Check your email for confirmation.");
    } catch (e) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const hasDetailsRow = Boolean(event.date || event.time || event.venue);

  return (
    <div className="min-h-screen bg-background relative">
      <Particles className="absolute inset-0 pointer-events-none" quantity={50} />

      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-28 md:pt-32">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={handleBackToEvents}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
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
              <GradientText className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6">
                {event.title}
              </GradientText>

              {event.tagline && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                  {event.tagline}
                </h2>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                {event.description}
              </motion.p>

              {hasDetailsRow && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex flex-wrap justify-center gap-6 pt-4"
                >
                  {event.date && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                  )}
                  {event.time && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                  )}
                  {event.venue && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-medium">{event.venue}</span>
                    </div>
                  )}
                </motion.div>
              )}

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

        {/* About the Event */}
        <Card className="mb-8 sm:mb-10 md:mb-12">
          <CardHeader>
            <h2 className="text-2xl sm:text-3xl font-bold">About the Event</h2>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">{event.description}</p>
            {(event.prize || event.eligibility) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {event.prize && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Prize</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">{event.prize}</p>
                  </div>
                )}
                {event.eligibility && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Eligibility</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">{event.eligibility}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* What You'll Gain */}
        {perks.length > 0 && (
          <Card className="mb-8 sm:mb-10 md:mb-12">
            <CardHeader>
              <h2 className="text-2xl sm:text-3xl font-bold">What You'll Gain</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    {perk.icon ? (
                      <perk.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                    ) : (
                      <span className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0">•</span>
                    )}
                    <p className="text-xs sm:text-sm">{perk.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Panel: VCs / Judges / Speakers */}
        <Card className="mb-8 sm:mb-10 md:mb-12">
          <CardHeader>
            <h2 className="text-2xl sm:text-3xl font-bold">{panelTitle}</h2>
            {panelSubtitle && <p className="text-muted-foreground text-sm sm:text-base">{panelSubtitle}</p>}
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-6">Will be announced soon</div>
            {/**
             * The panel members grid is intentionally commented out per instruction.
             * Do not delete this code. Uncomment when panel details are ready.
             */}
            {/**
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
              {panelMembers?.map((member, index) => (
                <div key={index} className="text-center">
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 object-cover"
                    />
                  )}
                  <h4 className="font-semibold text-sm sm:text-base">{member.name}</h4>
                  {member.title && <p className="text-xs sm:text-sm text-muted-foreground">{member.title}</p>}
                  {member.company && <p className="text-xs sm:text-sm text-primary">{member.company}</p>}
                  {member.bio && <p className="text-xs text-muted-foreground mt-2 hidden sm:block">{member.bio}</p>}
                </div>
              ))}
            </div>
            */}
          </CardContent>
        </Card>

        {/* Venue */}
        {(event.venue || event.date || event.time) && (
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
                  {event.venue && <p className="text-muted-foreground text-sm sm:text-base">{event.venue}</p>}
                  {event.date && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">{event.date}{event.time ? ` • ${event.time}` : ""}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacts */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-xl sm:text-2xl font-bold">Event Coordinators</h3>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {primaryContacts.length === 0 && (
                <div className="text-muted-foreground">Will be announced soon</div>
              )}
              {primaryContacts.map((contact, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-semibold text-sm sm:text-base">{contact.name}</h4>
                  {contact.role && <p className="text-xs sm:text-sm text-muted-foreground">{contact.role}</p>}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl sm:text-2xl font-bold">Faculty Coordinators</h3>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {seniorContacts.length === 0 && (
                <div className="text-muted-foreground">Will be announced soon</div>
              )}
              {seniorContacts.map((contact, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-semibold text-sm sm:text-base">{contact.name}</h4>
                  {contact.role && <p className="text-xs sm:text-sm text-muted-foreground">{contact.role}</p>}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
