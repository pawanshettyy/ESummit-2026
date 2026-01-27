import { EventPageTemplate } from "./event-template";

export function PitchArenaPage() {
  const event = {
    title: "Pitch Arena - Idea to Reality",
    tagline: "Transform Your Idea Into Reality",
    description:
      "A premier platform for first-time founders to pitch their innovative ideas to industry experts, investors, and mentors. Get shortlisted for the next round and turn your startup dreams into reality.",
    date: "February 2-3, 2026",
    time: "10:00 AM – 5:00 PM",
    venue: "SH 3 (Seminar Hall 3)",
    prize: { first: "₹10,000", second: "₹5,000", third: "₹3,000", total: "₹18,000" },
    eligibility: "Silicon, Quantum & Thakur Student Pass required",
  };

  const perks = [
    { text: "Mentorship from industry experts" },
    { text: "Actionable feedback to refine your pitch" },
    { text: "Opportunity to be shortlisted for Round 2" },
  ];

  const primaryContacts = [
    { name: "Akshay Upadhyay", role: "OC Member", phone: "9653310551" },
    { name: "Saloni Suthar", role: "OC Member", phone: "6378370213" },
    { name: "Shruti Jadhav", role: "OC Member", phone: "9820462485" },
    { name: "Sakshi Thakur", role: "OC Member", phone: "8655443326" },
  ];

  const seniorContacts = [
    { name: "Mr. Vinayak Bachel", role: "Faculty Coordinator", email: "vinayak.bachel@thakureducation.org" },
    { name: "Ms. Apeksha Waghmare", role: "Faculty Coordinator", email: "apeksha.waghmare@thakureducation.org" },
  ];

  return (
    <EventPageTemplate
      event={event}
      eventId="d1-pitch-arena"
      registrationUrl="https://docs.google.com/forms/d/e/1FAIpQLSdRZFkaw6QqN6ug4jNdVQDaGK1jQeNcyzOdsrlLFTXmSKMrJA/viewform?usp=dialog"
      perks={perks}
      panelTitle="Mentors"
      primaryContacts={primaryContacts}
      seniorContacts={seniorContacts}
    />
  );
}
