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

  // Event date: February 2-3, 2026
  const eventDate = new Date("2026-02-02T00:00:00");

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
    { label: "Events", value: "16+", icon: Trophy },
    { label: "Judges & Speakers", value: "50+", icon: Users },
    { label: "Expected Attendees", value: "2000+", icon: Users },
    { label: "Startup Pitches", value: "50+", icon: Building2 },
  ];

  const highlights = [
    {
      title: "Funding & Investment Events",
      description: "Connect with VCs and Angel Investors at The Ten Minute Million (TTMM) and Angel Investors Roundtable for real fundraising opportunities. TRL 5+ startups pitch for equity and seed funding.",
    },
    {
      title: "Incubation & Mentorship",
      description: "Present at Pitch Arena (idea stage) and Incubator Summit to receive mentorship, incubation offers, and acceleration support from top Mumbai and Pune incubation centers.",
    },
    {
      title: "Skill-Building Workshops",
      description: "3-hour hands-on workshops in Design Thinking & Innovation Strategy, Finance & Marketing, and Data Analytics & Business Development for future-ready entrepreneurs.",
    },
    {
      title: "Competitions & Networking",
      description: "Compete in IPL Auction, Startup League, and AI Build-A-Thon. Network at Startup Expo, Internship & Job Fair, Networking Arena, and Startup Youth Conclave with E-Cells from other colleges.",
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
              <Badge className="bg-primary text-primary-foreground border border-primary/50 px-4 py-2 text-sm font-semibold shadow-lg animate-pulse">
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
                  className="h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 w-auto object-contain"
                  alt="E-Summit 2026 Logo"
                />
              </div>
            </motion.h1>

            <WordReveal
              text="The Beginning of Legacy"
              className="mb-4 text-xl text-muted-foreground"
            />

            <TextReveal>
              <p className="mb-8 text-muted-foreground">
                Thakur College of Engineering and Technology announces its inaugural E-Summit 2026, 
                celebrating 25 years of excellence. In collaboration with TIMSR & TGBS, organized by TCET's AXIOS EDIC. 
                A two-day celebration uniting visionaries, investors, startup founders, and students to ignite 
                a lasting culture of entrepreneurship and innovation-driven excellence.
              </p>
            </TextReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            >
              <AnimatedBorder>
                <Button
                  size="lg"
                  onClick={() => onNavigate("booking")}
                  className="w-full sm:w-auto"
                >
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </AnimatedBorder>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("events")}
                className="w-full sm:w-auto"
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
            className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-2 sm:gap-4"
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
                    <CardContent className="flex flex-col items-center justify-center p-3 sm:p-6">
                      <div className="mb-1 sm:mb-2 text-2xl sm:text-3xl text-primary">
                        {value}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground capitalize">
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
      <section className="border-b py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
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
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="mb-2 sm:mb-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" />
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

      {/* Featured Speakers Section */}
      <section className="relative border-b py-20 overflow-hidden">
        <Particles className="absolute inset-0 opacity-30" quantity={50} ease={60} />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-12 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              Featured Speakers
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Learn from the best in the industry
            </motion.p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <Card className="overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center p-12 md:p-16 text-center min-h-[300px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <Users className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                  <div className="mb-3">
                    <span className="text-2xl font-semibold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                      Speakers Announcement Coming Soon
                    </span>
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    We're finalizing our incredible lineup of industry leaders, successful entrepreneurs, 
                    and investors. Stay tuned for the official announcement!
                  </p>
                </motion.div>
                <Button
                  onClick={() => onNavigate("speakers")}
                  variant="outline"
                >
                  Visit Speakers Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* COMMENTED SPEAKERS CAROUSEL - Uncomment when speakers are ready
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
      */}

      {/* Instagram Feed Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
              Follow Us
            </Badge>
            <h2 className="mb-4">Latest from Instagram</h2>
            <p className="text-muted-foreground">
              Stay connected with our journey - latest posts, reels, and event updates
            </p>
          </div>

          <div className="relative mx-auto max-w-6xl">
            {/* Instagram Feed Embed - Using Elfsight Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <Card className="overflow-hidden border-primary/10">
                <CardContent className="p-6">
                  {/* Elfsight Instagram Feed Widget */}
                  <div 
                    className="elfsight-app-d8e42e88-8b7d-4c7b-9c42-1e3f5a6b8c9d"
                    data-elfsight-app-lazy
                  />
                  
                  {/* Fallback content while widget loads */}
                  <div className="min-h-[400px] flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-center"
                    >
                      <div className="mb-4">
                        <svg
                          className="w-12 h-12 mx-auto text-primary/40"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">Loading Instagram feed...</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-center"
            >
              <Button
                size="lg"
                onClick={() => window.open('https://www.instagram.com/tcet_axios_ecell/', '_blank')}
                className="gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow @tcet_axios_ecell on Instagram
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Join our community and be part of the entrepreneurial revolution
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMMENTED NEWS SECTION - Old static news
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
                title: "FREE Pixel Pass Available",
                date: "Jan 15, 2026",
                content:
                  "Access 5 exciting events absolutely FREE! Limited seats available for the inaugural edition.",
              },
              {
                title: "New Pitching Events",
                date: "Jan 20, 2026",
                content:
                  "Pitch to VCs and Angel Investors at exclusive events. Secure seed funding for your startup!",
              },
              {
                title: "Prize Pool Updated",
                date: "Jan 25, 2026",
                content:
                  "Total prize money exceeds ₹5 Lakhs with additional funding opportunities from investors!",
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
      */}

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