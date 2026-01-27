import { EventPageTemplate } from "./event-template";

export function AiBuildathonPage() {
  const event = {
    title: "AI Build-A-Thon: The Innovation Challenge",
    description:
      "Push the boundaries of AI. Tackle a real-world problem by designing and presenting an innovative, AI-driven solution. Showcase your technical skills and creativity to win the challenge.",
    date: "February 2-3, 2026",
    time: "10:00 AM – 5:00 PM",
    venue: "SH 3 (Seminar Hall 3)",
    prize: { first: "₹5,000", second: "₹3,000", third: "₹2,000", total: "₹10,000" },
    eligibility: "All pass holders (Pixel, Silicon, Quantum)",
  };

  const primaryContacts = [
    { name: "Bhummi Girnara", role: "Core Member", phone: "9869832960" },
    { name: "Nishil Dhanuka", role: "OC Member", phone: "9137589740" },
    { name: "Ayush Chandel", role: "OC Member", phone: "6389005936" },
    { name: "Shravani Salunke", role: "OC Member", phone: "9326070090" },
    { name: "Prashant Gupta", role: "OC Member", phone: "9373270698" },
  ];

  return <EventPageTemplate event={event} eventId="d1-ai-buildathon-start" registrationUrl="https://docs.google.com/forms/d/e/1FAIpQLSf2IwGcR-SfwYWPyyjDN1P6sPR96PDKwf_KkeJ4_6z8_vGr2w/viewform?usp=publish-editor" panelTitle="Judges & Mentors" primaryContacts={primaryContacts} />;
}
