import { EventPageTemplate } from "./event-template";

export function DesignThinkingPage() {
  const event = {
    title: "Design Thinking & Innovation Strategy",
    description:
      "Hands-on workshop on design thinking and innovation for building successful ventures. 3-hour interactive sessions throughout the day.",
    date: "February 2-3, 2026",
    time: "10:00 - 17:00 (3 Hours Sessions)",
    venue: "Lab 522 & 523",
    eligibility: "Silicon & Quantum Pass holders",
  };
  const primaryContacts = [
    { name: "Nikita Tiwari", role: "Core Member" },
    { name: "Shweta Shukla", role: "Junior Core Member" },
    { name: "Mitesh Purohit", role: "OC Member" },
    { name: "Archit Kumar", role: "OC Member" },
    { name: "Shivang Shukla", role: "OC Member" },
    // Removed Sneha Chauhan
  ];

  return <EventPageTemplate event={event} eventId="d1-design-thinking" panelTitle="Speakers" primaryContacts={primaryContacts} />;
}
