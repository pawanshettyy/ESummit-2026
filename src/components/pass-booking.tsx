import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Check,
  Info,
  Ticket,
  Users,
  ArrowRight,
  CreditCard,
  Mail,
  Phone,
  Building2,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
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
import { ShimmerButton } from "./accentricity/shimmer-button";
import { GlassCard } from "./accentricity/glass-card";
import { API_BASE_URL } from "../lib/api";
import { PulseDot } from "./accentricity/pulse-dot";
import {
  initiateRazorpayPayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  convertToPaise,
} from "../utils/razorpay";
import { savePurchasedPass } from "../utils/pass-events";

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
  const [step, setStep] = useState(1);
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdPass, setCreatedPass] = useState<{
    passId: string;
    qrCodeUrl: string;
  } | null>(null);
  const [hasExistingPass, setHasExistingPass] = useState(false);
  const [isCheckingPass, setIsCheckingPass] = useState(false); // Track loading state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    rollNumber: "",
    meals: false,
    merchandise: false,
    workshop: false,
  });

  // Fetch and pre-fill form with user data from database (optimized - single call)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      setIsCheckingPass(true);
      try {
        // Single API call to check passes and get profile
        const passResponse = await fetch(
          `${API_BASE_URL}/passes/user/${user.id}`
        );
        const passData = await passResponse.json();

        // Check if user already has a pass
        if (passData.success && passData.data.passes && passData.data.passes.length > 0) {
          setHasExistingPass(true);
          setIsCheckingPass(false);
          toast.info("You already have a pass", {
            description: "Check your dashboard to view your pass.",
          });
          return; // Don't fetch profile if user already has a pass
        }

        // Fetch user profile for form pre-fill (only if no pass)
        const response = await fetch(
          `${API_BASE_URL}/users/profile/${user.id}`
        );
        const data = await response.json();

        if (data.success && data.data.user) {
          const userProfile = data.data.user;
          
          setFormData((prev) => ({
            ...prev,
            name: userProfile.fullName || user.fullName || "",
            email: userProfile.email || user.primaryEmailAddress?.emailAddress || "",
            phone: userProfile.phone || "",
            college: userProfile.college || "",
            year: userProfile.yearOfStudy || "",
            rollNumber: userProfile.rollNumber || "",
          }));

          console.log("✅ User profile loaded:", userProfile.email);
        } else {
          // Fallback to Clerk data if profile not found
          setFormData((prev) => ({
            ...prev,
            name: user.fullName || "",
            email: user.primaryEmailAddress?.emailAddress || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to Clerk data on error
        setFormData((prev) => ({
          ...prev,
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        }));
      } finally {
        setIsCheckingPass(false);
      }
    };

    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  // Auto-redirect to dashboard after booking completion
  useEffect(() => {
    if (step === 4) {
      // Show success message for 5 seconds, then redirect to dashboard
      const timer = setTimeout(() => {
        toast.success("Redirecting to your dashboard...");
        setTimeout(() => {
          onNavigate("dashboard");
        }, 1000);
      }, 5000); // Wait 5 seconds before redirecting

      return () => clearTimeout(timer);
    }
  }, [step, onNavigate]);

  const passes = [
    {
      id: "pixel",
      name: "Pixel Pass",
      price: 0,
      originalPrice: 299,
      features: [
        "Startup Expo",
        "Panel Discussion",
        "IPL Auction",
        "AI Build-A-Thon",
        "Biz-Arena League",
        "Certificate of participation",
      ],
      badge: "Free Entry",
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
        "Networking Arena",
        "Lunch included",
        "Certificate of participation",
      ],
      badge: "Popular",
      recommended: true,
    },
    {
      id: "quantum",
      name: "Quantum Pass",
      price: 999,
      originalPrice: 1299,
      features: [
        "All Silicon Pass events",
        "The Ten Minute Million",
        "The Angel Investor Roundtable",
        "Incubator Summit",
        "Internship Fair",
        "Premium networking sessions",
        "Priority access to all events",
        "Certificate of participation",
      ],
      badge: "Best Value",
    },
  ];

  const addons = [
    {
      id: "meals",
      name: "All Meals (2 days)",
      price: 300,
      icon: "🍽️",
    },
    {
      id: "merchandise",
      name: "E-Summit Merchandise Kit",
      price: 500,
      icon: "🎽",
    },
    {
      id: "workshop",
      name: "Premium Workshop Access",
      price: 700,
      icon: "🎓",
    },
  ];

  const handlePassSelect = (passId: string) => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      setSelectedPass(passId);
      setShowAuthDialog(true);
      return;
    }
    setSelectedPass(passId);
    setStep(2);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep(3);
  };

  const handlePayment = async () => {
    if (isProcessingPayment) return;

    // Use cached hasExistingPass state instead of making another API call
    if (hasExistingPass) {
      toast.error("You already have a pass", {
        description: "Only one pass per user is allowed. Check your dashboard.",
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      // TODO: Razorpay Integration (Bypassed for testing QR codes)
      // ============================================
      // When ready to implement Razorpay:
      // 1. Uncomment the Razorpay code below
      // 2. Comment out the direct pass creation
      // 3. Set up Razorpay keys in environment variables
      // ============================================

      /* RAZORPAY IMPLEMENTATION (COMMENTED OUT FOR TESTING)
      const order = await createRazorpayOrder(convertToPaise(totalPrice), "INR");

      await initiateRazorpayPayment({
        amount: convertToPaise(totalPrice),
        currency: "INR",
        name: "E-Summit 2026",
        description: selectedPassData?.name || "Event Pass",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          pass_type: selectedPassData?.id || "",
          pass_name: selectedPassData?.name || "",
          addons: JSON.stringify({
            meals: formData.meals,
            merchandise: formData.merchandise,
            workshop: formData.workshop,
          }),
        },
        handler: async (response) => {
          // Payment successful - verify and create pass
          const verified = await verifyRazorpayPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id || "",
            response.razorpay_signature || ""
          );

          if (verified) {
            // Create pass in database via API
            await createPassInDatabase();
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setIsProcessingPayment(false);
          },
        },
      });
      */

      // ============================================
      // TEMPORARY: Direct Pass Creation (For Testing QR Codes)
      // ============================================
      // This bypasses Razorpay and directly creates a pass
      // Remove this when implementing actual payment gateway
      
      console.log("🔄 Creating pass without payment (testing mode)...");
      console.log("API URL:", `${API_BASE_URL}/passes/create`);
      
      // Get Clerk user ID
      const clerkUserId = user?.id;
      
      if (!clerkUserId) {
        toast.error("Please login to purchase a pass");
        setIsProcessingPayment(false);
        return;
      }
      
      const requestBody = {
        clerkUserId: clerkUserId,
        passType: selectedPassData?.name || "Standard Pass",
        price: totalPrice,
        hasMeals: formData.meals,
        hasMerchandise: formData.merchandise,
        hasWorkshopAccess: formData.workshop,
      };
      
      console.log("Request body:", requestBody);
      
      try {
        // Create pass via API
        const response = await fetch(`${API_BASE_URL}/passes/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error:", errorText);
          toast.error(`Failed to create pass: ${errorText}`);
          setIsProcessingPayment(false);
          return;
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (data.success && data.data.pass) {
          const createdPass = data.data.pass;
          
          console.log("✅ Pass created:", createdPass.passId);
          console.log("🎫 QR Code generated:", createdPass.qrCodeUrl ? "Yes" : "No");

          // Store the created pass data including QR code
          setCreatedPass({
            passId: createdPass.passId,
            qrCodeUrl: createdPass.qrCodeUrl,
          });

          // Save to localStorage for backward compatibility
          const passData = {
            id: selectedPassData?.id || "",
            type: selectedPassData?.name || "",
            passId: createdPass.passId,
            price: totalPrice,
            purchaseDate: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            status: "Active",
          };
          savePurchasedPass(passData);

          toast.success("Pass created successfully! Check your dashboard for QR code.");
          setIsProcessingPayment(false);
          
          setTimeout(() => {
            setStep(4);
          }, 1000);
        } else {
          toast.error(data.message || "Failed to create pass. Please try again.");
          setIsProcessingPayment(false);
        }
      } catch (error) {
        console.error("Pass creation error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create pass. Please try again."
        );
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Pass creation error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create pass. Please try again."
      );
      setIsProcessingPayment(false);
    }
  };

  const selectedPassData = passes.find(
    (p) => p.id === selectedPass,
  );
  const totalAddons =
    (formData.meals ? 300 : 0) +
    (formData.merchandise ? 500 : 0) +
    (formData.workshop ? 700 : 0);
  const totalPrice =
    (selectedPassData?.price || 0) + totalAddons;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Show message if user already has a pass */}
      {hasExistingPass && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-900 dark:text-amber-100">
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

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {[
          { num: 1, label: "Select Pass" },
          { num: 2, label: "Your Details" },
          { num: 3, label: "Payment" },
          { num: 4, label: "Confirmation" },
        ].map((item, idx) => (
          <div key={item.num} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                step >= item.num
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > item.num ? (
                <Check className="h-5 w-5" />
              ) : (
                item.num
              )}
            </div>
            <span className="ml-2 hidden text-sm sm:inline">
              {item.label}
            </span>
            {idx < 3 && (
              <div className="mx-2 h-px w-8 bg-border sm:w-16" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Pass Selection */}
      {step === 1 && (
        <div>
          {/* Show loading state while checking for existing pass */}
          {isCheckingPass && (
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Checking your account...</p>
            </div>
          )}
          
          <div className="mb-8 text-center">
            <h1 className="mb-4">Choose Your Pass</h1>
            <p className="text-muted-foreground">
              Select the perfect pass for your E-Summit
              experience
            </p>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {passes.map((pass, index) => (
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
                                  <span className="text-3xl text-primary">
                                    ₹{pass.price}
                                  </span>
                                  <span className="text-sm text-muted-foreground line-through">
                                    ₹{pass.originalPrice}
                                  </span>
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
                        </ul>
                        {hasExistingPass ? (
                          <Button
                            className="w-full"
                            disabled
                          >
                            Pass Already Purchased
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            disabled
                          >
                            Passes will open soon
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
                                  <span className="text-3xl text-primary">
                                    ₹{pass.price}
                                  </span>
                                  <span className="text-sm text-muted-foreground line-through">
                                    ₹{pass.originalPrice}
                                  </span>
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
                        <Button
                          className="w-full"
                          variant="outline"
                          disabled
                        >
                          Passes will open soon
                        </Button>
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
                    {passes.map((pass) => (
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
                    "Startup Expo",
                    "Panel Discussion",
                    "IPL Auction",
                    "AI Build-A-Thon",
                    "Biz-Arena League",
                    "Pitch Arena",
                    "Startup Youth Conclave",
                    "All 3 Workshops",
                    "Networking Arena",
                    "Lunch included",
                    "The Ten Minute Million",
                    "Angel Investor Roundtable",
                    "Incubator Summit",
                    "Internship Fair",
                  ].map((feature, idx) => (
                    <tr key={feature} className="border-b">
                      <td className="p-4">{feature}</td>
                      {passes.map((pass, passIdx) => (
                        <td
                          key={pass.id}
                          className="p-4 text-center"
                        >
                          {(passIdx === 0 && idx < 5) ||
                          (passIdx === 1 && idx < 10) ||
                          (passIdx === 2 && idx < 14) ? (
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
      )}

      {/* Step 2: User Details */}
      {step === 2 && selectedPassData && (
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4">Your Details</h1>
            <p className="text-muted-foreground">
              Please provide your information to complete
              registration
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h3>Registration Form</h3>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleFormSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="college">
                        College/University *
                      </Label>
                      <Input
                        id="college"
                        value={formData.college}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            college: e.target.value,
                          })
                        }
                        placeholder="Your institution name"
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="year">
                          Year of Study
                        </Label>
                        <Select
                          value={formData.year}
                          onValueChange={(value: string) =>
                            setFormData({
                              ...formData,
                              year: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">
                              1st Year
                            </SelectItem>
                            <SelectItem value="2">
                              2nd Year
                            </SelectItem>
                            <SelectItem value="3">
                              3rd Year
                            </SelectItem>
                            <SelectItem value="4">
                              4th Year
                            </SelectItem>
                            <SelectItem value="pg">
                              Post Graduate
                            </SelectItem>
                            <SelectItem value="other">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rollNumber">
                          Roll Number
                        </Label>
                        <Input
                          id="rollNumber"
                          value={formData.rollNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              rollNumber: e.target.value,
                            })
                          }
                          placeholder="Your roll number"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="mb-4">
                        Add-ons (Optional)
                      </h4>
                      <div className="space-y-3">
                        {addons.map((addon) => (
                          <div
                            key={addon.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={addon.id}
                                checked={
                                  formData[
                                    addon.id as keyof typeof formData
                                  ] as boolean
                                }
                                onCheckedChange={(checked: boolean) =>
                                  setFormData({
                                    ...formData,
                                    [addon.id]: checked,
                                  })
                                }
                              />
                              <Label
                                htmlFor={addon.id}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <span>{addon.icon}</span>
                                {addon.name}
                              </Label>
                            </div>
                            <span className="text-sm">
                              +₹{addon.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <h3>Order Summary</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span>{selectedPassData.name}</span>
                      <span>
                        {selectedPassData.price === 0 ? "FREE" : `₹${selectedPassData.price}`}
                      </span>
                    </div>
                    {selectedPassData.originalPrice > selectedPassData.price && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        You save ₹
                        {selectedPassData.originalPrice -
                          selectedPassData.price}
                      </div>
                    )}
                  </div>

                  {totalAddons > 0 && (
                    <div className="space-y-2 border-t pt-4">
                      {formData.meals && (
                        <div className="flex justify-between text-sm">
                          <span>All Meals</span>
                          <span>₹300</span>
                        </div>
                      )}
                      {formData.merchandise && (
                        <div className="flex justify-between text-sm">
                          <span>Merchandise Kit</span>
                          <span>₹500</span>
                        </div>
                      )}
                      {formData.workshop && (
                        <div className="flex justify-between text-sm">
                          <span>Workshop Access</span>
                          <span>₹700</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span className="text-2xl text-primary">
                        ₹{totalPrice}
                      </span>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Your pass will be sent to your email after
                      payment
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && selectedPassData && (
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4">Payment</h1>
            <p className="text-muted-foreground">
              Complete your payment securely
            </p>
          </div>

          <Card>
            <CardHeader>
              <h3>Payment Summary</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-6 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Order Total</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {totalPrice === 0 ? "FREE" : `₹${totalPrice}`}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {selectedPassData.name}
                  {totalAddons > 0 && ` + Add-ons (₹${totalAddons})`}
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong className="block mb-2">Testing Mode</strong>
                  Payment gateway integration is currently disabled for testing. 
                  Click "Proceed to Payment" to create your pass directly. 
                  In production, you will be redirected to Razorpay's secure payment gateway.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={isProcessingPayment}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && selectedPassData && (
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-4">Registration Successful!</h1>
            <p className="text-muted-foreground">
              Your pass has been booked successfully
            </p>
          </div>

          <Card>
            <CardContent className="space-y-6 p-8">
              <div className="rounded-lg border-2 border-dashed p-6">
                <div className="mb-4 text-6xl">🎟️</div>
                <h3 className="mb-2">
                  {selectedPassData.name}
                </h3>
                <div className="mb-4 text-2xl text-primary">
                  {totalPrice === 0 ? "FREE" : `₹${totalPrice}`}
                </div>
                
                {/* Display actual QR code */}
                {createdPass?.qrCodeUrl ? (
                  <div className="mx-auto mb-4">
                    <img 
                      src={createdPass.qrCodeUrl} 
                      alt="Pass QR Code" 
                      className="mx-auto h-48 w-48 rounded-lg border bg-white p-2"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Scan this QR code at the venue
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto h-24 w-24 rounded-lg bg-muted">
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      QR Code
                    </div>
                  </div>
                )}
                
                <div className="mt-4 font-mono text-sm text-muted-foreground">
                  {createdPass?.passId || `ESUMMIT-2026-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
                </div>
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Confirmation sent to {formData.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    SMS sent to {formData.phone}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full"
                  onClick={() => onNavigate("dashboard")}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Download Digital Pass
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Calendar
                </Button>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-left text-xs">
                  Please carry a printed or digital copy of your
                  pass to the venue. You'll need to show it at
                  check-in.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}

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
    </div>
  );
}