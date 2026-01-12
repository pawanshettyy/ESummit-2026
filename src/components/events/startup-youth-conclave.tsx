import { EventPageTemplate } from "./event-template";

export function StartupYouthConclavePage() {
  const event = {
    title: "The Startup Youth Conclave",
    description:
      "Connect with Top E-Cells! Network with entrepreneurship cells from other colleges, share best practices, and build collaborations that go beyond your campus.",
    date: "February 3, 2026",
    time: "11:00 AM to 1:00 PM (Post Lunch)",
    venue: "Seminar Hall, 2nd floor, TSAP / Internal General Reading Room",
    eligibility: "Silicon & Quantum Pass holders",
  };
  const primaryContacts = [
    { name: "Krish Jain", role: "Core Member" },
    { name: "Shaleen Singh", role: "Junior Core Member" },
    { name: "Shreya Yadav", role: "OC Member" },
    { name: "Nikhil Shukla", role: "OC Member" },
    { name: "Namasavi Singh", role: "OC Member" },
  ];

  return <EventPageTemplate event={event} eventId="d2-startup-youth-conclave" panelTitle="E-Cell Representatives" primaryContacts={primaryContacts} />;
}
