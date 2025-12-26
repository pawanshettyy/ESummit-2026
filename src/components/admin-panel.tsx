import React, { useState, useEffect, useCallback } from "react";
import { useUser, SignIn, useAuth } from "@clerk/clerk-react";
import {
  Users,
  Calendar,
  Ticket,
  Upload,
  Download,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  LogOut,
  Shield,
  BarChart3,
  FileSpreadsheet,
  Loader2,
  Home,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { API_BASE_URL } from "../lib/api";
import { logger } from "../utils/logger";
/// <reference types="vite/client" />

// Role type definition
type AdminRole = "core" | "jc" | "oc" | null;

// Stats interface
interface DashboardStats {
  totalUsers: number;
  totalPasses: number;
  verifiedPasses: number;
  unverifiedPasses: number;
  totalEvents: number;
  totalRegistrations: number;
  checkInsToday: number;
  passTypeBreakdown: { [key: string]: number };
}

// User interface
interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  college: string | null;
  createdAt: string;
  bookingVerified: boolean;
  clerkUserId: string | null;
  passes: PassData[];
}

// Pass interface
interface PassData {
  id: string;
  passId: string;
  passType: string;
  status: string;
  bookingId: string | null;
  konfhubOrderId: string | null;
  price: number | null;
  createdAt: string;
  purchaseDate?: string;
  ticketDetails?: {
    attendeeName?: string;
    email?: string;
    phone?: string;
    college?: string;
    teamName?: string;
    registrationStatus?: string;
    registeredAt?: string;
    paymentMethod?: string;
    ticketUrl?: string;
    invoiceUrl?: string;
    checkInStatus?: string;
    checkInTime?: string;
    whatsappNumber?: string;
    buyerName?: string;
    buyerEmail?: string;
    amountPaid?: string;
    ticketPrice?: string;
    discountAmount?: string;
    couponCode?: string;
    refundAmount?: string;
    refundType?: string;
    importedAt?: string;
    importBatchId?: string;
  };
  user?: {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    college: string | null;
    bookingVerified: boolean;
  };
}

// Event Registration interface
interface EventRegistrationData {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  registrationDate: string;
  participantName: string | null;
  participantEmail: string | null;
  event: {
    id: string;
    title: string;
    date: string;
    venue: string;
  };
  user: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

// Role permissions configuration
const ROLE_PERMISSIONS = {
  core: ["stats", "users", "events", "passes", "upload"],
  jc: ["stats", "users", "events", "passes"],
  oc: ["stats", "users", "events"],
};

// Authorized emails for each role (you should configure this in your Clerk dashboard with custom claims)
// For now, we'll check Clerk metadata or use a simple mapping
const ADMIN_ROLES: { [email: string]: AdminRole } = {
  // Add your admin emails here
  // Example:
  // "admin@tcetmumbai.in": "core",
  // "jc@tcetmumbai.in": "jc",
  // "oc@tcetmumbai.in": "oc",
};

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<AdminRole>(null);
  
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [passes, setPasses] = useState<PassData[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistrationData[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [passTypeFilter, setPassTypeFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  
  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Expanded rows for pass details
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Determine user role from Clerk metadata or email mapping
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Check Clerk public metadata for role
      const clerkRole = (user.publicMetadata?.adminRole as AdminRole) || null;
      
      // Fallback to email mapping
      const email = user.primaryEmailAddress?.emailAddress || "";
      const mappedRole = ADMIN_ROLES[email] || null;
      
      // Check if user has org membership with role
      const orgRole = user.organizationMemberships?.[0]?.role;
      let finalRole: AdminRole = clerkRole || mappedRole;
      
      // Map org roles to admin roles
      if (orgRole === "org:admin" || orgRole === "admin") {
        finalRole = "core";
      } else if (orgRole === "org:member" || orgRole === "member") {
        // Check for JC/OC in metadata
        const memberRole = (user.publicMetadata?.role as string)?.toLowerCase();
        if (memberRole === "jc") finalRole = "jc";
        else if (memberRole === "oc") finalRole = "oc";
      }
      
      // Remove dev-only fallback: only assign role if found in Clerk or mapping
      
      setUserRole(finalRole);
      setIsLoading(false);
    } else if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  // Check if user has permission for a feature
  const hasPermission = (feature: string): boolean => {
    if (!userRole) return false;
    return ROLE_PERMISSIONS[userRole]?.includes(feature) || false;
  };

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          "x-admin-secret": (import.meta as ImportMeta).env.VITE_ADMIN_SECRET || "esummit2026-admin-import",
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      // Log error, do not set mock stats in production
      if (typeof logger !== 'undefined') logger.error("Error fetching stats:", error);
    }
  }, []);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          "x-admin-secret": (import.meta as ImportMeta).env.VITE_ADMIN_SECRET || "esummit2026-admin-import",
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users || []);
      }
    } catch (error) {
      if (typeof logger !== 'undefined') logger.error("Error fetching users:", error);
      setUsers([]);
    }
  }, []);

  // Fetch all passes
  const fetchPasses = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/passes`, {
        headers: {
          "x-admin-secret": (import.meta as ImportMeta).env.VITE_ADMIN_SECRET || "esummit2026-admin-import",
        },
      });
      const data = await response.json();
      if (data.success) {
        setPasses(data.data.passes || []);
      }
    } catch (error) {
      if (typeof logger !== 'undefined') logger.error("Error fetching passes:", error);
      setPasses([]);
    }
  }, []);

  // Fetch event registrations
  const fetchEventRegistrations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/registrations`, {
        headers: {
          "x-admin-secret": (import.meta as ImportMeta).env.VITE_ADMIN_SECRET || "esummit2026-admin-import",
        },
      });
      const data = await response.json();
      if (data.success) {
        setEventRegistrations(data.data.registrations || []);
      }
    } catch (error) {
      if (typeof logger !== 'undefined') logger.error("Error fetching registrations:", error);
      setEventRegistrations([]);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (userRole) {
      fetchStats();
      if (hasPermission("users")) fetchUsers();
      if (hasPermission("passes")) fetchPasses();
      if (hasPermission("events")) fetchEventRegistrations();
    }
  }, [userRole, fetchStats, fetchUsers, fetchPasses, fetchEventRegistrations]);

  // Handle CSV upload
  const handleFileUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/import-passes`, {
        method: "POST",
        headers: {
          "x-admin-secret": (import.meta as ImportMeta).env.VITE_ADMIN_SECRET || "esummit2026-admin-import",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully imported ${data.data.imported} passes!`, {
          description: `Skipped: ${data.data.skipped}, Errors: ${data.data.errors}`,
        });
        setUploadFile(null);
        // Refresh data
        fetchStats();
        fetchPasses();
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to import passes");
      }
    } catch (error) {
      if (typeof logger !== 'undefined') logger.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Filter passes
  const filteredPasses = passes.filter((pass) => {
    const matchesSearch =
      searchQuery === "" ||
      pass.passId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.bookingId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPassType =
      passTypeFilter === "all" || pass.passType === passTypeFilter;

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && pass.user?.bookingVerified) ||
      (verificationFilter === "unverified" && !pass.user?.bookingVerified);

    return matchesSearch && matchesPassType && matchesVerification;
  });

  // Filter event registrations
  const filteredRegistrations = eventRegistrations.filter((reg) => {
    const matchesSearch =
      searchQuery === "" ||
      reg.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.event?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEvent =
      eventFilter === "all" || reg.event?.id === eventFilter;

    return matchesSearch && matchesEvent;
  });

  // Pagination
  const paginatedPasses = filteredPasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(
    (activeTab === "passes" ? filteredPasses.length : filteredRegistrations.length) /
      itemsPerPage
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get unique events for filter
  const uniqueEvents = Array.from(
    new Set(eventRegistrations.map((r) => r.event?.id))
  ).map((id) => {
    const reg = eventRegistrations.find((r) => r.event?.id === id);
    return { id, title: reg?.event?.title || "Unknown" };
  });

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not signed in - show login
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Sign in with your authorized account to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-muted",
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  footerAction: "hidden",
                }
              }}
              redirectUrl="/admin"
              afterSignInUrl="/admin"
            />
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("home")}
                className="text-muted-foreground"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No admin role - unauthorized
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
              Contact your administrator to request access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-muted/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Signed in as: {user?.primaryEmailAddress?.emailAddress}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button
                className="flex-1"
                onClick={() => onNavigate("home")}
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="border-b bg-background/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title and icon section */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-xl bg-primary/10 shadow-sm flex-shrink-0">
                <Shield className="text-primary h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight truncate">Admin Panel</h1>
                <p className="text-sm text-muted-foreground font-medium truncate">
                  E-Summit 2026 Management
                </p>
              </div>
            </div>
            {/* Button and info group */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
              <Badge variant="secondary" className="capitalize px-2 py-1 rounded-lg text-sm sm:text-base flex-shrink-0">
                {userRole} Team
              </Badge>
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline font-mono max-w-[160px] truncate" title={user?.primaryEmailAddress?.emailAddress}>
                {user?.primaryEmailAddress?.emailAddress}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg border-muted h-9 w-9 flex-shrink-0"
                onClick={() => {
                  fetchStats();
                  if (hasPermission("users")) fetchUsers();
                  if (hasPermission("passes")) fetchPasses();
                  if (hasPermission("events")) fetchEventRegistrations();
                  toast.success("Data refreshed");
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg border-muted h-9 w-9 flex-shrink-0"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg border-muted h-9 w-9 flex-shrink-0"
                onClick={() => onNavigate("home")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            {hasPermission("events") && (
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Event Registrations</span>
              </TabsTrigger>
            )}
            {hasPermission("passes") && (
              <TabsTrigger value="passes" className="gap-2">
                <Ticket className="h-4 w-4" />
                <span className="hidden sm:inline">Pass Details</span>
              </TabsTrigger>
            )}
            {hasPermission("upload") && (
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Import CSV</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">
                      {stats?.totalUsers || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Passes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">
                      {stats?.totalPasses || 0}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className="text-green-600">
                      ✓ {stats?.verifiedPasses || 0} verified
                    </span>
                    <span className="text-amber-600">
                      ○ {stats?.unverifiedPasses || 0} pending
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Event Registrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">
                      {stats?.totalRegistrations || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Check-ins Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">
                      {stats?.checkInsToday || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pass Type Breakdown */}
            {stats?.passTypeBreakdown && Object.keys(stats.passTypeBreakdown).length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Pass Type Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(stats.passTypeBreakdown).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <span className="font-medium">{type}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Event Registrations Tab */}
          {hasPermission("events") && (
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Event Registrations</CardTitle>
                      <CardDescription>
                        {filteredRegistrations.length} registrations found
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 min-w-[180px] max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search by name or email..."
                          className="w-full h-10 pl-9 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-0"
                          value={searchQuery}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                          style={{ minWidth: 0 }}
                        />
                      </div>
                      <div className="flex-1 min-w-[140px] max-w-full">
                        <select
                          className="h-10 w-full px-3 rounded-lg border bg-background text-sm min-w-0"
                          value={eventFilter}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEventFilter(e.target.value)}
                          style={{ minWidth: 0 }}
                        >
                          <option value="all">All Events</option>
                          {uniqueEvents.map((event) => (
                            <option key={event.id} value={event.id}>
                              {event.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium min-w-[180px] break-words">User</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[180px] break-words">Event</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[140px] hidden md:table-cell break-words">Date</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[100px] break-words">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRegistrations.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-muted-foreground">
                              No registrations found
                            </td>
                          </tr>
                        ) : (
                          paginatedRegistrations.map((reg) => (
                            <tr key={reg.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 break-words max-w-[220px]">
                                <div>
                                  <p className="font-medium">{reg.user?.fullName || "N/A"}</p>
                                  <p className="text-xs text-muted-foreground">{reg.user?.email}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4 break-words max-w-[220px]">
                                <p className="font-medium">{reg.event?.title}</p>
                                <p className="text-xs text-muted-foreground">{reg.event?.venue}</p>
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell text-muted-foreground break-words max-w-[180px]">
                                {formatDate(reg.registrationDate)}
                              </td>
                              <td className="py-3 px-4 break-words max-w-[120px]">
                                <Badge
                                  variant={reg.status === "registered" ? "default" : "secondary"}
                                >
                                  {reg.status}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t gap-2">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Pass Details Tab */}
          {hasPermission("passes") && (
            <TabsContent value="passes">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>Pass Details</CardTitle>
                      <CardDescription>
                        {filteredPasses.length} passes found
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search by ID, email, name..."
                          className="w-full h-10 pl-9 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={searchQuery}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <select
                        className="h-10 px-3 rounded-lg border bg-background text-sm"
                        value={passTypeFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPassTypeFilter(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="Pixel Pass">Pixel Pass</option>
                        <option value="Silicon Pass">Silicon Pass</option>
                        <option value="Quantum Pass">Quantum Pass</option>
                        <option value="TCET Student Pass">TCET Student</option>
                      </select>
                      <select
                        className="h-10 px-3 rounded-lg border bg-background text-sm"
                        value={verificationFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVerificationFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium min-w-[120px]">Pass ID</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[160px]">User</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[120px] hidden md:table-cell">Type</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[100px]">Verified</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[140px] hidden lg:table-cell">Date</th>
                          <th className="text-center py-3 px-4 font-medium min-w-[80px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPasses.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                              No passes found
                            </td>
                          </tr>
                        ) : (
                          paginatedPasses.map((pass) => (
                            <>
                              <tr key={pass.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {pass.passId}
                                  </code>
                                </td>
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="font-medium">{pass.user?.fullName || "N/A"}</p>
                                    <p className="text-xs text-muted-foreground">{pass.user?.email}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4 hidden md:table-cell">
                                  <Badge variant="outline">{pass.passType}</Badge>
                                </td>
                                <td className="py-3 px-4">
                                  {pass.user?.bookingVerified ? (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <CheckCircle2 className="h-4 w-4" />
                                      <span className="text-xs hidden sm:inline">Verified</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-amber-600">
                                      <AlertCircle className="h-4 w-4" />
                                      <span className="text-xs hidden sm:inline">Pending</span>
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                                  {formatDate(pass.createdAt)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleRowExpansion(pass.id)}
                                  >
                                    {expandedRows.has(pass.id) ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </td>
                              </tr>
                              {expandedRows.has(pass.id) && (
                                <tr className="bg-muted/30">
                                  <td colSpan={6} className="py-4 px-4">
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm break-words min-w-0">
                                      {/* Booking Info */}
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Booking ID</p>
                                        <p className="font-mono text-xs">{pass.bookingId || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Payment ID</p>
                                        <p className="font-mono text-xs">{pass.konfhubOrderId || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Amount Paid</p>
                                        <p className="font-semibold">₹{pass.price || pass.ticketDetails?.amountPaid || 0}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Status</p>
                                        <Badge variant={
                                          pass.status === 'Active' ? 'default' : 
                                          pass.status === 'Cancelled' ? 'destructive' : 
                                          pass.status === 'Used' ? 'secondary' : 'outline'
                                        }>{pass.status}</Badge>
                                      </div>
                                      
                                      {/* Contact Info */}
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Phone</p>
                                        <p>{pass.user?.phone || pass.ticketDetails?.phone || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">College</p>
                                        <p>{pass.user?.college || pass.ticketDetails?.college || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Registration Status</p>
                                        <p>{pass.ticketDetails?.registrationStatus || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Registered At</p>
                                        <p className="text-xs">{pass.ticketDetails?.registeredAt || formatDate(pass.createdAt)}</p>
                                      </div>
                                      
                                      {/* Check-in Info */}
                                      <div>
                                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Check-in Status</p>
                                        <p className="flex items-center gap-1">
                                          {pass.ticketDetails?.checkInStatus?.toLowerCase() === 'true' ? (
                                            <><CheckCircle2 className="h-3 w-3 text-green-600" /> Checked In</>
                                          ) : (
                                            <><XCircle className="h-3 w-3 text-muted-foreground" /> Not Checked In</>
                                          )}
                                        </p>
                                      </div>
                                      
                                      {/* Payment Info */}
                                      {pass.ticketDetails?.couponCode && (
                                        <div>
                                          <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Coupon Code</p>
                                          <code className="bg-muted px-2 py-0.5 rounded text-xs">{pass.ticketDetails.couponCode}</code>
                                        </div>
                                      )}
                                      {pass.ticketDetails?.paymentMethod && (
                                        <div>
                                          <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Payment Method</p>
                                          <p>{pass.ticketDetails.paymentMethod}</p>
                                        </div>
                                      )}
                                      
                                      {/* Refund Info if applicable */}
                                      {(pass.ticketDetails?.refundAmount && pass.ticketDetails.refundAmount !== '0') && (
                                        <div>
                                          <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Refund</p>
                                          <p className="text-red-600">₹{pass.ticketDetails.refundAmount} ({pass.ticketDetails?.refundType || 'N/A'})</p>
                                        </div>
                                      )}
                                      
                                      {/* Links */}
                                      {(pass.ticketDetails?.ticketUrl || pass.ticketDetails?.invoiceUrl) && (
                                        <div className="col-span-full flex gap-2 pt-2 border-t">
                                          {pass.ticketDetails?.ticketUrl && (
                                            <a 
                                              href={pass.ticketDetails.ticketUrl} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                              <Eye className="h-3 w-3" /> View Ticket
                                            </a>
                                          )}
                                          {pass.ticketDetails?.invoiceUrl && (
                                            <a 
                                              href={pass.ticketDetails.invoiceUrl} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                              <Download className="h-3 w-3" /> Invoice
                                            </a>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* CSV Upload Tab */}
          {hasPermission("upload") && (
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Import Pass Data</CardTitle>
                  <CardDescription>
                    Upload a CSV or Excel file exported from KonfHub to import pass data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                    <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Supported formats:</strong> CSV (.csv) and Excel (.xlsx, .xls) files exported from KonfHub.
                      The import will create new passes and update existing ones based on email matching.
                    </AlertDescription>
                  </Alert>

                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      id="csv-upload"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadFile(file);
                          toast.success(`File selected: ${file.name}`);
                        }
                      }}
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer block">
                      {uploadFile ? (
                        <div className="space-y-3">
                          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{uploadFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(uploadFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setUploadFile(null);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove file
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">Click to upload</p>
                            <p className="text-sm text-muted-foreground">
                              CSV or Excel file (max 50MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleFileUpload}
                    disabled={!uploadFile || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Pass Data
                      </>
                    )}
                  </Button>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">Expected columns:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Email Address (required)</li>
                      <li>Name / Full Name</li>
                      <li>Phone Number</li>
                      <li>Ticket name (pass type)</li>
                      <li>Booking ID</li>
                      <li>Payment ID</li>
                      <li>Amount paid</li>
                      <li>Registration status</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
