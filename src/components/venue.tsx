import { MapPin, Phone, Navigation, Car, Utensils, AlertCircle, Building2, Train, Plane, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Card3D } from "./accentricity/card-3d";
import { HoverGlow } from "./accentricity/hover-glow";
import { RippleBackground } from "./accentricity/ripple-background";
import React from "react";

export function Venue() {
  const venues = [
    {
      name: "SH-4",
      capacity: "Main Hall",
      events: ["The Ten Minute Million (Day 1 & 2)"],
      features: ["Premium audio-visual setup", "VC panel seating", "Pitch stage"],
      floor: "Seminar Hall 4",
    },
    {
      name: "530, 531",
      capacity: "Conference Rooms",
      events: ["Angel Investors Roundtable (Day 2)"],
      features: ["Boardroom setup", "Presentation screens", "Networking space"],
      floor: "5th Floor",
    },
    {
      name: "SH-3, 532, 533, 504",
      capacity: "Multiple Rooms",
      events: ["Pitch Arena - Idea to Reality (Day 1)"],
      features: ["Mentor feedback zones", "Pitch presentation areas"],
      floor: "Seminar Halls & 5th Floor",
    },
    {
      name: "Multipurpose Hall 1st Floor",
      capacity: "Large Hall",
      events: ["Incubator Summit (Day 1 & 2)"],
      features: ["Incubation center booths", "Meeting areas", "Networking zones"],
      floor: "1st Floor",
    },
    {
      name: "Convocation Hall",
      capacity: "800 people",
      events: ["Internship & Job Fair (Day 1 & 2)"],
      features: ["Startup presentation stage", "Recruitment booths", "Open seating"],
      floor: "Ground Floor",
    },
    {
      name: "Multipurpose Hall 2nd Floor & Architecture Ground Floor",
      capacity: "Open spaces",
      events: ["Networking Arena (Lunch Hours)"],
      features: ["Informal seating", "Refreshment areas", "Networking zones"],
      floor: "2nd Floor & Ground Floor",
    },
    {
      name: "Lobby Area",
      capacity: "Exhibition space",
      events: ["Startup Expo (Day 1 & 2, 9:30 AM - 4:30 PM)"],
      features: ["Display booths", "Demo zones", "Visitor walkways"],
      floor: "Main Lobby",
    },
    {
      name: "505, 506",
      capacity: "Classrooms",
      events: ["Competition - IPL Auction (Day 1 & 2)"],
      features: ["Interactive screens", "Team seating", "Bidding setup"],
      floor: "5th Floor",
    },
    {
      name: "Lab 520 & 521",
      capacity: "Computer Labs",
      events: ["Competition - Biz Arena Startup League (Day 1 & 2)"],
      features: ["Computer workstations", "Simulation software", "Team zones"],
      floor: "5th Floor",
    },
    {
      name: "216, 217",
      capacity: "Labs",
      events: ["Competition - AI Build-A-Thon (Day 1 & 2)"],
      features: ["High-performance systems", "AI development tools", "Collaboration spaces"],
      floor: "2nd Floor",
    },
    {
      name: "Lab 522 & 523",
      capacity: "Workshop Labs",
      events: ["Workshop - Design Thinking & Innovation Strategy (Day 1 & 2)"],
      features: ["Whiteboard walls", "Collaborative furniture", "Design tools"],
      floor: "5th Floor",
    },
    {
      name: "Lab 524 & 525",
      capacity: "Workshop Labs",
      events: ["Workshop - Finance & Marketing (Day 1 & 2)"],
      features: ["Presentation equipment", "Case study materials", "Group seating"],
      floor: "5th Floor",
    },
    {
      name: "Lab 526 & 527",
      capacity: "Data Labs",
      events: ["Workshop - Data Analytics & BDM (Day 1 & 2)"],
      features: ["Analytics software", "Data visualization tools", "Computing resources"],
      floor: "5th Floor",
    },
    {
      name: "SH-1",
      capacity: "Seminar Hall",
      events: ["Startup Youth Conclave (Day 1, 10:00 AM - 1:00 PM)"],
      features: ["Panel seating", "Presentation stage", "E-Cell networking area"],
      floor: "Seminar Hall 1",
    },
    {
      name: "Auditorium",
      capacity: "1000+ seats",
      events: ["Panel Discussion & Valedictory (Day 1, Post Lunch)"],
      features: ["Premium sound system", "LED screens", "VIP seating", "Live streaming"],
      floor: "Main Auditorium",
    },
  ];

  const amenities = [
    {
      icon: Car,
      title: "Parking",
      description: "Ample parking space available",
      details: "Secure parking for participants",
    },
    {
      icon: Utensils,
      title: "Food & Beverages",
      description: "Multiple food courts and cafes",
      details: "Vegetarian, vegan, and international options",
    },
    {
      icon: Wifi,
      title: "High-speed WiFi",
      description: "Wireless internet across campus",
      details: "Free WiFi available in all venues",
    },
    {
      icon: AlertCircle,
      title: "Medical Assistance",
      description: "On-site medical support",
      details: "First aid and emergency services available",
    },
    {
      icon: Building2,
      title: "Accessibility",
      description: "Wheelchair accessible",
      details: "Elevators and ramps throughout venue",
    },
    {
      icon: Phone,
      title: "Complete Event Support",
      description: "Round-the-clock event assistance",
      details: "Dedicated helpdesk for all queries",
    },
    {
      icon: MapPin,
      title: "Navigation",
      description: "Easy campus navigation",
      details: "Signages and volunteers throughout campus",
    },
    {
      icon: Train,
      title: "Transport Access",
      description: "Well-connected location",
      details: "Metro, rail, and bus connectivity nearby",
    },
  ];

  const directions = [
    {
      icon: Train,
      title: "By Metro/Train",
      routes: [
        "Poisar Metro Station (Line 7 – Dahisar East to Gundavali) – approx. 800m walk",
        "Magathane Metro Station (Line 7 – Dahisar East to Gundavali) – approx. 1.5 km walk",
        "Borivali Railway Station (Western Line) – approx. 3.5 km (15 min drive)",
        "Kandivali Railway Station (Western Line) – approx. 2.5 km (10 min drive)",
      ],
    },
    {
      icon: Plane,
      title: "By Air",
      routes: [
        "Chhatrapati Shivaji Maharaj International Airport – approx. 14 km (30–40 min drive)",
        "Airport Metro Connection available via Line 7 (Gundavali – Andheri East)",
      ],
    },
    {
      icon: Navigation,
      title: "By Road",
      routes: [
        "Well-connected via Western Express Highway – just 1 km away",
        "Nearest BEST Bus Stops: Thakur College Bus Stop (right outside campus); Samata Nagar Police Station Bus Stop – 650m away; Mahindra & Mahindra Bus Stop – 1 km away",
        "Frequent BEST city bus services from Borivali, Kandivali, Malad, and Andheri",
        "Ride-sharing services (Ola, Uber) and auto-rickshaws easily available",
      ],
    },
  ];

  // Simple path - Vite serves public folder at root
  const tcetSrc = "/assets/tcet.webp";

  return (
    <div className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
      <div className="relative mb-12">
        <RippleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Venue Information
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Thakur College of Engineering and Technology Campus - Hosting E-Summit 2026 (February 2-3, 2026)
          </p>
        </motion.div>
      </div>

      {/* Main Venue Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <HoverGlow>
          <Card className="mb-12 overflow-hidden max-w-full">
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
              <img
                src={tcetSrc}
                alt="Thakur College of Engineering and Technology Campus"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Mobile-optimized text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <div className="text-white max-w-full">
                  <h2 className="mb-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-lg break-words">
                    Thakur College of Engineering and Technology
                  </h2>
                  <div className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 drop-shadow-md" />
                    <span className="drop-shadow-md break-words">Thakur Village, Kandivali East, Mumbai</span>
                  </div>
                </div>
              </div>
            </div>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="col-span-full sm:col-span-1">
              <h4 className="mb-2 font-semibold text-sm sm:text-base">Address</h4>
              <p className="text-sm text-muted-foreground leading-relaxed break-words">
                Thakur College of Engineering and Technology<br />
                Thakur Village, Kandivali East<br />
                Mumbai - 400101, Maharashtra
              </p>
            </div>
            <div className="col-span-full sm:col-span-1">
              <h4 className="mb-2 font-semibold text-sm sm:text-base">Contact</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">+91 98765 43210</span>
              </p>
            </div>
            <div className="col-span-full sm:col-span-1">
              <Button
                className="w-full mt-2 sm:mt-0 h-10 sm:h-11 text-sm sm:text-base"
                onClick={() => window.open('https://maps.google.com/?q=Thakur+College+of+Engineering+and+Technology+Kandivali+East+Mumbai', '_blank')}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>
          </div>
        </CardContent>
          </Card>
        </HoverGlow>
      </motion.div>

      {/* Alert */}
      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please arrive 30 minutes before your first event for check-in and security clearance.
        </AlertDescription>
      </Alert>

      {/* Venue Halls */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl md:text-3xl font-bold">Event Venues</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue, index) => (
            <motion.div
              key={venue.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="w-full max-w-full overflow-hidden"
            >
              <Card3D className="w-full max-w-full h-full">
                <Card className="h-full transition-all hover:shadow-xl w-full overflow-hidden max-w-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between min-w-0">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg md:text-xl font-semibold truncate pr-2">{venue.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{venue.floor}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div>
                      <h4 className="mb-1 text-sm font-medium">Events</h4>
                      <div className="flex flex-wrap gap-1 min-w-0">
                        {venue.events.map((event) => (
                          <Badge key={event} variant="secondary" className="text-xs px-2 py-0.5 truncate max-w-full">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-medium">Features</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {venue.features.map((feature) => (
                          <li key={feature} className="leading-relaxed break-words">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>

      {/*
      Interactive Campus Map
      <Card className="mb-12">
        <CardHeader>
          <h2>Campus Map</h2>
        </CardHeader>
        <CardContent>
          <div className="relative flex aspect-video items-center justify-center rounded-lg bg-muted">
            <div className="text-center">
              <MapPin className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Interactive campus map showing all event locations
              </p>
              <Button className="mt-4" variant="outline">
                Download Map PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      */}

      {/* Amenities */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl md:text-3xl font-bold">Amenities & Facilities</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((amenity) => (
            <Card key={amenity.title} className="text-center">
              <CardContent className="p-4 md:p-6">
                <amenity.icon className="mx-auto mb-3 h-8 w-8 md:h-10 md:w-10 text-primary" />
                <h3 className="mb-2 text-sm md:text-base font-semibold">{amenity.title}</h3>
                <p className="mb-1 text-xs md:text-sm">{amenity.description}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{amenity.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Directions */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl md:text-3xl font-bold">How to Reach</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {directions.map((direction) => (
            <Card key={direction.title} className="h-full">
              <CardContent className="p-4 md:p-6">
                <direction.icon className="mb-4 h-8 w-8 md:h-10 md:w-10 text-primary" />
                <h3 className="mb-3 text-lg md:text-xl font-semibold">{direction.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {direction.routes.map((route) => (
                    <li key={route} className="leading-relaxed break-words">• {route}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <h2 className="text-xl md:text-2xl font-bold">Emergency Contacts</h2>
          <p className="text-sm text-muted-foreground">
            Dedicated event support team available online and offline at R&D Cell, 4th Floor
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium">Event Helpdesk</h4>
            <p className="text-sm text-muted-foreground break-words">
              <Phone className="mr-2 inline h-4 w-4" />
              Ayush Pardeshi (CEO): +91 87665 36270
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Operations & Coordination</h4>
            <p className="text-sm text-muted-foreground break-words">
              <Phone className="mr-2 inline h-4 w-4" />
              Bhummi Girnara (COO): +91 98698 32960
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Technical Support</h4>
            <p className="text-sm text-muted-foreground break-words">
              <Phone className="mr-2 inline h-4 w-4" />
              Ahana Kulkarni (CTO): +91 89283 52406
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">General Coordination</h4>
            <p className="text-sm text-muted-foreground break-words">
              <Phone className="mr-2 inline h-4 w-4" />
              Yash Khatri (Chairperson): +91 95185 09120
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
