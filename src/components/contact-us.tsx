import { motion } from "motion/react";
import { Mail, Linkedin, MessageCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GlassCard } from "./accentricity/glass-card";
import { AuroraText } from "./magicui/aurora-text";

interface TeamMember {
  name: string;
  position: string;
  image?: string;
  email: string;
  whatsapp: string;
  linkedin: string;
}

export function ContactUs() {
  // Overall Coordinators
  const overallCoordinators: TeamMember[] = [
    {
      name: "Ahana Kulkarni",
      position: "Overall Coordinator",
      image: "",
      email: "ahana@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/ahana-kulkarni-753939272/"
    },
    {
      name: "Ayush Pardeshi",
      position: "Overall Coordinator",
      image: "",
      email: "ayush@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/ayush-pardeshi-8b76b4285/"
    }
  ];

  // Hospitality & PR
  const hospitalityTeam: TeamMember[] = [
    {
      name: "Hredey Chaand",
      position: "Hospitality & PR Head",
      image: "",
      email: "hredey@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/hredey-chaand-b10787351/"
    },
    {
      name: "Aman Pandey",
      position: "Hospitality & PR Head",
      image: "",
      email: "aman@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/aman-pandey-ab3334259/"
    }
  ];

  // Web & Technical
  const technicalTeam: TeamMember[] = [
    {
      name: "Pawan Shetty",
      position: "Web & Technical Head",
      image: "",
      email: "pawan@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/pawanshettyy/"
    },
    {
      name: "Raj Mane",
      position: "Web & Technical Head",
      image: "",
      email: "raj@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/raj-mane-268a95371/"
    }
  ];

  // Speakers, Judges, and Guests
  const speakersTeam: TeamMember[] = [
    {
      name: "Nidhi Dilipkumar Shukla",
      position: "Speakers, Judges & Guests Head",
      image: "",
      email: "nidhi@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/nidhi-shukla-36151a329/"
    },
    {
      name: "Tanvi Prakash Jabare",
      position: "Speakers, Judges & Guests Head",
      image: "",
      email: "tanvi@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/tanvi-jabare-b310a0347/"
    }
  ];

  // Sponsorships and Brands
  const sponsorshipTeam: TeamMember[] = [
    {
      name: "Yash Yadav",
      position: "Sponsorships & Brands Head",
      image: "",
      email: "yash@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/yash-yadav-0b3975264/"
    },
    {
      name: "Niyatee Thakur",
      position: "Sponsorships & Brands Head",
      image: "",
      email: "niyatee@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/niyatee-thakur-b01445398/"
    },
    {
      name: "Vedant Singh",
      position: "Sponsorships & Brands Head",
      image: "",
      email: "vedant@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/vedant-singh-93056b2bb/"
    }
  ];

  // Operations
  const operationsTeam: TeamMember[] = [
    {
      name: "Bhummi Girnara",
      position: "Operations Head",
      image: "",
      email: "bhummi@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/bhummi-girnara-7ba804290/"
    },
    {
      name: "Sayyam Lohade",
      position: "Operations Head",
      image: "",
      email: "sayyam@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/sayyam-lohade-899140334/"
    }
  ];

  // Design
  const designTeam: TeamMember[] = [
    {
      name: "Nikita Tiwari",
      position: "Design Head",
      image: "",
      email: "nikita@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://www.linkedin.com/in/nikita-tiwari-73a90330b/"
    },
    {
      name: "Kanchan Tripathi",
      position: "Design Head",
      image: "",
      email: "kanchan@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://linkedin.com/in/example"
    },
    {
      name: "Priyanshi Negi",
      position: "Design Head",
      image: "",
      email: "priyanshi@example.com",
      whatsapp: "+911234567890",
      linkedin: "https://linkedin.com/in/example"
    }
  ];

  const renderTeamMember = (member: TeamMember, index: number) => (
    <motion.div
      key={`${member.name}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full max-w-xs"
    >
      <GlassCard>
        <Card className="border-0 bg-transparent h-full">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback className="text-lg">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <p className="text-sm text-primary mb-4">{member.position}</p>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(member.linkedin, '_blank')}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </GlassCard>
    </motion.div>
  );

  return (
    <div className="container mx-auto py-8 md:py-12 px-4 md:px-6 lg:px-8">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Contact The Team
        </h1>
        
        <div className="relative mb-4 md:mb-6 py-4">
          <AuroraText 
            size="sm" 
            colors={["#a855f7", "#ec4899", "#3b82f6", "#8b5cf6", "#d946ef"]}
            className="tracking-[0.15em] md:tracking-[0.25em] uppercase font-light"
          >
            Get In Touch With Us
          </AuroraText>
        </div>
        
        <p className="text-base md:text-xl text-foreground px-4">
          Reach out to our team for any queries or assistance
        </p>
      </div>

      {/* Overall Coordinators */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-foreground">Overall Coordinators</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto place-items-center">
          {overallCoordinators.map(renderTeamMember)}
        </div>
      </div>

      {/* Hospitality & PR */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-foreground">Hospitality & PR</h2>
        <p className="text-foreground text-center mb-6">For any Hospitality related Queries</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto place-items-center">
          {hospitalityTeam.map(renderTeamMember)}
        </div>
      </div>

      {/* Web & Technical */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-foreground">Web & Technical</h2>
        <p className="text-foreground text-center mb-6">For any Website and Technical Queries</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto place-items-center">
          {technicalTeam.map(renderTeamMember)}
        </div>
      </div>

      {/* Speakers, Judges, and Guests */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-foreground">Speakers, Judges & Guests</h2>
        <p className="text-foreground text-center mb-6">For any Speaker, Judge, or Guest related Queries</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto place-items-center">
          {speakersTeam.map(renderTeamMember)}
        </div>
      </div>

      {/* Sponsorships and Brands */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-foreground">Sponsorships & Brands</h2>
        <p className="text-foreground text-center mb-6">For any Sponsorship and Brand Partnership Queries</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto place-items-center">
          {sponsorshipTeam.map(renderTeamMember)}
        </div>
      </div>

      {/* Operations */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-foreground">Operations</h2>
        <p className="text-foreground text-center mb-6">For any Operations related Queries</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto place-items-center">
          {operationsTeam.map(renderTeamMember)}
        </div>
      </div>

      {/* Design */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-foreground">Design</h2>
        <p className="text-foreground text-center mb-6">For any Design related Queries</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto place-items-center">
          {designTeam.map(renderTeamMember)}
        </div>
      </div>

      {/* Events Note */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-foreground">Events</h2>
        <p className="text-foreground text-center mb-6 max-w-3xl mx-auto">
          For specific event-related queries, kindly check the event page and contact the respective coordinators
        </p>
      </div>
    </div>
  );
}
