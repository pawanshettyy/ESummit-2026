// src/data/teamData.ts (FINAL CLEAN CODE - CORE TEAM RESTORED TO ICON STYLE)
// src/data/teamData.ts (FINAL CLEAN CODE - CORE TEAM RESTORED TO ICON STYLE)
import type { TeamMember, Venue, Benefit, EventListing } from '../types/data';

// --- Organizing Committee (From image_abe664.png) ---
export const organizingCommittee: TeamMember[] = [
  {
    name: "Shruti Nale",
    role: "Organizing Committee",
    subRole: "OC Member",
    image: "/images/dummy/akshay.jpg", 
    phone: "+91 XXXXXXXXXX",
  },
  {
    name: "Aryan Singh",
    role: "Organizing Committee",
    subRole: "OC Member",
    image: "/images/dummy/saloni.jpg",
    phone: "+91 XXXXXXXXXX",
  },
  {
    name: "Rutuja Bunke",
    role: "Organizing Committee",
    subRole: "OC Member",
    image: "/images/dummy/shruti.jpg",
    phone: "+91 XXXXXXXXXX",
  },
  {
    name: "Dhanush Shetty",
    role: "Organizing Committee",
    subRole: "OC Member",
    image: "/images/dummy/sakshi.jpg",
    phone: "+91 XXXXXXXXXX",
  },
];

// --- Faculty Coordinators ---
export const facultyCoordinators: TeamMember[] = [
  {
    name: "Mr. Vinayak Bachel",
    role: "Faculty Coordinator",
    subRole: "Faculty Coordinator",
    email: "vinayak.bachel@thakureducation.org",
    duty: "Pitching Events",
  },
  {
    name: "Ms. Apeksha Waghmare", 
    role: "Faculty Coordinator",
    subRole: "Faculty Coordinator",
    email: "apeksha.waghmare@thakureducation.org",
    duty: "Pitching Events",
  },
];

// --- Core Team (Using standard icon placeholder) ---
export const coreTeam: TeamMember[] = [
  {
    name: "Hredey Chaand",
    role: "Core Team",
    subRole: "Core Member - COO",
    email: "xyz@example.com",
    phone: "+91 XXXXXXXXXX",
  },
  {
    name: "Mishti Dhiman",
    role: "Core Team",
    subRole: "Core Member",
    email: "abc@example.com",
    phone: "+91 XXXXXXXXXX",
  },
  {
    name: "Diya Tailor",
    role: "Core Team",
    subRole: "Junior Core",
    email: "diya@example.com",
    phone: "+91 XXXXXXXXXX",
  },
 
];


// --- Event Venue, Benefits, Event Listings ---
export const eventVenue: Venue = { 
    name: "Thakur College of Engineering and Technology",
    addressLine1: "Room 530, 531" 
};

export const eventBenefits: Benefit[] = [
    { icon: '💡', title: 'Mentorship from Founders', description: 'Get guidance from industry experts' },
    { icon: '🏆', title: 'Funding Opportunities', description: 'Connect with investors & VCs' },
    { icon: '✨', title: 'Networking Sessions', description: 'Meet founders & investors' },
    { icon: '🚀', title: 'Participation Certificate', description: 'Recognition for all participants' },
];

export const eventListings: EventListing[] = [
    { 
        title: "The Angel Investors Roundtable", 
        tag: "Pre-Seed Funding", 
        description: "Present your early-stage startup to angel investors and secure pre-seed funding.", 
        date: "January 23–24, 2026", 
        location: "Room 530, 531", 
        time: "10:00 AM - 1:00 PM" 
    }
];