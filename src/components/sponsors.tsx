import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Marquee } from "./magicui/marquee";
import { motion } from "motion/react";
import { AnimatedBorder } from "./magicui/animated-border";

export function Sponsors() {
  const sponsorTiers = [
    {
      tier: "Title Sponsor",
      sponsors: [
        {
          name: "TechCorp Global",
          logo: "TC",
          description: "Leading technology company powering innovation worldwide",
          website: "techcorp.com",
          contribution: "Main sponsor supporting all major events",
        },
      ],
    },
    {
      tier: "Powered By Sponsor",
      sponsors: [
        {
          name: "InnovateTech",
          logo: "IT",
          description: "Digital transformation and cloud solutions",
          website: "innovatetech.com",
          contribution: "Technology infrastructure partner",
        },
      ],
    },
    {
      tier: "Associate Sponsors",
      sponsors: [
        {
          name: "StartupHub",
          logo: "SH",
          description: "India's largest startup community platform",
          website: "startuphub.com",
          contribution: "Networking and community support",
        },
        {
          name: "VentureCapital Partners",
          logo: "VC",
          description: "Leading VC firm investing in early-stage startups",
          website: "vcpartners.com",
          contribution: "Funding and mentorship opportunities",
        },
        {
          name: "GlobalBank",
          logo: "GB",
          description: "Banking and financial services",
          website: "globalbank.com",
          contribution: "Financial services partner",
        },
      ],
    },
    {
      tier: "Event Sponsors",
      sponsors: [
        {
          name: "CodersHub",
          logo: "CH",
          description: "Developer community and learning platform",
          website: "codershub.com",
          event: "Hackathon Sponsor",
        },
        {
          name: "MarketGrowth",
          logo: "MG",
          description: "Digital marketing and growth solutions",
          website: "marketgrowth.com",
          event: "Workshop Sponsor",
        },
        {
          name: "DesignStudio",
          logo: "DS",
          description: "UI/UX and product design agency",
          website: "designstudio.com",
          event: "Design Workshop Sponsor",
        },
        {
          name: "FinanceGuru",
          logo: "FG",
          description: "Financial planning and advisory services",
          website: "financeguru.com",
          event: "Finance Workshop Sponsor",
        },
      ],
    },
    {
      tier: "Media Partners",
      sponsors: [
        {
          name: "TechNews Daily",
          logo: "TN",
          description: "Leading tech news and media platform",
          website: "technews.com",
        },
        {
          name: "Startup Times",
          logo: "ST",
          description: "Startup ecosystem news and stories",
          website: "startuptimes.com",
        },
        {
          name: "Business Today",
          logo: "BT",
          description: "Business news and insights",
          website: "businesstoday.com",
        },
        {
          name: "Innovation Weekly",
          logo: "IW",
          description: "Weekly innovation and technology magazine",
          website: "innovationweekly.com",
        },
      ],
    },
    {
      tier: "Community Partners",
      sponsors: [
        {
          name: "E-Cell Network",
          logo: "EC",
          description: "National network of entrepreneurship cells",
          website: "ecell.network",
        },
        {
          name: "Women in Tech",
          logo: "WT",
          description: "Supporting women entrepreneurs in technology",
          website: "womenintech.org",
        },
        {
          name: "Student Entrepreneurs Club",
          logo: "SE",
          description: "Fostering student entrepreneurship",
          website: "studentent.org",
        },
      ],
    },
  ];

  const getTierStyles = (tier: string) => {
    switch (tier) {
      case "Title Sponsor":
        return { size: "lg", badge: "default" };
      case "Powered By Sponsor":
        return { size: "lg", badge: "default" };
      case "Associate Sponsors":
        return { size: "md", badge: "secondary" };
      case "Event Sponsors":
        return { size: "sm", badge: "secondary" };
      default:
        return { size: "sm", badge: "outline" };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          Our Sponsors & Partners
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-muted-foreground"
        >
          E-Summit 2026 is made possible by the generous support of our sponsors and partners who believe in fostering entrepreneurship
        </motion.p>
      </div>
      
      {/* Marquee Section for Media Partners */}
      <div className="mb-16 overflow-hidden rounded-lg border bg-card p-8">
        <h2 className="mb-6 text-center">Media Partners Showcase</h2>
        <Marquee pauseOnHover speed="slow" className="py-4">
          <div className="flex gap-8">
            {sponsorTiers
              .find((tier) => tier.tier === "Media Partners")
              ?.sponsors.map((sponsor) => (
                <div
                  key={sponsor.name}
                  className="flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg border bg-background px-6"
                >
                  <div className="text-2xl text-primary">{sponsor.logo}</div>
                </div>
              ))}
          </div>
        </Marquee>
        <Marquee reverse pauseOnHover speed="slow" className="py-4">
          <div className="flex gap-8">
            {sponsorTiers
              .find((tier) => tier.tier === "Community Partners")
              ?.sponsors.map((sponsor) => (
                <div
                  key={sponsor.name}
                  className="flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg border bg-background px-6"
                >
                  <div className="text-2xl text-primary">{sponsor.logo}</div>
                </div>
              ))}
          </div>
        </Marquee>
      </div>

      <div className="space-y-12">
        {sponsorTiers.map((tierGroup) => {
          const styles = getTierStyles(tierGroup.tier);
          const isLargeTier = tierGroup.tier === "Title Sponsor" || tierGroup.tier === "Powered By Sponsor";
          
          return (
            <div key={tierGroup.tier}>
              <div className="mb-6 text-center">
                <Badge variant={styles.badge as any} className="mb-2">
                  {tierGroup.tier}
                </Badge>
              </div>

              <div className={`grid gap-6 ${
                isLargeTier 
                  ? "md:grid-cols-1" 
                  : tierGroup.tier === "Associate Sponsors" 
                  ? "md:grid-cols-2 lg:grid-cols-3" 
                  : "md:grid-cols-2 lg:grid-cols-4"
              }`}>
                {tierGroup.sponsors.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full transition-shadow hover:shadow-lg">
                      <CardContent className={`p-6 text-center ${isLargeTier ? "p-8" : ""}`}>
                      {/* Logo placeholder */}
                      <div className={`mx-auto mb-4 flex items-center justify-center rounded-lg bg-primary text-primary-foreground ${
                        isLargeTier ? "h-32 w-32 text-3xl" : "h-20 w-20 text-xl"
                      }`}>
                        {sponsor.logo}
                      </div>
                      
                      <h3 className={isLargeTier ? "mb-3" : "mb-2"}>
                        {sponsor.name}
                      </h3>
                      
                      <p className="mb-4 text-sm text-muted-foreground">
                        {sponsor.description}
                      </p>

                      {sponsor.contribution && (
                        <p className="mb-4 text-sm text-primary">
                          {sponsor.contribution}
                        </p>
                      )}

                      {sponsor.event && (
                        <Badge variant="secondary" className="mb-4">
                          {sponsor.event}
                        </Badge>
                      )}

                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </Button>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Become a Sponsor */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <AnimatedBorder className="mt-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4">Become a Sponsor</h2>
              <p className="mb-8 text-muted-foreground">
                Partner with E-Summit 2026 and showcase your brand to 5000+ students, entrepreneurs, and investors
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg">Download Sponsorship Brochure</Button>
                <Button size="lg" variant="outline">
                  Contact Sponsorship Team
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Email: sponsors@esummit2026.com | Phone: +91 98765 43210
              </p>
            </CardContent>
          </Card>
        </AnimatedBorder>
      </motion.div>
    </div>
  );
}