/**
 * Utility for managing pass data and event access
 */

export interface Event {
  id: string;
  time: string;
  title: string;
  category: string;
  venue: string;
  speaker: string | null;
  description: string;
  duration: string;
  prize?: string;
  eligibility?: string;
  prerequisite?: string;
}

export interface PassData {
  id: string;
  type: string;
  passId: string;
  price: number;
  purchaseDate: string;
  status: string;
}

// Event data - centralized source of truth
export const eventSchedule = {
  day1: [
    // Registration & Opening
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
    // Pitching Events - Day 1
    {
      id: "d1-ten-minute-million",
      time: "10:00 - 13:00",
      title: "The Ten Minute Million",
      category: "pitching",
      venue: "Main Auditorium",
      speaker: "Venture Capitalists",
      description: "Pitch your startup to Venture Capitalists and compete for seed funding opportunities",
      duration: "3 hours",
      prize: "Seed Funding",
      eligibility: "TRL 4+",
    },
    {
      id: "d1-angel-roundtable",
      time: "14:00 - 17:00",
      title: "The Angel Investors Roundtable",
      category: "pitching",
      venue: "Conference Hall A",
      speaker: "Angel Investors",
      description: "Present your early-stage startup to angel investors and secure pre-seed funding",
      duration: "3 hours",
      prize: "Pre-Seed Funding",
      eligibility: "Early stage Startups",
    },
    // Competitions - Day 1
    {
      id: "d1-ipl-auction",
      time: "11:00 - 13:00",
      title: "IPL Auction",
      category: "competitions",
      venue: "Competition Arena A",
      speaker: "Business Strategy Experts",
      description: "Learn about capital allocation and customer acquisition through an interactive auction simulation",
      duration: "2 hours",
      prize: "₹50,000",
      eligibility: "Teams of 3-5 members",
    },
    {
      id: "d1-ai-buildathon-start",
      time: "09:00 - 18:00",
      title: "AI Buildathon - Day 1",
      category: "competitions",
      venue: "Tech Lab",
      speaker: "AI/ML Experts",
      description: "Build innovative AI solutions for early-stage startups (Day 1)",
      duration: "9 hours",
      prize: "₹1,50,000",
      eligibility: "Teams of 2-4 members",
    },
    // Workshops - Day 1
    {
      id: "d1-design-thinking",
      time: "10:00 - 12:30",
      title: "Design Thinking",
      category: "workshops",
      venue: "Workshop Hall A",
      speaker: "Innovation Expert",
      description: "Hands-on workshop on design thinking and innovation for building successful ventures",
      duration: "2.5 hours",
      eligibility: "All participants (Limited seats: 50)",
      prerequisite: "Laptop required",
    },
    {
      id: "d1-finance-marketing",
      time: "13:00 - 15:30",
      title: "Finance & Marketing",
      category: "workshops",
      venue: "Workshop Hall B",
      speaker: "Finance & Marketing Expert",
      description: "Hands-on workshop covering finance and marketing essentials for startups",
      duration: "2.5 hours",
      eligibility: "All participants (Limited seats: 50)",
    },
    // Networking - Day 1
    {
      id: "d1-startup-expo",
      time: "09:00 - 18:00",
      title: "Startup Expo",
      category: "networking",
      venue: "Exhibition Hall",
      speaker: null,
      description: "Showcase your startup and connect with investors, mentors, and fellow entrepreneurs",
      duration: "9 hours",
      eligibility: "All participants",
    },
    {
      id: "d1-panel-discussion",
      time: "15:00 - 17:00",
      title: "Panel Discussion",
      category: "networking",
      venue: "Main Auditorium",
      speaker: "Panel of Industry Experts",
      description: "Engage with industry leaders in panel discussions on entrepreneurship and innovation",
      duration: "2 hours",
      eligibility: "All participants",
    },
    {
      id: "d1-networking-arena",
      time: "10:00 - 18:00",
      title: "Networking Arena",
      category: "networking",
      venue: "Networking Lounge",
      speaker: null,
      description: "Dedicated networking space to connect with investors, mentors, and startup enthusiasts",
      duration: "8 hours",
      eligibility: "All participants",
    },
  ],
  day2: [
    // Pitching Events - Day 2
    {
      id: "d2-pitch-arena",
      time: "10:00 - 13:00",
      title: "Pitch Arena",
      category: "pitching",
      venue: "Conference Hall B",
      speaker: "Industry Experts",
      description: "Platform for first-time founders to pitch their ideas and get shortlisted for the next round",
      duration: "3 hours",
      prize: "Shortlisting for Round 2",
      eligibility: "Early stage Startups",
    },
    {
      id: "d2-incubator-summit",
      time: "14:00 - 17:00",
      title: "Incubator Summit",
      category: "pitching",
      venue: "Conference Hall C",
      speaker: "Incubation Centres",
      description: "Pitch to leading incubation centers and secure incubation support for your startup",
      duration: "3 hours",
      prize: "Incubation Support",
      eligibility: "Early Stage Startups",
    },
    // Competitions - Day 2
    {
      id: "d2-ai-buildathon-final",
      time: "09:00 - 18:00",
      title: "AI Buildathon - Day 2 Finals",
      category: "competitions",
      venue: "Tech Lab",
      speaker: "AI/ML Experts & Tech Leaders",
      description: "Final presentations and judging for AI Buildathon",
      duration: "9 hours",
      prize: "₹1,50,000",
      eligibility: "AI Buildathon participants only",
    },
    {
      id: "d2-startup-league",
      time: "10:00 - 14:00",
      title: "Startup League",
      category: "competitions",
      venue: "Competition Arena B",
      speaker: "Startup Founders",
      description: "Navigate startup challenges through strategic gameplay covering team, market, and capital management",
      duration: "4 hours",
      prize: "₹75,000",
      eligibility: "Teams of 3-4 members",
    },
    // Workshops - Day 2
    {
      id: "d2-data-analytics",
      time: "11:00 - 13:30",
      title: "Data Analytics & BDM",
      category: "workshops",
      venue: "Workshop Hall A",
      speaker: "Data Analytics Expert",
      description: "Learn hands-on data analysis tools and techniques to drive startup growth",
      duration: "2.5 hours",
      eligibility: "All participants (Limited seats: 50)",
      prerequisite: "Laptop required",
    },
    {
      id: "d2-ai-workshop",
      time: "14:00 - 16:30",
      title: "AI for Early Stage Startups",
      category: "workshops",
      venue: "Workshop Hall B",
      speaker: "AI/ML Expert",
      description: "Explore how AI can be leveraged in early-stage startups to accelerate growth",
      duration: "2.5 hours",
      eligibility: "All participants (Limited seats: 50)",
    },
    // Networking - Day 2
    {
      id: "d2-startup-expo",
      time: "09:00 - 18:00",
      title: "Startup Expo - Day 2",
      category: "networking",
      venue: "Exhibition Hall",
      speaker: null,
      description: "Continued startup showcase and networking opportunities",
      duration: "9 hours",
      eligibility: "All participants",
    },
    {
      id: "d2-networking-arena",
      time: "10:00 - 18:00",
      title: "Networking Arena - Day 2",
      category: "networking",
      venue: "Networking Lounge",
      speaker: null,
      description: "Final day networking space to solidify connections",
      duration: "8 hours",
      eligibility: "All participants",
    },
    {
      id: "d2-internship-fair",
      time: "11:00 - 16:00",
      title: "Internship Fair",
      category: "networking",
      venue: "Career Zone",
      speaker: null,
      description: "Connect with startups and companies looking for talented interns and fresh graduates",
      duration: "5 hours",
      eligibility: "Students and recent graduates",
    },
    {
      id: "d2-youth-conclave",
      time: "16:00 - 18:00",
      title: "Startup Youth Conclave",
      category: "networking",
      venue: "Conclave Hall",
      speaker: "Young Entrepreneurs",
      description: "Exclusive conclave bringing together young entrepreneurs, students, and startup enthusiasts",
      duration: "2 hours",
      eligibility: "Students and young entrepreneurs",
    },
    // Closing
    {
      id: "d2-closing",
      time: "18:00 - 19:00",
      title: "Closing Ceremony & Prize Distribution",
      category: "networking",
      venue: "Main Auditorium",
      speaker: "Organizing Committee",
      description: "Award ceremony and closing remarks for E-Summit 2026",
      duration: "1 hour",
      eligibility: "All participants",
    },
  ],
};

/**
 * Get events that a user is eligible for based on their pass type
 */
export function getEligibleEvents(passType: string): Event[] {
  const allEvents = [...eventSchedule.day1, ...eventSchedule.day2];
  
  // TCET Student Pass / Pixel Pass events (FREE pass)
  const pixelEvents = [
    "d1-startup-expo", "d1-panel-discussion", "d1-ipl-auction", 
    "d1-ai-buildathon-start", "d2-ai-buildathon-final", "d2-startup-league",
    "d2-startup-expo", "d1-networking-arena", "d2-networking-arena",
    "d1-registration", "d1-inaugural", "d2-closing"
  ];
  
  // Silicon Pass events (Pixel + extras)
  const siliconEvents = [
    ...pixelEvents,
    "d2-pitch-arena", "d2-youth-conclave",
    "d1-design-thinking", "d1-finance-marketing", "d2-data-analytics",
    // Lunch included with Silicon Pass
  ];
  
  // Quantum Pass events (Silicon + premium pitching events)
  const quantumEvents = [
    ...siliconEvents,
    "d1-ten-minute-million", "d1-angel-roundtable", 
    "d2-incubator-summit", "d2-internship-fair", "d2-ai-workshop"
  ];
  
  switch (passType) {
    case "pixel": // Pixel Pass - Free entry events
      return allEvents.filter(e => pixelEvents.includes(e.id));
    
    case "tcet_student": // TCET Student Pass - Same as Quantum (free)
    case "tcet student": 
      return allEvents.filter(e => quantumEvents.includes(e.id));
    
    case "silicon": // Silicon Pass - Pixel + workshops + pitch arena
      return allEvents.filter(e => siliconEvents.includes(e.id));
    
    case "quantum": // Quantum Pass - All events
      return allEvents.filter(e => quantumEvents.includes(e.id));
    
    // Legacy pass types (for backward compatibility)
    case "day1": // Gold Pass - Day 1 only
      return eventSchedule.day1;
    
    case "day2": // Silver Pass - Day 2 only
      return eventSchedule.day2;
    
    case "full": // Platinum Pass - Both days
    case "group": // Group Pass - Both days
      return allEvents;
    
    default:
      return [];
  }
}

/**
 * Get pass name from pass ID
 */
export function getPassName(passId: string): string {
  const passNames: Record<string, string> = {
    pixel: "Pixel Pass",
    silicon: "Silicon Pass",
    quantum: "Quantum Pass",
    tcet_student: "TCET Student Pass",
    "tcet student": "TCET Student Pass",
    // Legacy pass names for backward compatibility
    day1: "Gold Pass",
    day2: "Silver Pass",
    full: "Platinum Pass",
    group: "Group Pass (5+)",
  };
  return passNames[passId] || "Unknown Pass";
}

/**
 * Save purchased pass to localStorage
 */
export function savePurchasedPass(passData: PassData): void {
  const existingPasses = getPurchasedPasses();
  existingPasses.push(passData);
  localStorage.setItem("purchasedPasses", JSON.stringify(existingPasses));
}

/**
 * Get all purchased passes from localStorage
 */
export function getPurchasedPasses(): PassData[] {
  const passes = localStorage.getItem("purchasedPasses");
  return passes ? JSON.parse(passes) : [];
}

/**
 * Format event for display with date
 */
export function formatEventWithDate(event: Event, day: number): {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  speaker: string | null;
  description: string;
} {
  // E-Summit dates: February 2-3, 2026
  const eventDate = day === 1 ? "February 2, 2026" : "February 3, 2026";
  const dayLabel = day === 1 ? "Day 1" : "Day 2";
  
  return {
    id: event.id,
    title: event.title,
    date: eventDate,
    time: event.time,
    venue: event.venue,
    category: event.category,
    speaker: event.speaker,
    description: event.description,
  };
}

/**
 * Get all events for a pass with formatted dates
 */
export function getFormattedEventsForPass(passType: string) {
  const eligibleEvents = getEligibleEvents(passType);
  
  return eligibleEvents.map((event) => {
    const day = event.id.startsWith("d1") ? 1 : 2;
    return formatEventWithDate(event, day);
  });
}
