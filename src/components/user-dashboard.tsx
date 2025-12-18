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

interface Pass {
  id: number;
  passId: string;
  passType: string;
  price: number;
  purchaseDate: string;
  status: string;
  hasMeals: boolean;
  hasMerchandise: boolean;
  hasWorkshopAccess: boolean;
  qrCodeUrl?: string;
  transaction?: {
    id: string;  // UUID string, not number
    amount: number;
    status: string;
    konfhubPaymentId?: string;
  };
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
  const [activeTab, setActiveTab] = useState("passes");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [myPasses, setMyPasses] = useState<Pass[]>([]);
  const [isLoadingPasses, setIsLoadingPasses] = useState(true);
  const [downloadingPassId, setDownloadingPassId] = useState<string | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
  const [downloadingSchedule, setDownloadingSchedule] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [registeredEventDetails, setRegisteredEventDetails] = useState<Event[]>([]);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);

  const mockUser = {
    name: user?.fullName || userData?.name || "User",
    email: user?.primaryEmailAddress?.emailAddress || userData?.email || "user@example.com",
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
          // Only show passes with confirmed payment (Active status and completed transaction)
          const confirmedPasses = data.data.passes.filter((pass: Pass) => {
            return pass.status === 'Active' && 
                   pass.transaction && 
                   pass.transaction.status === 'completed';
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

  // Download invoice PDF
  const downloadInvoicePDF = async (transactionId: string) => {
    try {
      setDownloadingInvoiceId(transactionId);
      const response = await fetch(
        `${API_BASE_URL}/pdf/invoice/${transactionId}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download invoice PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ESUMMIT-2026-Invoice.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice PDF:', error);
      alert(error instanceof Error ? error.message : 'Failed to download invoice PDF. Please try again.');
    } finally {
      setDownloadingInvoiceId(null);
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
          <TabsTrigger value="passes">TCET Student Pass</TabsTrigger>
          <TabsTrigger value="schedule">
            My Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="passes">
          {isLoadingPasses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
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
                    onClick={() => window.open('https://konfhub.com/tcet-esummit26', '_blank')}
                  >
                    Book TCET Students Pass (Free)
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

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
    </div>
  );
}