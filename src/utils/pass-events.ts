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

/**
 * Get events that a user is eligible for based on their pass type
 */
export function getEligibleEvents(passType: string): Event[] {
  const allEvents = [...eventSchedule.day1, ...eventSchedule.day2];
  
  switch (passType) {
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
  // E-Summit dates: March 15-16, 2026
  const eventDate = day === 1 ? "March 15, 2026" : "March 16, 2026";
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
