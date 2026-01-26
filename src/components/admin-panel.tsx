import React, { useState, useEffect, useCallback } from "react";
import { useUser, SignIn, useClerk } from "@clerk/clerk-react";
import {
  Users,
  Calendar,
  Ticket,
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
  Loader2,
  Home,
  X,
  FileCheck,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
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
  passTypeBreakdown: { [key: string]: number };
  overview: {
    totalPasses: number;
    activePasses: number;
    usedPasses: number;
    pendingPasses: number;
    totalRevenue: number;
  };
  byPassType: Array<{
    passType: string;
    count: number;
    revenue: number;
  }>;
  recentPasses: Array<{
    passType: string;
    status: string;
    price: number | null;
    createdAt: string;
    user: {
      email: string;
      fullName: string | null;
    };
  }>;
}

// Pagination interface
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Bundled dashboard response
interface DashboardResponse {
  stats: DashboardStats;
  users: {
    data: UserData[];
    pagination: PaginationInfo;
  };
  passes: {
    data: PassData[];
    pagination: PaginationInfo;
  };
  eventRegistrations: {
    data: EventRegistrationData[];
    pagination: PaginationInfo;
  };
  claims: {
    data: PassClaimData[];
    pagination: PaginationInfo;
  };
}

// User interface
interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone: string | null;
  college: string | null;
  yearOfStudy?: string | null;
  createdAt: string;
  bookingVerified: boolean;
  is_active?: boolean;
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
  passId: string | null;
  status: string;
  registrationDate: string;
  formData: any;
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
  pass: {
    id: string;
    passId: string;
    passType: string;
    bookingId: string | null;
  } | null;
}

// Pass Claim interface
interface PassClaimData {
  id: string;
  clerkUserId: string;
  email: string;
  fullName: string | null;
  passType: string;
  bookingId: string | null;
  konfhubOrderId: string | null;
  ticketNumber: string | null;
  extractedData: any;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'verified';
  verifiedAt: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    college: string | null;
    bookingVerified: boolean;
  } | null;
  passes: PassData[];
}

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

// Role permissions configuration
const ROLE_PERMISSIONS = {
  core: ["stats", "users", "events", "passes", "claims"],
  jc: ["stats", "users", "events", "passes", "claims"],
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
  const clerk = useClerk();
  const [activeTab, setActiveTab] = useState("stats");
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<AdminRole>(null);
  
  // Data states - now using bundled dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Modal states
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistrationData | null>(null);
  const [showFormDataModal, setShowFormDataModal] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [passTypeFilter, setPassTypeFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [claimStatusFilter, setClaimStatusFilter] = useState<string>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Expanded rows for pass details
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Helper to get auth headers for API calls
  const getAuthHeaders = async () => {
    try {
      let token: string | null = null;
      try {
        // Preferred: clerk.getToken()
        if (clerk && typeof (clerk as any).getToken === "function") {
          token = await (clerk as any).getToken();
        }
        // Fallback: clerk.session.getToken()
        else if (clerk && (clerk as any).session && typeof (clerk as any).session.getToken === "function") {
          token = await (clerk as any).session.getToken();
        }
        // Fallback: window.Clerk.session.getToken()
        else if (typeof window !== "undefined" && (window as any).Clerk && (window as any).Clerk.session && typeof (window as any).Clerk.session.getToken === "function") {
          token = await (window as any).Clerk.session.getToken();
        }
      } catch (e) {
        logger.debug('getToken source failed', e);
      }

      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        logger.debug('Using Clerk token for authentication');
      } else {
        logger.warn('No Clerk token available - user may not be properly authenticated');
      }
      return headers;
    } catch (error) {
      logger.error('Failed to get auth token:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  };

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

  // Fetch complete dashboard data in a single API call
  const fetchDashboardData = useCallback(async (page: number = 1) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/dashboard?page=${page}&limit=${itemsPerPage}`, {
        headers
      });

      if (response.status === 403) {
        logger.error("Admin access denied for dashboard endpoint");
        toast.error("Access denied. Your account does not have admin permissions.");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      } else {
        logger.error("Dashboard fetch failed:", data.message);
      }
    } catch (error) {
      logger.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (userRole) {
      fetchDashboardData();
    }
  }, [userRole, fetchDashboardData]);

  // Check Clerk-admin status by calling backend debug endpoint (no adminSecret)
  const checkClerkAdmin = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/admin/debug-admin-secret`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const json = await resp.json();
      if (json && typeof json.match !== 'undefined') {
        if (json.match) {
          toast.success('Clerk public metadata indicates admin access');
        } else {
          toast.error('Clerk public metadata does not indicate admin access');
        }
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (err) {
      logger.error('Error checking Clerk admin status:', err);
      toast.error('Failed to verify Clerk admin status');
    }
  };

  // Handle claim approval/rejection
  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    const adminNotes = prompt(`Enter admin notes for ${action}ing this claim:`);
    if (adminNotes === null) return; // User cancelled

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/claims/${claimId}/action`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          action,
          adminNotes
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Claim ${action}d successfully`);
        fetchDashboardData(); // Refresh dashboard data
      } else {
        toast.error(data.error || `Failed to ${action} claim`);
      }
    } catch (error) {
      logger.error(`Error ${action}ing claim:`, error);
      toast.error(`Failed to ${action} claim`);
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

  // Loading state
  if (!isLoaded || isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Get unique events for filter (from dashboard data)
  const uniqueEvents = Array.from(
    new Set(dashboardData?.eventRegistrations.data.map((r) => r.event?.id) || [])
  ).map((id) => {
    const reg = dashboardData?.eventRegistrations.data.find((r) => r.event?.id === id);
    return { id, title: reg?.event?.title || "Unknown" };
  });

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
                  fetchDashboardData();
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
            {hasPermission("users") && (
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            )}
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
            {hasPermission("claims") && (
              <TabsTrigger value="claims" className="gap-2">
                <FileCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Pass Claims</span>
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
                      {dashboardData?.stats.totalUsers || 0}
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
                      {dashboardData?.stats.totalPasses || 0}
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
                      {dashboardData?.stats.totalRegistrations || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pass Type Breakdown */}
            {dashboardData?.stats.passTypeBreakdown && Object.keys(dashboardData.stats.passTypeBreakdown).length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Pass Type Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(dashboardData.stats.passTypeBreakdown).map(([type, count]) => (
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

          {/* Users Tab */}
          {hasPermission("users") && (
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        {dashboardData?.users.data.length || 0} users found
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 min-w-[480px] max-w-full">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          fetchDashboardData();
                        }}
                        className="shrink-0"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Users Table */}
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                User
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden sm:table-cell">
                                Email
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                                College
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden lg:table-cell">
                                Pass Type
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Status
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData?.users.data.map((user) => (
                              <>
                                <tr key={user.id} className="border-b hover:bg-muted/50">
                                  <td className="p-4 align-middle">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Users className="h-4 w-4 text-primary" />
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          {user.fullName || user.firstName + " " + user.lastName || "N/A"}
                                        </div>
                                        <div className="text-sm text-muted-foreground sm:hidden">
                                          {user.email}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 align-middle hidden sm:table-cell">
                                    <div className="text-sm">{user.email}</div>
                                  </td>
                                  <td className="p-4 align-middle hidden md:table-cell">
                                    <div className="text-sm">{user.college || "N/A"}</div>
                                  </td>
                                  <td className="p-4 align-middle hidden lg:table-cell">
                                    <Badge variant="outline">
                                      {user.passes?.[0]?.passType || "No Pass"}
                                    </Badge>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Badge
                                      variant={user.is_active ? "default" : "secondary"}
                                    >
                                      {user.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setExpandedRows((prev) => {
                                        const newSet = new Set(prev);
                                        if (newSet.has(user.id)) {
                                          newSet.delete(user.id);
                                        } else {
                                          newSet.add(user.id);
                                        }
                                        return newSet;
                                      })}
                                    >
                                      {expandedRows.has(user.id) ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </td>
                                </tr>
                                
                                {/* Expanded User Details - Shown directly below the user row */}
                                {expandedRows.has(user.id) && (
                                  <tr key={`details-${user.id}`}>
                                    <td colSpan={6} className="p-0 bg-muted/30">
                                      <div className="p-4 border-l-4 border-l-primary">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                          <div>
                                            <h4 className="font-medium mb-2">Basic Information</h4>
                                            <div className="space-y-1 text-sm">
                                              <p><strong>Email:</strong> {user.email}</p>
                                              <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                                              <p><strong>College:</strong> {user.college || "N/A"}</p>
                                              <p><strong>Year:</strong> {user.yearOfStudy || "N/A"}</p>
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="font-medium mb-2">Pass Information</h4>
                                            <div className="space-y-1 text-sm">
                                              {user.passes && user.passes.length > 0 ? (
                                                user.passes.map((pass) => (
                                                  <div key={pass.id} className="flex items-center gap-2">
                                                    <Badge variant="outline">{pass.passType}</Badge>
                                                    <span className="text-muted-foreground">
                                                      Status: {pass.status}
                                                    </span>
                                                  </div>
                                                ))
                                              ) : (
                                                <p className="text-muted-foreground">No passes found</p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {dashboardData?.users.pagination && dashboardData.users.pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Showing {dashboardData.users.data.length} of {dashboardData.users.pagination.totalItems} users
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={dashboardData.users.pagination.currentPage === 1}
                            onClick={() => {
                              // TODO: Implement pagination with API call
                            }}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={dashboardData.users.pagination.currentPage === dashboardData.users.pagination.totalPages}
                            onClick={() => {
                              // TODO: Implement pagination with API call
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Event Registrations Tab */}
          {hasPermission("events") && (
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Event Registrations</CardTitle>
                      <CardDescription>
                        {dashboardData?.eventRegistrations.data.length || 0} registrations found
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 min-w-[480px] max-w-full">
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
                          <th className="text-left py-3 px-4 font-medium min-w-[120px] break-words">Pass</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[140px] hidden md:table-cell break-words">Date</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[100px] break-words">Status</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[100px] break-words">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.eventRegistrations.data.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                              No registrations found
                            </td>
                          </tr>
                        ) : (
                          dashboardData.eventRegistrations.data.map((reg) => (
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
                              <td className="py-3 px-4 break-words max-w-[150px]">
                                {reg.pass ? (
                                  <div>
                                    <p className="font-medium text-xs">{reg.pass.passType}</p>
                                    <p className="text-xs text-muted-foreground font-mono">{reg.pass.passId}</p>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">No pass</span>
                                )}
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
                              <td className="py-3 px-4 break-words max-w-[120px]">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRegistration(reg);
                                    setShowFormDataModal(true);
                                  }}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {dashboardData?.eventRegistrations.pagination && dashboardData.eventRegistrations.pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t gap-2">
                      <p className="text-sm text-muted-foreground">
                        Page {dashboardData.eventRegistrations.pagination.currentPage} of {dashboardData.eventRegistrations.pagination.totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement pagination with API call
                          }}
                          disabled={dashboardData.eventRegistrations.pagination.currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement pagination with API call
                          }}
                          disabled={dashboardData.eventRegistrations.pagination.currentPage === dashboardData.eventRegistrations.pagination.totalPages}
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
                        {dashboardData?.passes.data.length || 0} passes found
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative flex-1 min-w-[500px]">
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
                          <th className="text-left py-3 px-4 font-medium min-w-[140px]">Registration</th>
                          <th className="text-left py-3 px-4 font-medium min-w-[140px] hidden lg:table-cell">Date</th>
                          <th className="text-center py-3 px-4 font-medium min-w-[80px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.passes.data.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                              No passes found
                            </td>
                          </tr>
                        ) : (
                          dashboardData.passes.data.map((pass) => (
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
                                  <div>
                                    <Badge variant={pass.ticketDetails?.registrationStatus === 'Confirmed' ? 'default' : 'secondary'} className="text-xs">
                                      {pass.ticketDetails?.registrationStatus || 'N/A'}
                                    </Badge>
                                    {pass.ticketDetails?.registeredAt && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {formatDate(pass.ticketDetails.registeredAt)}
                                      </p>
                                    )}
                                  </div>
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
                  {dashboardData?.passes.pagination && dashboardData.passes.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Page {dashboardData.passes.pagination.currentPage} of {dashboardData.passes.pagination.totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement pagination with API call
                          }}
                          disabled={dashboardData.passes.pagination.currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement pagination with API call
                          }}
                          disabled={dashboardData.passes.pagination.currentPage === dashboardData.passes.pagination.totalPages}
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

          {/* Pass Claims Tab */}
          {hasPermission("claims") && (
            <TabsContent value="claims">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Pass Claims</CardTitle>
                      <CardDescription>
                        {dashboardData?.claims.data.length || 0} claims found
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 min-w-[200px] max-w-md">
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
                      <select
                        value={claimStatusFilter}
                        onChange={(e) => setClaimStatusFilter(e.target.value)}
                        className="h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shrink-0"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchDashboardData()}
                        className="shrink-0"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Claims List */}
                    {dashboardData?.claims.data.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No pass claims found</p>
                      </div>
                    ) : (
                      dashboardData.claims.data.map((claim) => (
                        <Card key={claim.id} className="border-l-4 border-l-amber-500">
                          <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <h3 className="font-semibold break-words">{claim.fullName || claim.user?.fullName || 'N/A'}</h3>
                                  <Badge 
                                    variant={
                                      claim.status === 'pending' ? 'default' : 
                                      claim.status === 'approved' ? 'default' : 
                                      claim.status === 'expired' ? 'secondary' : 
                                      'destructive'
                                    }
                                    className="capitalize"
                                  >
                                    {claim.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{claim.email}</p>
                                <p className="text-sm text-muted-foreground">{claim.user?.phone || 'N/A'} • {claim.user?.college || 'N/A'}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{claim.passType}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(claim.createdAt)}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {/* User Pass Information */}
                              {claim.passes && claim.passes.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Existing Passes</h4>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {claim.passes.map((pass) => (
                                      <div key={pass.id} className="p-3 bg-muted/50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium">{pass.passType}</p>
                                            <p className="text-sm text-muted-foreground">{pass.passId}</p>
                                            <p className="text-sm text-muted-foreground">
                                              Status: <Badge variant="outline" className="ml-1">{pass.status}</Badge>
                                            </p>
                                          </div>
                                          <Badge variant={pass.status === 'Active' ? 'default' : 'secondary'}>
                                            {pass.status}
                                          </Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Claim Details */}
                              <div>
                                <h4 className="font-medium mb-2">Claim Details</h4>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Booking ID</p>
                                    <p className="font-mono text-sm">{claim.bookingId || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {claim.status === 'pending' && (
                                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                                  <Button
                                    size="sm"
                                    onClick={() => handleClaimAction(claim.id, 'approve')}
                                    className="flex-1 min-w-0"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">Approve</span>
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleClaimAction(claim.id, 'reject')}
                                    className="flex-1 min-w-0"
                                  >
                                    <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">Reject</span>
                                  </Button>
                                </div>
                              )}
                              {claim.status !== 'pending' && (
                                <div className="pt-4 border-t">
                                  <p className="text-sm text-muted-foreground">
                                    This claim has been {claim.status}. {claim.processedAt && `Processed on ${formatDate(claim.processedAt)}`}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

        </Tabs>
      </div>

      {/* Form Data Modal */}
      <Dialog open={showFormDataModal} onOpenChange={setShowFormDataModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Registration Details - {selectedRegistration?.event?.title}
            </DialogTitle>
            <DialogDescription>
              Form data submitted by {selectedRegistration?.user?.fullName || selectedRegistration?.user?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRegistration?.formData && Object.keys(selectedRegistration.formData || {}).length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Registration Type</h4>
                  <p className="text-sm capitalize">{selectedRegistration.formData.registrationType?.replace('_', ' ') || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Pass Type</h4>
                  <p className="text-sm">{selectedRegistration.pass?.passType || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Pass ID</h4>
                  <p className="text-sm font-mono">{selectedRegistration.pass?.passId || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Registration Date</h4>
                  <p className="text-sm">{formatDate(selectedRegistration.registrationDate)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm text-muted-foreground mb-3">Form Details</h4>
                <div className="space-y-2">
                  {Object.entries(selectedRegistration.formData).map(([key, value]) => {
                    if (key === 'registrationType') return null;
                    return (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-sm font-medium min-w-[120px] capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                        </span>
                        <span className="text-sm text-muted-foreground break-words">
                          {typeof value === 'boolean' 
                            ? value ? 'Yes' : 'No'
                            : Array.isArray(value) 
                              ? value.join(', ')
                              : String(value || 'N/A')
                          }
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No form data available for this registration.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
