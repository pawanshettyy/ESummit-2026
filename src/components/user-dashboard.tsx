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
    razorpayPaymentId?: string;
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
  speaker?: string;
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
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);

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
          setMyPasses(data.data.passes);
        }
      } catch (error) {
        console.error("Error fetching passes:", error);
      } finally {
        setIsLoadingPasses(false);
      }
    };

    fetchPasses();
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
      "Gold Pass": "day1",
      "Silver Pass": "day2",
      "Platinum Pass": "full",
      "Group Pass (5+)": "group",
      "Group Pass": "group",
    };
    return passTypeMap[passTypeName] || "day1"; // Default to day1 if unknown
  };

  // Get all eligible events from all purchased passes
  const mySchedule = myPasses.length > 0
    ? myPasses.flatMap((pass) => getFormattedEventsForPass(getPassTypeId(pass.passType)))
    : [];

  // Remove duplicate events (in case user has multiple passes)
  const uniqueSchedule = mySchedule.filter(
    (event, index, self) => 
      index === self.findIndex((e) => e.id === event.id)
  );

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
          <TabsTrigger value="passes">My Passes</TabsTrigger>
          <TabsTrigger value="schedule">
            My Schedule
          </TabsTrigger>
          <TabsTrigger value="register">
            Register for Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="passes">
          {isLoadingPasses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading your passes...</span>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {myPasses.length > 0 ? (
                myPasses.map((pass) => (
                  <Card key={pass.passId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3>{pass.passType}</h3>
                          <p className="text-sm text-muted-foreground">
                            Purchased on {formatDate(pass.purchaseDate)}
                          </p>
                        </div>
                        <Badge variant={pass.status === 'Active' ? 'default' : 'secondary'}>
                          {pass.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border-2 border-dashed p-6 text-center">
                        <div className="mb-4 text-4xl">🎟️</div>
                        {pass.qrCodeUrl ? (
                          <div className="mx-auto mb-4">
                            <img 
                              src={pass.qrCodeUrl} 
                              alt={`QR Code for ${pass.passId}`}
                              className="mx-auto h-48 w-48 rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="mx-auto mb-4 h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                            <div className="text-xs text-muted-foreground">
                              QR Code
                            </div>
                          </div>
                        )}
                        <div className="font-mono text-sm text-muted-foreground">
                          {pass.passId}
                        </div>
                      </div>
                      
                      {/* Pass Features */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-semibold">₹{pass.price}</span>
                        </div>
                        {pass.hasMeals && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Meals Included</Badge>
                          </div>
                        )}
                        {pass.hasMerchandise && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Merchandise</Badge>
                          </div>
                        )}
                        {pass.hasWorkshopAccess && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Workshop Access</Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => downloadPassPDF(pass.passId)}
                          disabled={downloadingPassId === pass.passId}
                        >
                          {downloadingPassId === pass.passId ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download Pass
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => pass.transaction && downloadInvoicePDF(pass.transaction.id)}
                          disabled={!pass.transaction || downloadingInvoiceId === pass.transaction?.id}
                        >
                          {downloadingInvoiceId === pass.transaction?.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <FileText className="mr-2 h-4 w-4" />
                              Invoice
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Ticket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No passes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't purchased any passes yet. Get your pass now!
                  </p>
                  <Button onClick={() => onNavigate("passes")}>
                    Browse Passes
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule">{isLoadingPasses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading your schedule...</span>
            </div>
          ) : (
          <div className="space-y-4">
            {myPasses.length > 0 && uniqueSchedule.length > 0 && (
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
                    <Ticket className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="mb-1">Your Pass Access</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        You have access to the following events based on your pass{myPasses.length > 1 ? 'es' : ''}:
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

            {uniqueSchedule.length > 0 ? (
              <>
                {uniqueSchedule.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <Badge variant="outline" className="mt-1">
                              {event.category}
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
                  <h3 className="mb-2">No events in your schedule</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {myPasses.length > 0
                      ? "You'll see events here based on your purchased pass"
                      : "Purchase a pass to access E-Summit events"}
                  </p>
                  <Button onClick={() => onNavigate(myPasses.length > 0 ? "schedule" : "booking")}>
                    {myPasses.length > 0 ? "View All Events" : "Book Pass"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {uniqueSchedule.length > 0 && (
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

        <TabsContent value="register">
          {isLoadingPasses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading events...</span>
            </div>
          ) : myPasses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <UserPlus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2">No pass found</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Purchase a pass to register for E-Summit events
                </p>
                <Button onClick={() => onNavigate("booking")}>
                  Book Pass
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Ticket className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="mb-1">Event Registration</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Register for individual events you want to attend. Based on your pass{myPasses.length > 1 ? 'es' : ''}, you're eligible for the following events:
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

              <div className="grid gap-4">
                {uniqueSchedule.map((event) => {
                  const isRegistered = registeredEvents.has(event.id);
                  const isRegistering = registeringEventId === event.id;

                  return (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <Badge variant="outline" className="mt-1">
                                {event.category}
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
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
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
                            
                            {isRegistered ? (
                              <Button disabled className="w-full md:w-auto" variant="outline">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Registered
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handleEventRegistration(event.id)}
                                disabled={isRegistering}
                                className="w-full md:w-auto"
                              >
                                {isRegistering ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registering...
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Register for Event
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {uniqueSchedule.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2">No events available</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      You'll see available events here based on your purchased pass
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