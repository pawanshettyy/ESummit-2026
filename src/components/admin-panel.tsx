import { useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { 
  Users, 
  Ticket, 
  Calendar, 
  Search, 
  Download, 
  Filter,
  QrCode,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Lock,
  Scan,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { motion } from "motion/react";
import { QRScanner } from "./qr-scanner";
import { EventIDGenerator } from "./event-id-generator";
import { API_BASE_URL } from "../lib/api";

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

// Role permissions
const ROLE_PERMISSIONS = {
  "Core": {
    participants: true,
    scanner: true,
    analytics: true,
    eventIds: true,
    export: true,
    edit: true,
  },
  "JC": {
    participants: true,
    scanner: true,
    analytics: true,
    eventIds: false,
    export: true,
    edit: false,
  },
  "OC": {
    participants: true,
    scanner: true,
    analytics: false,
    eventIds: false,
    export: false,
    edit: false,
  },
};

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { user } = useUser();
  const { getToken } = useAuth(); // Use the useAuth hook to get getToken function
  
  // Get Clerk session token for API authentication
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  // Fetch session token when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken();
        setSessionToken(token);
      } catch (error) {
        console.error('Failed to get session token:', error);
      }
    };
    
    if (user) {
      fetchToken();
    }
  }, [user, getToken]);
  
  // Check if user has any valid admin role (Core, JC, or OC)
  const VALID_ADMIN_ROLES = ['Core', 'JC', 'OC'];
  const userRole = user?.publicMetadata?.role as string;
  const isAdmin = userRole && VALID_ADMIN_ROLES.includes(userRole);
  
  // If not admin, redirect to home
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <Lock className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Access Denied</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              You do not have permission to access the admin panel.
            </p>
            <Button onClick={() => onNavigate("home")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get user's role and permissions from Clerk
  const adminRole = userRole as keyof typeof ROLE_PERMISSIONS;
  const adminEmail = user?.primaryEmailAddress?.emailAddress || "admin@esummit.com";
  const permissions = ROLE_PERMISSIONS[adminRole] || ROLE_PERMISSIONS["OC"];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPassType, setFilterPassType] = useState("all");
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  
  // State for real data from database
  const [passes, setPasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statsData, setStatsData] = useState({
    totalRegistrations: 0,
    activePasses: 0,
    checkInsToday: 0,
  });

  // Fetch all passes from database (with optional silent mode)
  const fetchPasses = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      
      // Get fresh token for each request
      const token = await getToken();
      
      if (!token) {
        console.error('No authentication token available');
        if (!silent) {
          toast.error("Authentication failed. Please refresh the page.");
        }
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        const allPasses = data.data.passes || [];
        setPasses(allPasses);
        
        // Use statistics from backend
        setStatsData({
          totalRegistrations: data.data.stats.totalRegistrations || 0,
          activePasses: data.data.stats.activePasses || 0,
          checkInsToday: data.data.stats.checkInsToday || 0,
        });
        
        if (silent) {
          console.log('🔄 Admin panel data refreshed silently');
        }
      } else {
        console.error('API returned error:', data.error || data.message);
        if (!silent) {
          toast.error(data.error || "Failed to load pass data");
        }
      }
    } catch (error) {
      console.error("Error fetching passes:", error);
      if (!silent) {
        toast.error("Failed to load pass data");
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [getToken]); // Add getToken as dependency

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    if (isAdmin) {
      fetchPasses(false); // Initial load with loading state
      
      // Auto-refresh every 3 seconds silently
      const interval = setInterval(() => fetchPasses(true), 3000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, fetchPasses]); // Add fetchPasses to dependencies

  // Listen for check-in events to trigger immediate refresh
  useEffect(() => {
    const handleCheckInEvent = () => {
      console.log('✅ Check-in event received! Refreshing admin panel...');
      fetchPasses(true); // Silent refresh
    };

    window.addEventListener('checkin-success', handleCheckInEvent);
    return () => window.removeEventListener('checkin-success', handleCheckInEvent);
  }, [fetchPasses]); // Add fetchPasses as dependency to avoid stale closure

  // Export participants to CSV
  const exportToCSV = () => {
    try {
      // Create CSV headers
      const headers = ["Pass ID", "Name", "Email", "Phone", "College", "Pass Type", "Price", "Purchase Date", "Status", "Check-in Status", "Last Check-in"];
      
      // Create CSV rows
      const rows = filteredParticipants.map(p => [
        p.id,
        p.name,
        p.email,
        p.phone,
        p.college,
        p.passType,
        p.price,
        p.purchaseDate,
        p.status,
        p.checkInStatus,
        p.lastCheckInTime ? new Date(p.lastCheckInTime).toLocaleString() : "N/A"
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `esummit-participants-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV exported successfully!", {
        description: `${filteredParticipants.length} participants exported`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV");
    }
  };

  // Transform passes data for participants table
  const participants = passes.map((pass) => {
    const hasCheckIn = pass.checkIns && pass.checkIns.length > 0;
    const lastCheckIn = hasCheckIn ? pass.checkIns[0] : null;
    
    return {
      id: pass.passId,
      name: pass.user?.fullName || "Unknown",
      email: pass.user?.email || "No email",
      phone: pass.user?.phone || "No phone",
      college: pass.user?.college || "Not provided",
      passType: pass.passType,
      price: pass.price,
      purchaseDate: new Date(pass.purchaseDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: pass.status,
      checkInStatus: hasCheckIn ? "Checked In" : "Not Checked In",
      lastCheckInTime: lastCheckIn?.checkInTime,
      lastCheckInEvent: lastCheckIn?.event?.title,
      qrCodeUrl: pass.qrCodeUrl,
      yearOfStudy: pass.user?.yearOfStudy,
      totalCheckIns: pass.checkIns?.length || 0,
    };
  });

  // Statistics for display
  const stats = [
    {
      label: "Total Registrations",
      value: statsData.totalRegistrations.toLocaleString(),
      icon: Users,
    },
    {
      label: "Active Passes",
      value: statsData.activePasses.toLocaleString(),
      icon: Ticket,
    },
    {
      label: "Check-ins Today",
      value: statsData.checkInsToday.toLocaleString(),
      icon: CheckCircle,
    },
  ];

  // Pass type distribution
  const passTypeCount = passes.reduce((acc: any, pass) => {
    acc[pass.passType] = (acc[pass.passType] || 0) + 1;
    return acc;
  }, {});

  const passDistribution = Object.entries(passTypeCount).map(([type, count]: [string, any]) => ({
    type,
    count,
    percentage: Math.round((count / passes.length) * 100) || 0,
  }));

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPassType === "all" || p.passType === filterPassType;
    return matchesSearch && matchesFilter;
  });

  // Handle QR code scan
  const handleScan = (code: string) => {
    setScannedCode(code);
    const participant = participants.find(p => p.id === code);
    if (participant) {
      // In a real app, this would update the database
      toast.success("Check-in Successful!", {
        description: `${participant.name} - ${participant.passType}`,
      });
      console.log("Checked in:", participant.name);
    } else {
      toast.error("Invalid QR Code", {
        description: "Pass ID not found in the system",
      });
    }
  };

  const handleLogout = () => {
    toast.info("Logged out successfully", {
      description: "Admin session ended",
    });
    onNavigate("home");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1>Admin Dashboard</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Shield className="mr-1 h-3 w-3" />
              {adminRole}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            E-Summit 2026 Management Panel • {adminEmail}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={async () => {
              setIsRefreshing(true);
              await fetchPasses(false);
              setIsRefreshing(false);
              toast.success("Data refreshed successfully");
            }}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Role Permissions Info */}
      {(adminRole === "OC" || adminRole === "JC") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Your Access Level:</strong> {adminRole === "OC" 
                ? "You have access to Participants and QR Scanner only."
                : "You have access to Participants, QR Scanner, and Analytics."}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-2xl mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue={permissions.scanner ? "scanner" : permissions.participants ? "participants" : "analytics"} className="w-full">
        <TabsList className="mb-6">
          {permissions.participants && <TabsTrigger value="participants">Participants</TabsTrigger>}
          {permissions.scanner && <TabsTrigger value="scanner">QR Scanner</TabsTrigger>}
          {permissions.analytics && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
          {permissions.eventIds && <TabsTrigger value="event-ids">Event IDs</TabsTrigger>}
        </TabsList>

        {/* Participants Tab */}
        {permissions.participants ? (
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h3>All Participants</h3>
                  <div className="flex gap-2">
                    {permissions.export && (
                      <Button variant="outline" size="sm" onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or pass ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterPassType} onValueChange={setFilterPassType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Pass Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pass Types</SelectItem>
                    <SelectItem value="Full Summit Pass">Full Summit Pass</SelectItem>
                    <SelectItem value="Day 1 Pass">Day 1 Pass</SelectItem>
                    <SelectItem value="Day 2 Pass">Day 2 Pass</SelectItem>
                    <SelectItem value="VIP Pass">VIP Pass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Participants Table */}
              <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Pass Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {participant.name.split(" ").map((n: string) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">{participant.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {participant.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <Mail className="h-3 w-3" />
                              {participant.email}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {participant.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Building className="h-3 w-3" />
                            {participant.college}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {participant.passType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="text-xs">
                            {participant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {participant.checkInStatus === "Checked In" ? (
                            <Badge variant="default" className="text-xs bg-green-500">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Checked In
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              <XCircle className="mr-1 h-3 w-3" />
                              Not Checked In
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Participant Details</DialogTitle>
                                <DialogDescription>
                                  View complete information about this participant
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label>Full Name</Label>
                                    <p className="text-sm text-muted-foreground">{participant.name}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p className="text-sm text-muted-foreground">{participant.email}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p className="text-sm text-muted-foreground">{participant.phone}</p>
                                  </div>
                                  <div>
                                    <Label>College</Label>
                                    <p className="text-sm text-muted-foreground">{participant.college}</p>
                                  </div>
                                  <div>
                                    <Label>Pass Type</Label>
                                    <p className="text-sm text-muted-foreground">{participant.passType}</p>
                                  </div>
                                  <div>
                                    <Label>Price Paid</Label>
                                    <p className="text-sm text-muted-foreground">₹{participant.price}</p>
                                  </div>
                                  <div>
                                    <Label>Purchase Date</Label>
                                    <p className="text-sm text-muted-foreground">{participant.purchaseDate}</p>
                                  </div>
                                  <div>
                                    <Label>Pass ID</Label>
                                    <p className="text-sm text-muted-foreground font-mono">{participant.id}</p>
                                  </div>
                                  <div>
                                    <Label>Check-in Status</Label>
                                    <div className="flex items-center gap-2">
                                      {participant.checkInStatus === "Checked In" ? (
                                        <>
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                          <span className="text-sm text-green-600 dark:text-green-400">
                                            Checked In
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">
                                            Not Checked In
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {participant.lastCheckInTime && (
                                    <div>
                                      <Label>Last Check-in</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(participant.lastCheckInTime).toLocaleString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                      {participant.lastCheckInEvent && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Event: {participant.lastCheckInEvent}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="rounded-lg border p-4 text-center">
                                  <div className="mb-2 text-sm text-muted-foreground">QR Code</div>
                                  {participant.qrCodeUrl ? (
                                    <img 
                                      src={participant.qrCodeUrl} 
                                      alt={`QR Code for ${participant.id}`}
                                      className="mx-auto h-32 w-32 rounded-lg bg-white p-2 border"
                                    />
                                  ) : (
                                    <div className="mx-auto h-32 w-32 rounded-lg bg-muted flex items-center justify-center">
                                      <QrCode className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredParticipants.length} of {participants.length} participants
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        ) : null}

        {/* QR Scanner Tab */}
        {permissions.scanner ? (
          <TabsContent value="scanner">
            <QRScanner />
          </TabsContent>
        ) : null}

        {/* Analytics Tab */}
        {permissions.analytics ? (
          <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3>Pass Type Distribution</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passDistribution.map((pass) => (
                    <div key={pass.type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{pass.type}</span>
                        <span className="text-muted-foreground">{pass.count} ({pass.percentage}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${pass.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <h3>Pass Statistics</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passDistribution.map((pass) => {
                    return (
                      <div key={pass.type} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="text-sm">{pass.type}</div>
                          <div className="text-xs text-muted-foreground">{pass.count} passes</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{pass.percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Total Passes</div>
                      <div className="text-lg text-primary">{statsData.totalRegistrations.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <h3>College-wise Registration</h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {(() => {
                    // Group passes by college
                    const collegeCount = passes.reduce((acc: any, pass) => {
                      const college = pass.user?.college || "Others";
                      acc[college] = (acc[college] || 0) + 1;
                      return acc;
                    }, {});
                    
                    // Sort by count and take top 6
                    const topColleges = Object.entries(collegeCount)
                      .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                      .slice(0, 6);
                    
                    return topColleges.map(([college, count]: [string, any]) => (
                      <div key={college} className="rounded-lg border p-4 text-center">
                        <Building className="mx-auto mb-2 h-8 w-8 text-primary" />
                        <div className="text-2xl mb-1">{count as number}</div>
                        <div className="text-sm text-muted-foreground">{college}</div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        ) : null}

        {/* Event ID Generator Tab */}
        {permissions.eventIds && (
          <TabsContent value="event-ids">
            <div className="p-4">
              <EventIDGenerator />
            </div>
          </TabsContent>
        )}

        {/* Access Restricted Message */}
        {!permissions.participants && !permissions.scanner && !permissions.analytics && (
          <div className="flex items-center justify-center py-20">
            <Card className="max-w-md border-destructive/50">
              <CardContent className="p-8 text-center">
                <Lock className="mx-auto mb-4 h-12 w-12 text-destructive" />
                <h3 className="mb-2">Access Restricted</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your role ({adminRole}) does not have permission to access any admin panels.
                </p>
                <Button variant="outline" onClick={() => onNavigate("home")}>
                  Return Home
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
}
