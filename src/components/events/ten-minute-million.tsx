import { Trophy, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { EventPageTemplate } from "./event-template";

export function TenMinuteMillionPage() {
  const eventData = {
    title: "The Ten Minute Deal",
    tagline: "Pitch Your Vision, Secure Your Future",
    description: "A high-energy pitching event where founders get just 10 minutes to present their startup to investors and industry leaders, aiming to secure funding, partnerships, and validation on the spot.",
    date: "February 2-3, 2026",
    time: "10:00 AM – 5:00 PM (Both days)",
    venue: "SH-1",
    prize: "Seed Funding Opportunity",
    eligibility: "Quantum Pass required",
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
    { name: "Aman Pandey", role: "Core Member" },
    { name: "Yask Khatri", role: "Core Member" },
    { name: "Ashita Sharma", role: "Junior Core Member" },
    { name: "Vedant Singh", role: "OC Member" },
    { name: "Pratik Verma", role: "OC Member" },
    { name: "Roshni Joshi", role: "OC Member" },
    { name: "Niyatee Thakur", role: "OC Member" },
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

  return (
    <EventPageTemplate
      event={eventData}
      eventId="d1-ten-minute-million"
      perks={perks}
      panelTitle="Meet the VCs"
      panelSubtitle="Pitch to leading Venture Capitalists"
      primaryContacts={primaryContacts}
      seniorContacts={seniorContacts}
    />
  );
}
