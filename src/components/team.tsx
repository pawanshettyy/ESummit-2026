import { motion } from "motion/react";
import { Mail, Linkedin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GlassCard } from "./accentricity/glass-card";
import { AuroraText } from "./magicui/aurora-text";

export function Team() {
  // Faculty Coordinators
  const facultyCoordinators: Array<{
    name: string;
    designation: string;
    department: string;
    email: string;
  }> = [
    // {
    //   name: "Prof. Dr. Name",
    //   designation: "Faculty Coordinator",
    //   department: "Department Name",
    //   email: "faculty@example.com"
    // }
    // Add faculty coordinators here when available
  ];

  // Executive Team
  const executiveTeam = {
    leadership: [
      {
        name: "Ayush Pardeshi",
        year: "TE",
        branch: "E&CS",
        position: "Chief Executive Officer (CEO)",
        type: "Leadership"
      },
      {
        name: "Aman Pandey",
        year: "BE",
        branch: "MME",
        position: "General Advisor (GA)",
        type: "Leadership"
      },
      {
        name: "Yash Khatri",
        year: "SE",
        branch: "COMP",
        position: "Chairperson",
        type: "Leadership"
      },
      {
        name: "Anushka Yadav",
        year: "TE",
        branch: "COMP",
        position: "Vice-Chairperson",
        type: "Leadership"
      },
      {
        name: "Krish Jain",
        year: "SE",
        branch: "COMP",
        position: "Outreach Head",
        type: "Leadership"
      }
    ],
    jc: [
      {
        name: "Varun Maurya",
        year: "SE",
        branch: "AI&ML",
        position: "JC - Executive",
        type: "Junior Core"
      },
      {
        name: "Shashank Mayur Barot",
        year: "SE",
        branch: "E&TC",
        position: "JC - Executive",
        type: "Junior Core"
      },
      {
        name: "Mehwish Siddique",
        year: "SE",
        branch: "AI&DS",
        position: "JC - Executive",
        type: "Junior Core"
      },
      {
        name: "Pawan Shetty",
        year: "SE",
        branch: "AI&ML",
        position: "JC - Executive",
        type: "Junior Core"
      }
    ],
    oc: [
      {
        name: "Yash Mattha",
        year: "SE",
        branch: "IT",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Tushar Gaba",
        year: "FE",
        branch: "IoT",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Vedant Singh",
        year: "FE",
        branch: "IT",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Om Paranjape",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Akshay Upadhyay",
        year: "SE",
        branch: "COMP",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Sankarshan Dwivedi",
        year: "FE",
        branch: "COMP",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Nishil Dhanuka",
        year: "FE",
        branch: "COMP",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Kaushal Shetty",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Prachi Kumari",
        year: "FE",
        branch: "IT",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Mitesh Purohit",
        year: "SE",
        branch: "AI&ML",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Ayush Giri",
        year: "FE",
        branch: "COMP",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Avya Chaurasia",
        year: "FE",
        branch: "IoT",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Diya Kandari",
        year: "FE",
        branch: "AI&ML",
        position: "OC - Executive",
        type: "Organizing Committee"
      },
      {
        name: "Shreya Yadav",
        year: "FE",
        branch: "COMP",
        position: "OC - Executive",
        type: "Organizing Committee"
      }
    ]
  };

  // Marketing and PR Team
  const marketingTeam = {
    leadership: [
      {
        name: "Hredey Chaand",
        year: "SE",
        branch: "COMP",
        position: "Chief Marketing Officer (CMO)",
        type: "Leadership"
      },
      {
        name: "Mishti Dhiman",
        year: "SE",
        branch: "COMP",
        position: "PR Head",
        type: "Core"
      },
      {
        name: "Yash Yadav",
        year: "SE",
        branch: "AI&ML",
        position: "Sponsorship Head",
        type: "Core"
      }
    ],
    jc: [
      {
        name: "Ashita Sharma",
        year: "SE",
        branch: "CSE",
        position: "JC - Marketing",
        type: "Junior Core"
      },
      {
        name: "Dia Tailor",
        year: "SE",
        branch: "AI&ML",
        position: "JC - Marketing",
        type: "Junior Core"
      },
      {
        name: "Subrat Rout",
        year: "SE",
        branch: "MME",
        position: "JC - Marketing",
        type: "Junior Core"
      }
    ],
    oc: [
      {
        name: "Niyatee Thakur",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Siddhesh Wagh",
        year: "SE",
        branch: "BCA",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Shubham Mane",
        year: "SE",
        branch: "COMP",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Sitanshu Shetty",
        year: "FE",
        branch: "E&TC",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Kavya Jhaveri",
        year: "FE",
        branch: "BCA",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Arpit Gawande",
        year: "FE",
        branch: "IoT",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Sakshi Thakur",
        year: "SE",
        branch: "AI&DS",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Shiva Saraswati",
        year: "SE",
        branch: "MME",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Arukesh Sahu",
        year: "FE",
        branch: "IoT",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Hitarth Bhatt",
        year: "FE",
        branch: "MME",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Khushi Tyagi",
        year: "FE",
        branch: "COMP",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Prashant Gupta",
        year: "FE",
        branch: "MME",
        position: "OC - Marketing",
        type: "Organizing Committee"
      },
      {
        name: "Shivanshi Pandit",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Marketing",
        type: "Organizing Committee"
      }
    ]
  };

  // Operations Team
  const operationsTeam = {
    leadership: [
      {
        name: "Bhummi Girnara",
        year: "TT",
        branch: "AI&DS",
        position: "Chief Operating Officer (COO)",
        type: "Leadership"
      },
      {
        name: "Sayyam Lohade",
        year: "TE",
        branch: "COMP",
        position: "Secretary",
        type: "Core"
      },
      {
        name: "Nidhi Dilipkumar Shukla",
        year: "SE",
        branch: "AI&ML",
        position: "Event Manager",
        type: "Core"
      },
      {
        name: "Tanvi Prakash Jabare",
        year: "SE",
        branch: "E&CS",
        position: "Publication Head",
        type: "Core"
      }
    ],
    jc: [
      {
        name: "Rudransh Atul Puthan",
        year: "SE",
        branch: "AI&ML",
        position: "JC - Operating",
        type: "Junior Core"
      },
      {
        name: "Kanchan Tripathi",
        year: "SE",
        branch: "E&CS",
        position: "JC - Operating",
        type: "Junior Core"
      },
      {
        name: "Shweta Shukla",
        year: "SE",
        branch: "AI&DS",
        position: "JC - Operating",
        type: "Junior Core"
      },
      {
        name: "Pratiksha Upadhyay",
        year: "SE",
        branch: "E&CS",
        position: "JC - Operating",
        type: "Junior Core"
      }
    ],
    oc: [
      {
        name: "Aayush Mishra",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Aditya Pandey",
        year: "SE",
        branch: "AI&ML",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Dhanush Shetty",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Roshni Joshi",
        year: "FE",
        branch: "E&TC",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Anugrah Yadav",
        year: "FE",
        branch: "COMP",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Shivang Shukla",
        year: "SE",
        branch: "COMP",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Shlok Yadav",
        year: "FE",
        branch: "CSE",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Shruti Sanjay Jadhav",
        year: "FE",
        branch: "MCA",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Rutuja Anil Bunke",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Shreeya Dewangan",
        year: "FE",
        branch: "IoT",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Namasavi Singh",
        year: "FE",
        branch: "CSE",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Prashant Yadav",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Shravani Kiran Salunke",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Operating",
        type: "Organizing Committee"
      },
      {
        name: "Sachin Kumawat",
        year: "FE",
        branch: "CSE",
        position: "OC - Operating",
        type: "Organizing Committee"
      }
    ]
  };

  // Technical Team
  const technicalTeam = {
    leadership: [
      {
        name: "Ahana Kulkarni",
        year: "TT",
        branch: "AI&DS",
        position: "Chief Technology Officer (CTO)",
        type: "Leadership"
      },
      {
        name: "Raj Mane",
        year: "SE",
        branch: "COMP",
        position: "Technical Lead",
        type: "Core"
      },
      {
        name: "Nikita Tiwari",
        year: "SE",
        branch: "COMP",
        position: "Creative Head",
        type: "Core"
      },
      {
        name: "Shweta Varma",
        year: "TE",
        branch: "E&TC",
        position: "SMM Head",
        type: "Core"
      }
    ],
    jc: [
      {
        name: "Krish Choudhary",
        year: "SE",
        branch: "COMP",
        position: "JC - Technical - SMM",
        type: "Junior Core"
      },
      {
        name: "Shaleen Singh",
        year: "SE",
        branch: "IT",
        position: "JC - Technical",
        type: "Junior Core"
      },
      {
        name: "Priyanshi Negi",
        year: "SE",
        branch: "E&CS",
        position: "JC - Technical",
        type: "Junior Core"
      }
    ],
    oc: [
      {
        name: "Himanshu Basant Naik",
        year: "FE",
        branch: "IoT",
        position: "OC - Technical - SMM",
        type: "Organizing Committee"
      },
      {
        name: "Arjun Parab",
        year: "FE",
        branch: "IoT",
        position: "OC - Technical - SMM",
        type: "Organizing Committee"
      },
      {
        name: "Sakshi Yadav",
        year: "FE",
        branch: "CSE",
        position: "OC - Technical - SMM",
        type: "Organizing Committee"
      },
      {
        name: "Aryan Anil Singh",
        year: "FE",
        branch: "COMP",
        position: "OC - Technical - SMM",
        type: "Organizing Committee"
      },
      {
        name: "Pratik Verma",
        year: "SE",
        branch: "COMP",
        position: "OC - Technical - SMM",
        type: "Organizing Committee"
      },
      {
        name: "Sneha Chauhan",
        year: "FE",
        branch: "E&TC",
        position: "OC - Technical",
        type: "Organizing Committee"
      },
      {
        name: "Nikhil Shukla",
        year: "SE",
        branch: "IT",
        position: "OC - Technical",
        type: "Organizing Committee"
      },
      {
        name: "Saloni Suthar",
        year: "FE",
        branch: "BCA",
        position: "OC - Technical",
        type: "Organizing Committee"
      },
      {
        name: "Chinmay Rajesh Mhatre",
        year: "FE",
        branch: "AI&DS",
        position: "OC - Technical",
        type: "Organizing Committee"
      },
      {
        name: "Prakash Mandal",
        year: "SE",
        branch: "AI&ML",
        position: "OC - Technical",
        type: "Organizing Committee"
      },
      {
        name: "Ayush Singh Chandel",
        year: "SE",
        branch: "B.VOC",
        position: "OC - Technical",
        type: "Organizing Committee"
      },
      {
        name: "Shubham Prajapati",
        year: "SE",
        branch: "AI&ML",
        position: "OC - Technical",
        type: "Organizing Committee"
      },
      {
        name: "Ayush Tyagi",
        year: "FE",
        branch: "CSE",
        position: "OC - Technical",
        type: "Organizing Committee"
      },
      {
        name: "Bhavika Vasule",
        year: "SE",
        branch: "COMP",
        position: "OC - Technical",
        type: "Organizing Committee"
      }
    ]
  };

  return (
    <div className="container mx-auto py-8 md:py-12 px-4 md:px-6 lg:px-8">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Meet the Team
        </h1>
        
        {/* Aurora decorative text */}
        <div className="relative mb-4 md:mb-6 py-4">
          <AuroraText 
            size="sm" 
            colors={["#a855f7", "#ec4899", "#3b82f6", "#8b5cf6", "#d946ef"]}
            className="tracking-[0.15em] md:tracking-[0.25em] uppercase font-light"
          >
            Building Tomorrow Together
          </AuroraText>
        </div>
        
        <p className="text-base md:text-xl text-muted-foreground px-4">
          The dedicated individuals making E-Summit 2026 a reality
        </p>
      </div>

      {/* Faculty Coordinators Section - Only show if there are coordinators */}
      {facultyCoordinators.length > 0 && (
        <div className="mb-12 md:mb-16">
          <div className="mb-6 md:mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Faculty Coordinators</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Our faculty advisors providing guidance and support
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {facultyCoordinators.map((faculty, index) => (
              <motion.div
                key={faculty.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard>
                  <Card className="border-0 bg-transparent h-full">
                    <CardContent className="p-6">
                      <h3 className="mb-2 text-lg font-semibold">{faculty.name}</h3>
                      <p className="mb-2 text-primary font-medium">{faculty.designation}</p>
                      <p className="mb-3 text-sm text-muted-foreground">{faculty.department}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${faculty.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                          {faculty.email}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="executive" className="w-full">
        <TabsList className="mb-6 md:mb-8 grid w-full max-w-3xl mx-auto grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 h-auto p-1">
          <TabsTrigger value="executive" className="text-xs md:text-sm py-2 md:py-2.5">Executive</TabsTrigger>
          <TabsTrigger value="marketing" className="text-xs md:text-sm py-2 md:py-2.5">Marketing & PR</TabsTrigger>
          <TabsTrigger value="operations" className="text-xs md:text-sm py-2 md:py-2.5">Operations</TabsTrigger>
          <TabsTrigger value="technical" className="text-xs md:text-sm py-2 md:py-2.5">Technical</TabsTrigger>
        </TabsList>

        {/* Executive Team */}
        <TabsContent value="executive">
          {/* Leadership */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Leadership</h2>
              <p className="text-sm md:text-base text-muted-foreground">Executive leadership team</p>
            </div>
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {executiveTeam.leadership.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard>
                    <Card className="border-0 bg-transparent h-full">
                      <CardContent className="p-6">
                        <h3 className="mb-2 text-lg font-semibold">{member.name}</h3>
                        <p className="mb-3 text-primary font-medium">{member.position}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">{member.branch}</Badge>
                          <Badge variant="outline">{member.year}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Junior Core */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Junior Core (JC)</h2>
              <p className="text-sm md:text-base text-muted-foreground">Rising executive leaders</p>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {executiveTeam.jc.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <h4 className="mb-1 text-sm font-semibold line-clamp-2">{member.name}</h4>
                      <p className="mb-2 text-xs text-primary line-clamp-1">{member.position}</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{member.branch}</Badge>
                        <Badge variant="outline" className="text-xs">{member.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Organizing Committee */}
          <div>
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Organizing Committee (OC)</h2>
              <p className="text-sm md:text-base text-muted-foreground">Executive support team</p>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {executiveTeam.oc.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <h4 className="mb-1 text-sm font-semibold line-clamp-2">{member.name}</h4>
                      <p className="mb-2 text-xs text-muted-foreground line-clamp-1">{member.position}</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">{member.branch}</Badge>
                        <Badge variant="outline" className="text-xs">{member.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Marketing & PR Team */}
        <TabsContent value="marketing">
          {/* Leadership */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Leadership & Core</h2>
              <p className="text-sm md:text-base text-muted-foreground">Marketing and PR leadership</p>
            </div>
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {marketingTeam.leadership.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard>
                    <Card className="border-0 bg-transparent h-full">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="mb-1 md:mb-2 text-base md:text-lg font-semibold">{member.name}</h3>
                        <p className="mb-2 md:mb-3 text-sm md:text-base text-primary font-medium">{member.position}</p>
                        <div className="flex gap-1.5 md:gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs md:text-sm">{member.branch}</Badge>
                          <Badge variant="outline" className="text-xs md:text-sm">{member.year}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Junior Core */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Junior Core (JC)</h2>
              <p className="text-sm md:text-base text-muted-foreground">Marketing junior core team</p>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {marketingTeam.jc.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <h4 className="mb-1 text-sm font-semibold line-clamp-2">{member.name}</h4>
                      <p className="mb-2 text-xs text-primary line-clamp-1">{member.position}</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{member.branch}</Badge>
                        <Badge variant="outline" className="text-xs">{member.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Organizing Committee */}
          <div>
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Organizing Committee (OC)</h2>
              <p className="text-sm md:text-base text-muted-foreground">Marketing support team</p>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {marketingTeam.oc.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <h4 className="mb-1 text-sm font-semibold line-clamp-2">{member.name}</h4>
                      <p className="mb-2 text-xs text-muted-foreground line-clamp-1">{member.position}</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">{member.branch}</Badge>
                        <Badge variant="outline" className="text-xs">{member.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Operations Team */}
        <TabsContent value="operations">
          {/* Leadership */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Leadership & Core</h2>
              <p className="text-sm md:text-base text-muted-foreground">Operations leadership</p>
            </div>
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {operationsTeam.leadership.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard>
                    <Card className="border-0 bg-transparent h-full">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="mb-1 md:mb-2 text-base md:text-lg font-semibold">{member.name}</h3>
                        <p className="mb-2 md:mb-3 text-sm md:text-base text-primary font-medium">{member.position}</p>
                        <div className="flex gap-1.5 md:gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs md:text-sm">{member.branch}</Badge>
                          <Badge variant="outline" className="text-xs md:text-sm">{member.year}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Junior Core */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Junior Core (JC)</h2>
              <p className="text-sm md:text-base text-muted-foreground">Operations junior core team</p>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {operationsTeam.jc.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <h4 className="mb-1 text-sm font-semibold line-clamp-2">{member.name}</h4>
                      <p className="mb-2 text-xs text-primary line-clamp-1">{member.position}</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{member.branch}</Badge>
                        <Badge variant="outline" className="text-xs">{member.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Organizing Committee */}
          <div>
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Organizing Committee (OC)</h2>
              <p className="text-sm md:text-base text-muted-foreground">Operations support team</p>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {operationsTeam.oc.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <h4 className="mb-1 text-sm font-semibold line-clamp-2">{member.name}</h4>
                      <p className="mb-2 text-xs text-muted-foreground line-clamp-1">{member.position}</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">{member.branch}</Badge>
                        <Badge variant="outline" className="text-xs">{member.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Technical Team */}
        <TabsContent value="technical">
          {/* Leadership */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Leadership & Core</h2>
              <p className="text-sm md:text-base text-muted-foreground">Technical, creative, and SMM leadership</p>
            </div>
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {technicalTeam.leadership.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard>
                    <Card className="border-0 bg-transparent h-full">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="mb-1 md:mb-2 text-base md:text-lg font-semibold">{member.name}</h3>
                        <p className="mb-2 md:mb-3 text-sm md:text-base text-primary font-medium">{member.position}</p>
                        <div className="flex gap-1.5 md:gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs md:text-sm">{member.branch}</Badge>
                          <Badge variant="outline" className="text-xs md:text-sm">{member.year}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Junior Core */}
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Junior Core (JC)</h2>
              <p className="text-sm md:text-base text-muted-foreground">Technical junior core team</p>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {technicalTeam.jc.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <h4 className="mb-1 text-sm font-semibold line-clamp-2">{member.name}</h4>
                      <p className="mb-2 text-xs text-primary line-clamp-1">{member.position}</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{member.branch}</Badge>
                        <Badge variant="outline" className="text-xs">{member.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Organizing Committee */}
          <div>
            <div className="mb-4 md:mb-6">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Organizing Committee (OC)</h2>
              <p className="text-sm md:text-base text-muted-foreground">Technical support team</p>
            </div>
            <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {technicalTeam.oc.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <h4 className="mb-1 text-sm font-semibold line-clamp-2">{member.name}</h4>
                      <p className="mb-2 text-xs text-muted-foreground line-clamp-1">{member.position}</p>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">{member.branch}</Badge>
                        <Badge variant="outline" className="text-xs">{member.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}