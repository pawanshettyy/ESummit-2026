// src/data/teamData.ts (FINAL CLEAN CODE - CORE TEAM RESTORED TO ICON STYLE)
// src/data/teamData.ts (FINAL CLEAN CODE - CORE TEAM RESTORED TO ICON STYLE)
import type { TeamMember, Venue, Benefit, EventListing } from '../types/data';



// --- Organizing Committee (From image_abe664.png) ---
export const organizingCommittee: TeamMember[] = [
  {
    name: "Shruti Nale",
    role: "Organizing Committee",
    subRole: "OC Member",
    image: "https://ukfostering.org.uk/wp-content/uploads/2016/11/dummy-female-img.jpg", 
    phone: "+91 XXXXXXXXXX",
  },
  {
    name: "Aryan Singh",
    role: "Organizing Committee",
    subRole: "OC Member",
    image: "https://www.clipartmax.com/png/middle/144-1442578_flat-person-icon-download-dummy-man.png",
    phone: "+91 XXXXXXXXXX",
  },
  {
    name: "Rutuja Bunke",
    role: "Organizing Committee",
    subRole: "OC Member",
    image: "https://ukfostering.org.uk/wp-content/uploads/2016/11/dummy-female-img.jpg",
    phone: "+91 XXXXXXXXXX",
  },
  {
    name: "Dhanush Shetty",
    role: "Organizing Committee",
    subRole: "OC Member",
    image: "https://www.clipartmax.com/png/middle/144-1442578_flat-person-icon-download-dummy-man.png",
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
    subRole: "Core Member - CMO",
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
    addressLine1: "530, 531 " 
};

export const eventBenefits: Benefit[] = [
  { icon: 'Lightbulb', title: 'Mentorship from Founders', description: 'Get guidance from industry experts' },
  { icon: 'Award', title: 'Funding Opportunities', description: 'Connect with investors & VCs' },
  { icon: 'Sparkles', title: 'Networking Sessions', description: 'Meet founders & investors' },
  { icon: 'Rocket', title: 'Participation Certificate', description: 'Recognition for all participants' },
];

export const eventListings: EventListing[] = [
    { 
        title: "The Angel Investor's Roundtable", 
        tag: "Pre-Seed Funding", 
        description: "Simulate real-world investment pitch scenarios and promote practical entrepreneurship.", 
        date: "February 2, 2026", 
        location: "530, 531", 
        time: "10:00 AM - 1:00 PM" 
    }
];