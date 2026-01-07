import { EventPageTemplate } from "./event-template";

export function DataAnalyticsBdmPage() {
  const event = {
    title: "Data Analytics & Business Development Essentials",
    description:
      "Make smarter decisions with data. Learn to analyze market trends, track key metrics, and use data-driven insights to fuel your business growth and strategy. 3-hour interactive sessions.",
    date: "February 2-3, 2026",
    time: "10:00 - 17:00 (3 Hours Sessions)",
    venue: "Lab 526 & 527",
    eligibility: "Silicon & Quantum Pass holders",
  };
  const primaryContacts = [
    { name: "Varun Maurya", role: "Junior Core Member" },
    { name: "Shubham Prajapati", role: "OC Member" },
    { name: "Ayush Tyagi", role: "OC Member" },
    { name: "SHLOK YADAV", role: "OC Member" },
    { name: "Arpit Gawande", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d1-data-analytics-bdm" panelTitle="Speakers" primaryContacts={primaryContacts} />;
}
