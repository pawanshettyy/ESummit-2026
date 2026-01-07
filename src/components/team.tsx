import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { Card, CardContent } from "./ui/card";
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
    // Add faculty coordinators here when available
  ];

  // Senior Management Team (SMT) - CEO, CTO, COO, CMO
  const seniorManagementTeam = [
    {
      name: "Ayush Pardeshi",
      year: "TE",
      branch: "E&CS",
      position: "Chief Executive Officer",
      shortPosition: "CEO",
      type: "SMT"
    },
    {
      name: "Ahana Kulkarni",
      year: "TT",
      branch: "AI&DS",
      position: "Chief Technology Officer",
      shortPosition: "CTO",
      type: "SMT"
    },
    {
      name: "Bhummi Girnara",
      year: "TT",
      branch: "AI&DS",
      position: "Chief Operating Officer",
      shortPosition: "COO",
      type: "SMT"
    },
    {
      name: "Hredey Chaand",
      year: "SE",
      branch: "COMP",
      position: "Chief Marketing Officer",
      shortPosition: "CMO",
      type: "SMT"
    }
  ];

  // CORE Team - organized by department
  const coreTeam = {
    executive: [
      {
        name: "Aman Pandey",
        year: "BE",
        branch: "MME",
        position: "General Advisor",
        department: "Executive"
      },
      {
        name: "Yash Khatri",
        year: "SE",
        branch: "COMP",
        position: "Chairperson",
        department: "Executive"
      }
    ],
    marketing: [
      {
        name: "Krish Jain",
        year: "SE",
        branch: "COMP",
        position: "Outreach Head",
        department: "Marketing"
      },
      {
        name: "Mishti Dhiman",
        year: "SE",
        branch: "COMP",
        position: "PR Head",
        department: "Marketing"
      },
      {
        name: "Yash Yadav",
        year: "SE",
        branch: "AI&ML",
        position: "Sponsorship Head",
        department: "Marketing"
      }
    ],
    operations: [
      {
        name: "Sayyam Lohade",
        year: "TE",
        branch: "COMP",
        position: "Secretary",
        department: "Operations"
      },
      {
        name: "Nidhi Dilipkumar Shukla",
        year: "SE",
        branch: "AI&ML",
        position: "Event Manager",
        department: "Operations"
      },
      {
        name: "Tanvi Prakash Jabare",
        year: "SE",
        branch: "E&CS",
        position: "Publication Head",
        department: "Operations"
      }
    ],
    technical: [
      {
        name: "Raj Mane",
        year: "SE",
        branch: "COMP",
        position: "Technical Lead",
        department: "Technical"
      },
      {
        name: "Nikita Tiwari",
        year: "SE",
        branch: "COMP",
        position: "Creative Head",
        department: "Technical"
      }
    ]
  };

  // JC Team - organized by department
  const jcTeam = {
    executive: [
      {
        name: "Yash Mattha",
        year: "SE",
        branch: "IT",
        position: "JC - Executive",
        department: "Executive"
      },
      {
        name: "Varun Maurya",
        year: "SE",
        branch: "AI&ML",
        position: "JC - Executive",
        department: "Executive"
      },
      {
        name: "Shashank Mayur Barot",
        year: "SE",
        branch: "E&TC",
        position: "JC - Executive",
        department: "Executive"
      },
      {
        name: "Mehwish Siddique",
        year: "SE",
        branch: "AI&DS",
        position: "JC - Executive",
        department: "Executive"
      },
      {
        name: "Pawan Shetty",
        year: "SE",
        branch: "AI&ML",
        position: "JC - Executive",
        department: "Executive"
      }
    ],
    marketing: [
      {
        name: "Ashita Sharma",
        year: "SE",
        branch: "CSE",
        position: "JC - Marketing",
        department: "Marketing"
      },
      {
        name: "Dia Tailor",
        year: "SE",
        branch: "AI&ML",
        position: "JC - Marketing",
        department: "Marketing"
      },
      {
        name: "Subrat Rout",
        year: "SE",
        branch: "MME",
        position: "JC - Marketing",
        department: "Marketing"
      }
    ],
    operations: [
      {
        name: "Rudransh Atul Puthan",
        year: "SE",
        branch: "AI&ML",
        position: "JC - Operations",
        department: "Operations"
      },
      {
        name: "Kanchan Tripathi",
        year: "SE",
        branch: "E&CS",
        position: "JC - Operations",
        department: "Operations"
      },
      {
        name: "Shweta Shukla",
        year: "SE",
        branch: "AI&DS",
        position: "JC - Operations",
        department: "Operations"
      },
      {
        name: "Pratiksha Upadhyay",
        year: "SE",
        branch: "E&CS",
        position: "JC - Operations",
        department: "Operations"
      }
    ],
    technical: [
      {
        name: "Krish Choudhary",
        year: "SE",
        branch: "COMP",
        position: "JC - Technical (SMM)",
        department: "Technical"
      },
      {
        name: "Shaleen Singh",
        year: "SE",
        branch: "IT",
        position: "JC - Technical",
        department: "Technical"
      },
      {
        name: "Priyanshi Negi",
        year: "SE",
        branch: "E&CS",
        position: "JC - Technical",
        department: "Technical"
      }
    ]
  };

  // OC Team - organized by department
  const ocTeam = {
    executive: [
      { name: "Tushar Gaba", year: "FE", branch: "IoT", position: "OC - Executive", department: "Executive" },
      { name: "Vedant Singh", year: "FE", branch: "IT", position: "OC - Executive", department: "Executive" },
      { name: "Om Paranjape", year: "FE", branch: "AI&DS", position: "OC - Executive", department: "Executive" },
      { name: "Akshay Upadhyay", year: "SE", branch: "COMP", position: "OC - Executive", department: "Executive" },
      { name: "Sankarshan Dwivedi", year: "FE", branch: "COMP", position: "OC - Executive", department: "Executive" },
      { name: "Nishil Dhanuka", year: "FE", branch: "COMP", position: "OC - Executive", department: "Executive" },
      { name: "Kaushal Shetty", year: "FE", branch: "AI&DS", position: "OC - Executive", department: "Executive" },
      { name: "Prachi Kumari", year: "FE", branch: "IT", position: "OC - Executive", department: "Executive" },
      { name: "Mitesh Purohit", year: "SE", branch: "AI&ML", position: "OC - Executive", department: "Executive" },
      { name: "Ayush Giri", year: "FE", branch: "COMP", position: "OC - Executive", department: "Executive" },
      { name: "Avya Chaurasia", year: "FE", branch: "IoT", position: "OC - Executive", department: "Executive" },
      { name: "Diya Kandari", year: "FE", branch: "AI&ML", position: "OC - Executive", department: "Executive" },
      { name: "Shreya Yadav", year: "FE", branch: "COMP", position: "OC - Executive", department: "Executive" }
    ],
    marketing: [
      { name: "Niyatee Thakur", year: "FE", branch: "AI&DS", position: "OC - Marketing", department: "Marketing" },
      { name: "Siddhesh Wagh", year: "SE", branch: "BCA", position: "OC - Marketing", department: "Marketing" },
      { name: "Shubham Mane", year: "SE", branch: "COMP", position: "OC - Marketing", department: "Marketing" },
      { name: "Sitanshu Shetty", year: "FE", branch: "E&TC", position: "OC - Marketing", department: "Marketing" },
      { name: "Kavya Jhaveri", year: "FE", branch: "BCA", position: "OC - Marketing", department: "Marketing" },
      { name: "Arpit Gawande", year: "FE", branch: "IoT", position: "OC - Marketing", department: "Marketing" },
      { name: "Sakshi Thakur", year: "SE", branch: "AI&DS", position: "OC - Marketing", department: "Marketing" },
      { name: "Shiva Saraswati", year: "SE", branch: "MME", position: "OC - Marketing", department: "Marketing" },
      { name: "Arukesh Sahu", year: "FE", branch: "IoT", position: "OC - Marketing", department: "Marketing" },
      { name: "Hitarth Bhatt", year: "FE", branch: "MME", position: "OC - Marketing", department: "Marketing" },
      { name: "Khushi Tyagi", year: "FE", branch: "COMP", position: "OC - Marketing", department: "Marketing" },
      { name: "Prashant Gupta", year: "FE", branch: "MME", position: "OC - Marketing", department: "Marketing" },
      { name: "Shivanshi Pandit", year: "FE", branch: "AI&DS", position: "OC - Marketing", department: "Marketing" }
    ],
    operations: [
      { name: "Aayush Mishra", year: "FE", branch: "AI&DS", position: "OC - Operations", department: "Operations" },
      { name: "Aditya Pandey", year: "SE", branch: "AI&ML", position: "OC - Operations", department: "Operations" },
      { name: "Dhanush Shetty", year: "FE", branch: "AI&DS", position: "OC - Operations", department: "Operations" },
      { name: "Roshni Joshi", year: "FE", branch: "E&TC", position: "OC - Operations", department: "Operations" },
      { name: "Anugrah Yadav", year: "FE", branch: "COMP", position: "OC - Operations", department: "Operations" },
      { name: "Shivang Shukla", year: "SE", branch: "COMP", position: "OC - Operations", department: "Operations" },
      { name: "Shlok Yadav", year: "FE", branch: "CSE", position: "OC - Operations", department: "Operations" },
      { name: "Shruti Sanjay Jadhav", year: "FE", branch: "MCA", position: "OC - Operations", department: "Operations" },
      { name: "Rutuja Anil Bunke", year: "FE", branch: "AI&DS", position: "OC - Operations", department: "Operations" },
      { name: "Shreeya Dewangan", year: "FE", branch: "IoT", position: "OC - Operations", department: "Operations" },
      { name: "Namasavi Singh", year: "FE", branch: "CSE", position: "OC - Operations", department: "Operations" },
      { name: "Prashant Yadav", year: "FE", branch: "AI&DS", position: "OC - Operations", department: "Operations" },
      { name: "Shravani Kiran Salunke", year: "FE", branch: "AI&DS", position: "OC - Operations", department: "Operations" },
      { name: "Sachin Kumawat", year: "FE", branch: "CSE", position: "OC - Operations", department: "Operations" }
    ],
    technical: [
      { name: "Himanshu Basant Naik", year: "FE", branch: "IoT", position: "OC - Technical (SMM)", department: "Technical" },
      { name: "Arjun Parab", year: "FE", branch: "IoT", position: "OC - Technical (SMM)", department: "Technical" },
      { name: "Sakshi Yadav", year: "FE", branch: "CSE", position: "OC - Technical (SMM)", department: "Technical" },
      { name: "Aryan Anil Singh", year: "FE", branch: "COMP", position: "OC - Technical (SMM)", department: "Technical" },
      { name: "Pratik Verma", year: "SE", branch: "COMP", position: "OC - Technical (SMM)", department: "Technical" },
      { name: "Sneha Chauhan", year: "FE", branch: "E&TC", position: "OC - Technical", department: "Technical" },
      { name: "Nikhil Shukla", year: "SE", branch: "IT", position: "OC - Technical", department: "Technical" },
      { name: "Saloni Suthar", year: "FE", branch: "BCA", position: "OC - Technical", department: "Technical" },
      { name: "Chinmay Rajesh Mhatre", year: "FE", branch: "AI&DS", position: "OC - Technical", department: "Technical" },
      { name: "Prakash Mandal", year: "SE", branch: "AI&ML", position: "OC - Technical", department: "Technical" },
      { name: "Ayush Singh Chandel", year: "SE", branch: "B.VOC", position: "OC - Technical", department: "Technical" },
      { name: "Shubham Prajapati", year: "SE", branch: "AI&ML", position: "OC - Technical", department: "Technical" },
      { name: "Ayush Tyagi", year: "FE", branch: "CSE", position: "OC - Technical", department: "Technical" },
      { name: "Bhavika Vasule", year: "SE", branch: "COMP", position: "OC - Technical", department: "Technical" }
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

      {/* Faculty Coordinators Section */}
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

      <Tabs defaultValue="smt" className="w-full">
        <TabsList className="mb-6 md:mb-8 grid w-full max-w-3xl mx-auto grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 h-auto p-1">
          <TabsTrigger value="smt" className="text-xs md:text-sm py-2 md:py-2.5">SMT</TabsTrigger>
          <TabsTrigger value="core" className="text-xs md:text-sm py-2 md:py-2.5">CORE</TabsTrigger>
          <TabsTrigger value="jc" className="text-xs md:text-sm py-2 md:py-2.5">JC</TabsTrigger>
          <TabsTrigger value="oc" className="text-xs md:text-sm py-2 md:py-2.5">OC</TabsTrigger>
        </TabsList>

        {/* Senior Management Team (SMT) */}
        <TabsContent value="smt">
          <div className="mb-6 md:mb-8">
            <div className="mb-4 md:mb-6 text-center">
              <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Senior Management Team</h2>
              <p className="text-sm md:text-base text-muted-foreground">C-Level executives leading E-Summit 2026</p>
            </div>
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {seniorManagementTeam.map((member, index) => (
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
                        <div className="mb-3 text-center">
                          <div className="text-4xl font-bold text-primary mb-2">{member.shortPosition}</div>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-center">{member.name}</h3>
                        <p className="mb-3 text-sm text-muted-foreground text-center">{member.position}</p>
                        <div className="flex gap-2 flex-wrap justify-center">
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
        </TabsContent>

        {/* CORE Team */}
        <TabsContent value="core">
          <div className="space-y-8 md:space-y-12">
            {/* Executive Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Executive</h2>
                <p className="text-sm md:text-base text-muted-foreground">Core executive leadership</p>
              </div>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {coreTeam.executive.map((member, index) => (
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

            {/* Marketing Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Marketing</h2>
                <p className="text-sm md:text-base text-muted-foreground">Core marketing leadership</p>
              </div>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {coreTeam.marketing.map((member, index) => (
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

            {/* Operations Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Operations</h2>
                <p className="text-sm md:text-base text-muted-foreground">Core operations leadership</p>
              </div>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {coreTeam.operations.map((member, index) => (
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

            {/* Technical Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Technical</h2>
                <p className="text-sm md:text-base text-muted-foreground">Core technical leadership</p>
              </div>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {coreTeam.technical.map((member, index) => (
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
          </div>
        </TabsContent>

        {/* JC Team */}
        <TabsContent value="jc">
          <div className="space-y-8 md:space-y-12">
            {/* Executive Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Executive</h2>
                <p className="text-sm md:text-base text-muted-foreground">Junior Core - Executive</p>
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {jcTeam.executive.map((member, index) => (
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

            {/* Marketing Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Marketing</h2>
                <p className="text-sm md:text-base text-muted-foreground">Junior Core - Marketing</p>
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {jcTeam.marketing.map((member, index) => (
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

            {/* Operations Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Operations</h2>
                <p className="text-sm md:text-base text-muted-foreground">Junior Core - Operations</p>
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {jcTeam.operations.map((member, index) => (
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

            {/* Technical Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Technical</h2>
                <p className="text-sm md:text-base text-muted-foreground">Junior Core - Technical</p>
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {jcTeam.technical.map((member, index) => (
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
          </div>
        </TabsContent>

        {/* OC Team */}
        <TabsContent value="oc">
          <div className="space-y-8 md:space-y-12">
            {/* Executive Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Executive</h2>
                <p className="text-sm md:text-base text-muted-foreground">Organizing Committee - Executive</p>
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {ocTeam.executive.map((member, index) => (
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

            {/* Marketing Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Marketing</h2>
                <p className="text-sm md:text-base text-muted-foreground">Organizing Committee - Marketing</p>
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {ocTeam.marketing.map((member, index) => (
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

            {/* Operations Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Operations</h2>
                <p className="text-sm md:text-base text-muted-foreground">Organizing Committee - Operations</p>
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {ocTeam.operations.map((member, index) => (
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

            {/* Technical Department */}
            <div>
              <div className="mb-4 md:mb-6 pt-4">
                <h2 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">Technical</h2>
                <p className="text-sm md:text-base text-muted-foreground">Organizing Committee - Technical</p>
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {ocTeam.technical.map((member, index) => (
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
