import { EventPageTemplate } from "./event-template";

export function PitchArenaPage() {
  const event = {
    title: "Pitch Arena - Idea to Reality",
    tagline: "Transform Your Idea Into Reality",
    description:
      "A premier platform for first-time founders to pitch their innovative ideas to industry experts, investors, and mentors. Get shortlisted for the next round and turn your startup dreams into reality.",
    date: "February 2-3, 2026",
    time: "10:00 AM – 5:00 PM",
    venue: "314, 315, 316",
    prize: "Shortlisting for Round 2",
    eligibility: "Silicon & Quantum Pass required",
  };

  const perks = [
    { text: "Mentorship from industry experts" },
    { text: "Actionable feedback to refine your pitch" },
    { text: "Opportunity to be shortlisted for Round 2" },
  ];

  const primaryContacts = [
    { name: "Akshay Upadhyay", role: "OC Member" },
    { name: "Saloni Suthar", role: "OC Member" },
    { name: "Shruti Jadhav", role: "OC Member" },
    { name: "Sakshi Thakur", role: "OC Member" },
  ];

  const seniorContacts = [
    { name: "Mr. Vinayak Bachel", role: "Faculty Coordinator", email: "vinayak.bachel@thakureducation.org" },
    { name: "Ms. Apeksha Waghmare", role: "Faculty Coordinator", email: "apeksha.waghmare@thakureducation.org" },
  ];

  return (
    <EventPageTemplate
      event={event}
      perks={perks}
      panelTitle="Mentors"
      primaryContacts={primaryContacts}
      seniorContacts={seniorContacts}
    />
  );
}
