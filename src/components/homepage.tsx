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
  user?: {
    passes?: Array<{
      id: string;
      passType: string;
      status: string;
    }>;
  };
}

export function HomePage({ onNavigate, user }: HomePageProps) {
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
      name: "Devang Raja",
      title: "Founder, Venture Wolf",
      topic: "The Ten Minute Deal & Future of Startup Funding",
      image: "/assets/panel/devang_raja.png",
    },
    {
      name: "Nikhil Jadhav",
      title: "VC, Ten Minute Deal",
      topic: "Startup Leadership & Investment Strategy",
      image: "/assets/panel/nikhil_jadhav.jpg",
    },
  ];

  const stats = [
    { label: "Events", value: "16+", icon: Trophy },
    { label: "Judges & Speakers", value: "30+", icon: Users },
    { label: "Expected Attendees", value: "1000+", icon: Users },
    { label: "Startup Pitches", value: "50+", icon: Building2 },
  ];

  const highlights = [
    {
      title: "Funding & Investment Events",
      description: "Connect with VCs at The Ten Minute Deal: Pitch to Win for real fundraising opportunities. TRL 5+ startups pitch for equity and seed funding.",
    },
    {
      title: "Incubation & Mentorship",
      description: "Present at Pitch Arena: Idea to Reality (idea stage) and The Incubator Summit: Earn Your Launchpad to receive mentorship, incubation offers, and acceleration support from top Mumbai and Pune incubation centers.",
    },
    {
      title: "Skill-Building Workshops",
      description: "3-hour hands-on workshops in Design Thinking & Innovation Strategy, Finance & Marketing for Startups, and Data Analytics & Business Development Essentials for future-ready entrepreneurs.",
    },
    {
      title: "Competitions",
      description: "Compete in IPL Auction: The Bid for Brilliance, Startup League Game: Build Your Empire, and AI Buildathon: The Innovation Challenge. Network at The Startup Expo, The Internship Fair, and Startup Youth Conclave with E-Cells from other colleges.",
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
              className="mb-4 text-xl text-foreground"
            />

            <TextReveal>
              <p className="mb-8 text-foreground">
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
            className="mx-auto mt-8 sm:mt-12 grid max-w-2xl grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-4"
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
                      <div className="text-xs sm:text-sm text-foreground capitalize">
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
                    <div className="text-sm text-foreground">
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
          <div className="mb-12 text-center px-4">
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
              Summit Benefits
            </Badge>
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Why Attend E-Summit 2026?</h2>
            <p className="text-sm sm:text-base text-foreground max-w-2xl mx-auto">
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
                    <p className="text-sm text-foreground leading-relaxed">
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
          <div className="mb-12 text-center px-4">
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
              Inaugural Edition 2026
            </Badge>
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Why This Inaugural Edition is Special
            </h2>
            <p className="text-sm sm:text-base text-foreground max-w-2xl mx-auto">
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
                  <p className="text-sm text-foreground leading-relaxed">
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
                  <p className="text-sm text-foreground leading-relaxed">
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
                  <p className="text-sm text-foreground leading-relaxed">
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

      <section className="border-b py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">Featured Speakers</h2>
            <p className="text-lg md:text-xl text-foreground">
              Learn from the best in the industry
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-64">
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

      {/* News and Updates Section */}
      <section className="border-b py-16 bg-gradient-to-br from-background via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center px-4">
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">
              Latest Updates
            </Badge>
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">News & Updates</h2>
            <p className="text-sm sm:text-base text-foreground max-w-2xl mx-auto">
              Stay informed with the latest announcements, updates, and exciting developments for E-Summit 2026.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Keynote Speakers Confirmed",
                date: "Jan 15, 2026",
                content:
                  "Exciting news! We've confirmed our keynote speakers including Devang Raja from Venture Wolf and Nikhil Jadhav from The Ten Minute Deal. Don't miss their insights on startup growth and investment strategies.",
                icon: Users,
              },
              {
                title: "Major Sponsors Onboarded",
                date: "Jan 16, 2026",
                content:
                  "We're thrilled to announce partnerships with leading sponsors including Venture Loop (Co-powered by), Hire Helmet (Support Sponsor), Mad Over Donuts, 99Pancakes, Nissin, and Red Bull. Their support will enhance the event experience.",
                icon: Building2,
              },
              {
                title: "Thakur Student Pass Registration Closing",
                date: "Jan 28, 2026",
                content:
                  "THAKUR STUDENT PASS will be closed at 29 Jan 2026 at 12 AM",
                icon: Calendar,
              },
            ].map((news, index) => (
              <motion.div
                key={news.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 group border-border/50 hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <news.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {news.date}
                      </div>
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {news.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {(!user?.passes || user.passes.length === 0) && (
        <section className="border-t bg-gradient-to-br from-primary/5 via-background to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-foreground">Ready to Join E-Summit 2026?</h2>
            <p className="mb-8 text-foreground">
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
      )}
    </div>
  );
}