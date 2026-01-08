import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { RippleBackground } from "./accentricity/ripple-background";
import { AuroraText } from "./magicui/aurora-text";

export function Sponsors() {
  // Sponsor Categories
  const sponsorCategories = [
    {
      title: "Food Sponsors",
      sponsors: [
        {
          name: "Mad Over Donuts",
          logo: "/assets/sponsors/mod.png",
          tier: "FOOD PARTNER",
          website: "https://madoverdonuts.com/"
        },
        {
          name: "99Pancakes",
          logo: "/assets/sponsors/99pancakes.png",
          tier: "FOOD PARTNER",
          website: "https://99pancakes.in/"
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
      <div className="relative mb-12">
        <RippleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <h1 className="mb-4 text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Sponsors & Partners
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Partnering with E-Summit 2026 to drive innovation and entrepreneurship
          </p>
        </motion.div>
      </div>

        {/* Sponsor Categories */}
        <div className="space-y-20">
          {sponsorCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="space-y-8"
            >
              <div className="relative mb-4 md:mb-6 py-4 text-center">
                <AuroraText 
                  size="sm" 
                  colors={["#a855f7", "#ec4899", "#3b82f6", "#8b5cf6", "#d946ef"]}
                  className="tracking-[0.15em] md:tracking-[0.25em] uppercase font-light"
                >
                  {category.title}
                </AuroraText>
              </div>

              <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                {category.sponsors.map((sponsor, sponsorIndex) => (
                  <motion.a
                    key={sponsor.name}
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: sponsorIndex * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="block group w-80"
                  >
                    <Card className="h-full border border-border/50 hover:border-border transition-all duration-300 hover:shadow-xl bg-card">
                      <CardContent className="p-8 flex flex-col items-center justify-center text-center h-[320px]">
                        <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                          {sponsor.logo.endsWith('.png') || sponsor.logo.endsWith('.jpg') || sponsor.logo.endsWith('.svg') ? (
                            <img 
                              src={sponsor.logo} 
                              alt={sponsor.name}
                              className="h-32 w-auto object-contain max-w-full"
                            />
                          ) : (
                            <div className="text-7xl">{sponsor.logo}</div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          {sponsor.name}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {sponsor.tier}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.a>
                ))}
              </div>
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
              Sponsorships & Brands
            </h2>
            <p className="text-foreground text-lg">
              For any Sponsorship and Brand Partnership Queries
            </p>
            <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Yash Yadav",
                role: "Sponsorship Head",
                image: "/assets/team/yash.png",
                whatsapp: "918591134029",
                linkedin: "https://www.linkedin.com/in/yash-yadav-0b3975264/"
              },
              {
                name: "Niyatee Thakur",
                role: "OC - Marketing",
                image: "/assets/team/niyatee.png",
                whatsapp: "919892682981",
                linkedin: "https://www.linkedin.com/in/niyatee-thakur-b01445398/"
              },
              {
                name: "Rudransh Atul Puthan",
                role: "JC - Operations",
                image: "/assets/team/rudransh.png",
                whatsapp: "918698555596",
                linkedin: "https://www.linkedin.com/in/rudransh-puthan-b5a1b9307/"
              }
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
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(`https://wa.me/${contact.whatsapp}`, '_blank');
                        }}
                      >
                        <FaWhatsapp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(contact.linkedin, '_blank');
                        }}
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
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