import { EventPageTemplate } from "./event-template";

export function FinanceMarketingPage() {
  const event = {
    title: "Finance & Marketing for Startups",
    description:
      "Build a solid foundation for your venture. Get essential, practical knowledge on managing your startup's finances and crafting marketing strategies that actually convert. 3-hour interactive sessions.",
    date: "February 2-3, 2026",
    time: "10:00 - 17:00 (3 Hours Sessions)",
    venue: "Lab 524 & 525",
    eligibility: "Silicon & Quantum Pass holders",
  };
  const primaryContacts = [
    { name: "Sayyam Lohade", role: "Core Member" },
    { name: "Priyanshi Negi", role: "Junior Core Member" },
    { name: "Ayush Giri", role: "OC Member" },
    { name: "Himanshu Naik", role: "OC Member" },
    { name: "Parthavi Rai", role: "OC Member" },
    { name: "Siddhesh Wagh", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d1-finance-marketing" panelTitle="Speakers" primaryContacts={primaryContacts} />;
}
