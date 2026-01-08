import { EventPageTemplate } from "./event-template";

export function IplAuctionPage() {
  const event = {
    title: "IPL Auction: The Bid for Brilliance",
    description:
      "Master the art of the deal. In this high-energy bidding game, build your dream team with a limited budget. Test your strategic thinking and financial savvy to outbid rivals and create a winning roster.",
    date: "February 2-3, 2026",
    time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 9:30 AM – 1:30 PM",
    venue: "601, TIMSR",
    prize: "TBD",
    eligibility: "All pass holders (Pixel, Silicon, Quantum)",
  };
  const primaryContacts = [
    { name: "Hredey Chaand", role: "Core Member" },
    { name: "Aman Pandey", role: "Core Member" },
    { name: "Pawan Shetty", role: "Junior Core Member" },
    { name: "Sakshi Yadav", role: "Junior Core Member" },
    { name: "Prachi Kumari", role: "OC Member" },
    { name: "Sitanshu Shetty", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d1-ipl-auction" panelTitle="Mentors & Judges" primaryContacts={primaryContacts} />;
}
