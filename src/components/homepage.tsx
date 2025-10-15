import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Trophy,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Particles } from "./magicui/particles";
import { TextReveal, WordReveal } from "./magicui/text-reveal";
import { GradientText } from "./magicui/gradient-text";
import { Spotlight } from "./magicui/spotlight";
import { Meteors } from "./magicui/meteors";
import { AnimatedBorder } from "./magicui/animated-border";
import { motion } from "motion/react";
import { Logo } from "./ui/logo";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentSpeaker, setCurrentSpeaker] = useState(0);

  // Event date: January 23-24, 2026
  const eventDate = new Date("2026-01-23T00:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference / (1000 * 60 * 60)) % 24,
          ),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const speakers = [
    {
      name: "Dr. Rajesh Kumar",
      title: "CEO, TechVentures India",
      topic: "Building Scalable Startups in Emerging Markets",
      image:
        "https://images.unsplash.com/photo-1689150571822-1b573b695391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBzcGVha2VyfGVufDF8fHx8MTc1OTQyODg5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Priya Sharma",
      title: "Founder, StartupHub",
      topic: "From Idea to IPO: The Startup Journey",
      image:
        "https://images.unsplash.com/photo-1590097520505-416422f07ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwZW50cmVwcmVuZXVyJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc1OTQyODg5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Amit Patel",
      title: "VP Engineering, GlobalTech",
      topic: "AI & the Future of Entrepreneurship",
      image:
        "https://images.unsplash.com/photo-1675716921224-e087a0cca69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBldmVudHxlbnwxfHx8fDE3NTk0MTY5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const stats = [
    { label: "Events", value: "30+", icon: Trophy },
    { label: "Speakers", value: "50+", icon: Users },
    { label: "Attendees", value: "5000+", icon: Users },
    { label: "Colleges", value: "100+", icon: Building2 },
  ];

  const highlights = [
    {
      title: "Startup Competitions",
      description: "Compete for prizes worth ₹10L+",
    },
    {
      title: "Expert Workshops",
      description: "Learn from industry leaders",
    },
    {
      title: "Networking Sessions",
      description: "Connect with investors & founders",
    },
    {
      title: "Panel Discussions",
      description: "Insights from successful entrepreneurs",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-secondary py-20">
        <Particles
          className="absolute inset-0"
          quantity={100}
        />
        <Spotlight className="hidden md:block" />
        <div className="absolute inset-0 overflow-hidden">
          <Meteors number={15} />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex justify-center"
            >
              <Badge className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 text-primary border border-primary/30 px-4 py-2 text-sm backdrop-blur-sm animate-pulse">
                Inaugural Edition - Making History
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 flex justify-center items-center"
            >
              <div className="logo-wrapper logo-wrapper-hero">
                <Logo 
                  className="h-40 md:h-48 lg:h-56 w-auto object-contain"
                  alt="E-Summit 2026 Logo"
                />
              </div>
            </motion.h1>

            <WordReveal
              text="TCET's First-Ever Entrepreneurship Summit"
              className="mb-4 text-xl text-muted-foreground"
            />

            <TextReveal>
              <p className="mb-8 text-muted-foreground">
                Be part of history as Thakur College launches
                Mumbai's most ambitious student entrepreneurship
                initiative. Join 5000+ students, entrepreneurs,
                and investors for two groundbreaking days of
                inspiration, innovation, and limitless
                possibilities.
              </p>
            </TextReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <AnimatedBorder>
                <Button
                  size="lg"
                  onClick={() => onNavigate("booking")}
                >
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </AnimatedBorder>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("events")}
              >
                View Events
              </Button>
            </motion.div>
          </div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-4"
          >
            {Object.entries(countdown).map(
              ([unit, value], index) => (
                <motion.div
                  key={unit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.9 + index * 0.1,
                  }}
                >
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="mb-2 text-3xl text-primary">
                        {value}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {unit}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Card className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="mb-3 h-8 w-8 text-primary" />
                    </motion.div>
                    <div className="mb-1 text-3xl text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* First Edition Special */}
      <section className="border-b py-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
              First Edition Highlights
            </Badge>
            <h2 className="mb-4">
              Why This Inaugural Edition is Special
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Be a pioneer in TCET's entrepreneurial journey.
              This first edition sets the foundation for years
              to come.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full text-center border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="mb-2">Make History</h3>
                  <p className="text-sm text-muted-foreground">
                    Be among the first participants of TCET's
                    landmark entrepreneurship initiative
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full text-center border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="mb-2">Fresh Perspectives</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience innovative formats and unique
                    opportunities designed from ground up
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full text-center border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="mb-2">Exclusive Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Limited inaugural edition benefits and
                    networking opportunities with industry
                    pioneers
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="border-b py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4">Why Attend E-Summit?</h2>
            <p className="text-muted-foreground">
              Experience the best of entrepreneurship ecosystem
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full transition-shadow hover:shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative z-10">
                    <h3 className="mb-2">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Speakers Carousel */}
      <section className="border-b py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4">Featured Speakers</h2>
            <p className="text-muted-foreground">
              Learn from the best in the industry
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-64 md:h-auto md:w-1/2">
                  <ImageWithFallback
                    src={speakers[currentSpeaker].image}
                    alt={speakers[currentSpeaker].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="flex flex-col justify-center p-8 md:w-1/2">
                  <h3 className="mb-2">
                    {speakers[currentSpeaker].name}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {speakers[currentSpeaker].title}
                  </p>
                  <p className="mb-6 text-sm">
                    {speakers[currentSpeaker].topic}
                  </p>
                  <Button
                    onClick={() => onNavigate("speakers")}
                    variant="outline"
                  >
                    View All Speakers
                  </Button>
                </CardContent>
              </div>
            </Card>

            {/* Carousel controls */}
            <div className="mt-4 flex justify-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  setCurrentSpeaker((prev) =>
                    prev === 0 ? speakers.length - 1 : prev - 1,
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {speakers.map((_, index) => (
                <Button
                  key={index}
                  size="icon"
                  variant={
                    currentSpeaker === index
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setCurrentSpeaker(index)}
                  className="h-2 w-2 rounded-full p-0"
                />
              ))}
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  setCurrentSpeaker((prev) =>
                    prev === speakers.length - 1 ? 0 : prev + 1,
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4">Latest Updates</h2>
            <p className="text-muted-foreground">
              Stay updated with E-Summit news
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Registration Open",
                date: "Jan 15, 2026",
                content:
                  "Early bird passes now available at special rates. Register before Feb 1st!",
              },
              {
                title: "New Speaker Announced",
                date: "Jan 20, 2026",
                content:
                  "Excited to announce keynote speaker from Fortune 500 company.",
              },
              {
                title: "Prize Pool Increased",
                date: "Jan 25, 2026",
                content:
                  "Total prize money now exceeds ₹15 Lakhs across all competitions!",
              },
            ].map((news) => (
              <Card
                key={news.title}
                className="transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {news.date}
                  </div>
                  <h3 className="mb-2">{news.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {news.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-br from-primary/5 via-background to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Ready to Join E-Summit 2026?</h2>
          <p className="mb-8 text-muted-foreground">
            Secure your spot at India's premier entrepreneurship
            event
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate("booking")}
            >
              Book Your Pass Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("schedule")}
            >
              View Schedule
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}