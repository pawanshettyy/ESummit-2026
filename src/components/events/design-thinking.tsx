import { EventPageTemplate } from "./event-template";

export function DesignThinkingPage() {
  const event = {
    title: "Design Thinking & Innovation Strategy",
    description:
      "Hands-on workshop on design thinking and innovation for building successful ventures. 3-hour interactive sessions throughout the day.",
    date: "February 2-3, 2026",
    time: "10:00 - 17:00 (3 Hours Sessions)",
    venue: "Lab 522 / 523",
    eligibility: "Silicon, Quantum & Thakur Student Pass holders",
  };
  const primaryContacts = [
    { name: "Nikita Tiwari", role: "Core Member", phone: "8446156587" },
    { name: "Shweta Shukla", role: "Junior Core Member", phone: "9867882433" },
    { name: "Mitesh Purohit", role: "OC Member", phone: "9664805151" },
    { name: "Archit Kumar", role: "OC Member", phone: "8356028780" },
    { name: "Shivang Shukla", role: "OC Member", phone: "8668424061" },
    // Removed Sneha Chauhan
  ];

  return <EventPageTemplate event={event} eventId="d1-design-thinking" registrationUrl="https://forms.gle/twLnTyeb4UKBaSBh7" panelTitle="Speakers" primaryContacts={primaryContacts} />;
}
