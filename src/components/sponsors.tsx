import { motion } from "motion/react";
import { Linkedin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "./ui/button";
import { AuroraText } from "./magicui/aurora-text";
import { Particles } from "./magicui/particles";
import { GlassCard } from "./accentricity/glass-card";

export function Sponsors() {
  return (
    <div className="container relative mx-auto py-20 overflow-hidden">
      <Particles className="absolute inset-0 opacity-30" quantity={50} ease={60} />
      
      {/* Coming Soon Section */}
      <div className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center">
        <div className="max-w-4xl w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent px-4">
              Our Sponsors
            </h1>
            
            <AuroraText
              size="lg"
              colors={["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca"]}
              className="mb-8 px-4"
            >
              Will be announced soon
            </AuroraText>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              We're finalizing partnerships with industry-leading organizations
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-8 md:p-12">              
              <div className="text-center">
                <p className="text-xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>
                  Interested in partnering with E-Summit 2026?
                </p>
                <p className="text-sm mb-8" style={{ color: 'var(--foreground)' }}>
                  Contact our Sponsorship Team:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Yash Yadav</p>
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>Sponsorship Head</p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open('https://wa.me/918591134029', '_blank')}
                      >
                        <FaWhatsapp className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open('https://www.linkedin.com/in/yash-yadav-0b3975264/', '_blank')}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Niyatee Thakur</p>
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>OC - Marketing</p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open('https://wa.me/919892682981', '_blank')}
                      >
                        <FaWhatsapp className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open('https://www.linkedin.com/in/niyatee-thakur-b01445398/', '_blank')}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Rudransh Puthan</p>
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>JC - Operations</p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open('https://wa.me/918698555596', '_blank')}
                      >
                        <FaWhatsapp className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open('https://www.linkedin.com/in/rudransh-puthan-b5a1b9307/', '_blank')}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/*
========================================
FULL SPONSORS COMPONENT - UNCOMMENT WHEN READY
========================================

To activate the full sponsors page:
1. Uncomment the imports below
2. Uncomment the sponsors data arrays
3. Replace the entire "Coming Soon" return statement with the full UI at the bottom

STEP 1: Uncomment these imports
----------------------------------------
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BentoGrid, BentoCard } from "./magicui/bento-grid";
import { GlassCard } from "./accentricity/glass-card";


STEP 2: Sponsors Data - Add inside the Sponsors() function
----------------------------------------
const titleSponsors = [
  {
    name: "Company Name",
    logo: "/sponsors/title-sponsor.png",
    description: "Leading technology company",
    website: "https://company.com",
    tier: "Title Sponsor",
  },
];

const platinumSponsors = [
  {
    name: "Platinum Company 1",
    logo: "/sponsors/platinum1.png",
    description: "Industry leader in innovation",
    website: "https://platinum1.com",
    tier: "Platinum",
  },
  {
    name: "Platinum Company 2",
    logo: "/sponsors/platinum2.png",
    description: "Global tech solutions provider",
    website: "https://platinum2.com",
    tier: "Platinum",
  },
];

const goldSponsors = [
  {
    name: "Gold Company 1",
    logo: "/sponsors/gold1.png",
    description: "Innovation partner",
    website: "https://gold1.com",
    tier: "Gold",
  },
  {
    name: "Gold Company 2",
    logo: "/sponsors/gold2.png",
    description: "Technology partner",
    website: "https://gold2.com",
    tier: "Gold",
  },
  {
    name: "Gold Company 3",
    logo: "/sponsors/gold3.png",
    description: "Strategic partner",
    website: "https://gold3.com",
    tier: "Gold",
  },
];

const silverSponsors = [
  {
    name: "Silver Company 1",
    logo: "/sponsors/silver1.png",
    website: "https://silver1.com",
    tier: "Silver",
  },
  {
    name: "Silver Company 2",
    logo: "/sponsors/silver2.png",
    website: "https://silver2.com",
    tier: "Silver",
  },
  {
    name: "Silver Company 3",
    logo: "/sponsors/silver3.png",
    website: "https://silver3.com",
    tier: "Silver",
  },
  {
    name: "Silver Company 4",
    logo: "/sponsors/silver4.png",
    website: "https://silver4.com",
    tier: "Silver",
  },
];

const communityPartners = [
  {
    name: "Community Partner 1",
    logo: "/sponsors/community1.png",
    website: "https://community1.com",
  },
  {
    name: "Community Partner 2",
    logo: "/sponsors/community2.png",
    website: "https://community2.com",
  },
  {
    name: "Community Partner 3",
    logo: "/sponsors/community3.png",
    website: "https://community3.com",
  },
  {
    name: "Community Partner 4",
    logo: "/sponsors/community4.png",
    website: "https://community4.com",
  },
  {
    name: "Community Partner 5",
    logo: "/sponsors/community5.png",
    website: "https://community5.com",
  },
];


STEP 3: Full Sponsors UI - Replace the return statement
----------------------------------------
return (
  <div className="container mx-auto py-12">
    <div className="mb-12 text-center">
      <GradientText 
        from="from-red-600"
        to="to-red-400"
        className="text-4xl font-bold mb-4"
      >
        Our Sponsors
      </GradientText>
      <p className="text-xl text-muted-foreground">
        Partnering with industry leaders to make E-Summit 2026 possible
      </p>
    </div>

    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-8 grid w-full max-w-3xl mx-auto grid-cols-6">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="title">Title</TabsTrigger>
        <TabsTrigger value="platinum">Platinum</TabsTrigger>
        <TabsTrigger value="gold">Gold</TabsTrigger>
        <TabsTrigger value="silver">Silver</TabsTrigger>
        <TabsTrigger value="community">Partners</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        Title Sponsors Section
        {titleSponsors.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 text-center text-2xl font-bold">Title Sponsor</h2>
            <div className="flex justify-center">
              {titleSponsors.map((sponsor) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="max-w-2xl"
                >
                  <GlassCard>
                    <Card className="border-0 bg-transparent">
                      <CardContent className="p-8 text-center">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="mx-auto mb-4 h-32 object-contain"
                        />
                        <h3 className="mb-2 text-2xl">{sponsor.name}</h3>
                        <p className="mb-4 text-muted-foreground">{sponsor.description}</p>
                        <Badge className="mb-4">{sponsor.tier}</Badge>
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                          Visit Website <ExternalLink className="h-4 w-4" />
                        </a>
                      </CardContent>
                    </Card>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        Platinum Sponsors Section
        {platinumSponsors.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 text-center text-2xl font-bold">Platinum Sponsors</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {platinumSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard>
                    <Card className="border-0 bg-transparent">
                      <CardContent className="p-6 text-center">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="mx-auto mb-4 h-24 object-contain"
                        />
                        <h3 className="mb-2">{sponsor.name}</h3>
                        <p className="mb-3 text-sm text-muted-foreground">{sponsor.description}</p>
                        <Badge variant="secondary" className="mb-3">{sponsor.tier}</Badge>
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          Visit Website <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardContent>
                    </Card>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        Gold Sponsors Section
        {goldSponsors.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 text-center text-2xl font-bold">Gold Sponsors</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {goldSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6 text-center">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="mx-auto mb-3 h-20 object-contain"
                      />
                      <h4 className="mb-2">{sponsor.name}</h4>
                      <p className="mb-3 text-xs text-muted-foreground">{sponsor.description}</p>
                      <Badge variant="outline" className="mb-3 text-xs">{sponsor.tier}</Badge>
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Website <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        Silver Sponsors Section
        {silverSponsors.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 text-center text-2xl font-bold">Silver Sponsors</h2>
            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
              {silverSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4 text-center">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="mx-auto mb-2 h-16 object-contain"
                      />
                      <h4 className="mb-2 text-sm">{sponsor.name}</h4>
                      <Badge variant="outline" className="mb-2 text-xs">{sponsor.tier}</Badge>
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        Community Partners Section
        {communityPartners.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-6 text-center text-2xl font-bold">Community Partners</h2>
            <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-5">
              {communityPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                >
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card className="transition-transform hover:scale-105">
                      <CardContent className="p-4 text-center">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="mx-auto h-12 object-contain"
                        />
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      Individual Tabs for Each Sponsor Tier
      <TabsContent value="title">
        <div className="grid gap-6">
          {titleSponsors.map((sponsor) => (
            <GlassCard key={sponsor.name}>
              <Card className="border-0 bg-transparent">
                <CardContent className="p-8 text-center">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="mx-auto mb-4 h-32 object-contain"
                  />
                  <h3 className="mb-2 text-2xl">{sponsor.name}</h3>
                  <p className="mb-4 text-muted-foreground">{sponsor.description}</p>
                  <Badge className="mb-4">{sponsor.tier}</Badge>
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </GlassCard>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="platinum">
        <div className="grid gap-6 md:grid-cols-2">
          {platinumSponsors.map((sponsor) => (
            <GlassCard key={sponsor.name}>
              <Card className="border-0 bg-transparent">
                <CardContent className="p-6 text-center">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="mx-auto mb-4 h-24 object-contain"
                  />
                  <h3 className="mb-2">{sponsor.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{sponsor.description}</p>
                  <Badge variant="secondary" className="mb-3">{sponsor.tier}</Badge>
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Visit Website <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            </GlassCard>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="gold">
        <div className="grid gap-6 md:grid-cols-3">
          {goldSponsors.map((sponsor) => (
            <Card key={sponsor.name}>
              <CardContent className="p-6 text-center">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="mx-auto mb-3 h-20 object-contain"
                />
                <h4 className="mb-2">{sponsor.name}</h4>
                <p className="mb-3 text-xs text-muted-foreground">{sponsor.description}</p>
                <Badge variant="outline" className="mb-3 text-xs">{sponsor.tier}</Badge>
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Website <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="silver">
        <div className="grid gap-4 md:grid-cols-4">
          {silverSponsors.map((sponsor) => (
            <Card key={sponsor.name}>
              <CardContent className="p-4 text-center">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="mx-auto mb-2 h-16 object-contain"
                />
                <h4 className="mb-2 text-sm">{sponsor.name}</h4>
                <Badge variant="outline" className="mb-2 text-xs">{sponsor.tier}</Badge>
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="community">
        <div className="grid gap-4 md:grid-cols-5">
          {communityPartners.map((partner) => (
            <a
              key={partner.name}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="transition-transform hover:scale-105">
                <CardContent className="p-4 text-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="mx-auto h-12 object-contain"
                  />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </TabsContent>
    </Tabs>

    Sponsorship CTA Section
    <div className="mt-16 text-center">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-8">
          <h3 className="mb-4 text-2xl font-bold">Become a Sponsor</h3>
          <p className="mb-6 text-muted-foreground">
            Partner with us to reach thousands of aspiring entrepreneurs, students, and industry professionals.
          </p>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Email:</strong>{" "}
              <a href="mailto:sponsors@esummit2026.com" className="text-primary hover:underline">
                sponsors@esummit2026.com
              </a>
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> +91 98765 43220
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

========================================
END OF COMMENTED SPONSORS COMPONENT
========================================
*/
