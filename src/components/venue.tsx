import { MapPin, Phone, Navigation, Car, Utensils, AlertCircle, Building2, Train, Plane } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Card3D } from "./accentricity/card-3d";
import { HoverGlow } from "./accentricity/hover-glow";
import { RippleBackground } from "./accentricity/ripple-background";

export function Venue() {
  const venues = [
    {
      name: "Main Auditorium",
      capacity: "2000 seats",
      events: ["Keynotes", "Panel Discussions", "Competition Finals"],
      features: ["Air-conditioned", "Premium sound system", "LED screens", "Live streaming"],
      floor: "Ground Floor",
    },
    {
      name: "Conference Hall B",
      capacity: "500 seats",
      events: ["B-Plan Competition", "Case Studies"],
      features: ["Projector", "Whiteboard", "Video conferencing"],
      floor: "First Floor",
    },
    {
      name: "Conference Hall C",
      capacity: "300 seats",
      events: ["Workshops", "Breakout Sessions"],
      features: ["Interactive displays", "Group seating"],
      floor: "First Floor",
    },
    {
      name: "Workshop Hall A",
      capacity: "150 seats",
      events: ["Technical Workshops", "Design Sessions"],
      features: ["Power outlets", "High-speed WiFi", "Collaborative spaces"],
      floor: "Second Floor",
    },
    {
      name: "Workshop Hall B",
      capacity: "150 seats",
      events: ["Marketing Workshops", "Growth Sessions"],
      features: ["Power outlets", "High-speed WiFi", "Presentation equipment"],
      floor: "Second Floor",
    },
    {
      name: "Tech Lab",
      capacity: "200 workstations",
      events: ["Hackathon", "Coding Competitions"],
      features: ["High-performance computers", "Multiple monitors", "24/7 access"],
      floor: "Third Floor",
    },
    {
      name: "Exhibition Area",
      capacity: "Open space",
      events: ["Startup Showcase", "Networking", "Sponsor Booths"],
      features: ["Modular booths", "Demo spaces", "Networking zones"],
      floor: "Ground Floor",
    },
    {
      name: "Food Court",
      capacity: "800 people",
      events: ["Meals", "Casual Networking"],
      features: ["Multiple cuisines", "Vegetarian options", "Quick service"],
      floor: "Ground Floor",
    },
    {
      name: "VIP Lounge",
      capacity: "100 people",
      events: ["Exclusive Networking"],
      features: ["Premium seating", "Complimentary refreshments", "Private meeting spaces"],
      floor: "First Floor",
      vipOnly: true,
    },
  ];

  const amenities = [
    {
      icon: Car,
      title: "Parking",
      description: "2000+ parking spots available",
      details: "Free parking for all pass holders",
    },
    {
      icon: Utensils,
      title: "Food & Beverages",
      description: "Multiple food courts and cafes",
      details: "Vegetarian, vegan, and international options",
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
          <h1 className="mb-4">Venue Information</h1>
          <p className="text-muted-foreground">
            Thakur College of Engineering and Technology Campus - Hosting E-Summit 2026
          </p>
        </motion.div>
      </div>

      {/* Main Venue Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <HoverGlow>
          <Card className="mb-12 overflow-hidden">
            <div className="relative h-96">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1600903308878-bf5e554ab841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYW1wdXMlMjBidWlsZGluZ3xlbnwxfHx8fDE3NTk0Mjg4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Campus venue"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="mb-2 text-white">Thakur College of Engineering and Technology</h2>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Thakur Village, Kandivali East</span>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="mb-1">Address</h4>
              <p className="text-sm text-muted-foreground">
                Thakur College of Engineering and Technology, Kandivali East,<br />
                Mumbai - 400101
              </p>
            </div>
            <div>
              <h4 className="mb-1">Contact</h4>
              <p className="text-sm text-muted-foreground">
                <Phone className="mr-2 inline h-4 w-4" />
                +91 98765 43210
              </p>
            </div>
            <div>
              <Button className="w-full">
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
        <h2 className="mb-6">Event Venues</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue, index) => (
            <motion.div
              key={venue.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card3D>
                <Card className="h-full transition-all hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3>{venue.name}</h3>
                        <p className="text-sm text-muted-foreground">{venue.floor}</p>
                      </div>
                      {venue.vipOnly && (
                        <Badge variant="default">VIP Only</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity: {venue.capacity}</p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm">Events</h4>
                      <div className="flex flex-wrap gap-1">
                        {venue.events.map((event) => (
                          <Badge key={event} variant="secondary" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm">Features</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {venue.features.map((feature) => (
                          <li key={feature}>• {feature}</li>
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
        <h2 className="mb-6">Amenities & Facilities</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {amenities.map((amenity) => (
            <Card key={amenity.title}>
              <CardContent className="p-6 text-center">
                <amenity.icon className="mx-auto mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-2">{amenity.title}</h3>
                <p className="mb-1 text-sm">{amenity.description}</p>
                <p className="text-xs text-muted-foreground">{amenity.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Directions */}
      <div className="mb-12">
        <h2 className="mb-6">How to Reach</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {directions.map((direction) => (
            <Card key={direction.title}>
              <CardContent className="p-6">
                <direction.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-3">{direction.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {direction.routes.map((route) => (
                    <li key={route}>• {route}</li>
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
          <h2>Emergency Contacts</h2>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2">Event Helpdesk</h4>
            <p className="text-sm text-muted-foreground">
              <Phone className="mr-2 inline h-4 w-4" />
              +91 98765 43210
            </p>
          </div>
          <div>
            <h4 className="mb-2">Medical Emergency</h4>
            <p className="text-sm text-muted-foreground">
              <Phone className="mr-2 inline h-4 w-4" />
              +91 98765 43211
            </p>
          </div>
          <div>
            <h4 className="mb-2">Security</h4>
            <p className="text-sm text-muted-foreground">
              <Phone className="mr-2 inline h-4 w-4" />
              +91 98765 43212
            </p>
          </div>
          <div>
            <h4 className="mb-2">Lost & Found</h4>
            <p className="text-sm text-muted-foreground">
              <Phone className="mr-2 inline h-4 w-4" />
              +91 98765 43213
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}