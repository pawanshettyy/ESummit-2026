import { EventPageTemplate } from "./event-template";

export function RoadmapToEntrepreneurshipPage() {
  const event = {
    title: "Roadmap to Entrepreneurship (Pre E-summit Workshop)",
    description:
      "Turn Ideas into Impact. One-hour hands-on workshop on Business Model Canvas with practical startup frameworks and mentor guidance.",
    date: "TBA (Pre E-Summit)",
    time: "1 hour session",
    venue: "TBA",
    eligibility: "Open to students, aspiring founders, and innovators",
  };

  return <EventPageTemplate event={event} eventId="pre-roadmap-entrepreneurship" panelTitle="Speakers" />;
}
