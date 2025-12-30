import { EventPageTemplate } from "./event-template";

export function AiEarlyStageStartupsPage() {
  const event = {
    title: "AI for Early Stage Startups",
    description:
      "Explore how AI can be leveraged in early-stage startups to accelerate growth. Hands-on and practical insights for founders.",
    date: "February 3, 2026",
    time: "2:00 PM – 4:30 PM",
    venue: "Workshop Hall B",
    eligibility: "All pass holders",
  };

  return <EventPageTemplate event={event} eventId="d2-ai-early-stage-startups" panelTitle="Speakers" />;
}
