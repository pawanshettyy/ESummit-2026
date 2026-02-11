import { type ElementType } from "react";
import { motion } from "motion/react";
import { Particles } from "../magicui/particles";
import { GradientText } from "../magicui/gradient-text";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Calendar, Clock, MapPin, Mail, Phone, ArrowRight, ArrowLeft, Trophy, Users, Target, CheckCircle2, MessageCircle } from "lucide-react";
import { GlassCard } from "../accentricity/glass-card";

type PrizeObject = {
  first?: string;
  second?: string;
  third?: string | null;
  total?: string;
};

type EventData = {
  title: string;
  tagline?: string;
  description: string;
  date?: string;
  time?: string;
  venue?: string;
  prize?: string | PrizeObject;
  eligibility?: string;
};

type Perk = { icon?: ElementType; text: string };

type Contact = {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
};

type Judge = {
  name: string;
  role?: string;
  image?: string;
  linkedin?: string;
};

type Sponsor = {
  name: string;
  logo: string;
  website?: string;
};

interface EventPageTemplateProps {
  event: EventData;
  eventId: string; // Add eventId prop
  registrationUrl: string; // Google Form URL for registration
  perks?: Perk[];
  panelTitle?: string;
  panelSubtitle?: string;
  panelMembers?: PanelMember[]; // kept for future use
  judges?: Judge[];
  sponsors?: Sponsor[];
  sponsorTitle?: string;
  primaryContacts?: Contact[];
  seniorContacts?: Contact[];
}

export function EventPageTemplate({
  event,
  eventId,
  registrationUrl,
  perks = [],
  panelTitle = "Speakers / Judges",
  panelSubtitle,
  panelMembers,
  judges,
  sponsors,
  sponsorTitle = "Event Sponsors",
  primaryContacts = [],
  seniorContacts = [],
}: EventPageTemplateProps) {

  const handleBackToEvents = () => {
    sessionStorage.setItem('navigateTo', 'events');
    window.location.href = '/';
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
                  disabled
                  className="group relative px-10 py-6 text-lg font-bold bg-muted text-muted-foreground rounded-2xl cursor-not-allowed inline-flex items-center gap-3"
                >
                  Event Completed - Thank You!
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About the Event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <GlassCard>
            <Card className="border-0 bg-transparent">
              <CardHeader className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">About the Event</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <p className="text-base sm:text-lg text-foreground/80 mb-6 leading-relaxed">{event.description}</p>
                {(event.prize || event.eligibility) && (
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {event.prize && (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-primary/20">
                            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <h4 className="font-bold text-base sm:text-lg text-foreground">Prize Pool</h4>
                        </div>
                        {typeof event.prize === 'string' ? (
                          <p className="text-foreground/70 text-sm sm:text-base leading-relaxed">{event.prize}</p>
                        ) : (
                          <div className="text-foreground/70 text-sm sm:text-base leading-relaxed">
                            {event.prize.first && (
                              <div className="mb-1"><strong>1st Prize:</strong> {event.prize.first}</div>
                            )}
                            {event.prize.second && (
                              <div className="mb-1"><strong>2nd Prize:</strong> {event.prize.second}</div>
                            )}
                            {event.prize.third && event.prize.third !== '—' && event.prize.third !== '-' && (
                              <div className="mb-1"><strong>3rd Prize:</strong> {event.prize.third}</div>
                            )}
                            {event.prize.total && (
                              <div className="mt-2 font-semibold"><strong>Total:</strong> {event.prize.total}</div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                    {event.eligibility && (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-primary/10 border border-purple-500/20"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-purple-500/20">
                            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                          </div>
                          <h4 className="font-bold text-base sm:text-lg text-foreground">Eligibility</h4>
                        </div>
                        <p className="text-foreground/70 text-sm sm:text-base leading-relaxed">{event.eligibility}</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </GlassCard>
        </motion.div>

        {/* What You'll Gain */}
        {perks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <GlassCard>
              <Card className="border-0 bg-transparent">
                <CardHeader className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What You'll Gain</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {perks.map((perk, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="group relative"
                      >
                        <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-purple-500/5 hover:border-primary/40 transition-all duration-300 h-full shadow-sm hover:shadow-lg">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            {perk.icon ? (
                              <perk.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                            ) : (
                              <div className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center text-primary font-bold flex-shrink-0">✓</div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">{perk.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GlassCard>
          </motion.div>
        )}

        {/* Panel: VCs / Judges / Speakers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <GlassCard>
            <Card className="border-0 bg-transparent">
              <CardHeader className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{panelTitle}</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                {panelSubtitle && <p className="text-foreground/70 text-sm sm:text-base pt-2">{panelSubtitle}</p>}
              </CardHeader>
              <CardContent>
                {judges && judges.length > 0 ? (
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
                    {judges.map((judge, index) => (
                      <motion.div
                        key={judge.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group"
                      >
                        <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 h-full">
                          <div className="relative h-48">
                            <img
                              src={judge.image}
                              alt={judge.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <h3 className="font-semibold text-lg mb-1">{judge.name}</h3>
                              <p className="text-sm text-white/90">{judge.role}</p>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            {judge.linkedin && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => window.open(judge.linkedin, '_blank')}
                              >
                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-foreground/80 font-medium">Will be announced soon</span>
                    </div>
                  </motion.div>
                )}
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
          </GlassCard>
        </motion.div>

        {/* Event Sponsors */}
        {sponsors && sponsors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <GlassCard>
              <Card className="border-0 bg-transparent">
                <CardHeader className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{sponsorTitle}</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
                    {sponsors.map((sponsor, index) => (
                      <motion.div
                        key={sponsor.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="group"
                      >
                        {sponsor.website ? (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <div className="p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 bg-gradient-to-br from-background via-primary/5 to-purple-500/5 hover:shadow-lg text-center">
                              <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                className="h-16 sm:h-20 w-auto object-contain mx-auto mb-3 group-hover:scale-105 transition-transform duration-300"
                              />
                              <h4 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">{sponsor.name}</h4>
                            </div>
                          </a>
                        ) : (
                          <div className="p-6 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-purple-500/5 text-center">
                            <img
                              src={sponsor.logo}
                              alt={sponsor.name}
                              className="h-16 sm:h-20 w-auto object-contain mx-auto mb-3"
                            />
                            <h4 className="text-sm sm:text-base font-semibold text-foreground">{sponsor.name}</h4>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GlassCard>
          </motion.div>
        )}

        {/* Venue */}
        {(event.venue || event.date || event.time) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <GlassCard>
              <Card className="border-0 bg-transparent overflow-hidden">
                <CardHeader className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Venue Information</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-primary/5 border border-primary/20">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/20">
                          <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base sm:text-lg text-foreground mb-2">Location</h4>
                          {event.venue && <p className="text-foreground/80 text-sm sm:text-base mb-3 leading-relaxed">{event.venue}</p>}
                          {event.date && (
                            <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-primary/20">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-foreground/70 font-medium">{event.date}</span>
                              </div>
                              {event.time && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-primary/20">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span className="text-foreground/70 font-medium">{event.time}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GlassCard>
          </motion.div>
        )}

        {/* Contacts */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard>
              <Card className="border-0 bg-transparent h-full">
                <CardHeader className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">Event Coordinators</h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {primaryContacts.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-foreground/70 text-sm">Will be announced soon</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {primaryContacts.map((contact, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="space-y-2 p-4 sm:p-5 border-2 border-primary/20 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 hover:border-primary/40 transition-all duration-300"
                        >
                          <h4 className="font-bold text-base sm:text-lg text-foreground">{contact.name}</h4>
                          {contact.role && <p className="text-xs sm:text-sm text-primary font-medium">{contact.role}</p>}
                          <div className="space-y-2 pt-2">
                            {contact.email && (
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70">
                                <div className="p-1.5 rounded-md bg-primary/10">
                                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                </div>
                                <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors break-all">{contact.email}</a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <GlassCard>
              <Card className="border-0 bg-transparent h-full">
                <CardHeader className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">Faculty Coordinators</h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {seniorContacts.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-foreground/70 text-sm">Will be announced soon</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {seniorContacts.map((contact, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="space-y-2 p-4 sm:p-5 border-2 border-purple-500/20 rounded-xl bg-gradient-to-br from-purple-500/5 to-primary/5 hover:border-purple-500/40 transition-all duration-300"
                        >
                          <h4 className="font-bold text-base sm:text-lg text-foreground">{contact.name}</h4>
                          {contact.role && <p className="text-xs sm:text-sm text-purple-500 font-medium">{contact.role}</p>}
                          <div className="space-y-2 pt-2">
                            {contact.phone && (
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70">
                                <div className="p-1.5 rounded-md bg-purple-500/10">
                                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                                </div>
                                <a href={`tel:${contact.phone}`} className="hover:text-purple-500 transition-colors break-all">{contact.phone}</a>
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70">
                                <div className="p-1.5 rounded-md bg-purple-500/10">
                                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                                </div>
                                <a href={`mailto:${contact.email}`} className="hover:text-purple-500 transition-colors break-all">{contact.email}</a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </GlassCard>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
