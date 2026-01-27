import { EventPageTemplate } from "./event-template";

export function InternshipFairPage() {
  const event = {
    title: "The Internship Fair",
    description:
      "Build your founding team. Startups present their vision to recruit talented interns and full-time members, connecting ambitious talent with groundbreaking ideas.",
    date: "February 2-3, 2026",
    time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 10:00 AM – 1:00 PM",
    venue: "Convocation Hall",
    eligibility: "Quantum & Thakur Student Pass holders",
  };
  const primaryContacts = [
    { name: "Tanvi Jabare", role: "Core Member", phone: "9324065445" },
    { name: "Shashank Barot", role: "Junior Core Member", phone: "9324065445" },
    { name: "Tushar Gaba", role: "OC Member", phone: "9324065445" },
    { name: "Chinmay Mhatre", role: "OC Member", phone: "9324065445" },
    { name: "Shreeya Dewangan", role: "OC Member", phone: "9324065445" },
    { name: "Shubham Mane", role: "OC Member", phone: "9324065445" },
  ];

  return <EventPageTemplate event={event} eventId="d1-internship-fair" registrationUrl="https://forms.gle/jEBsMLqLSwirBvbj9" panelTitle="Participating Startups" primaryContacts={primaryContacts} />;
}
