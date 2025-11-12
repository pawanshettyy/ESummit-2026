import { useState } from "react";
import { Trophy, Users, Code, Lightbulb, Briefcase, Gamepad2, Music, Coffee, ArrowRight, Calendar, MapPin, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface EventsListingProps {
  onNavigate: (page: string) => void;
}

export function EventsListing({ onNavigate }: EventsListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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
      description: "Pitch your startup to Venture Capitalists and compete for seed funding opportunities.",
      date: "January 23, 2026",
      time: "10:00 - 13:00",
      venue: "Main Auditorium",
      prize: "Seed Funding",
      eligibility: "TRL 4+",
      objective: "Fundraising",
      outcome: "Receive Seed Funding",
      rules: ["10-minute pitch presentation", "Live Q&A with VCs", "Pitch deck required"],
      judges: ["Venture Capitalists"],
      prerequisites: "Technology Readiness Level 4 or above",
      registrationDeadline: "January 10, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 2,
      title: "The Angel Investors Roundtable",
      category: "pitching",
      description: "Present your early-stage startup to angel investors and secure pre-seed funding.",
      date: "January 23, 2026",
      time: "14:00 - 17:00",
      venue: "Conference Hall A",
      prize: "Pre-Seed Funding",
      eligibility: "Early stage Startups",
      objective: "Receive Investment",
      outcome: "Receive Pre-Seed Funding",
      rules: ["Pitch to panel of angel investors", "15-minute presentation + Q&A", "MVP demonstration required"],
      judges: ["Angel Investors"],
      prerequisites: "Early-stage startup with MVP",
      registrationDeadline: "January 10, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 3,
      title: "Pitch Arena",
      category: "pitching",
      description: "Platform for first-time founders to pitch their ideas and get shortlisted for the next round.",
      date: "January 24, 2026",
      time: "10:00 - 13:00",
      venue: "Conference Hall B",
      prize: "Shortlisting for Round 2",
      eligibility: "Early stage Startups",
      objective: "Encourage First Time Founders",
      outcome: "Shortlisting Best Ideas for Round 2",
      rules: ["5-minute pitch", "Open to first-time founders", "Idea stage acceptable"],
      judges: ["Industry Experts"],
      prerequisites: "First-time founders welcome",
      registrationDeadline: "January 12, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 4,
      title: "Incubator Summit",
      category: "pitching",
      description: "Pitch to leading incubation centers and secure incubation support for your startup.",
      date: "January 24, 2026",
      time: "14:00 - 17:00",
      venue: "Conference Hall C",
      prize: "Incubation Support",
      eligibility: "Early Stage Startups",
      objective: "To Provide Incubation",
      outcome: "Receiving Incubation",
      rules: ["Pitch to incubation centers", "Present growth roadmap", "Team introduction required"],
      judges: ["Incubation Centres"],
      prerequisites: "Early-stage startup team",
      registrationDeadline: "January 12, 2026",
      icon: Lightbulb,
      color: "primary",
    },

    // COMPETITIONS
    {
      id: 5,
      title: "IPL Auction",
      category: "competitions",
      description: "Learn about capital allocation and customer acquisition through an interactive auction simulation.",
      date: "January 23, 2026",
      time: "11:00 - 13:00",
      venue: "Competition Arena A",
      prize: "₹50,000",
      eligibility: "Teams of 3-5 members",
      objective: "To educate on use of capital and customer acquisition",
      outcome: "Gain Insights about CAC and strategy",
      rules: ["Auction-style competition", "Strategic bidding required", "Budget management"],
      judges: ["Business Strategy Experts"],
      prerequisites: "None",
      registrationDeadline: "January 10, 2026",
      icon: Trophy,
      color: "primary",
    },
    {
      id: 6,
      title: "AI Buildathon",
      category: "competitions",
      description: "Build innovative AI solutions for early-stage startups in this intensive competition.",
      date: "January 23-24, 2026",
      time: "09:00 - 18:00",
      venue: "Tech Lab",
      prize: "₹1,50,000",
      eligibility: "Teams of 2-4 members",
      objective: "Use of AI in early stage startups",
      outcome: "Enhance our knowledge about AI Revolution",
      rules: ["Build AI-powered solution", "Use any AI/ML framework", "Final demo required"],
      judges: ["AI/ML Experts", "Tech Leaders"],
      prerequisites: "Programming knowledge required",
      registrationDeadline: "January 8, 2026",
      icon: Code,
      color: "secondary",
    },
    {
      id: 7,
      title: "Startup League",
      category: "competitions",
      description: "Navigate startup challenges through strategic gameplay covering team, market, and capital management.",
      date: "January 24, 2026",
      time: "10:00 - 14:00",
      venue: "Competition Arena B",
      prize: "₹75,000",
      eligibility: "Teams of 3-4 members",
      objective: "Strategic handling on startup domains (Team, Market, Capital etc)",
      outcome: "Gain insights about each domain using a Game",
      rules: ["Multi-round gameplay", "Strategy-based decisions", "Team collaboration required"],
      judges: ["Startup Founders", "Business Strategists"],
      prerequisites: "None",
      registrationDeadline: "January 10, 2026",
      icon: Gamepad2,
      color: "accent",
    },

    // WORKSHOPS
    {
      id: 8,
      title: "Design Thinking",
      category: "workshops",
      description: "Hands-on workshop on design thinking and innovation for building successful ventures.",
      date: "January 23, 2026",
      time: "10:00 - 12:30",
      venue: "Workshop Hall A",
      eligibility: "All participants (Limited seats: 50)",
      objective: "Hands-on Design Thinking & Innovation",
      outcome: "Gain insights for building innovation & ventures",
      prerequisites: "Laptop required",
      speaker: "Innovation Expert",
      icon: Users,
      color: "muted",
    },
    {
      id: 9,
      title: "Finance & Marketing",
      category: "workshops",
      description: "Hands-on workshop covering finance and marketing essentials for startups.",
      date: "January 23, 2026",
      time: "13:00 - 15:30",
      venue: "Workshop Hall B",
      eligibility: "All participants (Limited seats: 50)",
      objective: "Hands-on Finance & Marketing for startups",
      outcome: "Gain knowledge on the domain specific terms for startups",
      prerequisites: "None",
      speaker: "Finance & Marketing Expert",
      icon: Briefcase,
      color: "muted",
    },
    {
      id: 10,
      title: "Data Analytics & BDM",
      category: "workshops",
      description: "Learn hands-on data analysis tools and techniques to drive startup growth.",
      date: "January 24, 2026",
      time: "11:00 - 13:30",
      venue: "Workshop Hall A",
      eligibility: "All participants (Limited seats: 50)",
      objective: "Hands-on Data Analysis Tools",
      outcome: "Get insights about how data analysis help in startup growth",
      prerequisites: "Laptop required",
      speaker: "Data Analytics Expert",
      icon: Users,
      color: "muted",
    },
    {
      id: 11,
      title: "AI for Early Stage Startups",
      category: "workshops",
      description: "Explore how AI can be leveraged in early-stage startups to accelerate growth.",
      date: "January 24, 2026",
      time: "14:00 - 16:30",
      venue: "Workshop Hall B",
      eligibility: "All participants (Limited seats: 50)",
      objective: "Use of AI in early stage startups",
      outcome: "Enhance our knowledge about AI Revolution",
      prerequisites: "Basic tech knowledge helpful",
      speaker: "AI/ML Expert",
      icon: Code,
      color: "muted",
    },

    // NETWORKING EVENTS
    {
      id: 12,
      title: "Startup Expo",
      category: "networking",
      description: "Showcase your startup and connect with investors, mentors, and fellow entrepreneurs.",
      date: "January 23-24, 2026",
      time: "09:00 - 18:00",
      venue: "Exhibition Hall",
      eligibility: "All participants",
      objective: "Connect startups with ecosystem stakeholders",
      outcome: "Build valuable connections and partnerships",
      icon: Coffee,
      color: "outline",
    },
    {
      id: 13,
      title: "Panel Discussion",
      category: "networking",
      description: "Engage with industry leaders in panel discussions on entrepreneurship and innovation.",
      date: "January 23, 2026",
      time: "15:00 - 17:00",
      venue: "Main Auditorium",
      eligibility: "All participants",
      objective: "Learn from industry leaders",
      outcome: "Gain insights from experienced entrepreneurs",
      speaker: "Panel of Industry Experts & Successful Founders",
      icon: Users,
      color: "outline",
    },
    {
      id: 14,
      title: "Networking Arena",
      category: "networking",
      description: "Dedicated networking space to connect with investors, mentors, and startup enthusiasts.",
      date: "January 23-24, 2026",
      time: "10:00 - 18:00",
      venue: "Networking Lounge",
      eligibility: "All participants",
      objective: "Facilitate meaningful connections",
      outcome: "Expand your professional network",
      icon: Coffee,
      color: "outline",
    },
    {
      id: 15,
      title: "Internship Fair",
      category: "networking",
      description: "Connect with startups and companies looking for talented interns and fresh graduates.",
      date: "January 24, 2026",
      time: "11:00 - 16:00",
      venue: "Career Zone",
      eligibility: "Students and recent graduates",
      objective: "Connect students with startup opportunities",
      outcome: "Secure internship and job opportunities",
      icon: Briefcase,
      color: "outline",
    },
    {
      id: 16,
      title: "Startup Youth Conclave",
      category: "networking",
      description: "Exclusive conclave bringing together young entrepreneurs, students, and startup enthusiasts.",
      date: "January 24, 2026",
      time: "16:00 - 18:00",
      venue: "Conclave Hall",
      eligibility: "Students and young entrepreneurs",
      objective: "Inspire and empower youth entrepreneurship",
      outcome: "Build youth startup community",
      speaker: "Young Entrepreneurs & Student Innovators",
      icon: Users,
      color: "outline",
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
      <div className="mb-8">
        <h1 className="mb-4">Events</h1>
        <p className="text-muted-foreground">
          Explore 16+ events including pitching competitions, workshops, and networking sessions
        </p>
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
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents(category.id).map((event) => (
                <Card key={event.id} className="flex flex-col transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <event.icon className="h-8 w-8 text-primary" />
                      {event.prize && (
                        <Badge variant="default" className="bg-primary">
                          {event.prize}
                        </Badge>
                      )}
                    </div>
                    <h3>{event.title}</h3>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="mb-4 text-sm text-muted-foreground">{event.description}</p>
                    
                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {event.venue}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mt-auto w-full" onClick={() => setSelectedEvent(event)}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <event.icon className="h-6 w-6 text-primary" />
                            {event.title}
                          </DialogTitle>
                          <DialogDescription>
                            {event.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          
                          <div className="grid gap-3 rounded-lg bg-muted p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">{event.date} | {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{event.venue}</span>
                            </div>
                            {event.speaker && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="text-sm">{event.speaker}</span>
                              </div>
                            )}
                            {event.prize && (
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-primary" />
                                <span className="text-sm text-primary">Prize: {event.prize}</span>
                              </div>
                            )}
                          </div>

                          {event.objective && (
                            <div>
                              <h4 className="mb-2">Objective</h4>
                              <p className="text-sm text-muted-foreground">{event.objective}</p>
                            </div>
                          )}

                          {event.outcome && (
                            <div>
                              <h4 className="mb-2">Expected Outcome</h4>
                              <p className="text-sm text-muted-foreground">{event.outcome}</p>
                            </div>
                          )}

                          {event.eligibility && (
                            <div>
                              <h4 className="mb-2">Eligibility</h4>
                              <p className="text-sm text-muted-foreground">{event.eligibility}</p>
                            </div>
                          )}

                          {event.rules && (
                            <div>
                              <h4 className="mb-2">Rules</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {event.rules.map((rule, idx) => (
                                  <li key={idx}>• {rule}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {event.judges && (
                            <div>
                              <h4 className="mb-2">Judges/Speakers</h4>
                              <div className="flex flex-wrap gap-2">
                                {event.judges.map((judge, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {judge}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {event.prerequisites && (
                            <div>
                              <h4 className="mb-2">Prerequisites</h4>
                              <p className="text-sm text-muted-foreground">{event.prerequisites}</p>
                            </div>
                          )}

                          {event.registrationDeadline && (
                            <div className="rounded-lg bg-primary/10 p-3 text-sm">
                              Registration deadline: {event.registrationDeadline}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button className="flex-1" onClick={() => onNavigate("booking")}>
                              Register Now
                            </Button>
                            <Button variant="outline" onClick={() => onNavigate("schedule")}>
                              Add to Schedule
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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