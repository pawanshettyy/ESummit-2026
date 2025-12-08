import {Footer} from "../../footer.tsx";
import { TextReveal, WordReveal } from "../../magicui/text-reveal";
import { GradientText } from "../../magicui/gradient-text";
import { GlowCard } from "../../accentricity/glow-card";
import { HoverGlow } from "../../accentricity/hover-glow";


import { PitchNavigation } from "./PitchNavigation";

import { motion, number } from "motion/react";
import { Card, CardContent } from "../../ui/card";
import { Trophy, Lightbulb, Users, Rocket } from "lucide-react";

export default function PitchPage() {
  const navigateTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- SPEAKERS / JUDGES DATA ---
  const speakers = [
    {
      name: "Judge 1",
      role: "Investor",
      image: "/placeholder-user.jpg",
    },
    {
      name: "Judge 2",
      role: "VC Panelist",
      image: "/placeholder-user.jpg",
    },
    {
      name: "Speaker 1",
      role: "Startup Mentor",
      image: "/placeholder-user.jpg",
    },
  ];

  // --- PERKS DATA ---
  const perks = [
    { label: "Mentorship from founder", desc: "Guidance from experts" , icon: Lightbulb },
    { label: "Funding opportunities", desc: "Startup support opportunities", icon: Trophy },
    { label: "Networking", desc: "Meet founders & investors", icon: Users },
    { label: "Participate certificate", desc:  "Exciting awards for winners" , icon: Rocket },
  ];

   const contacts =[
    {
      name: "A Coordinator",
      number : "91XXXXXXXX",
      image : "https://ukfostering.org.uk/wp-content/uploads/2016/11/dummy-female-img.jpg",
    },
     {
      name: "B Coordinator",
      number : "91XXXXXXXX",
      image : "https://www.clipartmax.com/png/middle/144-1442578_flat-person-icon-download-dummy-man.png",
    },
   ];

   const seniorcontacts =[
    {
      name: "senior 1",
      number : "91XXXXXXXX",
      email:"aabcc@yahoo.com" ,
    },
     {
      name: "senior 2",
      number : "91XXXXXXXX",
      email:"aabcc@yahoo.com" ,
    },
   ];

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8">
      <PitchNavigation
        onBack={() => (window.location.href = "/")}
        onHome={() => (window.location.href = "/")}
        onDashboard={() => (window.location.href = "/dashboard")}
        onNavigate={navigateTo}
      />

      <main className="pt-24">

        {/*EVENT BRIEF*/}
        <section id="event-brief" className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <TextReveal>
      <GradientText className="text-4xl font-bold mb-4">
        Pitch Arena – Idea To Reality
      </GradientText>
    </TextReveal>
            <p className="text-muted-foreground">
              Platform for first-time founders to pitch their ideas and get shortlisted for the next round...
            </p>
          </div>
        </section>

        {/* SPEAKERS & JUDGES */}
        <section id="speakers" className="bg-muted/10 px-4 py-16">
          <h2 className="text-3xl font-semibold mb-16 text-center">Speakers & Judges</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all">
                  <CardContent className="flex flex-col items-center p-6">
                    <motion.img
                      src={person.image}
                      alt={person.name}
                      className="h-24 w-24 rounded-full object-cover mb-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="text-lg font-semibold">{person.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {person.role}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PERKS*/}
        <section id="perks" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-semibold mb-16 text-center">Perks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {perks.map((perk, index) => (
    <motion.div
      key={perk.label}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
    >

      {/* shines ONLY on hover */}
      <HoverGlow glowColor="#ff0000" intensity={0.7} borderRadius="16px">

        <Card className="text-center transition-all hover:-translate-y-1">
          <CardContent className="flex flex-col items-center p-6">

            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <perk.icon className="mb-3 h-10 w-10 text-primary" />
            </motion.div>

            <div className="text-base font-semibold">{perk.label}</div>

            <p className="text-sm text-muted-foreground mt-1 text-center">
              {perk.desc}
            </p>

          </CardContent>
        </Card>

      </HoverGlow>

    </motion.div>
  ))}
</div>
        </section>

        {/* CONTACT INFO */}
       
        <section id="contacts" className="bg-muted/10 px-4 py-12">
  <h2 className="text-3xl font-semibold mb-16 text-center -mt-4">
    Contact
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 justify-center max-w-3xl mx-auto">
    {contacts.map((person, index) => (
      <motion.div
        key={person.name}
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="flex justify-center"
      >
        <Card className="w-[300px] hover:shadow-lg hover:-translate-y-1 transition-all">
          <CardContent className="flex flex-col items-center p-6">
            <motion.img
              src={person.image}
              className="h-24 w-24 rounded-full object-cover mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />

            <div className="text-lg font-semibold">{person.name}</div>
            <div className="text-sm text-muted-foreground">
              {person.number}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
</section>


        {/*  SENIOR CONTACTS */}
        
         <section id="seniorcontacts" className="bg-muted/10 px-4 py-12">
  <h2 className="text-3xl font-semibold mb-16 text-center -mt-4">
   Senior Contact
  </h2>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 justify-center max-w-3xl mx-auto">
    { seniorcontacts.map((person, index) => (
      <motion.div
        key={person.name}
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="flex justify-center"
      >
        <Card className="w-[300px] hover:shadow-lg hover:-translate-y-1 transition-all">
          <CardContent className="flex flex-col items-center p-6">
            {/* <motion.img
              src={person.image}
              className="h-24 w-24 rounded-full object-cover mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            /> */}

            <div className="text-lg font-semibold">{person.name}</div>
            <div className="text-sm text-muted-foreground">
              {person.number}
            </div>
            <div className="text-lg font-semibold">{person.email}</div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
</section>

        {/* VENUE */}
        <section id="venue" className="border-b py-16 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
  <div className="container mx-auto px-4">
    
    <div className="grid gap-6 mb-12 place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="h-full border-primary/20 
          hover:border-red-500 
          hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]
          transition-all duration-300 group"
        >
          <CardContent className="p-8 text-center">
            
            <div className="mb-4 h-12 w-12 mx-auto rounded-lg 
              bg-primary/10 flex items-center justify-center 
              group-hover:bg-red-200 transition-colors">
            </div>

            <h3 className="mb-3 text-xl font-semibold">Venue</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              TCET – SH-3, SH-4, Auditorium
            </p>

          </CardContent>
        </Card>
      </motion.div>
    </div>

  </div>
</section>
         

          
            {/* REGISTER BUTTON */}
    
        <section className="py-20 text-center">
  <button
    onClick={() => (window.location.href = "/booking")}
    style={{
      padding: '16px 48px',
      backgroundColor: '#dc2626',
      color: 'white',
      borderRadius: '9999px',
      fontSize: '18px'
    }}
    className="shadow-lg hover:scale-105 transition"
  >
    Register Now
  </button>
</section>
      </main>
      <Footer onNavigate={navigateTo} />

    </div>
  );
}
