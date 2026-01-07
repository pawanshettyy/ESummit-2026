import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Check,
  Info,
  Ticket,
  LogIn,
  AlertCircle,
  Download,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { motion } from "motion/react";
import { GlowCard } from "./accentricity/glow-card";
import { GlassCard } from "./accentricity/glass-card";
import { API_BASE_URL } from "../lib/api";
import { KonfHubWidget } from "./konfhub-widget";
import { savePurchasedPass } from "../utils/pass-events";
import { PulseDot } from "./accentricity/pulse-dot";

interface PassBookingProps {
  isAuthenticated: boolean;
  userData: { name: string; email: string } | null;
  onNavigate: (page: string) => void;
  onRequestAuth: () => void;
}

export function PassBooking({
  isAuthenticated,
  userData,
  onNavigate,
  onRequestAuth,
}: PassBookingProps) {
  const { user } = useUser();
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showKonfHubWidget, setShowKonfHubWidget] = useState(false);
  const [hasExistingPass, setHasExistingPass] = useState(false);
  const [isCheckingPass, setIsCheckingPass] = useState(false);

  // Check if user is a Thakur student (TCET, TGBS, TIMSR)
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const isThakurStudent = userEmail.toLowerCase().endsWith("@tcetmumbai.in") || 
                          userEmail.toLowerCase().endsWith("@tgbs.in") || 
                          userEmail.toLowerCase().endsWith("@timsr.edu.in");

  // KonfHub ticket ID mapping for each pass
  const passTicketIds: Record<string, string> = {
    pixel: "70906",
    silicon: "70907",
    quantum: "70908",
    exhibitors: "70909",
    tcet_student: "", // Thakur Student Pass - uses standard widget without specific ticket ID
  };

  // Check if user already has a pass
  useEffect(() => {
    const checkExistingPass = async () => {
      if (!user?.id) return;

      setIsCheckingPass(true);
      try {
        const passResponse = await fetch(
          `${API_BASE_URL}/passes/user/${user.id}`
        );
        const passData = await passResponse.json();

        if (passData.success && passData.data.passes && passData.data.passes.length > 0) {
          setHasExistingPass(true);
          toast.info("You already have a pass", {
            description: "Check your dashboard to view your pass.",
          });
        }
      } catch (error) {
        console.error("Error checking existing pass:", error);
      } finally {
        setIsCheckingPass(false);
      }
    };

    if (user?.id) {
      checkExistingPass();
    }
  }, [user]);

  const passes = [
    {
      id: "pixel",
      name: "Pixel Pass",
      price: 0,
      earlyBirdPrice: 0,
      originalPrice: 299,
      features: [
        "Startup Expo",
        "Panel Discussion",
        "IPL Auction",
        "AI Build-A-Thon",
        "Biz-Arena League",
        "Certificate of participation",
      ],
      badge: "Free",
      description: undefined,
    },
    {
      id: "silicon",
      name: "Silicon Pass",
      price: 499,
      originalPrice: 799,
      features: [
        "All Pixel Pass events",
        "Pitch Arena",
        "Startup Youth Conclave",
        "All 3 Workshops",
        "Informals (Networking Arena)",
        "Certificate of participation",
      ],
      badge: "Popular",
      recommended: true,
      description: undefined,
    },
    {
      id: "quantum",
      name: "Quantum Pass",
      price: 999,
      originalPrice: 1299,
      features: [
        "All Silicon Pass events",
        "The Ten Minute Deal",
        "The Angel Investor's Roundtable",
        "Incubator Summit",
        "Internship Fair",
        "Premium networking sessions",
        "Priority access to all events",
        "Certificate of participation",
      ],
      badge: "Best Value",
      description: undefined,
    },
    {
      id: "exhibitors",
      name: "Exhibitors Pass",
      price: 1299,
      originalPrice: 1999,
      features: [
        "Opportunity to showcase your startup/business/company",
        "Dedicated booth in Startup Expo",
        "Participation in Internship Fair",
        "Partnering with TCET",
        "Access to networking sessions",
        "Certificate of participation",
      ],
      badge: "Exhibitor",
      description: "Perfect for startups and companies looking to showcase their products/services",
    },
  ];

  // Add Thakur Student Pass for eligible students
  const thakurStudentPass = {
    id: "thakur_student",
    name: "Thakur Student Pass",
    price: 0,
    earlyBirdPrice: 0,
    originalPrice: 1299,
    features: [
      "All Quantum Pass events",
      "The Ten Minute Deal",
      "The Angel Investor's Roundtable",
      "Incubator Summit",
      "Internship Fair",
      "Premium networking sessions",
      "Priority access to all events",
      "Certificate of participation",
    ],
    badge: "Thakur Students",
    description: "Exclusive free pass for TCET, TGBS, and TIMSR students",
    isThakurPass: true,
  };

  const displayPasses = isThakurStudent 
    ? [passes.find(p => p.id === "exhibitors")!, thakurStudentPass] 
    : passes;

  const handlePassSelect = (passId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setSelectedPass(passId);
      setShowAuthDialog(true);
      return;
    }

    // Check if user already has a pass
    if (hasExistingPass) {
      toast.error("You already have a pass", {
        description: "Only one pass per user is allowed. Check your dashboard.",
      });
      return;
    }

    // Set selected pass and open KonfHub widget directly
    setSelectedPass(passId);
    setShowKonfHubWidget(true);
  };

  const handleKonfHubSuccess = async (data: any) => {
    // KonfHub purchase completed successfully
    setIsProcessingPayment(true);
    
    try {
      const clerkUserId = user?.id;
      const selectedPassData = passes.find((p) => p.id === selectedPass);
      
      const requestBody = {
        clerkUserId: clerkUserId,
        passType: selectedPassData?.name || "Standard Pass",
        price: selectedPassData?.price || 0,
        hasMeals: false,
        hasMerchandise: false,
        hasWorkshopAccess: false,
        konfhubData: data,
      };
      
      const response = await fetch(`${API_BASE_URL}/passes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Failed to create pass: ${errorText}`);
        setIsProcessingPayment(false);
        return;
      }

      const result = await response.json();

      if (result.success && result.data.pass) {
        const createdPass = result.data.pass;
        const selectedPassData = passes.find((p) => p.id === selectedPass);
        const passData = {
          id: selectedPassData?.id || "",
          type: selectedPassData?.name || "",
          passId: createdPass.passId,
          price: selectedPassData?.price || 0,
          purchaseDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: "Active",
        };
        savePurchasedPass(passData);

        toast.success("Pass purchased successfully!", {
          description: "Redirecting to your dashboard...",
        });
        setShowKonfHubWidget(false);
        setIsProcessingPayment(false);
        
        setTimeout(() => {
          onNavigate("dashboard");
        }, 1500);
      } else {
        toast.error("⚠️ Couldn't create your pass. Please try again or contact support if the issue continues.");
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Pass creation error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "⚠️ Pass creation failed. Please refresh and try again, or contact support for assistance."
      );
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Existing pass notification */}
      {hasExistingPass && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-black dark:text-amber-100">
              <strong>You already have a pass!</strong>
              <p className="mt-1 text-sm">
                Only one pass per user is allowed. Visit your{" "}
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="font-semibold underline underline-offset-2 hover:text-amber-700"
                >
                  dashboard
                </button>{" "}
                to view your existing pass and QR code.
              </p>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Pass Selection */}
      <div>
        {/* Show loading state while checking for existing pass */}
        {isCheckingPass && (
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Checking your account...</p>
          </div>
        )}
        
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl md:text-5xl lg:text-6xl"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Choose Your Pass
            </motion.h1>
            <p className="mx-auto mb-6 max-w-2xl text-base sm:text-lg text-muted-foreground px-4">
              Select the perfect pass for your E-Summit experience and unlock exclusive access to premium events
            </p>
            <div className="mx-auto mb-6 max-w-4xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Alert className="border-primary/20 bg-primary/5 text-center h-full">
                    <Info className="mx-auto h-4 w-4 text-primary" />
                    <AlertDescription className="text-center text-sm text-primary/80">
                      <strong>Pass upgrades available!</strong> You can upgrade your pass at the venue during check-in for additional benefits.
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="flex-1">
                  <a 
                    href="https://drive.google.com/file/d/1ORodqG9xSgSKKYi-nwIP4xxhXCvHEXRc/view?usp=sharing" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 text-center h-full cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                      <div className="flex items-center gap-2 justify-center mb-1">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <AlertDescription className="text-center text-blue-600 dark:text-blue-400">
                        <p className="text-sm font-bold">Click to open Brochure</p>
                        <p className="text-xs mt-1">Learn more about E-Summit 2026</p>
                      </AlertDescription>
                    </Alert>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

          <div className={`mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 ${isThakurStudent ? 'lg:grid-cols-2 max-w-4xl mx-auto' : 'lg:grid-cols-4'}`}>
            {displayPasses.map((pass, index) => (
              <motion.div
                key={pass.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                {pass.recommended ? (
                  <GlowCard>
                    <Card
                      className={`relative transition-all hover:shadow-lg border-primary h-full`}
                    >
                      {pass.badge && (
                        <div className="absolute -top-3 left-4 flex items-center gap-1">
                          <PulseDot size="sm" />
                          <Badge className="bg-primary">
                            {pass.badge}
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3>{pass.name}</h3>
                            <div className="mt-2 flex items-baseline gap-2">
                              {pass.price === 0 ? (
                                <>
                                  <span className="text-3xl font-bold text-primary">
                                    FREE
                                  </span>
                                  <span className="text-sm text-muted-foreground line-through">
                                    ₹{pass.originalPrice}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl font-bold text-green-600">
                                        ₹{pass.earlyBirdPrice || pass.price}
                                      </span>
                                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                        Early Bird
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-sm text-muted-foreground line-through">
                                        ₹{pass.originalPrice}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <motion.div
                            whileHover={{
                              rotate: 360,
                              scale: 1.2,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <Ticket className="h-8 w-8 text-primary" />
                          </motion.div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="mb-6 space-y-2">
                          {pass.features.map((feature, idx) => (
                            <motion.li
                              key={feature}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.3 + idx * 0.1,
                              }}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              <span>{feature}</span>
                            </motion.li>
                          ))}
                        </ul>                        {pass.description && (
                          <Alert className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              {pass.description}
                            </AlertDescription>
                          </Alert>
                        )}                        {hasExistingPass ? (
                          <Button
                            className="w-full"
                            disabled
                          >
                            Pass Already Purchased
                          </Button>
                        ) : pass.isThakurPass ? (
                          <Button
                            className="w-full"
                            onClick={() => onNavigate("dashboard")}
                          >
                            Get From Dashboard →
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={() => handlePassSelect(pass.id)}
                          >
                            Select This Pass
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </GlowCard>
                ) : (
                  <GlassCard className="h-full">
                    <Card className="relative border-0 bg-transparent h-full">
                      {pass.badge && (
                        <Badge className="absolute -top-3 left-4 bg-primary">
                          {pass.badge}
                        </Badge>
                      )}
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3>{pass.name}</h3>
                            <div className="mt-2 flex items-baseline gap-2">
                              {pass.price === 0 ? (
                                <>
                                  <span className="text-3xl font-bold text-primary">
                                    FREE
                                  </span>
                                  <span className="text-sm text-muted-foreground line-through">
                                    ₹{pass.originalPrice}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl font-bold text-green-600">
                                        ₹{pass.earlyBirdPrice || pass.price}
                                      </span>
                                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                        Early Bird
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-sm text-muted-foreground line-through">
                                        ₹{pass.originalPrice}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <Ticket className="h-8 w-8 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="mb-6 space-y-2">
                          {pass.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {pass.description && (
                          <Alert className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              {pass.description}
                            </AlertDescription>
                          </Alert>
                        )}
                        {hasExistingPass ? (
                          <Button
                            className="w-full"
                            variant="outline"
                            disabled
                          >
                            Pass Already Purchased
                          </Button>
                        ) : pass.isThakurPass ? (
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => onNavigate("dashboard")}
                          >
                            Get From Dashboard →
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => handlePassSelect(pass.id)}
                          >
                            Select This Pass
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </GlassCard>
                )}
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <Card className="overflow-hidden">
            <CardHeader>
              <h2>Compare Passes</h2>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-4 text-left">Feature</th>
                    {[...passes.filter(p => p.id !== "exhibitors"), ...(isThakurStudent ? [thakurStudentPass] : [])].map((pass) => (
                      <th
                        key={pass.id}
                        className="p-4 text-center"
                      >
                        {pass.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Startup Expo", included: ["pixel", "silicon", "quantum", "thakur_student"] },
                    { name: "Panel Discussion", included: ["pixel", "silicon", "quantum", "thakur_student"] },
                    { name: "IPL Auction", included: ["pixel", "silicon", "quantum", "thakur_student"] },
                    { name: "AI Build-A-Thon", included: ["pixel", "silicon", "quantum", "thakur_student"] },
                    { name: "Biz-Arena League", included: ["pixel", "silicon", "quantum", "thakur_student"] },
                    { name: "Pitch Arena", included: ["silicon", "quantum", "thakur_student"] },
                    { name: "Startup Youth Conclave", included: ["silicon", "quantum", "thakur_student"] },
                    { name: "All 3 Workshops", included: ["silicon", "quantum", "thakur_student"] },
                    { name: "Networking Arena", included: ["silicon", "quantum", "thakur_student"] },
                    { name: "Lunch included", included: ["silicon", "quantum", "thakur_student"] },
                    { name: "The Ten Minute Deal", included: ["quantum", "thakur_student"] },
                    { name: "Angel Investor Roundtable", included: ["quantum", "thakur_student"] },
                    { name: "Incubator Summit", included: ["quantum", "thakur_student"] },
                    { name: "Internship Fair", included: ["quantum", "thakur_student"] },
                  ].map((feature) => (
                    <tr key={feature.name} className="border-b">
                      <td className="p-4">{feature.name}</td>
                      {[...passes.filter(p => p.id !== "exhibitors"), ...(isThakurStudent ? [thakurStudentPass] : [])].map((pass) => (
                        <td
                          key={pass.id}
                          className="p-4 text-center"
                        >
                          {feature.included.includes(pass.id) ? (
                            <Check className="mx-auto h-5 w-5 text-primary" />
                          ) : (
                            <span className="text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please login or create an account to book your E-Summit pass.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to be logged in to proceed with the booking. This helps us
                manage your passes and send you important updates about E-Summit 2026.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowAuthDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowAuthDialog(false);
                onRequestAuth();
              }}
              className="w-full sm:w-auto"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* KonfHub Widget Dialog */}
      <Dialog open={showKonfHubWidget} onOpenChange={setShowKonfHubWidget}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Complete your payment securely through KonfHub
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <KonfHubWidget
              mode="iframe"
              ticketId={selectedPass ? passTicketIds[selectedPass] : undefined}
              onSuccess={handleKonfHubSuccess}
              onClose={() => {
                setShowKonfHubWidget(false);
                toast.info("Payment cancelled");
              }}
              className="min-h-[500px]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}