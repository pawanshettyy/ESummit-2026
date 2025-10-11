import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Filter, Download, Plus, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import { BentoGrid, BentoCard } from "./magicui/bento-grid";
import { PulseDot } from "./accentricity/pulse-dot";
import { FloatingCard } from "./accentricity/floating-card";

export function EventSchedule() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [mySchedule, setMySchedule] = useState<string[]>([]);

  const categories = [
    { id: "all", label: "All Events", color: "default" },
    { id: "competition", label: "Competitions", color: "primary" },
    { id: "workshop", label: "Workshops", color: "secondary" },
    { id: "keynote", label: "Keynotes", color: "accent" },
    { id: "panel", label: "Panel Discussions", color: "muted" },
    { id: "networking", label: "Networking", color: "outline" },
  ];

  const events = {
    day1: [
      {
        id: "d1-1",
        time: "09:00 - 09:30",
        title: "Registration & Welcome",
        category: "networking",
        venue: "Main Entrance",
        speaker: null,
        description: "Check-in and receive your welcome kit",
        duration: "30 min",
      },
      {
        id: "d1-2",
        time: "09:30 - 10:30",
        title: "Inaugural Ceremony",
        category: "keynote",
        venue: "Main Auditorium",
        speaker: "Chief Guest",
        description: "Official opening of E-Summit 2026",
        duration: "1 hour",
      },
      {
        id: "d1-3",
        time: "10:45 - 12:00",
        title: "Keynote: Building Scalable Startups",
        category: "keynote",
        venue: "Main Auditorium",
        speaker: "Dr. Rajesh Kumar",
        description: "Learn strategies for scaling your startup in emerging markets",
        duration: "1 hr 15 min",
        eligibility: "All participants",
      },
      {
        id: "d1-4",
        time: "10:45 - 12:00",
        title: "Workshop: Product Design Thinking",
        category: "workshop",
        venue: "Workshop Hall A",
        speaker: "Design Expert",
        description: "Hands-on workshop on design thinking methodology",
        duration: "1 hr 15 min",
        eligibility: "Limited seats",
        prerequisite: "Laptop required",
      },
      {
        id: "d1-5",
        time: "12:00 - 13:00",
        title: "Networking Lunch",
        category: "networking",
        venue: "Food Court",
        speaker: null,
        description: "Connect with fellow entrepreneurs and investors",
        duration: "1 hour",
      },
      {
        id: "d1-6",
        time: "13:00 - 15:00",
        title: "B-Plan Competition - Round 1",
        category: "competition",
        venue: "Conference Hall B",
        speaker: "Panel of Judges",
        description: "Present your business plan to win ₹3L prize",
        duration: "2 hours",
        prize: "₹3,00,000",
        eligibility: "Pre-registered teams only",
      },
      {
        id: "d1-7",
        time: "13:00 - 15:00",
        title: "Workshop: Digital Marketing Strategies",
        category: "workshop",
        venue: "Workshop Hall A",
        speaker: "Marketing Guru",
        description: "Master digital marketing for startups",
        duration: "2 hours",
      },
      {
        id: "d1-8",
        time: "15:30 - 17:00",
        title: "Panel: Future of AI in Business",
        category: "panel",
        venue: "Main Auditorium",
        speaker: "Industry Experts",
        description: "Expert discussion on AI's impact on entrepreneurship",
        duration: "1 hr 30 min",
      },
      {
        id: "d1-9",
        time: "15:30 - 17:00",
        title: "Case Study Competition",
        category: "competition",
        venue: "Conference Hall C",
        speaker: "Corporate Judges",
        description: "Solve real-world business challenges",
        duration: "1 hr 30 min",
        prize: "₹1,50,000",
      },
      {
        id: "d1-10",
        time: "17:30 - 19:00",
        title: "Startup Showcase & Networking",
        category: "networking",
        venue: "Exhibition Area",
        speaker: null,
        description: "Meet innovative startups and investors",
        duration: "1 hr 30 min",
      },
    ],
    day2: [
      {
        id: "d2-1",
        time: "09:00 - 10:30",
        title: "Keynote: From Idea to IPO",
        category: "keynote",
        venue: "Main Auditorium",
        speaker: "Priya Sharma",
        description: "Journey of building a successful startup",
        duration: "1 hr 30 min",
      },
      {
        id: "d2-2",
        time: "09:00 - 11:00",
        title: "Hackathon Finals",
        category: "competition",
        venue: "Tech Lab",
        speaker: "Tech Judges",
        description: "24-hour hackathon final presentations",
        duration: "2 hours",
        prize: "₹5,00,000",
        eligibility: "Hackathon participants only",
      },
      {
        id: "d2-3",
        time: "11:00 - 12:30",
        title: "Workshop: Financial Planning for Startups",
        category: "workshop",
        venue: "Workshop Hall A",
        speaker: "Finance Expert",
        description: "Master startup finances and funding",
        duration: "1 hr 30 min",
      },
      {
        id: "d2-4",
        time: "11:00 - 12:30",
        title: "Pitch Competition Finals",
        category: "competition",
        venue: "Main Auditorium",
        speaker: "Investor Panel",
        description: "Final round - pitch to top VCs",
        duration: "1 hr 30 min",
        prize: "₹2,00,000 + Funding",
      },
      {
        id: "d2-5",
        time: "12:30 - 13:30",
        title: "Lunch & Networking",
        category: "networking",
        venue: "Food Court",
        speaker: null,
        description: "Final networking opportunity",
        duration: "1 hour",
      },
      {
        id: "d2-6",
        time: "13:30 - 15:00",
        title: "Panel: Fundraising Strategies",
        category: "panel",
        venue: "Main Auditorium",
        speaker: "VCs & Angel Investors",
        description: "Learn how to raise capital effectively",
        duration: "1 hr 30 min",
      },
      {
        id: "d2-7",
        time: "13:30 - 15:00",
        title: "Workshop: Growth Hacking",
        category: "workshop",
        venue: "Workshop Hall B",
        speaker: "Growth Expert",
        description: "Rapid growth strategies for startups",
        duration: "1 hr 30 min",
      },
      {
        id: "d2-8",
        time: "15:30 - 17:00",
        title: "Closing Ceremony & Prize Distribution",
        category: "keynote",
        venue: "Main Auditorium",
        speaker: "Organizing Committee",
        description: "Award ceremony and closing remarks",
        duration: "1 hr 30 min",
      },
      {
        id: "d2-9",
        time: "17:30 - 19:30",
        title: "Networking Dinner with Speakers",
        category: "networking",
        venue: "Banquet Hall",
        speaker: null,
        description: "Exclusive dinner with speakers and VIPs",
        duration: "2 hours",
        eligibility: "VIP pass holders only",
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

  const filterEvents = (eventsList: typeof events.day1) => {
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
          <TabsTrigger value="day1">Day 1 - March 15</TabsTrigger>
          <TabsTrigger value="day2">Day 2 - March 16</TabsTrigger>
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