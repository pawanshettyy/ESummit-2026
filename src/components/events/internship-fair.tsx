import { EventPageTemplate } from "./event-template";

export function InternshipFairPage() {
  const event = {
    title: "The Internship Fair",
    description:
      "Build your founding team. Startups present their vision to recruit talented interns and full-time members, connecting ambitious talent with groundbreaking ideas.",
    date: "February 2-3, 2026",
    time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 10:00 AM – 1:00 PM",
    venue: "Convocation Hall",
    eligibility: "Quantum Pass holders",
  };
  const primaryContacts = [
    { name: "Tanvi Jabare", role: "Core Member" },
    { name: "Shashank Barot", role: "Junior Core Member" },
    { name: "Tushar Gaba", role: "OC Member" },
    { name: "Chinmay Mhatre", role: "OC Member" },
    { name: "Shreeya Dewangan", role: "OC Member" },
    { name: "Shubham Mane", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d1-internship-fair" panelTitle="Participating Startups" primaryContacts={primaryContacts} />;
}
