import { EventPageTemplate } from "./event-template";

export function AiBuildathonPage() {
  const event = {
    title: "AI Build-A-Thon: The Innovation Challenge",
    description:
      "Push the boundaries of AI. Tackle a real-world problem by designing and presenting an innovative, AI-driven solution. Showcase your technical skills and creativity to win the challenge.",
    date: "February 2-3, 2026",
    time: "10:00 AM – 5:00 PM",
    venue: "SH 3",
    prize: "₹1,50,000",
    eligibility: "All pass holders (Pixel, Silicon, Quantum)",
  };

  const primaryContacts = [
    { name: "Bhummi Girnara", role: "Core Member" },
    { name: "Nishil Dhanuka", role: "OC Member" },
    { name: "Ayush Chandel", role: "OC Member" },
    { name: "Shravani Salunke", role: "OC Member" },
    { name: "Prashant Gupta", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d1-ai-buildathon" panelTitle="Judges & Mentors" primaryContacts={primaryContacts} />;
}
