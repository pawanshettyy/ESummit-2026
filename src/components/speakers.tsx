import { motion } from "motion/react";
import { Linkedin, Twitter, Globe, Calendar, MapPin, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { AuroraText } from "./magicui/aurora-text";
import { Particles } from "./magicui/particles";
import { GlassCard } from "./accentricity/glass-card";
import { RippleBackground } from "./accentricity/ripple-background";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Speakers() {
  const speakers = [
    {
      name: "Devang Raja",
      title: "Founder, Venture Wolf",
      bio: "Devang Raja is the founder of Venture Wolf, a venture capital firm dedicated to empowering early-stage startups. As a panelist at E-Summit 2026, he brings extensive experience in startup funding and investment strategies.",
      expertise: ["Venture Capital", "Startup Investing", "Entrepreneurship"],
      achievements: [
        "Founded Venture Wolf",
        "Panelist at TTMD & Panel Discussion",
        "Event Sponsor for E-Summit 2026",
      ],
      session: [
        {
          title: "The Ten Minute Deal",
          date: "February 2-3, 2026",
          time: "10:00 AM – 5:00 PM",
          venue: "SH-1",
        },
        {
          title: "Panel Discussion: Future of Startup Funding",
          date: "February 2, 2026",
          time: "02:00 PM",
          venue: "Main Auditorium",
        },
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/devangraja2001/",
      },
      image: "/assets/panel/devang_raja.png",
    },
    {
      name: "Nikhil Jadhav",
      title: "VC, Ten Minute Deal",
      bio: "Nikhil Jadhav is the Founder of Robomax India Robotics, a leading robotics company established in 2018. With over 7 years of experience in startup leadership and robotics innovation, he specializes in early-stage startup investments and brings deep expertise in identifying promising ventures. As a former Robotics Trainer, he combines technical knowledge with entrepreneurial vision to guide startups through their growth journey at E-Summit 2026.",
      expertise: ["Start-up Leadership", "Robotics", "Programmable Logic Controller (PLC)", "Startup Investing", "Investment Strategy"],
      achievements: [
        "Founder of Robomax India Robotics (2018-Present)",
        "Robotics Trainer at Holy Angel (2018-2020)",
        "Panelist at The Ten Minute Deal",
        "7+ years in startup leadership and robotics",
      ],
      session: [
        {
          title: "The Ten Minute Deal",
          date: "February 2-3, 2026",
          time: "10:00 AM – 5:00 PM",
          venue: "SH-1",
        },
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/nikhil-jadhav-a42758b2/?originalSubdomain=in",
      },
      image: "/assets/panel/nikhil_jadhav.jpg",
    },
    {
      name: "Karn Rajani",
      title: "Finance Expert, Gitsol Finance",
      bio: "Karn Rajani is a finance expert at Gitsol Finance, bringing deep insights into financial strategies and investment opportunities. As a judge at The Ten Minute Deal, he evaluates startup pitches with a focus on financial viability and growth potential.",
      expertise: ["Finance", "Investment", "Startup Evaluation"],
      achievements: [
        "Finance Expert at Gitsol Finance",
        "Judge at The Ten Minute Deal",
      ],
      session: [
        {
          title: "The Ten Minute Deal",
          date: "February 2-3, 2026",
          time: "10:00 AM – 5:00 PM",
          venue: "SH-1",
        },
      ],
      social: {},
      image: "/assets/panel/default.png",
    },
    {
      name: "Devang Bhuta",
      title: "Parent Entrepreneur & Investor",
      bio: "Devang Bhuta is a seasoned entrepreneur and investor with a passion for products. As a parent entrepreneur, he mentors the next generation of innovators and invests in promising ventures. His experience in product development and investment makes him a valuable judge at E-Summit 2026.",
      expertise: ["Entrepreneurship", "Investment", "Product Development"],
      achievements: [
        "Parent Entrepreneur & Investor",
        "Judge at The Ten Minute Deal",
      ],
      session: [
        {
          title: "The Ten Minute Deal",
          date: "February 2-3, 2026",
          time: "10:00 AM – 5:00 PM",
          venue: "SH-1",
        },
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/db-passsionforproducts",
      },
      image: "/assets/panel/default.png",
    },
    {
      name: "Dr. Anita Divakar",
      title: "Former CEO, VJTI Technology Business Incubator",
      bio: "Dr. Anita Divakar is the former CEO of VJTI Technology Business Incubator, where she led initiatives to support technology startups. With extensive experience in incubation and mentorship, she serves as an industry mentor at Pitch Arena, guiding entrepreneurs from idea to reality.",
      expertise: ["Technology Incubation", "Startup Mentorship", "Business Development"],
      achievements: [
        "Former CEO at VJTI Technology Business Incubator",
        "Industry Mentor at Pitch Arena",
      ],
      session: [
        {
          title: "Pitch Arena - Idea to Reality",
          date: "January 30, 2026",
          time: "10:00 AM – 5:00 PM",
          venue: "314, 315, 316",
        },
      ],
      social: {},
      image: "/assets/panel/default.png",
    },
    {
      name: "Capt. Amit Rai",
      title: "Industry Mentor",
      bio: "Capt. Amit Rai brings a wealth of experience in leadership and industry practices. As an industry mentor at Pitch Arena, he provides valuable insights to entrepreneurs developing their ideas into successful businesses.",
      expertise: ["Leadership", "Industry Practices", "Mentorship"],
      achievements: [
        "Industry Mentor at Pitch Arena",
      ],
      session: [
        {
          title: "Pitch Arena - Idea to Reality",
          date: "January 30, 2026",
          time: "10:00 AM – 5:00 PM",
          venue: "314, 315, 316",
        },
      ],
      social: {},
      image: "/assets/panel/default.png",
    },
    {
      name: "Abhishek Patil",
      title: "Founder, 3D Design Studio",
      bio: "Abhishek Patil is the founder of 3D Design Studio, specializing in innovative design solutions. His expertise in design thinking and creative processes makes him an ideal mentor for entrepreneurs at Pitch Arena.",
      expertise: ["3D Design", "Design Thinking", "Creative Solutions"],
      achievements: [
        "Founder of 3D Design Studio",
        "Mentor at Pitch Arena",
      ],
      session: [
        {
          title: "Pitch Arena - Idea to Reality",
          date: "January 30, 2026",
          time: "10:00 AM – 5:00 PM",
          venue: "314, 315, 316",
        },
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/abhishpatil",
      },
      image: "/assets/panel/default.png",
    },
    {
      name: "Dr. Sachin Laddha",
      title: "Incubation Expert, MU Incubation",
      bio: "Dr. Sachin Laddha is an expert in startup incubation at MU Incubation. He provides guidance on incubation processes and helps startups navigate the early stages of development at The Incubator Summit.",
      expertise: ["Startup Incubation", "Business Development", "Mentorship"],
      achievements: [
        "Incubation Expert at MU Incubation",
        "Speaker at The Incubator Summit",
      ],
      session: [
        {
          title: "The Incubator Summit",
          date: "January 30-31, 2026",
          time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 10:00 AM – 1:00 PM",
          venue: "SSC TIMSR",
        },
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/sachinladdha",
      },
      image: "/assets/panel/default.png",
    },
    {
      name: "Himani Jaiswal",
      title: "Incubation Expert, WISE SNDTWU",
      bio: "Himani Jaiswal is an incubation expert at WISE SNDTWU, dedicated to supporting women entrepreneurs and startups. She shares insights on incubation strategies and gender-inclusive entrepreneurship at The Incubator Summit.",
      expertise: ["Startup Incubation", "Women Entrepreneurship", "Business Strategy"],
      achievements: [
        "Incubation Expert at WISE SNDTWU",
        "Speaker at The Incubator Summit",
      ],
      session: [
        {
          title: "The Incubator Summit",
          date: "January 30-31, 2026",
          time: "Day 1: 10:00 AM – 5:00 PM | Day 2: 10:00 AM – 1:00 PM",
          venue: "SSC TIMSR",
        },
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/himani-jaiswal-189b25232",
      },
      image: "/assets/panel/default.png",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
          <div className="relative mb-12">
            <RippleBackground />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 text-center"
            >
              <h1 className="mb-4 text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Speakers, Panelists & Guests
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Coming Soon: Learn from industry leaders, successful entrepreneurs, and investors who have built and scaled remarkable businesses
              </p>
            </motion.div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto justify-items-center">
        {speakers.map((speaker, index) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-2xl h-full">
                <div className="relative h-64">
                  <ImageWithFallback
                    src={speaker.image}
                    alt={speaker.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="mb-1 text-white">{speaker.name}</h3>
                    <p className="text-sm text-white/90">{speaker.title}</p>
                  </div>
                </div>

                <CardContent className="space-y-4 p-6">
                  <p className="text-sm text-muted-foreground">{speaker.bio}</p>

                  <div>
                    <h4 className="mb-2 text-sm">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {speaker.expertise.map((exp) => (
                        <Badge key={exp} variant="secondary">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm">Key Achievements</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {speaker.achievements.slice(0, 3).map((achievement) => (
                        <li key={achievement}>• {achievement}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <h4 className="mb-2 text-sm">Session Details</h4>
                    {speaker.session.map((sess, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="text-sm">{sess.title}</p>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {sess.date} at {sess.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {sess.venue}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 border-t pt-4">
                    {speaker.social.twitter && (
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        <a href={`https://twitter.com/${speaker.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </a>
                      </motion.div>
                    )}
                    {speaker.social.linkedin && (
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        <a href={speaker.social.linkedin} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                      </motion.div>
                    )}
                    {speaker.social.website && (
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        <a href={`https://${speaker.social.website}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Globe className="h-4 w-4" />
                          </Button>
                        </a>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="mt-48"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl py-4 font-bold mb-4 text-foreground">
            Speakers, Judges & Guests
          </h2>
          <p className="text-foreground text-lg">
            For any Speaker, Judge, or Guest related Queries
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Nidhi Dilipkumar Shukla",
              role: "Event Manager",
              image: "/assets/team/nidhi.png",
              whatsapp: "+918169231870",
              linkedin: "https://www.linkedin.com/in/nidhi-shukla-36151a329/"
            },
            {
              name: "Tanvi Prakash Jabare",
              role: "Publication Head",
              image: "/assets/team/tanvi.png",
              whatsapp: "+919619368299",
              linkedin: "https://www.linkedin.com/in/tanvi-jabare-b310a0347/"
            },
            {
              name: "Vedant Singh",
              role: "OC - Executive",
              image: "/assets/team/vedant.png",
              whatsapp: "+911234567890",
              linkedin: "https://www.linkedin.com/in/vedant-singh-93056b2bb/"
            },
          ].map((contact, index) => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <Avatar className="h-32 w-32 mb-4 mx-auto">
                    <AvatarImage src={contact.image} alt={contact.name} />
                    <AvatarFallback className="text-2xl">
                      {contact.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="text-xl font-bold mb-2">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground font-medium mb-4">
                      {contact.role}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">Contact</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={contact.linkedin && !contact.linkedin.includes('/in/example') ? "flex-1" : "w-full"}
                      onClick={() => window.open(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                    >
                      <FaWhatsapp className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                    {contact.linkedin && !contact.linkedin.includes('/in/example') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(contact.linkedin, '_blank')}
                      >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}