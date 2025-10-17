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
      description: "Compete for prizes worth ₹15L+ across multiple categories including B-Plan, Pitch Deck, and Innovation Challenge with mentorship from industry experts.",
    },
    {
      title: "Expert Workshops",
      description: "Participate in hands-on workshops led by successful entrepreneurs, venture capitalists, and industry leaders covering business strategy, funding, and growth.",
    },
    {
      title: "Networking Opportunities",
      description: "Connect with 5000+ students, 100+ startups, angel investors, and venture capitalists in curated networking sessions and interactive roundtables.",
    },
    {
      title: "Panel Discussions",
      description: "Gain insights from panel discussions featuring founders of unicorn startups, corporate leaders, and innovation pioneers sharing real-world experiences.",
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

      {/* Key Highlights */}
      <section className="border-b py-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
              Summit Benefits
            </Badge>
            <h2 className="mb-4">Why Attend E-Summit 2026?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlock unprecedented opportunities for growth, learning, and collaboration 
              at India's most comprehensive student entrepreneurship summit.
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
                whileHover={{ y: -8 }}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/30 relative overflow-hidden group border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 relative z-10">
                    <div className="inline-block mb-3">
                      <h3 className="text-lg font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                        {highlight.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* First Edition Special */}
      <section className="border-b py-16 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
              Inaugural Edition 2026
            </Badge>
            <h2 className="mb-4">
              Why This Inaugural Edition is Special
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join us in establishing the cornerstone of TCET's entrepreneurial legacy. 
              This pioneering edition marks the beginning of an enduring tradition of innovation, 
              leadership, and transformative business excellence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg group">
                <CardContent className="p-8">
                  <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Foundational Legacy</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Become a pioneering participant in TCET's landmark entrepreneurship initiative. 
                    Your presence helps establish a prestigious tradition that will inspire future 
                    generations of innovators and business leaders.
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
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg group">
                <CardContent className="p-8">
                  <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Innovative Framework</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Experience cutting-edge formats, curated workshops, and bespoke networking 
                    opportunities meticulously designed to foster entrepreneurial excellence and 
                    strategic collaboration among industry stakeholders.
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
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg group">
                <CardContent className="p-8">
                  <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Elite Networking</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gain privileged access to exclusive inaugural edition benefits, including 
                    direct engagement with industry pioneers, venture capitalists, and thought 
                    leaders shaping the future of entrepreneurship.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
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