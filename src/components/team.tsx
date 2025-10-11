import { Mail, Linkedin, Phone } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "motion/react";
import { BentoGrid, BentoCard } from "./magicui/bento-grid";
import { GlassCard } from "./accentricity/glass-card";
import { GradientText } from "./magicui/gradient-text";

export function Team() {
  const facultyCoordinators = [
    {
      name: "Prof. Dr. Sharma",
      role: "Faculty Coordinator",
      department: "Department of Management",
      email: "sharma@institute.edu",
      phone: "+91 98765 43210",
    },
    {
      name: "Prof. Gupta",
      role: "Co-Coordinator",
      department: "Department of Computer Science",
      email: "gupta@institute.edu",
      phone: "+91 98765 43211",
    },
  ];

  const coreTeam = [
    {
      name: "Rahul Verma",
      role: "Overall Coordinator",
      department: "Operations",
      year: "4th Year, B.Tech",
      email: "rahul@esummit.com",
      linkedin: "/rahulverma",
    },
    {
      name: "Priya Singh",
      role: "Co-Coordinator",
      department: "Marketing & PR",
      year: "4th Year, MBA",
      email: "priya@esummit.com",
      linkedin: "/priyasingh",
    },
    {
      name: "Amit Kumar",
      role: "Technical Head",
      department: "Technology",
      year: "3rd Year, B.Tech CSE",
      email: "amit@esummit.com",
      linkedin: "/amitkumar",
    },
    {
      name: "Sneha Patel",
      role: "Finance Head",
      department: "Finance",
      year: "3rd Year, B.Com",
      email: "sneha@esummit.com",
      linkedin: "/snehapatel",
    },
    {
      name: "Arjun Reddy",
      role: "Sponsorship Head",
      department: "Sponsorship",
      year: "4th Year, MBA",
      email: "arjun@esummit.com",
      linkedin: "/arjunreddy",
    },
    {
      name: "Kavya Nair",
      role: "Content Head",
      department: "Content & Media",
      year: "3rd Year, B.A.",
      email: "kavya@esummit.com",
      linkedin: "/kavyanair",
    },
  ];

  const domainHeads = [
    {
      domain: "Events & Competitions",
      members: [
        { name: "Rohan Mehta", role: "Events Head", year: "3rd Year" },
        { name: "Neha Joshi", role: "Competition Coordinator", year: "2nd Year" },
      ],
    },
    {
      domain: "Hospitality & Accommodation",
      members: [
        { name: "Vikram Singh", role: "Hospitality Head", year: "3rd Year" },
        { name: "Ananya Desai", role: "Accommodation Coordinator", year: "2nd Year" },
      ],
    },
    {
      domain: "Design & Creatives",
      members: [
        { name: "Aditya Sharma", role: "Design Head", year: "3rd Year" },
        { name: "Riya Kapoor", role: "Graphics Coordinator", year: "2nd Year" },
      ],
    },
    {
      domain: "Marketing & Outreach",
      members: [
        { name: "Karan Malhotra", role: "Marketing Head", year: "3rd Year" },
        { name: "Ishita Rao", role: "Social Media Manager", year: "2nd Year" },
      ],
    },
    {
      domain: "Speaker Relations",
      members: [
        { name: "Manish Gupta", role: "Speaker Coordinator", year: "3rd Year" },
        { name: "Divya Iyer", role: "Guest Relations", year: "2nd Year" },
      ],
    },
    {
      domain: "Logistics & Operations",
      members: [
        { name: "Siddharth Jain", role: "Logistics Head", year: "3rd Year" },
        { name: "Pooja Reddy", role: "Operations Coordinator", year: "2nd Year" },
      ],
    },
    {
      domain: "Public Relations",
      members: [
        { name: "Aryan Shah", role: "PR Head", year: "3rd Year" },
        { name: "Tanvi Mishra", role: "Media Relations", year: "2nd Year" },
      ],
    },
    {
      domain: "Registration & Check-in",
      members: [
        { name: "Nikhil Pandey", role: "Registration Head", year: "2nd Year" },
        { name: "Shreya Bajaj", role: "Check-in Coordinator", year: "2nd Year" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <GradientText>Our Team</GradientText>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-muted-foreground"
        >
          Meet the dedicated team behind E-Summit 2026 who are working tirelessly to make this event a success
        </motion.p>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="mb-8 grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="core">Core Team</TabsTrigger>
          <TabsTrigger value="domains">Domain Heads</TabsTrigger>
        </TabsList>

        {/* Faculty Coordinators */}
        <TabsContent value="faculty">
          <div className="mb-6">
            <h2 className="mb-2">Faculty Coordinators</h2>
            <p className="text-muted-foreground">
              Our faculty advisors providing guidance and support
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {facultyCoordinators.map((faculty, index) => (
              <motion.div
                key={faculty.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard>
                  <Card className="border-0 bg-transparent">
                    <CardContent className="p-6">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                    {faculty.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="mb-1">{faculty.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {faculty.role}
                  </Badge>
                  <p className="mb-4 text-sm text-muted-foreground">{faculty.department}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {faculty.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {faculty.phone}
                    </div>
                  </div>
                </CardContent>
                  </Card>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Core Team */}
        <TabsContent value="core">
          <div className="mb-6">
            <h2 className="mb-2">Core Team Members</h2>
            <p className="text-muted-foreground">
              The leadership team driving E-Summit 2026
            </p>
          </div>
          
          <BentoGrid className="md:grid-cols-3">
            {coreTeam.map((member, index) => (
              <BentoCard key={member.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary"
                    >
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </motion.div>
                    <h3 className="mb-1">{member.name}</h3>
                    <Badge variant="default" className="mb-2">
                      {member.role}
                    </Badge>
                    <p className="mb-1 text-sm text-muted-foreground">{member.department}</p>
                    <p className="mb-4 text-xs text-muted-foreground">{member.year}</p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        {member.email}
                      </Button>
                      {member.linkedin && (
                        <Button variant="outline" size="sm" className="w-full">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </motion.div>
              </BentoCard>
            ))}
          </BentoGrid>
        </TabsContent>

        {/* Domain Heads */}
        <TabsContent value="domains">
          <div className="mb-6">
            <h2 className="mb-2">Domain Heads</h2>
            <p className="text-muted-foreground">
              Specialized teams managing different aspects of the summit
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {domainHeads.map((domain) => (
              <Card key={domain.domain}>
                <CardContent className="p-6">
                  <h3 className="mb-4">{domain.domain}</h3>
                  <div className="space-y-4">
                    {domain.members.map((member) => (
                      <div key={member.name} className="flex items-start gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className="text-sm">{member.name}</h4>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                          <p className="text-xs text-muted-foreground">{member.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Volunteers section removed */}

      {/* Contact Section */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <h4 className="mb-2">General Queries</h4>
            <p className="mb-2 text-sm text-muted-foreground">info@esummit2026.com</p>
            <p className="text-sm text-muted-foreground">+91 98765 43210</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h4 className="mb-2">Sponsorship</h4>
            <p className="mb-2 text-sm text-muted-foreground">sponsors@esummit2026.com</p>
            <p className="text-sm text-muted-foreground">+91 98765 43220</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h4 className="mb-2">Speaker Relations</h4>
            <p className="mb-2 text-sm text-muted-foreground">speakers@esummit2026.com</p>
            <p className="text-sm text-muted-foreground">+91 98765 43230</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}