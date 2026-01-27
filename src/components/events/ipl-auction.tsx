import { EventPageTemplate } from "./event-template";

export function IplAuctionPage() {
  const event = {
    title: "IPL Auction: The Bid for Brilliance",
    description:
      "Master the art of the deal. In this high-energy bidding game, build your dream team with a limited budget. Test your strategic thinking and financial savvy to outbid rivals and create a winning roster.",
    date: "February 2-3, 2026",
    time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 9:30 AM – 1:30 PM",
    venue: "601 TIMSR",
    prize: { first: "₹5,000", second: "₹3,000", third: "₹2,000", total: "₹10,000" },
    eligibility: "All pass holders (Pixel, Silicon, Quantum)",
  };
  const primaryContacts = [
    { name: "Hredey Chaand", role: "Core Member", phone: "9004724466" },
    { name: "Aman Pandey", role: "Core Member", phone: "8108390154" },
    { name: "Pawan Shetty", role: "Junior Core Member", phone: "7045146854" },
    { name: "Sakshi Yadav", role: "Junior Core Member", phone: "9136010511" },
    { name: "Prachi Kumari", role: "OC Member", phone: "8104047564" },
    { name: "Sitanshu Shetty", role: "OC Member", phone: "7208390629" },
  ];

  return <EventPageTemplate event={event} eventId="d1-ipl-auction" registrationUrl="https://docs.google.com/forms/d/e/1FAIpQLSdDK0Rke1JlV9n74PJ_IJrPMm1Vb-FePtoZ-V5I1TFIJ4gnrg/viewform?usp=publish-editor" panelTitle="Mentors & Judges" primaryContacts={primaryContacts} />;
}
