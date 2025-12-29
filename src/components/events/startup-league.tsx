import { EventPageTemplate } from "./event-template";

export function StartupLeaguePage() {
  const event = {
    title: "Startup League Game: Build Your Empire",
    description:
      "Step into the founder's seat. Run a virtual startup in this fast-paced simulation. Make critical decisions on product, marketing, and funding to outmaneuver competitors and dominate the market.",
    date: "February 2-3, 2026",
    time: "10:00 AM to 1:00 PM",
    venue: "301, TIMSR",
    prize: "₹1,00,000",
    eligibility: "All pass holders (Pixel, Silicon, Quantum)",
  };
  const primaryContacts = [
    { name: "Aman Pandey", role: "Core Member" },
    { name: "Raj Mane", role: "Core Member" },
    { name: "Kaushal Shetty", role: "OC Member" },
    { name: "Bhavika Vasule", role: "OC Member" },
    { name: "Anugrah Yadav", role: "OC Member" },
    { name: "Shiva Saraswati", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} panelTitle="Mentors & Judges" primaryContacts={primaryContacts} />;
}
