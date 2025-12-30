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

  const events: { day1: Event[]; day2: Event[] } = {
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
        time: "10:00 - 13:00",
        title: "The Ten Minute Million",
        category: "pitching",
        venue: "SH-1",
        speaker: "5 Venture Capitalists",
        description: "Pitch to VCs for seed funding opportunities. TRL 4+ startups present 10-minute pitches followed by Q&A.",
        duration: "3 hours",
        eligibility: "TRL 4+ startups",
        prerequisite: "Pitch deck required (PDF, max 15 slides)",
      },
      {
        id: "d1-angel-roundtable",
        time: "14:00 - 17:00",
        title: "Angel Investors Roundtable",
        category: "pitching",
        venue: "530, 531",
        speaker: "5 Angel Investors",
        description: "Present early-stage startup to angel investors for pre-seed funding. 15-minute presentation + Q&A with MVP demonstration.",
        duration: "3 hours",
        eligibility: "Early stage startups with MVP",
      },
      {
        id: "d1-pitch-arena",
        time: "10:00 - 13:00",
        title: "Pitch Arena - Idea to Reality",
        category: "pitching",
        venue: "SH-3, 532, 533, 504",
        speaker: "3 Industry Mentors",
        description: "Early-stage idea pitching platform for first-time founders. 5-minute pitch format, open to idea stage startups.",
        duration: "3 hours",
        eligibility: "Early stage startups, first-time founders welcome",
      },
      {
        id: "d1-incubator-summit",
        time: "10:00 - 17:00",
        title: "Incubator Summit",
        category: "pitching",
        venue: "Multipurpose Hall 1st floor",
        speaker: "5 Incubation Centre Evaluators",
        description: "Pitch to top incubation centers from Mumbai and Pune for incubation support, mentorship slots, and acceleration guidance.",
        duration: "7 hours",
        eligibility: "Early stage startups",
      },
      {
        id: "d1-ai-buildathon-start",
        time: "10:00 - 17:00",
        title: "AI Build-A-Thon (Day 1)",
        category: "competitions",
        venue: "216, 217",
        speaker: "Tech Mentors",
        description: "Build innovative AI-powered solutions to real-world problems (Continues to Day 2)",
        duration: "7 hours",
        prize: "₹1,50,000",
        eligibility: "All pass holders",
        prerequisite: "Laptop with development environment",
      },
      {
        id: "d1-ipl-auction",
        time: "10:00 - 17:00",
        title: "IPL Auction",
        category: "competitions",
        venue: "505, 506",
        speaker: "Business Strategy Mentors",
        description: "Simulate IPL auction mechanics with team building and strategic bidding",
        duration: "7 hours",
        prize: "TBD",
        eligibility: "All pass holders",
      },
      {
        id: "d1-biz-arena",
        time: "10:00 - 17:00",
        title: "Biz Arena Startup League",
        category: "competitions",
        venue: "Lab 520 & 521",
        speaker: "Business Mentors",
        description: "Team-based business simulation competition with real-world startup challenges",
        duration: "7 hours",
        prize: "₹1,00,000",
        eligibility: "All pass holders",
      },
      {
        id: "d1-startup-youth-conclave",
        time: "10:00 - 13:00",
        title: "Startup Youth Conclave",
        category: "networking",
        venue: "SH-1",
        speaker: "E-Cell Representatives",
        description: "Networking session with E-Cell representatives from 40+ colleges across India",
        duration: "3 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d1-design-thinking",
        time: "10:00 - 17:00",
        title: "Design Thinking & Innovation Strategy Workshop",
        category: "workshops",
        venue: "Lab 522 & 523",
        speaker: "Design Expert",
        description: "Hands-on workshop teaching design thinking methodology for problem-solving and innovation",
        duration: "7 hours",
        eligibility: "Silicon & Quantum Pass holders",
        prerequisite: "Notepad recommended",
      },
      {
        id: "d1-finance-marketing",
        time: "10:00 - 17:00",
        title: "Finance & Marketing Workshop",
        category: "workshops",
        venue: "Lab 524 & 525",
        speaker: "Industry Expert",
        description: "Master financial planning and marketing strategies for startups",
        duration: "7 hours",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d1-data-analytics",
        time: "10:00 - 17:00",
        title: "Data Analytics & BDM Workshop",
        category: "workshops",
        venue: "Lab 526 & 527",
        speaker: "Data Scientist",
        description: "Learn data-driven decision making and business development strategies",
        duration: "7 hours",
        eligibility: "Silicon & Quantum Pass holders",
        prerequisite: "Basic Excel knowledge",
      },
      {
        id: "d1-startup-expo",
        time: "09:30 - 16:30",
        title: "Startup Expo (Day 1)",
        category: "networking",
        venue: "Lobby Area",
        speaker: null,
        description: "Explore booths from innovative startups and connect with founders",
        duration: "7 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d1-internship-fair",
        time: "10:00 - 17:00",
        title: "Internship & Job Fair (Day 1)",
        category: "networking",
        venue: "Convocation Hall",
        speaker: null,
        description: "Meet startups and companies offering internship and job opportunities",
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
        title: "Informals",
        category: "networking",
        venue: "Multipurpose Hall 2nd Floor and TSAP ground floor",
        speaker: null,
        description: "Informal session to mingle with judges, speakers, and mentors over lunch for valuable connections.",
        duration: "30 min",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d1-panel-discussion",
        time: "Post Lunch",
        title: "Panel Discussion & Valedictory",
        category: "networking",
        venue: "Auditorium",
        speaker: "Industry Leaders",
        description: "Expert panel discussing trends and future of entrepreneurship, followed by Day 1 closing",
        duration: "2 hours",
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
        time: "10:00 - 13:00",
        title: "The Ten Minute Million (Day 2)",
        category: "pitching",
        venue: "SH-4",
        speaker: "5 Venture Capitalists",
        description: "Day 2 continuation - TRL 4+ startups pitch to VCs for seed funding",
        duration: "3 hours",
        eligibility: "TRL 4+ startups",
        prerequisite: "Pitch deck required (PDF, max 15 slides)",
      },
      {
        id: "d2-angel-roundtable",
        time: "14:00 - 17:00",
        title: "Angel Investors Roundtable (Day 2)",
        category: "pitching",
        venue: "530, 531",
        speaker: "5 Angel Investors",
        description: "Day 2 continuation - Angel investor meetings for early-stage startups",
        duration: "3 hours",
        eligibility: "Early stage startups with MVP",
      },
      {
        id: "d2-incubator-summit",
        time: "10:00 - 17:00",
        title: "Incubator Summit (Day 2)",
        category: "pitching",
        venue: "Multipurpose Hall 1st floor",
        speaker: "5 Incubation Centre Evaluators",
        description: "Day 2 continuation - Pitch to incubation centers for support and mentorship",
        duration: "7 hours",
        eligibility: "Early stage startups",
      },
      {
        id: "d2-ai-buildathon-final",
        time: "10:00 - 17:00",
        title: "AI Build-A-Thon (Day 2 Finals)",
        category: "competitions",
        venue: "216, 217",
        speaker: "Tech Judges",
        description: "Final day of hackathon - build completion and judging",
        duration: "7 hours",
        prize: "₹1,50,000",
        eligibility: "All pass holders (participants only)",
      },
      {
        id: "d2-ipl-auction",
        time: "10:00 - 17:00",
        title: "IPL Auction (Day 2)",
        category: "competitions",
        venue: "505, 506",
        speaker: "Business Strategy Mentors",
        description: "Day 2 continuation - IPL auction simulation with final rounds",
        duration: "7 hours",
        prize: "TBD",
        eligibility: "All pass holders",
      },
      {
        id: "d2-biz-arena",
        time: "10:00 - 17:00",
        title: "Biz Arena Startup League (Day 2)",
        category: "competitions",
        venue: "Lab 520 & 521",
        speaker: "Business Mentors",
        description: "Day 2 continuation - Final rounds of business simulation competition",
        duration: "7 hours",
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
        description: "Day 2 continuation - Advanced design thinking sessions",
        duration: "7 hours",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d2-finance-marketing",
        time: "10:00 - 17:00",
        title: "Finance & Marketing Workshop (Day 2)",
        category: "workshops",
        venue: "Lab 524 & 525",
        speaker: "Industry Expert",
        description: "Day 2 continuation - Advanced finance and marketing strategies",
        duration: "7 hours",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d2-data-analytics",
        time: "10:00 - 17:00",
        title: "Data Analytics & BDM Workshop (Day 2)",
        category: "workshops",
        venue: "Lab 526 & 527",
        speaker: "Data Scientist",
        description: "Day 2 continuation - Advanced data analytics and business development",
        duration: "7 hours",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d2-startup-expo",
        time: "09:30 - 16:30",
        title: "Startup Expo (Day 2)",
        category: "networking",
        venue: "Lobby Area",
        speaker: null,
        description: "Continue exploring innovative startups and their products",
        duration: "7 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d2-internship-fair",
        time: "10:00 - 17:00",
        title: "Internship & Job Fair (Day 2)",
        category: "networking",
        venue: "Convocation Hall",
        speaker: null,
        description: "Day 2 continuation - More opportunities from startups and companies",
        duration: "7 hours",
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
        id: "d2-panel-discussion",
        time: "14:00 - 17:00",
        title: "The Panel Discussion",
        category: "networking",
        venue: "Auditorium",
        speaker: "Industry Leaders",
        description: "Expert panel discussion followed by Q&A, aligned with brochure schedule.",
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
          className="relative z-10"
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
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Venues</SelectItem>
                <SelectItem value="Main Auditorium">Main Auditorium</SelectItem>
                <SelectItem value="Auditorium">Auditorium</SelectItem>
                <SelectItem value="Convocation Hall">Convocation Hall</SelectItem>
                <SelectItem value="Lobby Area">Lobby Area</SelectItem>
                <SelectItem value="SH-1">SH-1</SelectItem>
                <SelectItem value="SH-3, 532, 533, 504">SH-3, 532, 533, 504</SelectItem>
                <SelectItem value="SH-4">SH-4</SelectItem>
                <SelectItem value="216, 217">216, 217</SelectItem>
                <SelectItem value="505, 506">505, 506</SelectItem>
                <SelectItem value="530, 531">530, 531</SelectItem>
                <SelectItem value="Lab 520 & 521">Lab 520 & 521</SelectItem>
                <SelectItem value="Lab 522 & 523">Lab 522 & 523</SelectItem>
                <SelectItem value="Lab 524 & 525">Lab 524 & 525</SelectItem>
                <SelectItem value="Lab 526 & 527">Lab 526 & 527</SelectItem>
                <SelectItem value="Multipurpose Hall 1st floor">Multipurpose Hall 1st floor</SelectItem>
                <SelectItem value="Multipurpose Hall 2nd Floor & Architecture Ground Floor">Multipurpose Hall 2nd Floor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="day1">Day 1 - February 2, 2026</TabsTrigger>
          <TabsTrigger value="day2">Day 2 - February 3, 2026</TabsTrigger>
        </TabsList>

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
