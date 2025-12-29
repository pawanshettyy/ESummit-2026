import { EventPageTemplate } from "./event-template";

export function NetworkingArenaPage() {
  const event = {
    title: "Informals",
    description:
      "Connect beyond the stage. An informal session for founders to mingle with judges, speakers, and mentors over lunch, turning conversations into valuable connections.",
    date: "February 2, 2026",
    time: "5 PM to 5:30 PM",
    venue: "Multipurpose Hall 2nd Floor and TSAP ground floor",
    eligibility: "Silicon & Quantum Pass holders",
  };
  const primaryContacts = [
    { name: "Yash Khatri", role: "Core Member" },
    { name: "Pratiksha Upadhyay", role: "Junior Core Member" },
    { name: "Diya Kandari", role: "OC Member" },
    { name: "Shivanshi Pandit", role: "OC Member" },
    { name: "Prashant Yadav", role: "OC Member" },
    { name: "Arukesh Sahu", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} panelTitle="Guests" primaryContacts={primaryContacts} />;
}
