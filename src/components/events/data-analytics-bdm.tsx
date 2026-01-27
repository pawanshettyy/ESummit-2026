import { EventPageTemplate } from "./event-template";

export function DataAnalyticsBdmPage() {
  const event = {
    title: "Data Analytics & Business Development Essentials",
    description:
      "Make smarter decisions with data. Learn to analyze market trends, track key metrics, and use data-driven insights to fuel your business growth and strategy. 3-hour interactive sessions.",
    date: "February 2-3, 2026",
    time: "10:00 - 17:00 (3 Hours Sessions)",
    venue: "Lab 526 / 527 / 528 / 529",
    eligibility: "Silicon, Quantum & Thakur Student Pass holders",
  };
  const primaryContacts = [
    { name: "Varun Maurya", role: "Junior Core Member", phone: "8104751559" },
    { name: "Ayush Tyagi", role: "OC Member", phone: "9324065445" },
    { name: "SHLOK YADAV", role: "OC Member", phone: "9967630097" },
    { name: "Arpit Gawande", role: "OC Member", phone: "7447743779" },
  ];

  return <EventPageTemplate event={event} eventId="d1-data-analytics" registrationUrl="https://forms.gle/twLnTyeb4UKBaSBh7" panelTitle="Speakers" primaryContacts={primaryContacts} />;
}
