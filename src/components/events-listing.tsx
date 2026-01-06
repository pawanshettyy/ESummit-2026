import { useState } from "react";
import { Trophy, Users, Code, Lightbulb, Briefcase, Gamepad2, Music, Coffee, ArrowRight, Calendar, MapPin, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "motion/react";
import { RippleBackground } from "./accentricity/ripple-background";

interface EventsListingProps {
  onNavigate: (page: string) => void;
}

export function EventsListing({ onNavigate }: EventsListingProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (event: any) => {
    // Store event data in sessionStorage
    sessionStorage.setItem('selectedEvent', JSON.stringify(event));
    // Navigate to event page on same page
    onNavigate(`event-${event.id}`);
  };

  const eventCategories = [
    { id: "all", label: "All Events", icon: Trophy },
    { id: "pitching", label: "Pitching Events", icon: Lightbulb },
    { id: "competitions", label: "Competitions", icon: Trophy },
    { id: "workshops", label: "Workshops", icon: Users },
    { id: "networking", label: "Networking Events", icon: Coffee },
  ];

  const allEvents = [
    // PITCHING EVENTS
    {
      id: 1,
      title: "The Ten Minute Million",
      category: "pitching",
      description: "A high-energy pitching event where founders get just 10 minutes to present their startup to investors and industry leaders, aiming to secure funding, partnerships, and validation on the spot.",
      date: "February 2-3, 2026",
      time: "10:00 AM – 5:00 PM (Both days)",
      venue: "SH-1",
      prize: "Seed Funding",
      eligibility: "Quantum Pass required",
      objective: "Fundraising",
      outcome: "Receive Seed Funding",
      rules: ["10-minute pitch presentation", "Live Q&A with VCs", "Pitch deck required"],
      judges: ["5 Venture Capitalists"],
      prerequisites: "Technology Readiness Level 4 or above",
      registrationDeadline: "January 25, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 2,
      title: "The Angel Investor's Roundtable",
      category: "pitching",
      description: "An exclusive gathering where capital meets innovation. This roundtable brings together angel investors to vet and co-invest in the most promising early-stage companies, featuring founders selected from our Pitch Arena.",
      date: "February 2, 2026",
      time: "9:30 AM – 1:30 PM",
      venue: "Seminar Hall",
      prize: "Pre-Seed Funding",
      eligibility: "Quantum Pass required",
      objective: "Receive Investment",
      outcome: "Receive Pre-Seed Funding",
      rules: ["Pitch to panel of angel investors", "15-minute presentation + Q&A", "MVP demonstration required"],
      judges: ["5 Angel Investors"],
      prerequisites: "Early-stage startup with MVP",
      registrationDeadline: "January 25, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 3,
      title: "Pitch Arena - Idea to Reality",
      category: "pitching",
      description: "Step into the arena! Founders pitch to top-tier mentors for real-time feedback and expert guidance to launch their ideas.",
      date: "February 2-3, 2026",
      time: "10:00 AM – 5:00 PM",
      venue: "314, 315, 316",
      prize: "Shortlisting for Round 2",
      eligibility: "Silicon & Quantum Pass required",
      objective: "Encourage First Time Founders",
      outcome: "Shortlisting Best Ideas for Round 2",
      rules: ["5-minute pitch", "Open to first-time founders", "Idea stage acceptable"],
      judges: ["3 Industry Mentors"],
      prerequisites: "First-time founders welcome",
      registrationDeadline: "January 27, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 4,
      title: "The Incubator Summit",
      category: "pitching",
      description: "Where ideas earn their launchpad. Founders pitch to evaluators from five top incubation centers, competing for a spot and seed support to accelerate their venture.",
      date: "February 2-3, 2026",
      time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 10:00 AM - 1:00 PM",
      venue: "SSC TIMSR",
      prize: "Incubation Support",
      eligibility: "Quantum Pass required",
      objective: "To Provide Incubation",
      outcome: "Receiving Incubation",
      rules: ["Pitch to incubation centers", "Present growth roadmap", "Team introduction required"],
      judges: ["5 Incubation Centre Evaluators"],
      prerequisites: "Early-stage startup team",
      registrationDeadline: "January 27, 2026",
      icon: Lightbulb,
      color: "primary",
    },

    // COMPETITIONS
    {
      id: 5,
      title: "IPL Auction: The Bid for Brilliance",
      category: "competitions",
      description: "Master the art of the deal. In this high-energy bidding game, build your dream team with a limited budget. Test your strategic thinking and financial savvy to outbid rivals and create a winning roster.",
      date: "February 2-3, 2026",
      time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 9:30 AM – 1:30 PM",
      venue: "601, TIMSR",
      prize: "TBD",
      eligibility: "All pass holders (Pixel, Silicon, Quantum)",
      objective: "To educate on use of capital and customer acquisition",
      outcome: "Gain Insights about CAC and strategy",
      rules: ["Auction-style competition", "Strategic bidding required", "Budget management"],
      judges: ["Business Strategy Mentors"],
      prerequisites: "None",
      registrationDeadline: "January 25, 2026",
      icon: Trophy,
      color: "primary",
    },
    {
      id: 6,
      title: "AI Build-A-Thon: The Innovation Challenge",
      category: "competitions",
      description: "Push the boundaries of AI. Tackle a real-world problem by designing and presenting an innovative, AI-driven solution. Showcase your technical skills and creativity to win the challenge.",
      date: "February 2-3, 2026",
      time: "10:00 AM – 5:00 PM",
      venue: "SH 3",
      prize: "₹1,50,000",
      eligibility: "All pass holders (Pixel, Silicon, Quantum)",
      objective: "Use of AI in early stage startups",
      outcome: "Enhance our knowledge about AI Revolution",
      rules: ["Build AI-powered solution", "Use any AI/ML framework", "Final demo required"],
      judges: ["Tech Mentors", "Tech Judges"],
      prerequisites: "Laptop with development environment",
      registrationDeadline: "January 23, 2026",
      icon: Code,
      color: "secondary",
    },
    {
      id: 7,
      title: "Startup League Game: Build Your Empire",
      category: "competitions",
      description: "Step into the founder's seat. Run a virtual startup in this fast-paced simulation. Make critical decisions on product, marketing, and funding to outmaneuver competitors and dominate the market.",
      date: "February 2-3, 2026",
      time: "10:00 AM to 1:00 PM",
      venue: "301, TIMSR",
      prize: "₹1,00,000",
      eligibility: "All pass holders (Pixel, Silicon, Quantum)",
      objective: "Strategic handling on startup domains (Team, Market, Capital etc)",
      outcome: "Gain insights about each domain using a Game",
      rules: ["Multi-round gameplay", "Strategy-based decisions", "Team collaboration required"],
      judges: ["Business Mentors"],
      prerequisites: "None",
      registrationDeadline: "January 25, 2026",
      icon: Gamepad2,
      color: "accent",
    },

    // WORKSHOPS
    {
      id: 8,
      title: "Design Thinking & Innovation Strategy",
      category: "workshops",
      description: "Hands-on workshop on design thinking and innovation for building successful ventures. 3-hour interactive sessions throughout the day.",
      date: "February 2-3, 2026",
      time: "10:00 - 17:00 (3 Hours Sessions)",
      venue: "Lab 522 & 523",
      eligibility: "Silicon & Quantum Pass holders",
      objective: "Hands-on Design Thinking & Innovation",
      outcome: "Gain insights for building innovation & ventures",
      prerequisites: "Notepad recommended",
      speaker: "Design Expert",
      icon: Users,
      color: "muted",
    },
    {
      id: 9,
      title: "Finance & Marketing for Startups",
      category: "workshops",
      description: "Build a solid foundation for your venture. Get essential, practical knowledge on managing your startup's finances and crafting marketing strategies that actually convert. 3-hour interactive sessions.",
      date: "February 2-3, 2026",
      time: "10:00 - 17:00 (3 Hours Sessions)",
      venue: "Lab 524 & 525",
      eligibility: "Silicon & Quantum Pass holders",
      objective: "Hands-on Finance & Marketing for startups",
      outcome: "Gain knowledge on the domain specific terms for startups",
      prerequisites: "None",
      speaker: "Industry Expert",
      icon: Briefcase,
      color: "muted",
    },
    {
      id: 10,
      title: "Data Analytics & Business Development Essentials",
      category: "workshops",
      description: "Make smarter decisions with data. Learn to analyze market trends, track key metrics, and use data-driven insights to fuel your business growth and strategy. 3-hour interactive sessions.",
      date: "February 2-3, 2026",
      time: "10:00 - 17:00 (3 Hours Sessions)",
      venue: "Lab 526 & 527",
      eligibility: "Silicon & Quantum Pass holders",
      objective: "Hands-on Data Analysis Tools",
      outcome: "Get insights about how data analysis help in startup growth",
      prerequisites: "Basic Excel knowledge",
      speaker: "Data Scientist",
      icon: Users,
      color: "muted",
    },


    // NETWORKING EVENTS
    {
      id: 11,
      title: "The Startup Expo",
      category: "networking",
      description: "Display Your First Prototype! Showcase your early-stage idea and prototype to the entire college community in our main lobby. A perfect chance to get your first users and feedback.",
      date: "February 2, 2026",
      time: "1:00 PM – 5:00 PM",
      venue: "Lobby Area",
      eligibility: "All pass holders",
      objective: "Connect startups with ecosystem stakeholders",
      outcome: "Build valuable connections and partnerships",
      icon: Coffee,
      color: "outline",
    },
    {
      id: 12,
      title: "The Panel Discussion",
      category: "networking",
      description: "Get the Final Insights. Hear from our expert judges and speakers in a final panel discussion, followed by the closing ceremony to celebrate the day's winners and achievements.",
      date: "February 3, 2026",
      time: "2:00 PM to 5:00 PM (Post Lunch)",
      venue: "Auditorium",
      eligibility: "All pass holders",
      objective: "Learn from industry leaders",
      outcome: "Gain insights from experienced entrepreneurs",
      speaker: "Industry Leaders",
      icon: Users,
      color: "outline",
    },
    {
      id: 13,
      title: "Informals",
      category: "networking",
      description: "Connect beyond the stage. An informal session for founders to mingle with judges, speakers, and mentors over lunch, turning conversations into valuable connections.",
      date: "February 2, 2026",
      time: "5 PM to 5:30 PM",
      venue: "Multipurpose Hall 2nd Floor and TSAP ground floor",
      eligibility: "Silicon & Quantum Pass holders",
      objective: "Facilitate meaningful connections",
      outcome: "Expand your professional network",
      icon: Coffee,
      color: "outline",
    },
    {
      id: 14,
      title: "The Internship Fair",
      category: "networking",
      description: "Build your founding team. Startups present their vision to recruit talented interns and full-time members, connecting ambitious talent with groundbreaking ideas.",
      date: "February 2-3, 2026",
      time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 10:00 AM – 1:00 PM",
      venue: "Convocation Hall",
      eligibility: "Quantum Pass holders",
      objective: "Connect students with startup opportunities",
      outcome: "Secure internship and job opportunities",
      icon: Briefcase,
      color: "outline",
    },
    {
      id: 15,
      title: "The Startup Youth Conclave",
      category: "networking",
      description: "Connect with Top E-Cells! Network with entrepreneurship cells from other colleges, share best practices, and build collaborations that go beyond your campus.",
      date: "February 3, 2026",
      time: "11:00 AM to 1:00 PM (Post Lunch)",
      venue: "Seminar Hall 2nd floor TSAP",
      eligibility: "Silicon & Quantum Pass holders",
      objective: "Inspire and empower youth entrepreneurship",
      outcome: "Build youth startup community",
      speaker: "E-Cell Representatives",
      icon: Users,
      color: "outline",
    },
    {
      id: 18,
      title: "Networking Arena",
      category: "networking",
      description: "Open networking session during lunch - connect with entrepreneurs, investors, judges, and fellow participants. An ideal opportunity to build relationships and explore collaborations.",
      date: "February 2-3, 2026",
      time: "Lunch Hours",
      venue: "Multipurpose Hall 2nd Floor & Architecture Ground Floor",
      eligibility: "All pass holders",
      objective: "Facilitate meaningful connections during lunch",
      outcome: "Build valuable professional relationships",
      icon: Coffee,
      color: "outline",
    },
    // Additional workshops and pre-summit events
    {
      id: 16,
      title: "AI for Early Stage Startups",
      category: "workshops",
      description: "Explore how AI can be leveraged in early-stage startups to accelerate growth. Hands-on and practical insights for founders.",
      date: "February 3, 2026",
      time: "2:00 PM – 4:30 PM",
      venue: "Workshop Hall B",
      eligibility: "All pass holders",
      objective: "Use of AI in early stage startups",
      outcome: "Understand where AI accelerates early-stage traction",
      prerequisites: "None",
      icon: Users,
      color: "muted",
    },
    {
      id: 17,
      title: "Roadmap to Entrepreneurship (Pre E-summit Workshop)",
      category: "workshops",
      description: "Turn Ideas into Impact. One-hour hands-on workshop on Business Model Canvas with practical startup frameworks and mentor guidance.",
      date: "TBA (Pre E-Summit)",
      time: "1 hour session",
      venue: "TBA",
      eligibility: "Open to students, aspiring founders, and innovators",
      objective: "Help participants convert ideas into viable business models",
      outcome: "Clarity on business model using BMC and actionable next steps",
      prerequisites: "None",
      icon: Users,
      color: "muted",
    },
  ];

  const filteredEvents = (category: string) => {
    const events = category === "all" ? allEvents : allEvents.filter((e) => e.category === category);
    if (searchQuery) {
      return events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return events;
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
            Events
          </h1>
          <p className="text-muted-foreground">
            Explore 15+ events including pitching competitions, workshops, and networking sessions
          </p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto">
          {eventCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="gap-2 flex-shrink-0">
              <cat.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {eventCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredEvents(category.id).length} events found
            </div>
            
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents(category.id).map((event) => (
                <Card key={event.id} className="flex flex-col transition-shadow hover:shadow-lg max-w-full overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex items-start justify-between">
                      <event.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                      {event.prize && (
                        <Badge variant="default" className="bg-primary text-xs shrink-0">
                          {event.prize}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold leading-tight break-words">{event.title}</h3>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col p-4 sm:p-6 pt-0">
                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed break-words">{event.description}</p>

                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="mt-auto w-full h-10 sm:h-11"
                      onClick={() => handleViewDetails(event)}
                    >
                      Register Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
