import { motion } from "framer-motion";
import { Circle, ChevronDown, Clock, Calendar, TrendingUp, Award, Target, BarChart2, PieChart, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Speaker {
  name: string;
  role: string;
  photo: string;
  bio?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function HeroSection({
  title,
  subtitle,
  date,
  time,
  venue,
  tagline,
}: {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  tagline?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative w-full flex items-start justify-center overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-950 pt-24 md:pt-32 pb-20 md:pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.15] via-transparent to-orange-500/[0.15] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-red-500/[0.25]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-orange-500/[0.25]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-red-600/[0.25]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-pink-500/[0.25]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.15] mb-6 md:mb-8"
          >
            <Circle className="h-2 w-2 fill-red-500/80" />
            <span className="text-sm text-white/80 tracking-wide">
              Exclusive E-Summit Workshop
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="font-bold mb-6 tracking-tight leading-tight">
              <motion.span 
                className="block pb-6 text-6xl md:text-8xl font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #dc143c 0%, #dc143c 70%, #e6e6e6 85%, #dc143c 100%)",
                  backgroundSize: "250% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  textShadow: "0 0 6px rgba(220, 20, 60, 0.35), 0 0 12px rgba(220, 20, 60, 0.25)"
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "200% 50%"]
                }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              >
                {title}
              </motion.span>
              <span className="text-red-200 block text-3xl md:text-5xl mt-2">
                {tagline}
              </span>
              <span className="text-white/60 block text-lg mt-2">
                {subtitle}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 text-white mb-8">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/15 transition-colors">
                <Calendar className="h-5 w-5 text-red-400" />
                <span className="text-base font-semibold">{date}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/15 transition-colors">
                <Clock className="h-5 w-5 text-red-400" />
                <span className="text-base font-semibold">{time}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/15 transition-colors">
                <MapPin className="h-5 w-5 text-red-400" />
                <span className="text-base font-semibold">{venue}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-7 text-xl rounded-full shadow-xl shadow-red-900/20 hover:shadow-red-900/40 transition-all"
              onClick={() => {
                const element = document.getElementById('topics');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Curriculum
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-transparent to-red-950/80 pointer-events-none" />
    </div>
  );
}

function ProofSection({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-red-950 to-red-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Workshop Impact
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Practical skills to master startup finances and marketing strategies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-red-800/30 border-red-700/50 p-8 text-center hover:bg-red-800/40 transition-all backdrop-blur-sm">
                <div className="text-4xl md:text-5xl font-bold text-red-300 mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ topics, perks, activity }: { topics: string[], perks: string[], activity: string }) {
  const features = [
    {
      icon: PieChart,
      title: "Smart Pricing & Finance",
      description: "Learn financial basics, modeling, and pricing strategies for sustainable growth",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop",
    },
    {
      icon: Target,
      title: "Marketing Strategy",
      description: "Understand brand psychology, positioning, and building effective marketing funnels",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop",
    },
    {
      icon: TrendingUp,
      title: "Pitch-Ready Thinking",
      description: "Develop real-world strategies and learn to tell your brand story effectively",
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section id="topics" className="w-full py-20 bg-red-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Curriculum & Key Takeaways
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Comprehensive curriculum covering the financial and marketing pillars of business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="bg-red-800/30 border-red-700/50 overflow-hidden hover:bg-red-800/40 transition-all hover:-translate-y-1 h-full">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <feature.icon className="h-10 w-10 text-red-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">
                Curriculum Modules
              </h3>
              <div className="space-y-3">
                {topics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 bg-red-800/20 border border-red-700/30 rounded-lg p-4 hover:bg-red-800/30 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-white/90">{topic}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">
                Exclusive Perks
              </h3>
              <div className="space-y-3">
                {perks.map((perk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 bg-red-800/20 border border-red-700/30 rounded-lg p-4 hover:bg-red-800/30 transition-colors"
                  >
                    <Award className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <span className="text-white/90">{perk}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-900 to-red-800 rounded-xl p-8 border border-red-700/50 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Hands-on Activity</h3>
            <p className="text-xl text-red-200">{activity}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpeakersSection({ speakers }: { speakers: Speaker[] }) {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-red-900 to-red-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Meet Your Instructors
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Learn from industry veterans in finance and marketing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {speakers.map((speaker, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-red-800/30 border-red-700/50 p-6 text-center hover:bg-red-800/40 transition-all h-full backdrop-blur-sm">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-red-600">
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {speaker.name}
                </h3>
                <p className="text-red-300 text-sm mb-3">{speaker.role}</p>
                {speaker.bio && (
                  <p className="text-white/70 text-sm">{speaker.bio}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-20 bg-red-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Everything you need to know about the workshop
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card
                className={cn(
                  "bg-red-800/30 border-red-700/50 transition-all cursor-pointer backdrop-blur-sm",
                  openIndex === index && "bg-red-800/50 border-red-600/60"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-red-400" />
                  </motion.div>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6">
                      <p className="text-white/70">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FinanceMarketingPage() {
  const speakers: Speaker[] = [
    {
      name: "Priya Desai",
      role: "CFO, TechStartups",
      photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop",
      bio: "Expert in startup finance and fundraising strategies with 15+ years of experience.",
    },
    {
      name: "Amit Shah",
      role: "CMO, GrowthGenius",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop",
      bio: "Marketing veteran who has scaled multiple D2C brands to market leadership positions.",
    },
  ];

  const topics = [
    "Why brands win: psychology + positioning",
    "Marketing funnel basics",
    "Social media strategies",
    "Brand storytelling",
    "Smart pricing",
    "Financial basics",
    "Build a funnel",
    "Real-world marketing strategies",
    "Pitch-ready thinking",
  ];

  const perks = [
    "Certificate",
    "Financial model template",
    "Social media checklist",
    "Mentor networking",
    "Priority for competitions",
  ];

  const proofStats = [
    { label: "Workshop Duration", value: "3 Hours" },
    { label: "Hands-on Tools", value: "5+" },
    { label: "Case Studies", value: "10+" },
  ];

  const faqs = [
    {
      question: "Who is this workshop for?",
      answer: "This workshop is designed for aspiring entrepreneurs and students who want to build a strong foundation in financial management and marketing strategies for startups.",
    },
    {
      question: "What software will we use?",
      answer: "We will use tools like Microsoft Excel/Google Sheets for financial modeling and various digital marketing tools for strategy sessions.",
    },
    {
      question: "Do I need to bring my own laptop?",
      answer: "Yes, a laptop is required to participate in the hands-on financial modeling and marketing exercises.",
    },
    {
      question: "Will I get a certificate?",
      answer: "Yes, all participants who complete the workshop will receive a Certificate of Completion from E-Summit 2026.",
    },
    {
      question: "Is this included in the pass?",
      answer: "This workshop is included with Silicon and Quantum passes. Pixel pass holders may need to upgrade or register separately if spots are available.",
    },
  ];

  return (
    <div className="min-h-screen bg-red-950">
      <HeroSection
        title="Finance & Marketing"
        tagline="Master the Money. Build the Market."
        subtitle="Workshop 2026"
        date="January 23-24, 2026"
        time="10:00 AM - 1:00 PM"
        venue="Lab 524 & 525, TCET"
      />
      <ProofSection stats={proofStats} />
      <FeaturesSection 
        topics={topics} 
        perks={perks}
        activity="Build a mini business model + pricing + marketing plan → Pitch"
      />
      <SpeakersSection speakers={speakers} />
      <FAQSection faqs={faqs} />
    </div>
  );
}