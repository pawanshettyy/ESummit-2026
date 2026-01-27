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
    eligibility: "Quantum & Thakur Student Pass required",
  };
  const primaryContacts = [
    { name: "Bhummi Girnara", role: "Core Member", phone: "9869832960" },
    { name: "Yash Yadav", role: "Core Member", phone: "8591134029" },
    { name: "Yash Mattha", role: "Junior Core Member", phone: "8591129559" },
    { name: "Kanchan Tripathi", role: "Junior Core Member", phone: "7709339449" },
    { name: "Avya Chaurasia", role: "OC Member", phone: "8779549523" },
    { name: "Arjun Parab", role: "OC Member", phone: "9321313968" },
    { name: "Hitarth Bhatt", role: "OC Member", phone: "9819418228" },
  ];

  return <EventPageTemplate event={event} eventId="d1-incubator-summit" registrationUrl="https://docs.google.com/forms/d/e/1FAIpQLSeQhu5wIrAJi6ldgcOinOW8QQFWnaxWqEKWyMTjWFFbVFstow/viewform?usp=publish-editor" panelTitle="Incubation Centre Evaluators" primaryContacts={primaryContacts} />;
}
