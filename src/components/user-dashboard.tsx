import React, { useState, useEffect, type MouseEvent } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Download,
  Calendar,
  Ticket,
  FileText,
  Loader2,
  UserPlus,
  CheckCircle2,
  Copy,
  X,
  Upload,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getFormattedEventsForPass } from "../utils/pass-events";
import { ProfileCompletionModal } from "./profile-completion-modal";
import { API_BASE_URL } from "../lib/api";
import { AuroraText } from "./magicui/aurora-text";
import { KonfHubWidget } from "./konfhub-widget";
import { toast } from "sonner";

interface Pass {
  id: string; // UUID
  passId: string;
  passType: string;
  bookingId?: string;
  konfhubTicketId?: string;
  konfhubOrderId?: string;
  price?: number;
  purchaseDate?: string;
  ticketDetails?: {
    inclusions?: string[];
    features?: string[];
    [key: string]: any;
  };
  status: string;
  qrCodeUrl?: string;
  qrCodeData?: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  speaker?: string | null;
}

interface EventRegistration {
  eventId: string;
  userId: string;
  registeredAt: string;
  status: string;
}

interface PendingPassClaim {
  id: string;
  clerkUserId: string;
  email: string;
  fullName?: string;
  passType: string;
  bookingId?: string;
  konfhubOrderId?: string;
  ticketNumber?: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

interface UserDashboardProps {
  onNavigate: (page: string) => void;
  userData?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export function UserDashboard({
  onNavigate,
  userData,
  onLogout,
}: UserDashboardProps) {
  const { user } = useUser();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [myPasses, setMyPasses] = useState<Pass[]>([]);
  const [isLoadingPasses, setIsLoadingPasses] = useState(true);
  const [downloadingPassId, setDownloadingPassId] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [registeredEventDetails, setRegisteredEventDetails] = useState<Event[]>([]);
  const [eligibleEventsFromPass, setEligibleEventsFromPass] = useState<Event[]>([]);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tcetCode, setTcetCode] = useState<string | null>(null);
  const [isAssigningCode, setIsAssigningCode] = useState(false);
  const [showKonfHubWidget, setShowKonfHubWidget] = useState(false);
  
  // Pass claim states
  const [showPassClaimModal, setShowPassClaimModal] = useState(false);
  const [pendingClaims, setPendingClaims] = useState<PendingPassClaim[]>([]);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimFormData, setClaimFormData] = useState({
    bookingId: '',
    konfhubOrderId: '',
    ticketNumber: '',
    passType: 'Pixel Pass',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Check if user is a TCET student based on email domain
  const userName = user?.fullName || userData?.name || "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || userData?.email || "user@example.com";
  const isTCETStudent = userEmail.toLowerCase().endsWith("@tcetmumbai.in");

  // Set initial tab to My Passes for all users
  const [activeTab, setActiveTab] = useState("mypasses");

  // Fetch TCET code for TCET students
  useEffect(() => {
    const fetchTcetCode = async () => {
      if (!isTCETStudent || !user?.id) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/tcet/code/${user.id}`
        );
        const data = await response.json();

        if (data.success && data.data.code) {
          setTcetCode(data.data.code);
        }
      } catch (error) {
        // Error handled by toast notification
      }
    };

    fetchTcetCode();
  }, [isTCETStudent, user?.id]);

  // Handle TCET pass booking
  const handleTcetPassBooking = async () => {
    if (!user?.id) {
      toast.error("🔒 Please sign in to book your pass and unlock exclusive event access!");
      return;
    }

    setIsAssigningCode(true);

    try {
      // Assign a code if not already assigned
      if (!tcetCode) {
        const response = await fetch(
          `${API_BASE_URL}/tcet/assign/${user.id}`,
          { method: 'POST' }
        );
        const data = await response.json();

        if (!data.success) {
          toast.error(data.error || "❌ Unable to apply this code. Please verify the code and try again.");
          setIsAssigningCode(false);
          return;
        }

        setTcetCode(data.data.code);
        toast.success(`Your unique code: ${data.data.code}`, {
          description: "Please use this code when booking on KonfHub",
          duration: 10000,
        });
      }

      // Open KonfHub widget
      setShowKonfHubWidget(true);
    } catch (error) {
      // Error already handled by toast notification
      toast.error("⚠️ Something went wrong. Please refresh the page and try again.");
    } finally {
      setIsAssigningCode(false);
    }
  };

  // Fetch user passes from database
  useEffect(() => {
    const fetchPasses = async () => {
      if (!user?.id) {
        setIsLoadingPasses(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/passes/user/${user.id}`
        );
        const data = await response.json();

        if (data.success && data.data.passes) {
          console.log('[Dashboard] Fetched passes:', data.data.passes);
          // Show all Active passes
          const confirmedPasses = data.data.passes.filter((pass: Pass) => {
            return pass.status === 'Active';
          });
          console.log('[Dashboard] Active passes:', confirmedPasses);
          setMyPasses(confirmedPasses);
          
          // Auto-populate schedule with eligible events based on purchased passes
          if (confirmedPasses.length > 0) {
            console.log('[Dashboard] Processing passes for schedule:', confirmedPasses);
            const passTypeId = getPassTypeId(confirmedPasses[0].passType);
            console.log('[Dashboard] Pass Type ID:', passTypeId);
            
            const eligibleEvents = getFormattedEventsForPass(passTypeId);
            console.log('[Dashboard] Eligible events from pass-events.ts:', eligibleEvents.length, eligibleEvents);
            
            // Convert to the Event interface format used by the component
            const formattedEvents: Event[] = eligibleEvents.map(event => ({
              id: event.id,
              title: event.title,
              description: event.description,
              date: event.date,
              time: event.time,
              venue: event.venue,
              category: event.category,
              speaker: event.speaker,
            }));
            
            console.log('[Dashboard] Formatted events for schedule:', formattedEvents.length);
            
            // Store eligible events separately
            setEligibleEventsFromPass(formattedEvents);
          } else {
            console.log('[Dashboard] No confirmed passes, clearing eligible events');
            setEligibleEventsFromPass([]);
          }
        }
      } catch (error) {
        console.error("Error fetching passes:", error);
      } finally {
        setIsLoadingPasses(false);
      }
    };

    fetchPasses();
  }, [user?.id]);

  // Fetch pending pass claims
  useEffect(() => {
    const fetchPendingClaims = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/pass-claims/user/${user.id}`
        );
        const data = await response.json();

        if (data.success && data.data.claims) {
          // Filter out expired claims and only show pending ones
          const activeClaims = data.data.claims.filter(
            (claim: PendingPassClaim) => claim.status === 'pending'
          );
          setPendingClaims(activeClaims);
        }
      } catch (error) {
        console.error("Error fetching pending claims:", error);
      }
    };

    fetchPendingClaims();
    
    // Poll every 30 seconds to check for verification updates
    const interval = setInterval(fetchPendingClaims, 30000);
    return () => clearInterval(interval);
  }, [user?.id, myPasses.length]);

  // Handle pass claim submission
  const handleSubmitPassClaim = async () => {
    if (!user?.id || !userEmail) {
      toast.error("🔒 Please sign in to claim your pass. Already have a booking? We'll help you get your pass!");
      return;
    }

    if (!claimFormData.bookingId && !claimFormData.konfhubOrderId && !claimFormData.ticketNumber) {
      toast.error("📋 Please provide at least one identifier from your booking confirmation (Booking ID, Order ID, or Ticket Number).");
      return;
    }

    setIsSubmittingClaim(true);

    try {
      const formData = new FormData();
      formData.append('clerkUserId', user.id);
      formData.append('email', userEmail);
      formData.append('fullName', userName);
      formData.append('passType', claimFormData.passType);
      
      if (claimFormData.bookingId) {
        formData.append('bookingId', claimFormData.bookingId);
      }
      if (claimFormData.konfhubOrderId) {
        formData.append('konfhubOrderId', claimFormData.konfhubOrderId);
      }
      if (claimFormData.ticketNumber) {
        formData.append('ticketNumber', claimFormData.ticketNumber);
      }
      if (uploadedFile) {
        formData.append('ticketFile', uploadedFile);
      }

      const response = await fetch(`${API_BASE_URL}/pass-claims/submit`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.pass) {
          // Pass was immediately verified
          toast.success("🎉 Pass verified!", {
            description: "Your pass has been added to your account.",
          });
          // Refresh passes
          window.location.reload();
        } else {
          // Pending verification
          toast.success("Claim submitted!", {
            description: "We'll verify your pass within 32 hours. Check back for updates.",
          });
          setPendingClaims(prev => [...prev, data.data.claim]);
        }
        setShowPassClaimModal(false);
        setClaimFormData({
          bookingId: '',
          konfhubOrderId: '',
          ticketNumber: '',
          passType: 'Pixel Pass',
        });
        setUploadedFile(null);
      } else {
        toast.error(data.error || "Failed to submit claim");
      }
    } catch (error) {
      console.error("Error submitting pass claim:", error);
      toast.error("⚠️ Couldn't submit your claim. Please check your information and try again. Contact support if the issue persists.");
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  // Cancel a pending claim
  const handleCancelClaim = async (claimId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pass-claims/${claimId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkUserId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Claim cancelled");
        setPendingClaims(prev => prev.filter(c => c.id !== claimId));
      } else {
        toast.error(data.error || "Failed to cancel claim");
      }
    } catch (error) {
      toast.error("Failed to cancel claim");
    }
  };

  // Calculate hours remaining for a claim
  const getHoursRemaining = (expiresAt: string): number => {
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.round((expiry - now) / (60 * 60 * 1000)));
  };

  // Fetch user's registered events
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      if (!user?.id) {
        setIsLoadingRegistrations(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/events/registered/${user.id}`
        );
        const data = await response.json();

        if (data.success && data.data.registeredEventIds) {
          setRegisteredEvents(new Set(data.data.registeredEventIds));
          
          // Fetch full event details for each registered event
          const eventIds = data.data.registeredEventIds;
          if (eventIds.length > 0) {
            const eventDetailsPromises = eventIds.map(async (eventId: string) => {
              try {
                const eventResponse = await fetch(
                  `${API_BASE_URL}/events/${eventId}`
                );
                const eventData = await eventResponse.json();
                if (eventData.success && eventData.data && eventData.data.event) {
                  const event = eventData.data.event;
                  // Parse date safely
                  const eventDate = new Date(event.date);
                  const isValidDate = !isNaN(eventDate.getTime());
                  
                  return {
                    id: event.eventId || event.id,
                    title: event.title,
                    description: event.description || '',
                    date: isValidDate ? eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : event.date || 'Date TBA',
                    time: event.startTime && event.endTime ? `${new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - ${new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}` : 'Time TBA',
                    venue: event.venue,
                    category: event.category,
                    speaker: event.speakerName || null,
                  };
                }
              } catch (err) {
                console.error(`Error fetching event ${eventId}:`, err);
              }
              return null;
            });
            
            const events = await Promise.all(eventDetailsPromises);
            setRegisteredEventDetails(events.filter((e): e is Event => e !== null));
          }
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setIsLoadingRegistrations(false);
      }
    };

    fetchRegisteredEvents();
  }, [user?.id, refreshTrigger]);

  // Refresh events when user navigates to dashboard or when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        // Refresh registered events when user comes back to the page
        setRefreshTrigger(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id]);

  // Check if user profile is complete
  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id) {
        setIsCheckingProfile(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/check-profile/${user.id}`
        );
        const data = await response.json();

        // If user doesn't exist in database, create them
        if (data.success && !data.data.exists) {
          const syncResponse = await fetch(`${API_BASE_URL}/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkUserId: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              fullName: user.fullName || '',
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              imageUrl: user.imageUrl || '',
            }),
          });
          
          await syncResponse.json();

          // Show profile modal for new users
          setShowProfileModal(true);
        } else if (data.success && data.data.exists && !data.data.isComplete) {
          setShowProfileModal(true);
        }
      } catch (error) {
        // Silent fail - profile check is not critical
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user?.id]);

  const handleProfileComplete = () => {
    setShowProfileModal(false);
  };

  // Map pass type names to pass identifiers for event eligibility
  const getPassTypeId = (passTypeName: string): string => {
    // Normalize the pass type name (trim and lowercase for comparison)
    const normalizedName = passTypeName.trim().toLowerCase();
    
    const passTypeMap: Record<string, string> = {
      // New pass types
      "pixel pass": "pixel",
      "silicon pass": "silicon",
      "quantum pass": "quantum",
      "exhibitors pass": "exhibitors",
      "tcet student pass": "tcet_student",
      "tcet pass": "tcet_student",
      // Legacy pass types (for backward compatibility)
      "gold pass": "day1",
      "silver pass": "day2",
      "platinum pass": "full",
      "group pass (5+)": "group",
      "group pass": "group",
    };
    
    const passTypeId = passTypeMap[normalizedName] || "pixel";
    console.log('[Dashboard] Pass Type Mapping:', { passTypeName, normalizedName, passTypeId });
    return passTypeId;
  };

  // Use the fetched registered event details directly
  const registeredSchedule = registeredEventDetails;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Download pass PDF
  const downloadPassPDF = async (passId: string) => {
    try {
      setDownloadingPassId(passId);
      const response = await fetch(
        `${API_BASE_URL}/pdf/pass/${passId}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download pass PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ESUMMIT-2026-${passId}-Pass.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading pass PDF:', error);
      toast.error(error instanceof Error ? error.message : '⚠️ Unable to download your pass. Please check your internet connection and try again.');
    } finally {
      setDownloadingPassId(null);
    }
  };

  // Handle event registration
  const handleEventRegistration = async (eventId: string) => {
    if (!user?.id) {
      toast.error('🔒 Please sign in to register for events. Your pass grants you access to exclusive opportunities!');
      return;
    }

    // Check if already registered
    if (registeredEvents.has(eventId)) {
      toast.error('⚠️ You are already registered for this event!', {
        description: 'Check "Your Registered Events" section above.',
      });
      return;
    }

    try {
      setRegisteringEventId(eventId);
      
      // TODO: This will be replaced with actual API call
      // const response = await fetch(`${API_BASE_URL}/events/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user.id, eventId })
      // });
      
      // For now, just simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRegisteredEvents(prev => new Set([...prev, eventId]));
      toast.success(`✅ You're registered! Check your email for event details and next steps.`, { duration: 5000 });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('⚠️ Registration failed. Please check your pass eligibility and try again. Need help? Contact support.');
    } finally {
      setRegisteringEventId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto sm:mx-0">
            <AvatarImage src={user?.imageUrl} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg sm:text-xl">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="mb-1 text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Welcome back, {userName.split(" ")[0]}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="mypasses">My Passes</TabsTrigger>
          {isTCETStudent && (
            <TabsTrigger value="tcet">TCET Student Pass</TabsTrigger>
          )}
          <TabsTrigger value="schedule">
            My Schedule
          </TabsTrigger>
        </TabsList>

        {/* My Passes Tab - For all users */}
        <TabsContent value="mypasses">
          {isLoadingPasses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {myPasses.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">🎫 My Passes</h3>
                    <Badge variant="secondary">{myPasses.length} Pass{myPasses.length > 1 ? 'es' : ''}</Badge>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {myPasses.map((pass) => (
                      <Card key={pass.passId} className="border-2 border-primary/20 max-w-full overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 min-w-0">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-base sm:text-lg font-bold truncate">{pass.passType}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">Pass ID: {pass.passId}</p>
                              {pass.bookingId && (
                                <p className="text-xs text-muted-foreground truncate">Booking ID: {pass.bookingId}</p>
                              )}
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700 self-start shrink-0">
                              {pass.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs sm:text-sm">{pass.purchaseDate ? 'Purchase Date' : 'Registered'}</p>
                              <p className="font-medium text-sm sm:text-base">{formatDate(pass.purchaseDate || pass.createdAt)}</p>
                            </div>
                            {pass.price && (
                              <div>
                                <p className="text-muted-foreground text-xs sm:text-sm">Amount Paid</p>
                                <p className="font-medium text-sm sm:text-base">₹{pass.price.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Includes:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {pass.ticketDetails?.inclusions && pass.ticketDetails.inclusions.length > 0 ? (
                                pass.ticketDetails.inclusions.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-1 min-w-0">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    <span className="break-words">{item}</span>
                                  </div>
                                ))
                              ) : (
                                <>
                                  <div className="flex items-center gap-1 min-w-0">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    <span className="break-words">Event Access</span>
                                  </div>
                                  <div className="flex items-center gap-1 min-w-0">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    <span className="break-words">Networking</span>
                                  </div>
                                  <div className="flex items-center gap-1 min-w-0">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    <span className="break-words">Certificate</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {pass.status === 'Active' && (pass.qrCodeUrl || pass.bookingId || pass.konfhubTicketId) ? (
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => downloadPassPDF(pass.passId)}
                                disabled={downloadingPassId === pass.passId}
                              >
                                {downloadingPassId === pass.passId ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Ticket className="mr-2 h-4 w-4" />
                                )}
                                Download Pass
                              </Button>
                            ) : pass.status === 'Active' ? (
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.open('https://konfhub.com', '_blank')}
                              >
                                <Ticket className="mr-2 h-4 w-4" />
                                View on KonfHub
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="flex-1"
                                disabled
                              >
                                <Ticket className="mr-2 h-4 w-4" />
                                Pass Processing
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pending Claims Section */}
                  {pendingClaims.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                        Pending Verification
                      </h4>
                      {pendingClaims.map((claim) => (
                        <Card key={claim.id} className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Verifying
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {getHoursRemaining(claim.expiresAt)}h remaining
                                  </span>
                                </div>
                                <p className="text-sm font-medium">{claim.passType}</p>
                                <p className="text-xs text-muted-foreground">
                                  {claim.bookingId && `Booking: ${claim.bookingId}`}
                                  {claim.konfhubOrderId && ` | Order: ${claim.konfhubOrderId}`}
                                  {claim.ticketNumber && ` | Ticket: ${claim.ticketNumber}`}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleCancelClaim(claim.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Alert className="mt-3 bg-amber-100/50 border-amber-200">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <AlertDescription className="text-xs text-amber-800">
                                We're verifying your pass details. If not verified within 32 hours, this claim will expire.
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Enter Pass Details Button */}
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowPassClaimModal(true)}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Already purchased? Enter your pass details
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Pending Claims when no verified passes */}
                  {pendingClaims.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                        Pending Verification
                      </h4>
                      {pendingClaims.map((claim) => (
                        <Card key={claim.id} className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Verifying
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {getHoursRemaining(claim.expiresAt)}h remaining
                                  </span>
                                </div>
                                <p className="text-sm font-medium">{claim.passType}</p>
                                <p className="text-xs text-muted-foreground">
                                  {claim.bookingId && `Booking: ${claim.bookingId}`}
                                  {claim.konfhubOrderId && ` | Order: ${claim.konfhubOrderId}`}
                                  {claim.ticketNumber && ` | Ticket: ${claim.ticketNumber}`}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleCancelClaim(claim.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Alert className="mt-3 bg-amber-100/50 border-amber-200">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <AlertDescription className="text-xs text-amber-800">
                                We're verifying your pass details. Check back later for updates!
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <Ticket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2">No passes yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Book your E-Summit 2026 pass to get started
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => onNavigate("booking")}>
                          Book Pass Now
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowPassClaimModal(true)}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Enter Pass Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* TCET Student Pass Tab */}
        {isTCETStudent && (
          <TabsContent value="tcet">{isLoadingPasses ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading...</span>
              </div>
            ) : myPasses.length > 0 ? (
              // User already has a pass - show confirmation
              <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50/50 via-transparent to-green-100/30 dark:from-green-950/20 dark:to-green-900/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      You Already Have a Pass!
                    </h3>
                    <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                      You have already booked a <strong>{myPasses[0].passType}</strong>. 
                      Only one pass per user is allowed. Check the "My Passes" tab to view your pass details.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setActiveTab("mypasses")}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      View My Pass
                    </Button>
                    {myPasses[0].qrCodeUrl && (
                      <Button 
                        className="flex-1"
                        onClick={() => downloadPassPDF(myPasses[0].passId)}
                        disabled={downloadingPassId === myPasses[0].passId}
                      >
                        {downloadingPassId === myPasses[0].passId ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        Download Pass PDF
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* TCET Students Special Booking */}
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">🎓 TCET Students Pass</h3>
                      <Badge className="bg-green-600 hover:bg-green-700">FREE</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Exclusive free pass for TCET students! Book now and enjoy access to select events at E-Summit 2026.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tcetCode && (
                      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-600 shadow-md">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-100">Your TCET Access Code:</p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 sm:p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-blue-400 dark:border-blue-500">
                              <span className="font-mono text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 tracking-wider break-all">{tcetCode}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(tcetCode);
                                  toast.success("Code copied to clipboard!");
                                }}
                                className="sm:ml-auto w-full sm:w-auto"
                              >
                                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="text-xs sm:text-sm">Copy</span>
                              </Button>
                            </div>
                            <p className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 font-medium">💡 Save this code! Use it during KonfHub booking to access your TCET student pass</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900">
                      <CheckCircle2 className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
                        ⚠️ <strong>Verification Required:</strong> You must bring your TCET ID card and a valid government-issued ID to the venue entrance for verification.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">Includes:</p>
                      <ul className="space-y-1 ml-4">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> All Quantum Pass events</li>
                      </ul>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handleTcetPassBooking}
                      disabled={isAssigningCode}
                    >
                      {isAssigningCode ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Book TCET Students Pass (Free)</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        )}

        <TabsContent value="schedule">{isLoadingPasses || isLoadingRegistrations ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading your schedule...</span>
            </div>
          ) : (
          <div className="space-y-4">
            {myPasses.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="mb-1 font-semibold">Events Included with Your Pass</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {eligibleEventsFromPass.length === 0 ? '⏳ Loading your eligible events...' : `🎉 You have access to ${eligibleEventsFromPass.length} event${eligibleEventsFromPass.length > 1 ? 's' : ''} with your ${myPasses[0]?.passType}!`}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {myPasses.map((pass) => (
                          <Badge key={pass.passId} variant="default">
                            {pass.passType}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {registeredSchedule.length > 0 ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Your Registered Events</h3>
                  <p className="text-sm text-muted-foreground">
                    You have registered for {registeredSchedule.length} event{registeredSchedule.length > 1 ? 's' : ''}
                  </p>
                </div>
                {registeredSchedule.map((event) => (
                  <Card key={event.id} className="border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <Badge variant="outline" className="mt-1">
                              {event.category}
                            </Badge>
                            <Badge variant="default" className="mt-1 bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Registered
                            </Badge>
                            <div className="flex-1">
                              <h3 className="mb-2">{event.title}</h3>
                              {event.speaker && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  Speaker: {event.speaker}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {event.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Ticket className="h-4 w-4" />
                              {event.venue}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2">No registered events yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {myPasses.length > 0
                      ? "Register for events to see them in your schedule"
                      : "Purchase a pass to access E-Summit events"}
                  </p>
                  <Button onClick={() => onNavigate(myPasses.length > 0 ? "events" : "booking")}>
                    {myPasses.length > 0 ? "Browse Events" : "Book Pass"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Show all eligible events from pass */}
            {myPasses.length > 0 && eligibleEventsFromPass.length > 0 && (
              <>
                <div className="mb-4 mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">All Events Available with Your Pass</h3>
                  <p className="text-sm text-muted-foreground">
                    These are all the events you can attend with your {myPasses[0]?.passType}. Register for events to add them to your schedule.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {eligibleEventsFromPass.map((event) => {
                    const isRegistered = registeredEvents.has(event.id);
                    return (
                      <Card key={event.id} className={isRegistered ? "border-green-500/30 bg-green-50/30" : "border-muted"}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant="outline" className="shrink-0">
                              {event.category}
                            </Badge>
                            {isRegistered && (
                              <Badge variant="default" className="bg-green-600 shrink-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Registered
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-2 break-words">{event.title}</h4>
                          {event.speaker && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Speaker: {event.speaker}
                            </p>
                          )}
                          <div className="space-y-1 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span className="truncate">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span className="truncate">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Ticket className="h-3 w-3 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          </div>
                          {!isRegistered && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => onNavigate("events")}
                            >
                              View & Register
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            {registeredSchedule.length > 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2">View complete schedule</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    See the full E-Summit schedule and plan your day
                  </p>
                  <Button onClick={() => onNavigate("schedule")}>
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onComplete={handleProfileComplete}
      />

      {/* KonfHub Widget Modal for TCET Pass Booking */}
      {showKonfHubWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20">
            {/* Header with TCET Code Highlight */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 p-3 sm:p-6 border-b-2 border-primary/20">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-2xl font-bold mb-2 flex items-center gap-2">
                    🎓 <span className="truncate">Book TCET Student Pass</span>
                  </h3>
                  {tcetCode && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-2 border-dashed border-primary shadow-sm">
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">Your TCET Access Code</p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <span className="font-mono text-2xl sm:text-4xl font-bold text-primary tracking-widest break-all">{tcetCode}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(tcetCode);
                            toast.success("Code copied!", {
                              description: "TCET access code copied to clipboard"
                            });
                          }}
                          className="w-full sm:w-auto"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="text-xs sm:text-sm">Copy</span>
                        </Button>
                      </div>
                      <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                        ⚠️ Use this code in the booking form to access your TCET student pass
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKonfHubWidget(false)}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            
            {/* KonfHub Widget Container */}
            <div className="overflow-y-auto bg-gray-50 dark:bg-gray-950" style={{ height: 'calc(95vh - 160px)' }}>
              <KonfHubWidget
                eventId="tcet-esummit26"
                mode="iframe"
                onSuccess={(data) => {
                  // Pass booking completed successfully
                  toast.success("🎉 Booking Successful!", {
                    description: "Your TCET student pass has been booked. Check your email for confirmation."
                  });
                  setShowKonfHubWidget(false);
                }}
                onClose={() => setShowKonfHubWidget(false)}
                className="w-full h-full min-h-[500px] sm:min-h-[600px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pass Claim Modal */}
      {showPassClaimModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="relative w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-xl overflow-hidden shadow-2xl border max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-blue-500/10 p-4 sm:p-5 border-b shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                      <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <span>Claim Your Pass</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    Already purchased? Enter your booking details to link your pass.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassClaimModal(false)}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive h-8 w-8 sm:h-9 sm:w-9 shrink-0 -mt-1 -mr-1"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            
            {/* Form - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 sm:p-5 space-y-4">
                {/* Pass Type */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Pass Type <span className="text-destructive">*</span>
                  </label>
                  <select 
                    className="w-full h-11 sm:h-10 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                    value={claimFormData.passType}
                    onChange={(e) => setClaimFormData(prev => ({ ...prev, passType: e.target.value }))}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                  >
                    <option value="Pixel Pass">Pixel Pass (₹299)</option>
                    <option value="Silicon Pass">Silicon Pass (₹499)</option>
                    <option value="Quantum Pass">Quantum Pass (₹999)</option>
                    <option value="TCET Student Pass">TCET Student Pass (Free)</option>
                  </select>
                </div>

                {/* Booking ID */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Booking ID / Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., KONF-12345 or ES26-XXXXX"
                    className="w-full h-11 sm:h-10 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                    value={claimFormData.bookingId}
                    onChange={(e) => setClaimFormData(prev => ({ ...prev, bookingId: e.target.value }))}
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Found in your confirmation email from KonfHub</p>
                </div>

                {/* Collapsible Optional Fields */}
                <div className="space-y-3 pt-1">
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Additional Details (Optional)</p>
                  
                  {/* KonfHub Order ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-medium text-foreground/80">
                      KonfHub Order ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ORD-XXXXXXXXXX"
                      className="w-full h-11 sm:h-10 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                      value={claimFormData.konfhubOrderId}
                      onChange={(e) => setClaimFormData(prev => ({ ...prev, konfhubOrderId: e.target.value }))}
                    />
                  </div>

                  {/* Ticket Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-medium text-foreground/80">
                      Ticket Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., TKT-123456"
                      className="w-full h-11 sm:h-10 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                      value={claimFormData.ticketNumber}
                      onChange={(e) => setClaimFormData(prev => ({ ...prev, ticketNumber: e.target.value }))}
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs sm:text-sm font-medium text-foreground/80">
                    Upload Ticket (Optional)
                  </label>
                  <div className="border-2 border-dashed rounded-xl p-4 sm:p-5 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer active:scale-[0.99]">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      id="ticket-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFile(file);
                          toast.success(`File selected: ${file.name}`);
                        }
                      }}
                    />
                    <label htmlFor="ticket-upload" className="cursor-pointer block">
                      {uploadedFile ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-green-600">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <span className="text-sm font-medium truncate max-w-[180px] sm:max-w-[250px]">{uploadedFile.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: MouseEvent) => {
                              e.preventDefault();
                              setUploadedFile(null);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                          >
                            <X className="h-4 w-4 mr-1" />
                            <span className="text-xs">Remove</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted/50 flex items-center justify-center">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                              Tap to upload ticket PDF or screenshot
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-0.5">
                              PDF, PNG, JPG • Max 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Info Alert */}
                <Alert className="bg-blue-50/80 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <AlertDescription className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    <strong>How it works:</strong> We'll verify your details against our records. If found, your pass activates instantly! Otherwise, verification takes up to 32 hours.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="p-4 sm:p-5 border-t bg-muted/30 shrink-0 safe-area-inset-bottom">
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 sm:h-10 text-sm"
                  onClick={() => setShowPassClaimModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 sm:h-10 text-sm font-medium"
                  onClick={handleSubmitPassClaim}
                  disabled={isSubmittingClaim || (!claimFormData.bookingId && !claimFormData.konfhubOrderId && !claimFormData.ticketNumber)}
                >
                  {isSubmittingClaim ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit & Verify
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2 sm:hidden">
                Swipe down to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}