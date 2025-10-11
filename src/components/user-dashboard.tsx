import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Download,
  Calendar,
  Ticket,
  FileText,
  Loader2,
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
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getFormattedEventsForPass } from "../utils/pass-events";
import { ProfileCompletionModal } from "./profile-completion-modal";

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
    id: number;
    amount: number;
    status: string;
    razorpayPaymentId?: string;
  };
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
          `http://localhost:5000/api/v1/passes/user/${user.id}`
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
        const response = await fetch(
          `http://localhost:5000/api/v1/users/check-profile/${user.id}`
        );
        const data = await response.json();

        if (data.success && !data.data.isComplete) {
          setShowProfileModal(true);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user?.id]);

  const handleProfileComplete = () => {
    setShowProfileModal(false);
  };

  // Get all eligible events from all purchased passes
  const mySchedule = myPasses.length > 0
    ? myPasses.flatMap((pass) => getFormattedEventsForPass(pass.passId))
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
      const response = await fetch(
        `http://localhost:5000/api/v1/pdf/pass/${passId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to download pass PDF');
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
      alert('Failed to download pass PDF. Please try again.');
    }
  };

  // Download invoice PDF
  const downloadInvoicePDF = async (transactionId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/pdf/invoice/${transactionId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to download invoice PDF');
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
      alert('Failed to download invoice PDF. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
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
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Pass
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => pass.transaction && downloadInvoicePDF(pass.transaction.id.toString())}
                          disabled={!pass.transaction}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Invoice
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
      </Tabs>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onComplete={handleProfileComplete}
      />
    </div>
  );
}