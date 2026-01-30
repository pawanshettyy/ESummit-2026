import { Trophy, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { EventPageTemplate } from "./event-template";

export function TenMinuteMillionPage() {
  const eventData = {
    title: "The Ten Minute Deal",
    tagline: "Pitch Your Vision, Secure Your Future",
    description: "A high-energy pitching event where founders get just 10 minutes to present their startup to investors and industry leaders, aiming to secure funding, partnerships, and validation on the spot.",
    date: "February 2-3, 2026",
    time: "10:00 AM – 5:00 PM (Both days)",
    venue: "SH-1 (Seminar Hall 1)",
    eligibility: "Quantum Pass or Thakur Student Pass required",
  };

  const perks = [
    { icon: Trophy, text: "Direct pitch to top VCs and angel investors" },
    { icon: Star, text: "Seed funding opportunity for winning pitch" },
    { icon: CheckCircle2, text: "Networking with 50+ investors and founders" },
    { icon: Sparkles, text: "Certificate of participation and pitch deck review" },
    { icon: Star, text: "Media coverage and PR opportunities" },
    { icon: CheckCircle2, text: "Access to exclusive investor database" }
  ];

  const primaryContacts = [
    { name: "Aman Pandey", role: "Core Member", phone: "8108390154" },
    { name: "Yask Khatri", role: "Core Member", phone: "9518509120" },
    { name: "Ashita Sharma", role: "Junior Core Member", phone: "9321516123" },
    { name: "Vedant Singh", role: "OC Member", phone: "9833223507" },
    { name: "Pratik Verma", role: "OC Member", phone: "9167655416" },
    { name: "Roshni Joshi", role: "OC Member", phone: "9372711453" },
    { name: "Niyatee Thakur", role: "OC Member", phone: "9892682981" },
  ];

  const seniorContacts = [
    {
      name: "Dr. Vikram Desai",
      role: "Faculty Coordinator",
      phone: "+91 98765 43200",
      email: "vikram.desai@tcet.edu"
    },
    {
      name: "Prof. Anjali Reddy",
      role: "E-Cell Head",
      phone: "+91 98765 43201",
      email: "anjali.reddy@tcet.edu"
    }
  ];

  const judges = [
    {
      name: "Devang Raja",
      role: "Founder, Venture Wolf",
      image: "/assets/panel/devang_raja.png",
      linkedin: "https://www.linkedin.com/in/devangraja2001/"
    },
    {
      name: "Nikhil Jadhav",
      role: "VC, Ten Minute Deal",
      image: "/assets/panel/nikhil_jadhav.jpg",
      linkedin: "https://www.linkedin.com/in/nikhil-jadhav-a42758b2/?originalSubdomain=in"
    },
    {
      name: "Karn Rajani",
      role: "Finance Expert, Gitsol Finance",
      image: "/assets/panel/default.png",
      linkedin: ""
    },
    {
      name: "Devang Bhuta",
      role: "Parent Entrepreneur & Investor",
      image: "/assets/panel/default.png",
      linkedin: "https://www.linkedin.com/in/db-passsionforproducts"
    }
  ];

  const sponsors = [
    {
      name: "Venture Wolf",
      logo: "/assets/panel/eventSponsor/venturewolf.png",
      website: "https://www.venturewolf.in/"
    }
  ];

  return (
    <EventPageTemplate
      event={eventData}
      eventId="d1-ten-minute-million"
      registrationUrl="https://forms.gle/pLzKEuzk53XPkyREA"
      perks={perks}
      panelTitle="Meet the VCs"
      panelSubtitle="Pitch to leading Venture Capitalists"
      judges={judges}
      sponsors={sponsors}
      sponsorTitle="Investors"
      primaryContacts={primaryContacts}
      seniorContacts={seniorContacts}
    />
  );
}
