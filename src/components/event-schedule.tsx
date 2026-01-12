import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Filter, Plus, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
// import { toast } from "sonner";
import { motion } from "motion/react";
import { BentoGrid, BentoCard } from "./magicui/bento-grid";
import { PulseDot } from "./accentricity/pulse-dot";
import { FloatingCard } from "./accentricity/floating-card";
import { RippleBackground } from "./accentricity/ripple-background";

const EventSchedule = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");

  // Define event type for consistency
  type Event = {
    id: string;
    time: string;
    title: string;
    category: string;
    venue: string;
    speaker: string | null;
    description: string;
    duration: string;
    eligibility?: string;
    prerequisite?: string;
    prize?: string;
  };

  const categories = [
    { id: "all", label: "All Events", color: "default" },
    { id: "pitching", label: "Pitching Events", color: "accent" },
    { id: "competitions", label: "Competitions", color: "primary" },
    { id: "workshops", label: "Workshops", color: "secondary" },
    { id: "networking", label: "Networking", color: "outline" },
  ];

  const events: { preEvent: Event[]; day1: Event[]; day2: Event[] } = {
    preEvent: [
      {
        id: "pre-udaan",
        time: "TBA",
        title: "Udaan - Roadmap to Entrepreneurship",
        category: "workshops",
        venue: "TBA",
        speaker: "Prof. Chaitali & Dr. Pankaj Nandurkar",
        description: "Turn Ideas into Impact. A focused, hands-on workshop designed to help you transform your ideas into actionable business models. Learn practical startup frameworks, gain real-world insights, and take your first confident step into entrepreneurship.",
        duration: "1 hour",
        eligibility: "Open to students, aspiring founders, and innovators",
      },
    ],
    day1: [
      {
        id: "d1-registration",
        time: "09:00 - 09:30",
        title: "Registration & Welcome",
        category: "networking",
        venue: "Main Entrance",
        speaker: null,
        description: "Check-in and receive your welcome kit",
        duration: "30 min",
      },
      {
        id: "d1-inaugural",
        time: "09:30 - 10:30",
        title: "Inaugural Ceremony",
        category: "networking",
        venue: "Main Auditorium",
        speaker: "Chief Guest",
        description: "Official opening of E-Summit 2026",
        duration: "1 hour",
      },
      {
        id: "d1-ten-minute-million",
        time: "10:00 - 17:00",
        title: "The Ten Minute Deal: Pitch to Win",
        category: "pitching",
        venue: "SH-1",
        speaker: "5 Venture Capitalists",
        description: "A high-energy pitching event where founders get just 10 minutes to present their startup to investors and industry leaders, aiming to secure funding, partnerships, and validation on the spot.",
        duration: "7 hours",
        eligibility: "TRL 4+ startups",
        prerequisite: "Pitch deck required (PDF, max 15 slides)",
      },

      {
        id: "d1-pitch-arena",
        time: "10:00 - 17:00",
        title: "Pitch Arena: Idea to Reality",
        category: "pitching",
        venue: "314, 315, 316",
        speaker: "3 Industry Mentors",
        description: "Step into the arena! Founders pitch to top-tier mentors for real-time feedback and expert guidance to launch their ideas.",
        duration: "7 hours",
        eligibility: "Early stage startups, first-time founders welcome",
      },
      {
        id: "d1-incubator-summit",
        time: "10:00 - 17:00",
        title: "The Incubator Summit: Earn Your Launchpad",
        category: "pitching",
        venue: "SSC TIMSR",
        speaker: "5 Incubation Centre Evaluators",
        description: "Where ideas earn their launchpad. Founders pitch to evaluators from five top incubation centers, competing for a spot and seed support to accelerate their venture.",
        duration: "7 hours",
        eligibility: "Early stage startups",
      },
      {
        id: "d1-ai-buildathon-start",
        time: "10:00 - 17:00",
        title: "AI Contest: The Innovation Challenge (Day 1)",
        category: "competitions",
        venue: "SH 3",
        speaker: "Tech Mentors",
        description: "Push the boundaries of AI. Tackle a real-world problem by designing and presenting an innovative, AI-driven solution. Showcase your technical skills and creativity to win the challenge.",
        duration: "7 hours",
        prize: "₹1,50,000",
        eligibility: "All pass holders",
        prerequisite: "Laptop with development environment",
      },
      {
        id: "d1-ipl-auction",
        time: "10:00 - 17:00",
        title: "IPL Auction: The Bid for Brilliance",
        category: "competitions",
        venue: "601, TIMSR",
        speaker: "Business Strategy Mentors",
        description: "Master the art of the deal. In this high-energy bidding game, build your dream team with a limited budget. Test your strategic thinking and financial savvy to outbid rivals and create a winning roster.",
        duration: "7 hours",
        prize: "TBD",
        eligibility: "All pass holders",
      },
      {
        id: "d1-biz-arena",
        time: "10:00 - 13:00",
        title: "Startup League Game: Build Your Empire",
        category: "competitions",
        venue: "301, TIMSR",
        speaker: "Business Mentors",
        description: "Step into the founder's seat. Run a virtual startup in this fast-paced simulation. Make critical decisions on product, marketing, and funding to outmaneuver competitors and dominate the market.",
        duration: "3 hours",
        prize: "₹1,00,000",
        eligibility: "All pass holders",
      },

      {
        id: "d1-design-thinking",
        time: "10:00 - 17:00",
        title: "Design Thinking & Innovation Strategy Workshop",
        category: "workshops",
        venue: "Lab 522 & 523",
        speaker: "Design Expert",
        description: "Unlock Your Creative Potential. Master the tools to solve complex problems and generate groundbreaking ideas. This hands-on workshop will equip you with a powerful framework for innovation.",
        duration: "7 hours (3 Hour Sessions)",
        eligibility: "Silicon & Quantum Pass holders",
        prerequisite: "Notepad recommended",
      },
      {
        id: "d1-finance-marketing",
        time: "10:00 - 17:00",
        title: "Finance & Marketing for Startups Workshop",
        category: "workshops",
        venue: "Lab 524 & 525",
        speaker: "Industry Expert",
        description: "Build a Solid Foundation for Your Venture. Get essential, practical knowledge on managing your startup's finances and crafting marketing strategies that actually convert.",
        duration: "7 hours (3 Hour Sessions)",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d1-data-analytics",
        time: "10:00 - 17:00",
        title: "Data Analytics & Business Development Essentials Workshop",
        category: "workshops",
        venue: "Lab 526 / 527 / 528 / 529",
        speaker: "Data Scientist",
        description: "Make Smarter Decisions with Data. Learn to analyze market trends, track key metrics, and use data-driven insights to fuel your business growth and strategy.",
        duration: "7 hours (3 Hour Sessions)",
        eligibility: "Silicon & Quantum Pass holders",
        prerequisite: "Basic Excel knowledge",
      },
      {
        id: "d1-startup-expo",
        time: "13:00 - 17:00",
        title: "The Startup Expo: Display Your First Prototype",
        category: "networking",
        venue: "Lobby Area",
        speaker: null,
        description: "Display Your First Prototype! Showcase your early-stage idea and prototype to the entire college community in our main lobby. A perfect chance to get your first users and feedback.",
        duration: "4 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d1-internship-fair",
        time: "10:00 - 17:00",
        title: "The Internship Fair: Build Your Founding Team (Day 1)",
        category: "networking",
        venue: "Convocation Hall",
        speaker: null,
        description: "Build your founding team. Startups present their vision to recruit talented interns and full-time members, connecting ambitious talent with groundbreaking ideas.",
        duration: "7 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d1-networking-arena",
        time: "Lunch Hours",
        title: "Networking Arena (Lunch)",
        category: "networking",
        venue: "Multipurpose Hall 2nd Floor & Architecture Ground Floor",
        speaker: null,
        description: "Open networking session during lunch - connect with entrepreneurs and investors",
        duration: "Lunch Break",
        eligibility: "All pass holders",
      },
      {
        id: "d1-informals",
        time: "17:00 - 17:30",
        title: "Informals: Connect Beyond the Stage",
        category: "networking",
        venue: "Multipurpose Hall 2nd Floor and TSAP ground floor",
        speaker: null,
        description: "Connect beyond the stage. An informal session for founders to mingle with judges, speakers, and mentors, turning conversations into valuable connections.",
        duration: "30 min",
        eligibility: "All pass holders",
      },

    ],
    day2: [
      {
        id: "d2-registration",
        time: "09:00 - 09:30",
        title: "Day 2 Registration",
        category: "networking",
        venue: "Main Entrance",
        speaker: null,
        description: "Check-in for Day 2 events",
        duration: "30 min",
      },
      {
        id: "d2-ten-minute-million",
        time: "10:00 - 17:00",
        title: "The Ten Minute Deal: Pitch to Win (Day 2)",
        category: "pitching",
        venue: "SH-1",
        speaker: "5 Venture Capitalists",
        description: "A high-energy pitching event where founders get just 10 minutes to present their startup to investors and industry leaders, aiming to secure funding, partnerships, and validation on the spot.",
        duration: "7 hours",
        eligibility: "TRL 4+ startups",
        prerequisite: "Pitch deck required (PDF, max 15 slides)",
      },
      {
        id: "d2-angel-roundtable",
        time: "09:30 - 13:30",
        title: "The Angel Investor's Roundtable: Capital Meets Innovation",
        category: "pitching",
        venue: "General Reading Room (4th floor) / Seminar hall, 2nd floor, TSAP",
        speaker: "5 Angel Investors",
        description: "An exclusive gathering where capital meets innovation. This roundtable brings together angel investors to vet and co-invest in the most promising early-stage companies, featuring founders selected from our Pitch Arena.",
        duration: "4 hours",
        eligibility: "Early stage startups with MVP",
      },
      {
        id: "d2-incubator-summit",
        time: "10:00 - 13:00",
        title: "The Incubator Summit: Earn Your Launchpad (Day 2)",
        category: "pitching",
        venue: "SSC TIMSR",
        speaker: "5 Incubation Centre Evaluators",
        description: "Where ideas earn their launchpad. Founders pitch to evaluators from five top incubation centers, competing for a spot and seed support to accelerate their venture.",
        duration: "3 hours",
        eligibility: "Early stage startups",
      },
      {
        id: "d2-ai-buildathon-final",
        time: "10:00 - 17:00",
        title: "AI Contest: The Innovation Challenge (Day 2 Finals)",
        category: "competitions",
        venue: "SH 3",
        speaker: "Tech Judges",
        description: "Push the boundaries of AI. Tackle a real-world problem by designing and presenting an innovative, AI-driven solution. Showcase your technical skills and creativity to win the challenge.",
        duration: "7 hours",
        prize: "₹1,50,000",
        eligibility: "All pass holders (participants only)",
      },
      {
        id: "d2-ipl-auction",
        time: "09:30 - 13:30",
        title: "IPL Auction: The Bid for Brilliance (Day 2)",
        category: "competitions",
        venue: "601, TIMSR",
        speaker: "Business Strategy Mentors",
        description: "Master the art of the deal. In this high-energy bidding game, build your dream team with a limited budget. Test your strategic thinking and financial savvy to outbid rivals and create a winning roster.",
        duration: "4 hours",
        prize: "TBD",
        eligibility: "All pass holders",
      },
      {
        id: "d2-biz-arena",
        time: "10:00 - 13:00",
        title: "Startup League Game: Build Your Empire (Day 2)",
        category: "competitions",
        venue: "301, TIMSR",
        speaker: "Business Mentors",
        description: "Step into the founder's seat. Run a virtual startup in this fast-paced simulation. Make critical decisions on product, marketing, and funding to outmaneuver competitors and dominate the market.",
        duration: "3 hours",
        prize: "₹1,00,000",
        eligibility: "All pass holders",
      },
      {
        id: "d2-design-thinking",
        time: "10:00 - 17:00",
        title: "Design Thinking & Innovation Strategy Workshop (Day 2)",
        category: "workshops",
        venue: "Lab 522 & 523",
        speaker: "Design Expert",
        description: "Unlock Your Creative Potential. Master the tools to solve complex problems and generate groundbreaking ideas. This hands-on workshop will equip you with a powerful framework for innovation.",
        duration: "7 hours (3 Hour Sessions)",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d2-finance-marketing",
        time: "10:00 - 17:00",
        title: "Finance & Marketing for Startups Workshop (Day 2)",
        category: "workshops",
        venue: "Lab 524 & 525",
        speaker: "Industry Expert",
        description: "Build a Solid Foundation for Your Venture. Get essential, practical knowledge on managing your startup's finances and crafting marketing strategies that actually convert.",
        duration: "7 hours (3 Hour Sessions)",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d2-data-analytics",
        time: "10:00 - 17:00",
        title: "Data Analytics & Business Development Essentials Workshop (Day 2)",
        category: "workshops",
        venue: "Lab 526 / 527 / 528 / 529",
        speaker: "Data Scientist",
        description: "Make Smarter Decisions with Data. Learn to analyze market trends, track key metrics, and use data-driven insights to fuel your business growth and strategy.",
        duration: "7 hours (3 Hour Sessions)",
        eligibility: "Silicon & Quantum Pass holders",
      },

      {
        id: "d2-internship-fair",
        time: "10:00 - 13:00",
        title: "The Internship Fair: Build Your Founding Team (Day 2)",
        category: "networking",
        venue: "Convocation Hall",
        speaker: null,
        description: "Build your founding team. Startups present their vision to recruit talented interns and full-time members, connecting ambitious talent with groundbreaking ideas.",
        duration: "3 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d2-networking-arena",
        time: "Lunch Hours",
        title: "Networking Arena (Lunch)",
        category: "networking",
        venue: "Multipurpose Hall 2nd Floor & Architecture Ground Floor",
        speaker: null,
        description: "Final networking opportunity during lunch with entrepreneurs and investors",
        duration: "Lunch Break",
        eligibility: "All pass holders",
      },
      {
        id: "d2-closing",
        time: "Post 5:00 PM",
        title: "Closing Ceremony & Prize Distribution",
        category: "networking",
        venue: "Auditorium",
        speaker: "Organizing Committee",
        description: "Award ceremony, winner announcements, and closing remarks for E-Summit 2026",
        duration: "1 hr 30 min",
        eligibility: "All pass holders",
      },
      {
        id: "d2-startup-youth-conclave",
        time: "11:00 - 13:00",
        title: "Startup Youth Conclave: Connect with Top E-Cells",
        category: "networking",
        venue: "Seminar Hall, 2nd floor, TSAP / Internal General Reading Room",
        speaker: "E-Cell Representatives",
        description: "Connect with Top E-Cells! Network with entrepreneurship cells from other colleges, share best practices, and build collaborations that go beyond your campus.",
        duration: "2 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d2-panel-discussion",
        time: "14:00 - 17:00",
        title: "The Panel Discussion: Get the Final Insights",
        category: "networking",
        venue: "Auditorium",
        speaker: "Industry Leaders",
        description: "Get the Final Insights. Hear from our expert judges and speakers in a final panel discussion, followed by the closing ceremony to celebrate the day's winners and achievements.",
        duration: "3 hours",
        eligibility: "All pass holders",
      },
    ],
  };



  const filterEvents = (eventsList: Event[]) => {
    return eventsList.filter((event) => {
      const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
      const venueMatch = selectedVenue === "all" || event.venue === selectedVenue;
      return categoryMatch && venueMatch;
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.color || "default";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-12">
        <RippleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <h1 className="mb-4 text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Event Schedule
          </h1>
          <p className="text-muted-foreground">
            Plan your E-Summit experience with our comprehensive schedule
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filter by:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:flex md:gap-4 md:flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedVenue} onValueChange={setSelectedVenue}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Venues</SelectItem>
                <SelectItem value="TBA">TBA</SelectItem>
                <SelectItem value="Main Entrance">Main Entrance</SelectItem>
                <SelectItem value="Main Auditorium">Main Auditorium</SelectItem>
                <SelectItem value="Auditorium">Auditorium</SelectItem>
                <SelectItem value="SH-1">SH-1</SelectItem>
                <SelectItem value="314, 315, 316">314, 315, 316</SelectItem>
                <SelectItem value="SSC TIMSR">SSC TIMSR</SelectItem>
                <SelectItem value="SH 3">SH 3</SelectItem>
                <SelectItem value="601, TIMSR">601, TIMSR</SelectItem>
                <SelectItem value="301, TIMSR">301, TIMSR</SelectItem>
                <SelectItem value="Lab 522 & 523">Lab 522 & 523</SelectItem>
                <SelectItem value="Lab 524 & 525">Lab 524 & 525</SelectItem>
                <SelectItem value="Lab 526 / 527 / 528 / 529">Lab 526 / 527 / 528 / 529</SelectItem>
                <SelectItem value="Lobby Area">Lobby Area</SelectItem>
                <SelectItem value="Convocation Hall">Convocation Hall</SelectItem>
                <SelectItem value="Multipurpose Hall 2nd Floor and Multipurpose Hall Ground Floor">Multipurpose Hall 2nd Floor and Ground Floor</SelectItem>
                <SelectItem value="General Reading Room (4th floor) / Seminar hall, 2nd floor, TSAP">General Reading Room / Seminar hall TSAP</SelectItem>
                <SelectItem value="Seminar Hall, 2nd floor, TSAP / Internal General Reading Room">Seminar Hall TSAP / Internal Reading Room</SelectItem>
                <SelectItem value="Auditorium (D-1)">Auditorium (D-1)</SelectItem>
                <SelectItem value="Auditorium (D-2)">Auditorium (D-2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="preEvent" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 text-xs sm:text-sm">
          <TabsTrigger value="preEvent" className="px-2 sm:px-4">Pre Event</TabsTrigger>
          <TabsTrigger value="day1" className="px-2 sm:px-4">Day 1 - Feb 2</TabsTrigger>
          <TabsTrigger value="day2" className="px-2 sm:px-4">Day 2 - Feb 3</TabsTrigger>
        </TabsList>

        <TabsContent value="preEvent" className="mt-6">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Pre-summit workshops will be scheduled before the main event. Stay tuned for exact dates and registration details.
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            {filterEvents(events.preEvent).map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant={getCategoryColor(event.category) as any} className="text-xs">
                          {categories.find((c) => c.id === event.category)?.label}
                        </Badge>
                      </div>

                      <h3 className="mb-2 text-lg sm:text-xl font-semibold">{event.title}</h3>

                      <div className="mb-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        {event.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{event.speaker}</span>
                          </div>
                        )}
                      </div>

                      <p className="mb-2 text-sm leading-relaxed">{event.description}</p>

                      {(event.eligibility || event.prerequisite) && (
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          {event.eligibility && <span>• {event.eligibility}</span>}
                          {event.prerequisite && <span>• {event.prerequisite}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:min-w-[120px]">
                      {/* Register button removed - registration handled in individual event pages */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="day1" className="mt-6">
          <div className="space-y-4">
            {filterEvents(events.day1).map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant={getCategoryColor(event.category) as any} className="text-xs">
                          {categories.find((c) => c.id === event.category)?.label}
                        </Badge>
                      </div>

                      <h3 className="mb-2 text-lg sm:text-xl font-semibold">{event.title}</h3>

                      <div className="mb-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        {event.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{event.speaker}</span>
                          </div>
                        )}
                      </div>

                      <p className="mb-2 text-sm leading-relaxed">{event.description}</p>

                      {(event.eligibility || event.prerequisite) && (
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          {event.eligibility && <span>• {event.eligibility}</span>}
                          {event.prerequisite && <span>• {event.prerequisite}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:min-w-[120px]">
                      {/* Register button removed - registration handled in individual event pages */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="day2" className="mt-6">
          <div className="space-y-4">
            {filterEvents(events.day2).map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant={getCategoryColor(event.category) as any} className="text-xs">
                          {categories.find((c) => c.id === event.category)?.label}
                        </Badge>
                      </div>

                      <h3 className="mb-2 text-lg sm:text-xl font-semibold">{event.title}</h3>

                      <div className="mb-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        {event.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{event.speaker}</span>
                          </div>
                        )}
                      </div>

                      <p className="mb-2 text-sm leading-relaxed">{event.description}</p>

                      {(event.eligibility || event.prerequisite) && (
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          {event.eligibility && <span>• {event.eligibility}</span>}
                          {event.prerequisite && <span>• {event.prerequisite}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:min-w-[120px]">
                      {/* Register button removed - registration handled in individual event pages */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventSchedule;
