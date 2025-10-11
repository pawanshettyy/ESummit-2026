import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

// Magic UI Components
import { Particles } from "./magicui/particles";
import { TextReveal, WordReveal } from "./magicui/text-reveal";
import { GradientText } from "./magicui/gradient-text";
import { Spotlight } from "./magicui/spotlight";
import { Meteors } from "./magicui/meteors";
import { AnimatedBorder } from "./magicui/animated-border";
import { Marquee } from "./magicui/marquee";
import { BentoGrid, BentoCard } from "./magicui/bento-grid";
import { ShineBorder } from "./magicui/shine-border";
import { AnimatedBeam } from "./magicui/animated-beam";

// Accentricity UI Components
import { FloatingCard } from "./accentricity/floating-card";
import { GlowCard } from "./accentricity/glow-card";
import { GlassCard } from "./accentricity/glass-card";
import { ShimmerButton } from "./accentricity/shimmer-button";
import { AnimatedGradient } from "./accentricity/animated-gradient";
import { PulseDot } from "./accentricity/pulse-dot";
import { RippleBackground } from "./accentricity/ripple-background";
import { NeonText } from "./accentricity/neon-text";
import { Card3D } from "./accentricity/card-3d";
import { HoverGlow } from "./accentricity/hover-glow";

export function UIShowcase() {
  const [activeTab, setActiveTab] = useState("magic");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4">
          <GradientText>UI Components Showcase</GradientText>
        </h1>
        <p className="text-muted-foreground">
          Explore all Magic UI and Accentricity UI components used in E-Summit 2026
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="magic">Magic UI</TabsTrigger>
          <TabsTrigger value="accentricity">Accentricity UI</TabsTrigger>
        </TabsList>

        {/* Magic UI Components */}
        <TabsContent value="magic" className="space-y-8">
          {/* Particles */}
          <Card>
            <CardHeader>
              <h2>Particles</h2>
              <p className="text-sm text-muted-foreground">
                Animated particle background effect
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 overflow-hidden rounded-lg border bg-background">
                <Particles className="absolute inset-0" quantity={50} />
                <div className="relative z-10 flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Particle effect in background</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Text Effects */}
          <Card>
            <CardHeader>
              <h2>Text Animations</h2>
              <p className="text-sm text-muted-foreground">
                TextReveal, WordReveal, and GradientText
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextReveal>
                <p>This text fades in smoothly</p>
              </TextReveal>
              <WordReveal text="These words appear one by one" />
              <GradientText>Gradient text effect</GradientText>
            </CardContent>
          </Card>

          {/* Meteors */}
          <Card>
            <CardHeader>
              <h2>Meteors</h2>
              <p className="text-sm text-muted-foreground">Falling meteor animation</p>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 overflow-hidden rounded-lg border bg-background">
                <Meteors number={10} />
                <div className="relative z-10 flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Watch the meteors fall</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animated Border */}
          <Card>
            <CardHeader>
              <h2>Animated Border</h2>
              <p className="text-sm text-muted-foreground">Pulsing border effect</p>
            </CardHeader>
            <CardContent className="flex gap-4">
              <AnimatedBorder>
                <Button>Hover Me</Button>
              </AnimatedBorder>
            </CardContent>
          </Card>

          {/* Marquee */}
          <Card>
            <CardHeader>
              <h2>Marquee</h2>
              <p className="text-sm text-muted-foreground">Infinite scrolling effect</p>
            </CardHeader>
            <CardContent>
              <Marquee pauseOnHover speed="normal">
                <div className="flex gap-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg border bg-card"
                    >
                      Item {i + 1}
                    </div>
                  ))}
                </div>
              </Marquee>
            </CardContent>
          </Card>

          {/* Bento Grid */}
          <Card>
            <CardHeader>
              <h2>Bento Grid</h2>
              <p className="text-sm text-muted-foreground">Modern grid layout</p>
            </CardHeader>
            <CardContent>
              <BentoGrid>
                <BentoCard span="2">
                  <CardContent className="p-6">Large Card (span 2)</CardContent>
                </BentoCard>
                <BentoCard span="1">
                  <CardContent className="p-6">Small Card</CardContent>
                </BentoCard>
                <BentoCard span="1">
                  <CardContent className="p-6">Small Card</CardContent>
                </BentoCard>
                <BentoCard span="2">
                  <CardContent className="p-6">Large Card (span 2)</CardContent>
                </BentoCard>
              </BentoGrid>
            </CardContent>
          </Card>

          {/* Shine Border */}
          <Card>
            <CardHeader>
              <h2>Shine Border</h2>
              <p className="text-sm text-muted-foreground">Shimmering border animation</p>
            </CardHeader>
            <CardContent>
              <ShineBorder color="red">
                <Card>
                  <CardContent className="p-6">
                    <p>Card with shining border</p>
                  </CardContent>
                </Card>
              </ShineBorder>
            </CardContent>
          </Card>

          {/* Animated Beam */}
          <Card>
            <CardHeader>
              <h2>Animated Beam</h2>
              <p className="text-sm text-muted-foreground">Animated line effect</p>
            </CardHeader>
            <CardContent>
              <div className="relative h-20 rounded-lg border bg-background">
                <AnimatedBeam className="absolute bottom-0 left-0" duration={2} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accentricity UI Components */}
        <TabsContent value="accentricity" className="space-y-8">
          {/* Floating Card */}
          <Card>
            <CardHeader>
              <h2>Floating Card</h2>
              <p className="text-sm text-muted-foreground">
                Card with floating hover animation
              </p>
            </CardHeader>
            <CardContent>
              <FloatingCard>
                <Card>
                  <CardContent className="p-6">
                    <p>Hover to see float effect</p>
                  </CardContent>
                </Card>
              </FloatingCard>
            </CardContent>
          </Card>

          {/* Glow Card */}
          <Card>
            <CardHeader>
              <h2>Glow Card</h2>
              <p className="text-sm text-muted-foreground">Card with glowing border</p>
            </CardHeader>
            <CardContent>
              <GlowCard>
                <Card>
                  <CardContent className="p-6">
                    <p>Hover to see glow effect</p>
                  </CardContent>
                </Card>
              </GlowCard>
            </CardContent>
          </Card>

          {/* Glass Card */}
          <Card>
            <CardHeader>
              <h2>Glass Card</h2>
              <p className="text-sm text-muted-foreground">Glassmorphic design</p>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                <GlassCard blur="lg">
                  <Card className="border-0 bg-transparent">
                    <CardContent className="p-6">
                      <p>Glass effect card</p>
                    </CardContent>
                  </Card>
                </GlassCard>
              </div>
            </CardContent>
          </Card>

          {/* Shimmer Button */}
          <Card>
            <CardHeader>
              <h2>Shimmer Button</h2>
              <p className="text-sm text-muted-foreground">Button with shimmer effect</p>
            </CardHeader>
            <CardContent className="flex gap-4">
              <ShimmerButton>Shimmer Button</ShimmerButton>
            </CardContent>
          </Card>

          {/* Animated Gradient */}
          <Card>
            <CardHeader>
              <h2>Animated Gradient</h2>
              <p className="text-sm text-muted-foreground">Animated gradient background</p>
            </CardHeader>
            <CardContent>
              <AnimatedGradient className="rounded-lg p-8">
                <p className="text-center">Content with animated gradient background</p>
              </AnimatedGradient>
            </CardContent>
          </Card>

          {/* Pulse Dot */}
          <Card>
            <CardHeader>
              <h2>Pulse Dot</h2>
              <p className="text-sm text-muted-foreground">Pulsing indicator dots</p>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <PulseDot size="sm" />
                <span className="text-sm">Small</span>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot size="md" />
                <span className="text-sm">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot size="lg" />
                <span className="text-sm">Large</span>
              </div>
            </CardContent>
          </Card>

          {/* Ripple Background */}
          <Card>
            <CardHeader>
              <h2>Ripple Background</h2>
              <p className="text-sm text-muted-foreground">Animated blob background</p>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 overflow-hidden rounded-lg border">
                <RippleBackground />
                <div className="relative z-10 flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Animated blobs in background</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Neon Text */}
          <Card>
            <CardHeader>
              <h2>Neon Text</h2>
              <p className="text-sm text-muted-foreground">Text with neon glow</p>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-black p-8 text-center">
                <NeonText color="#dc2626">
                  <span className="text-3xl">Neon Glow Text</span>
                </NeonText>
              </div>
            </CardContent>
          </Card>

          {/* 3D Card */}
          <Card>
            <CardHeader>
              <h2>3D Card</h2>
              <p className="text-sm text-muted-foreground">Card with 3D tilt effect</p>
            </CardHeader>
            <CardContent>
              <Card3D>
                <Card>
                  <CardContent className="p-8 text-center">
                    <p>Move your mouse over me</p>
                  </CardContent>
                </Card>
              </Card3D>
            </CardContent>
          </Card>

          {/* Hover Glow */}
          <Card>
            <CardHeader>
              <h2>Hover Glow</h2>
              <p className="text-sm text-muted-foreground">Cursor-following glow effect</p>
            </CardHeader>
            <CardContent>
              <HoverGlow glowColor="#dc2626">
                <Card>
                  <CardContent className="p-8 text-center">
                    <p>Move your cursor over this card</p>
                  </CardContent>
                </Card>
              </HoverGlow>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Combination Example */}
      <Card className="mt-12">
        <CardHeader>
          <h2>Combined Effect Example</h2>
          <p className="text-sm text-muted-foreground">
            Multiple components working together
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-background via-background to-secondary p-12">
            <Particles className="absolute inset-0" quantity={30} />
            <Spotlight />
            <div className="absolute inset-0">
              <Meteors number={5} />
            </div>
            
            <div className="relative z-10 text-center">
              <TextReveal>
                <h2 className="mb-4">
                  <GradientText>Amazing Components</GradientText>
                </h2>
              </TextReveal>
              
              <WordReveal 
                text="Create stunning interfaces with these effects" 
                className="mb-6 text-muted-foreground"
              />
              
              <div className="flex justify-center gap-4">
                <AnimatedBorder>
                  <ShimmerButton>
                    Get Started
                  </ShimmerButton>
                </AnimatedBorder>
                
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-12 text-center">
        <Badge variant="secondary" className="mb-2">
          💡 Pro Tip
        </Badge>
        <p className="text-sm text-muted-foreground">
          See UI_COMPONENTS_GUIDE.md for detailed usage instructions and best practices
        </p>
      </div>
    </div>
  );
}
