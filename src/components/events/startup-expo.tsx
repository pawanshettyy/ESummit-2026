import { EventPageTemplate } from "./event-template";

export function StartupExpoPage() {
  const event = {
    title: "The Startup Expo",
    description:
      "Display Your First Prototype! Showcase your early-stage idea and prototype to the entire college community in our main lobby. A perfect chance to get your first users and feedback.",
    date: "February 2, 2026",
    time: "1:00 PM – 5:00 PM",
    venue: "Lobby Area",
    prize: { first: "₹5,000", second: "₹3,000", total: "₹8,000" },
    eligibility: "All pass holders",
  };
  const primaryContacts = [
    { name: "Krish Choudhary", role: "Junior Core Member" },
    { name: "Sankarshan Dwivedi", role: "OC Member" },
    { name: "Aayush Mishra", role: "OC Member" },
    { name: "Khushi Tyagi", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d1-startup-expo" panelTitle="Guests" primaryContacts={primaryContacts} />;
}
