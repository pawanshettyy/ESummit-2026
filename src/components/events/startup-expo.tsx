import { EventPageTemplate } from "./event-template";

export function StartupExpoPage() {
  const event = {
    title: "The Startup Expo",
    description:
      "Display Your First Prototype! Showcase your early-stage idea and prototype to the entire college community in our main lobby. A perfect chance to get your first users and feedback.",
    date: "February 2, 2026",
    time: "1:00 PM – 5:00 PM",
    venue: "Main Lobby",
    prize: { first: "₹5,000", second: "₹3,000", total: "₹8,000" },
    eligibility: "All pass holders",
  };
  const primaryContacts = [
    { name: "Sankarshan Dwivedi", role: "OC Member", phone: "8208840697" },
    { name: "Aayush Mishra", role: "OC Member", phone: "9987638504" },
    { name: "Khushi Tyagi", role: "OC Member", phone: "8369998587" },
  ];

  return <EventPageTemplate event={event} eventId="d1-startup-expo" registrationUrl="https://docs.google.com/forms/d/e/1FAIpQLSfTauJzW1DPck7t6Dw3J4XxrWFpl3FmeuKjE98izAycAGOlew/viewform" panelTitle="Guests" primaryContacts={primaryContacts} />;
}
