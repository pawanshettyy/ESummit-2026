import { useState, useEffect } from "react";
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
    hasMeals?: boolean;
    hasMerchandise?: boolean;
    hasWorkshopAccess?: boolean;
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
  const [downloadingSchedule, setDownloadingSchedule] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [registeredEventDetails, setRegisteredEventDetails] = useState<Event[]>([]);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
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

  const mockUser = {
    name: user?.fullName || userData?.name || "User",
    email: user?.primaryEmailAddress?.emailAddress || userData?.email || "user@example.com",
  };

  // Check if user is a TCET student based on email domain
  const isTCETStudent = mockUser.email.toLowerCase().endsWith("@tcetmumbai.in");

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
        console.error("Error fetching TCET code:", error);
      }
    };

    fetchTcetCode();
  }, [isTCETStudent, user?.id]);

  // Handle TCET pass booking
  const handleTcetPassBooking = async () => {
    if (!user?.id) {
      toast.error("Please login to book a pass");
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
          toast.error(data.error || "Failed to assign code");
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
      console.error("Error assigning TCET code:", error);
      toast.error("Failed to process request. Please try again.");
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
          // Show all Active passes
          const confirmedPasses = data.data.passes.filter((pass: Pass) => {
            return pass.status === 'Active';
          });
          setMyPasses(confirmedPasses);
          
          // Auto-populate schedule with eligible events based on purchased passes
          if (confirmedPasses.length > 0) {
            const passTypeId = getPassTypeId(confirmedPasses[0].passType);
            const eligibleEvents = getFormattedEventsForPass(passTypeId);
            
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
            
            // Update registered events with eligible events from pass
            setRegisteredEventDetails(prevEvents => {
              // Merge with existing registered events, avoid duplicates
              const existingIds = new Set(prevEvents.map(e => e.id));
              const newEvents = formattedEvents.filter(e => !existingIds.has(e.id));
              return [...prevEvents, ...newEvents];
            });
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
    if (!user?.id || !mockUser.email) {
      toast.error("Please login to submit a pass claim");
      return;
    }

    if (!claimFormData.bookingId && !claimFormData.konfhubOrderId && !claimFormData.ticketNumber) {
      toast.error("Please enter at least one identifier (Booking ID, Order ID, or Ticket Number)");
      return;
    }

    setIsSubmittingClaim(true);

    try {
      const formData = new FormData();
      formData.append('clerkUserId', user.id);
      formData.append('email', mockUser.email);
      formData.append('fullName', mockUser.name);
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
      toast.error("Failed to submit claim. Please try again.");
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
                  return {
                    id: event.eventId || event.id,
                    title: event.title,
                    description: event.description || '',
                    date: new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }),
                    time: `${new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - ${new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`,
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
  }, [user?.id]);

  // Check if user profile is complete
  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id) {
        setIsCheckingProfile(false);
        return;
      }

      try {
        console.log('[Profile Check] Checking profile for user:', user.id);
        
        const response = await fetch(
          `${API_BASE_URL}/users/check-profile/${user.id}`
        );
        const data = await response.json();
        
        console.log('[Profile Check] Response:', data);

        // If user doesn't exist in database, create them
        if (data.success && !data.data.exists) {
          console.log('[Profile Check] User does not exist, creating...');
          
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
          
          const syncData = await syncResponse.json();
          console.log('[Profile Check] User sync result:', syncData);

          // Show profile modal for new users
          console.log('[Profile Check] Showing modal for new user');
          setShowProfileModal(true);
        } else if (data.success && data.data.exists && !data.data.isComplete) {
          console.log('[Profile Check] User exists but profile incomplete, showing modal');
          setShowProfileModal(true);
        } else {
          console.log('[Profile Check] Profile is complete or error occurred');
        }
      } catch (error) {
        console.error("[Profile Check] Error:", error);
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
    const passTypeMap: Record<string, string> = {
      // New pass types
      "Pixel Pass": "pixel",
      "Silicon Pass": "silicon",
      "Quantum Pass": "quantum",
      "TCET Student Pass": "tcet_student",
      // Legacy pass types (for backward compatibility)
      "Gold Pass": "day1",
      "Silver Pass": "day2",
      "Platinum Pass": "full",
      "Group Pass (5+)": "group",
      "Group Pass": "group",
    };
    return passTypeMap[passTypeName] || "pixel"; // Default to pixel if unknown
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
      alert(error instanceof Error ? error.message : 'Failed to download pass PDF. Please try again.');
    } finally {
      setDownloadingPassId(null);
    }
  };

  // Download personalized schedule PDF
  const downloadSchedulePDF = async () => {
    try {
      setDownloadingSchedule(true);
      
      if (!user?.id) {
        alert('Please login to download your schedule');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/pdf/schedule/${user.id}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download schedule PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ESUMMIT-2026-My-Schedule.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading schedule PDF:', error);
      alert(error instanceof Error ? error.message : 'Failed to download schedule PDF. Please try again.');
    } finally {
      setDownloadingSchedule(false);
    }
  };

  // Handle event registration
  const handleEventRegistration = async (eventId: string) => {
    if (!user?.id) {
      alert('Please login to register for events');
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
      alert(`Successfully registered for the event! You'll receive further details soon.`);
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event. Please try again.');
    } finally {
      setRegisteringEventId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.imageUrl} alt={mockUser.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {mockUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="mb-1">
              Welcome back, {mockUser.name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {mockUser.email}
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
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {myPasses.map((pass) => (
                      <Card key={pass.passId} className="border-2 border-primary/20">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-bold">{pass.passType}</h4>
                              <p className="text-sm text-muted-foreground">Pass ID: {pass.passId}</p>
                              {pass.bookingId && (
                                <p className="text-xs text-muted-foreground">Booking ID: {pass.bookingId}</p>
                              )}
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700">
                              {pass.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">{pass.purchaseDate ? 'Purchase Date' : 'Registered'}</p>
                              <p className="font-medium">{formatDate(pass.purchaseDate || pass.createdAt)}</p>
                            </div>
                            {pass.price && (
                              <div>
                                <p className="text-muted-foreground">Amount Paid</p>
                                <p className="font-medium">₹{pass.price.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Includes:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {pass.ticketDetails?.inclusions && pass.ticketDetails.inclusions.length > 0 ? (
                                pass.ticketDetails.inclusions.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    <span>{item}</span>
                                  </div>
                                ))
                              ) : (
                                <>
                                  {(pass.ticketDetails?.hasMeals || pass.price && pass.price >= 500) && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                                      <span>Meals</span>
                                    </div>
                                  )}
                                  {(pass.ticketDetails?.hasMerchandise || pass.price && pass.price >= 1000) && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                                      <span>Merchandise</span>
                                    </div>
                                  )}
                                  {(pass.ticketDetails?.hasWorkshopAccess || pass.price && pass.price >= 1500) && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                                      <span>Workshop Access</span>
                                    </div>
                                  )}
                                  {(!pass.price || pass.price < 500) && (
                                    <>
                                      <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        <span>Event Access</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        <span>Networking</span>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {pass.qrCodeUrl ? (
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
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> Startup Expo</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> Panel Discussion</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> IPL Auction</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> AI Build-A-Thon</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> Biz-Arena League</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary" /> Certificate of participation</li>
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
            {myPasses.length > 0 && registeredSchedule.length > 0 && (
              <div className="flex justify-end mb-4">
                <Button
                  onClick={downloadSchedulePDF}
                  disabled={downloadingSchedule}
                  variant="outline"
                >
                  {downloadingSchedule ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download My Schedule (PDF)
                    </>
                  )}
                </Button>
              </div>
            )}

            {myPasses.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="mb-1">Events Included with Your Pass</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {registeredEventDetails.length === 0 ? 'Your eligible events will appear here once your pass is confirmed.' : `You have access to ${registeredEventDetails.length} event${registeredEventDetails.length > 1 ? 's' : ''} with your ${myPasses[0]?.passType}.`}
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
                  <Button onClick={() => onNavigate(myPasses.length > 0 ? "schedule" : "booking")}>
                    {myPasses.length > 0 ? "Browse Events" : "Book Pass"}
                  </Button>
                </CardContent>
              </Card>
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
                  console.log("TCET pass booking completed:", data);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-blue-500/10 p-4 sm:p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Enter Pass Details
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Already purchased a pass? Enter your booking details below.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassClaimModal(false)}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Form */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Pass Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pass Type</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={claimFormData.passType}
                  onChange={(e) => setClaimFormData(prev => ({ ...prev, passType: e.target.value }))}
                >
                  <option value="Pixel Pass">Pixel Pass (₹299)</option>
                  <option value="Silicon Pass">Silicon Pass (₹499)</option>
                  <option value="Quantum Pass">Quantum Pass (₹999)</option>
                  <option value="TCET Student Pass">TCET Student Pass (Free)</option>
                </select>
              </div>

              {/* Booking ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Booking ID / Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g., KONF-12345 or ES26-XXXXX"
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={claimFormData.bookingId}
                  onChange={(e) => setClaimFormData(prev => ({ ...prev, bookingId: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Found in your confirmation email</p>
              </div>

              {/* KonfHub Order ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium">KonfHub Order ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., ORD-XXXXXXXXXX"
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={claimFormData.konfhubOrderId}
                  onChange={(e) => setClaimFormData(prev => ({ ...prev, konfhubOrderId: e.target.value }))}
                />
              </div>

              {/* Ticket Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ticket Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., TKT-123456"
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={claimFormData.ticketNumber}
                  onChange={(e) => setClaimFormData(prev => ({ ...prev, ticketNumber: e.target.value }))}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Ticket PDF (Optional)</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
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
                  <label htmlFor="ticket-upload" className="cursor-pointer">
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">{uploadedFile.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            setUploadedFile(null);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload your ticket PDF or screenshot
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF or Image, max 10MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Info Alert */}
              <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>How it works:</strong> We'll verify your details against our records. If found immediately, your pass will be activated. Otherwise, we'll check periodically for up to 32 hours. Check back later for updates!
                </AlertDescription>
              </Alert>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t bg-muted/30 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPassClaimModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitPassClaim}
                disabled={isSubmittingClaim || (!claimFormData.bookingId && !claimFormData.konfhubOrderId && !claimFormData.ticketNumber)}
              >
                {isSubmittingClaim ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit Claim
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}