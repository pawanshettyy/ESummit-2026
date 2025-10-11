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
    { id: "competitions", label: "Competitions", icon: Trophy },
    { id: "workshops", label: "Workshops", icon: Users },
    { id: "speakers", label: "Speaker Sessions", icon: Lightbulb },
    { id: "hackathon", label: "Hackathon", icon: Code },
    { id: "networking", label: "Networking", icon: Coffee },
  ];

  const allEvents = [
    {
      id: 1,
      title: "B-Plan Competition",
      category: "competitions",
      description: "Present your business plan and compete for funding and mentorship opportunities.",
      date: "March 15, 2026",
      time: "13:00 - 17:00",
      venue: "Conference Hall B",
      prize: "₹3,00,000",
      eligibility: "Teams of 2-5 members",
      rules: ["Business plan must be original", "10-minute presentation", "Q&A session with judges"],
      judges: ["Industry Experts", "VCs", "Serial Entrepreneurs"],
      prerequisites: "Registered teams only",
      registrationDeadline: "March 10, 2026",
      icon: Trophy,
      color: "primary",
    },
    {
      id: 2,
      title: "Startup Pitch Competition",
      category: "competitions",
      description: "Pitch your startup idea to top VCs and angel investors for a chance to win funding.",
      date: "March 16, 2026",
      time: "11:00 - 14:00",
      venue: "Main Auditorium",
      prize: "₹2,00,000 + Potential Funding",
      eligibility: "Early-stage startups",
      rules: ["5-minute pitch", "Pitch deck required", "Live demo preferred"],
      judges: ["Angel Investors", "VCs", "Successful Founders"],
      prerequisites: "Working prototype/MVP",
      registrationDeadline: "March 8, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 3,
      title: "24-Hour Hackathon",
      category: "hackathon",
      description: "Build innovative solutions to real-world problems in this intense 24-hour coding marathon.",
      date: "March 15-16, 2026",
      time: "09:00 (Day 1) - 09:00 (Day 2)",
      venue: "Tech Lab",
      prize: "₹5,00,000",
      eligibility: "Teams of 2-4 members",
      rules: ["Code from scratch", "Open-source tools allowed", "Final presentation required"],
      judges: ["Tech Leaders", "CTOs", "Senior Engineers"],
      prerequisites: "Laptop and development environment setup",
      registrationDeadline: "March 5, 2026",
      icon: Code,
      color: "secondary",
    },
    {
      id: 4,
      title: "Case Study Competition",
      category: "competitions",
      description: "Analyze and solve real business challenges presented by top companies.",
      date: "March 15, 2026",
      time: "15:30 - 17:00",
      venue: "Conference Hall C",
      prize: "₹1,50,000",
      eligibility: "Teams of 3-4 members",
      rules: ["On-the-spot case study", "60-minute solution time", "15-minute presentation"],
      judges: ["Corporate Leaders", "Management Consultants"],
      prerequisites: "None",
      registrationDeadline: "March 12, 2026",
      icon: Briefcase,
      color: "accent",
    },
    {
      id: 5,
      title: "Product Design Thinking Workshop",
      category: "workshops",
      description: "Learn design thinking methodology from industry experts and apply it to real problems.",
      date: "March 15, 2026",
      time: "10:45 - 12:00",
      venue: "Workshop Hall A",
      eligibility: "All participants (Limited seats)",
      prerequisites: "Laptop required",
      speaker: "Design Expert from leading tech company",
      icon: Users,
      color: "muted",
    },
    {
      id: 6,
      title: "Digital Marketing for Startups",
      category: "workshops",
      description: "Master digital marketing strategies to grow your startup on a limited budget.",
      date: "March 15, 2026",
      time: "13:00 - 15:00",
      venue: "Workshop Hall A",
      eligibility: "All participants",
      prerequisites: "None",
      speaker: "Marketing Guru with 15+ years experience",
      icon: Users,
      color: "muted",
    },
    {
      id: 7,
      title: "Financial Planning for Startups",
      category: "workshops",
      description: "Learn how to manage startup finances, raise funding, and achieve profitability.",
      date: "March 16, 2026",
      time: "11:00 - 12:30",
      venue: "Workshop Hall A",
      eligibility: "All participants",
      prerequisites: "None",
      speaker: "Finance Expert & Former CFO",
      icon: Users,
      color: "muted",
    },
    {
      id: 8,
      title: "Growth Hacking Workshop",
      category: "workshops",
      description: "Discover rapid growth strategies used by successful startups to scale quickly.",
      date: "March 16, 2026",
      time: "13:30 - 15:00",
      venue: "Workshop Hall B",
      eligibility: "All participants",
      prerequisites: "None",
      speaker: "Growth Expert from unicorn startup",
      icon: Users,
      color: "muted",
    },
    {
      id: 9,
      title: "Building Scalable Startups",
      category: "speakers",
      description: "Keynote on strategies for building and scaling startups in emerging markets.",
      date: "March 15, 2026",
      time: "10:45 - 12:00",
      venue: "Main Auditorium",
      speaker: "Dr. Rajesh Kumar, CEO of TechVentures India",
      eligibility: "All participants",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 10,
      title: "From Idea to IPO",
      category: "speakers",
      description: "Learn the complete journey of taking a startup from conception to public listing.",
      date: "March 16, 2026",
      time: "09:00 - 10:30",
      venue: "Main Auditorium",
      speaker: "Priya Sharma, Founder of StartupHub",
      eligibility: "All participants",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 11,
      title: "AI & Future of Entrepreneurship",
      category: "speakers",
      description: "Panel discussion on how AI is transforming the startup ecosystem.",
      date: "March 15, 2026",
      time: "15:30 - 17:00",
      venue: "Main Auditorium",
      speaker: "Panel of Industry Experts",
      eligibility: "All participants",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 12,
      title: "Fundraising Strategies Panel",
      category: "speakers",
      description: "VCs and angel investors share insights on raising capital effectively.",
      date: "March 16, 2026",
      time: "13:30 - 15:00",
      venue: "Main Auditorium",
      speaker: "VCs & Angel Investors",
      eligibility: "All participants",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 13,
      title: "Startup Showcase & Networking",
      category: "networking",
      description: "Meet innovative startups, connect with investors, and expand your network.",
      date: "March 15, 2026",
      time: "17:30 - 19:00",
      venue: "Exhibition Area",
      eligibility: "All participants",
      icon: Coffee,
      color: "outline",
    },
    {
      id: 14,
      title: "Networking Dinner with Speakers",
      category: "networking",
      description: "Exclusive dinner with keynote speakers and VIPs.",
      date: "March 16, 2026",
      time: "17:30 - 19:30",
      venue: "Banquet Hall",
      eligibility: "VIP pass holders only",
      icon: Coffee,
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
          Explore 30+ events including competitions, workshops, and networking sessions
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