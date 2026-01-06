import { EventPageTemplate } from "./event-template";

export function NetworkingArenaPage() {
  const event = {
    title: "Networking Arena",
    description:
      "Open networking session during lunch - connect with entrepreneurs, investors, judges, and fellow participants. An ideal opportunity to build relationships and explore collaborations.",
    date: "February 2-3, 2026",
    time: "Lunch Hours",
    venue: "Multipurpose Hall 2nd Floor & Architecture Ground Floor",
    eligibility: "All pass holders",
  };
  const primaryContacts = [
    { name: "Yash Khatri", role: "Core Member" },
    { name: "Pratiksha Upadhyay", role: "Junior Core Member" },
    { name: "Diya Kandari", role: "OC Member" },
    { name: "Shivanshi Pandit", role: "OC Member" },
    { name: "Prashant Yadav", role: "OC Member" },
    { name: "Arukesh Sahu", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d1-networking-arena" panelTitle="Guests" primaryContacts={primaryContacts} />;
}
