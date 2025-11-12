import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Filter, Download, Plus, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { motion } from "motion/react";
import { BentoGrid, BentoCard } from "./magicui/bento-grid";
import { PulseDot } from "./accentricity/pulse-dot";
import { FloatingCard } from "./accentricity/floating-card";

export function EventSchedule() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [mySchedule, setMySchedule] = useState<string[]>([]);

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
        time: "10:45 - 12:00",
        title: "The Ten Minute Million",
        category: "pitching",
        venue: "Main Auditorium",
        speaker: "Investor Panel",
        description: "High-stakes pitch competition where founders have just 10 minutes to secure funding commitments",
        duration: "1 hr 15 min",
        prize: "₹10,00,000",
        eligibility: "Quantum Pass holders only",
      },
      {
        id: "d1-angel-roundtable",
        time: "10:45 - 12:00",
        title: "Angel Investors Roundtable",
        category: "pitching",
        venue: "Conference Hall A",
        speaker: "Angel Investors Network",
        description: "Intimate discussion platform for early-stage startups to connect with angel investors",
        duration: "1 hr 15 min",
        eligibility: "Quantum Pass holders only",
      },
      {
        id: "d1-ipl-auction",
        time: "12:00 - 14:00",
        title: "IPL Auction",
        category: "competitions",
        venue: "Sports Arena",
        speaker: null,
        description: "Strategic team-building game where participants bid for cricket players to build their dream IPL team",
        duration: "2 hours",
        prize: "₹50,000",
        eligibility: "All pass holders",
      },
      {
        id: "d1-ai-buildathon-start",
        time: "13:00 - 17:00",
        title: "AI Build-A-Thon (Day 1)",
        category: "competitions",
        venue: "Tech Lab",
        speaker: "Tech Mentors",
        description: "Build innovative AI-powered solutions to real-world problems (Continues to Day 2)",
        duration: "4 hours",
        prize: "₹1,50,000",
        eligibility: "All pass holders",
        prerequisite: "Laptop with development environment",
      },
      {
        id: "d1-design-thinking",
        time: "14:30 - 16:00",
        title: "Design Thinking Workshop",
        category: "workshops",
        venue: "Workshop Hall A",
        speaker: "Design Expert",
        description: "Hands-on workshop teaching design thinking methodology for problem-solving",
        duration: "1 hr 30 min",
        eligibility: "Silicon & Quantum Pass holders",
        prerequisite: "Notepad recommended",
      },
      {
        id: "d1-finance-marketing",
        time: "14:30 - 16:00",
        title: "Finance & Marketing Workshop",
        category: "workshops",
        venue: "Workshop Hall B",
        speaker: "Industry Expert",
        description: "Master financial planning and marketing strategies for startups",
        duration: "1 hr 30 min",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d1-startup-expo",
        time: "15:00 - 18:00",
        title: "Startup Expo",
        category: "networking",
        venue: "Exhibition Area",
        speaker: null,
        description: "Explore booths from innovative startups and connect with founders",
        duration: "3 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d1-panel-discussion",
        time: "16:30 - 18:00",
        title: "Panel Discussion: Future of Entrepreneurship",
        category: "networking",
        venue: "Main Auditorium",
        speaker: "Industry Leaders",
        description: "Expert panel discussing trends and future of entrepreneurship in India",
        duration: "1 hr 30 min",
        eligibility: "All pass holders",
      },
      {
        id: "d1-networking-arena",
        time: "18:30 - 20:00",
        title: "Networking Arena",
        category: "networking",
        venue: "Lounge Area",
        speaker: null,
        description: "Open networking session with refreshments - connect with entrepreneurs and investors",
        duration: "1 hr 30 min",
        eligibility: "Silicon & Quantum Pass holders",
      },
    ],
    day2: [
      {
        id: "d2-pitch-arena",
        time: "09:00 - 11:00",
        title: "Pitch Arena",
        category: "pitching",
        venue: "Main Auditorium",
        speaker: "VC Panel",
        description: "Rapid-fire pitch competition where startups present to venture capitalists",
        duration: "2 hours",
        prize: "₹2,00,000",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d2-incubator-summit",
        time: "09:00 - 11:00",
        title: "Incubator Summit",
        category: "pitching",
        venue: "Conference Hall A",
        speaker: "Incubator Directors",
        description: "Meet leading incubators and accelerators looking for their next cohort",
        duration: "2 hours",
        eligibility: "Quantum Pass holders only",
      },
      {
        id: "d2-ai-buildathon-final",
        time: "10:00 - 13:00",
        title: "AI Build-A-Thon (Finals)",
        category: "competitions",
        venue: "Tech Lab",
        speaker: "Tech Judges",
        description: "Final presentations and judging for the AI hackathon",
        duration: "3 hours",
        prize: "₹1,50,000",
        eligibility: "All pass holders (participants only)",
      },
      {
        id: "d2-startup-league",
        time: "11:30 - 13:30",
        title: "Biz-Arena League (Startup League)",
        category: "competitions",
        venue: "Conference Hall B",
        speaker: "Business Mentors",
        description: "Team-based business case competition with real-world startup challenges",
        duration: "2 hours",
        prize: "₹1,00,000",
        eligibility: "All pass holders",
      },
      {
        id: "d2-data-analytics",
        time: "11:30 - 13:00",
        title: "Data Analytics & BDM Workshop",
        category: "workshops",
        venue: "Workshop Hall A",
        speaker: "Data Scientist",
        description: "Learn data-driven decision making and business development strategies",
        duration: "1 hr 30 min",
        eligibility: "Silicon & Quantum Pass holders",
        prerequisite: "Basic Excel knowledge",
      },
      {
        id: "d2-ai-workshop",
        time: "11:30 - 13:00",
        title: "AI for Early Stage Startups",
        category: "workshops",
        venue: "Workshop Hall B",
        speaker: "AI Consultant",
        description: "Practical applications of AI for early-stage startup operations",
        duration: "1 hr 30 min",
        eligibility: "Quantum Pass holders",
      },
      {
        id: "d2-startup-expo",
        time: "14:00 - 17:00",
        title: "Startup Expo (Day 2)",
        category: "networking",
        venue: "Exhibition Area",
        speaker: null,
        description: "Continue exploring innovative startups and their products",
        duration: "3 hours",
        eligibility: "All pass holders",
      },
      {
        id: "d2-networking-arena",
        time: "14:00 - 15:30",
        title: "Networking Arena (Day 2)",
        category: "networking",
        venue: "Lounge Area",
        speaker: null,
        description: "Final networking opportunity with entrepreneurs and investors",
        duration: "1 hr 30 min",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d2-internship-fair",
        time: "15:00 - 17:00",
        title: "Internship Fair",
        category: "networking",
        venue: "Career Zone",
        speaker: null,
        description: "Meet startups and companies offering internship opportunities",
        duration: "2 hours",
        eligibility: "Quantum Pass holders",
      },
      {
        id: "d2-youth-conclave",
        time: "16:00 - 17:30",
        title: "Startup Youth Conclave",
        category: "networking",
        venue: "Main Auditorium",
        speaker: "Young Entrepreneurs",
        description: "Inspiring talks from young successful entrepreneurs and student founders",
        duration: "1 hr 30 min",
        eligibility: "Silicon & Quantum Pass holders",
      },
      {
        id: "d2-closing",
        time: "18:00 - 19:30",
        title: "Closing Ceremony & Prize Distribution",
        category: "networking",
        venue: "Main Auditorium",
        speaker: "Organizing Committee",
        description: "Award ceremony, winner announcements, and closing remarks",
        duration: "1 hr 30 min",
        eligibility: "All pass holders",
      },
    ],
  };

  const toggleEvent = (eventId: string) => {
    if (mySchedule.includes(eventId)) {
      setMySchedule(mySchedule.filter((id) => id !== eventId));
      toast.info("Event removed from your schedule");
    } else {
      // Check for clash
      const event = [...events.day1, ...events.day2].find((e) => e.id === eventId);
      if (event) {
        const hasClash = mySchedule.some((scheduledId) => {
          const scheduledEvent = [...events.day1, ...events.day2].find((e) => e.id === scheduledId);
          return scheduledEvent && scheduledEvent.time === event.time;
        });

        if (hasClash) {
          toast.error("Time clash detected! Please remove conflicting event first.");
          return;
        }
      }
      setMySchedule([...mySchedule, eventId]);
      toast.success("Event added to your schedule");
    }
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

  const exportSchedule = () => {
    const myEvents = [...events.day1, ...events.day2].filter((e) => mySchedule.includes(e.id));
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//E-Summit 2026//EN
${myEvents.map((event) => `BEGIN:VEVENT
SUMMARY:${event.title}
LOCATION:${event.venue}
DESCRIPTION:${event.description}
END:VEVENT`).join("\n")}
END:VCALENDAR`;
    
    toast.success("Calendar export prepared! (Demo)");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4">Event Schedule</h1>
        <p className="text-muted-foreground">
          Plan your E-Summit experience with our comprehensive schedule
        </p>
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
                <SelectItem value="Workshop Hall A">Workshop Hall A</SelectItem>
                <SelectItem value="Workshop Hall B">Workshop Hall B</SelectItem>
                <SelectItem value="Conference Hall B">Conference Hall B</SelectItem>
                <SelectItem value="Conference Hall C">Conference Hall C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={exportSchedule} className="w-full md:w-auto md:ml-auto">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export My Schedule</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </CardContent>
      </Card>

      {mySchedule.length > 0 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {mySchedule.length} event(s) in your schedule. We'll send reminders 1 hour before each event.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="day1">Day 1 - January 23</TabsTrigger>
          <TabsTrigger value="day2">Day 2 - January 24</TabsTrigger>
        </TabsList>

        <TabsContent value="day1" className="mt-6">
          <div className="space-y-4">
            {filterEvents(events.day1).map((event) => (
              <Card key={event.id} className={mySchedule.includes(event.id) ? "border-primary" : ""}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant={getCategoryColor(event.category) as any}>
                          {categories.find((c) => c.id === event.category)?.label}
                        </Badge>
                        {event.prize && (
                          <Badge variant="default" className="bg-primary">
                            Prize: {event.prize}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="mb-2">{event.title}</h3>
                      
                      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.venue}
                        </div>
                        {event.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.speaker}
                          </div>
                        )}
                      </div>

                      <p className="mb-2 text-sm">{event.description}</p>

                      {(event.eligibility || event.prerequisite) && (
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {event.eligibility && <span>• {event.eligibility}</span>}
                          {event.prerequisite && <span>• {event.prerequisite}</span>}
                        </div>
                      )}
                    </div>

                    <Button
                      variant={mySchedule.includes(event.id) ? "default" : "outline"}
                      onClick={() => toggleEvent(event.id)}
                      className="md:ml-4"
                    >
                      {mySchedule.includes(event.id) ? (
                        <>Added</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Schedule
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="day2" className="mt-6">
          <div className="space-y-4">
            {filterEvents(events.day2).map((event) => (
              <Card key={event.id} className={mySchedule.includes(event.id) ? "border-primary" : ""}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant={getCategoryColor(event.category) as any}>
                          {categories.find((c) => c.id === event.category)?.label}
                        </Badge>
                        {event.prize && (
                          <Badge variant="default" className="bg-primary">
                            Prize: {event.prize}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="mb-2">{event.title}</h3>
                      
                      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.venue}
                        </div>
                        {event.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.speaker}
                          </div>
                        )}
                      </div>

                      <p className="mb-2 text-sm">{event.description}</p>

                      {(event.eligibility || event.prerequisite) && (
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {event.eligibility && <span>• {event.eligibility}</span>}
                          {event.prerequisite && <span>• {event.prerequisite}</span>}
                        </div>
                      )}
                    </div>

                    <Button
                      variant={mySchedule.includes(event.id) ? "default" : "outline"}
                      onClick={() => toggleEvent(event.id)}
                      className="md:ml-4"
                    >
                      {mySchedule.includes(event.id) ? (
                        <>Added</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Schedule
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}