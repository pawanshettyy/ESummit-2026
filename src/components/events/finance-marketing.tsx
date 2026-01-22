import { EventPageTemplate } from "./event-template";

export function FinanceMarketingPage() {
  const event = {
    title: "Finance & Marketing for Startups",
    description:
      "Build a solid foundation for your venture. Get essential, practical knowledge on managing your startup's finances and crafting marketing strategies that actually convert. 3-hour interactive sessions.",
    date: "February 2-3, 2026",
    time: "10:00 - 17:00 (3 Hours Sessions)",
    venue: "Lab 524 / 525",
    eligibility: "Silicon, Quantum & Thakur Student Pass holders",
  };
  const primaryContacts = [
    { name: "Sayyam Lohade", role: "Core Member", phone: "9373749488" },
    { name: "Priyanshi Negi", role: "Junior Core Member", phone: "8669098431" },
    { name: "Ayush Giri", role: "OC Member", phone: "9022307407" },
    { name: "Himanshu Naik", role: "OC Member", phone: "9561874652" },
    { name: "Parthavi Rai", role: "OC Member", phone: "7307254413" },
    { name: "Siddhesh Wagh", role: "OC Member", phone: "7058338686" },
  ];

  return <EventPageTemplate event={event} eventId="d1-finance-marketing" panelTitle="Speakers" primaryContacts={primaryContacts} />;
}
