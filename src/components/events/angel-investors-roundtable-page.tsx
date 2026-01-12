import { EventPageTemplate } from "./event-template";

export function AngelInvestorsRoundtablePage() {
  const event = {
    title: "The Angel Investor's Roundtable",
    description:
      "An exclusive gathering where capital meets innovation. This roundtable brings together angel investors to vet and co-invest in the most promising early-stage companies, featuring founders selected from our Pitch Arena.",
    date: "February 2, 2026",
    time: "9:30 AM – 1:30 PM",
    venue: "General Reading Room (4th floor) / Seminar hall, 2nd floor, TSAP",
    eligibility: "Quantum Pass required",
  };

  const primaryContacts = [
    { name: "Hredey Chaand", role: "Core Member" },
    { name: "Mishti Dhiman", role: "Core Member" },
    { name: "Diya Tailor", role: "Junior Core Member" },
    { name: "Shruti Nale", role: "OC Member" },
    { name: "Aryan Singh", role: "OC Member" },
    { name: "Rutuja Bunke", role: "OC Member" },
    { name: "Dhanush Shetty", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d2-angel-roundtable" panelTitle="Angel Investors Panel" primaryContacts={primaryContacts} />;
}
