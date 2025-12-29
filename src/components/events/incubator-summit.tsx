import { EventPageTemplate } from "./event-template";

export function IncubatorSummitPage() {
  const event = {
    title: "The Incubator Summit",
    description:
      "Where ideas earn their launchpad. Founders pitch to evaluators from five top incubation centers, competing for a spot and seed support to accelerate their venture.",
    date: "February 2-3, 2026",
    time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 10:00 AM – 1:00 PM",
    venue: "SSC TIMSR",
    prize: "Incubation Support",
    eligibility: "Quantum Pass required",
  };
  const primaryContacts = [
    { name: "Bhummi Girnara", role: "Core Member" },
    { name: "Yash Yadav", role: "Core Member" },
    { name: "Yash Mattha", role: "Junior Core Member" },
    { name: "Kanchan Tripathi", role: "Junior Core Member" },
    { name: "Avya Chaurasia", role: "OC Member" },
    { name: "Arjun Parab", role: "OC Member" },
    { name: "Hitarth Bhatt", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} panelTitle="Incubation Centre Evaluators" primaryContacts={primaryContacts} />;
}
