import React, { useState, useEffect, useCallback } from "react";
import { useUser, SignIn, useAuth } from "@clerk/clerk-react";
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
  attendeeName: string;
  email: string;
  phone: string;
  college: string;
  passType: string;
  bookingId: string | null;
  konfhubOrderId: string | null;
  price: number | null;
  ticketUrl: string | null;
  ticketFileUrl: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  reason: string;
  adminNotes: string | null;
  createdAt: string;
  processedAt: string | null;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    college: string | null;
    bookingVerified: boolean;
  };
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
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<AdminRole>(null);
  
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [passes, setPasses] = useState<PassData[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistrationData[]>([]);
  const [claims, setClaims] = useState<PassClaimData[]>([]);
  
  // Modal states
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistrationData | null>(null);
  const [showFormDataModal, setShowFormDataModal] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [passTypeFilter, setPassTypeFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  
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
      const response = await fetch(`${API_BASE_URL}/admin/stats`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      // Log error, do not set mock stats in production
      logger.error("Error fetching stats:", error);
    }
  }, []);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users || []);
      }
    } catch (error) {
      logger.error("Error fetching users:", error);
      setUsers([]);
    }
  }, []);

  // Fetch all passes
  const fetchPasses = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/passes`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setPasses(data.data.passes || []);
      }
    } catch (error) {
      logger.error("Error fetching passes:", error);
      setPasses([]);
    }
  }, []);

  // Fetch event registrations
  const fetchEventRegistrations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/registrations`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setEventRegistrations(data.data.registrations || []);
      }
    } catch (error) {
      logger.error("Error fetching registrations:", error);
      setEventRegistrations([]);
    }
  }, []);

  // Fetch pass claims
  const fetchClaims = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/claims`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setClaims(data.data.claims || []);
      }
    } catch (error) {
      logger.error("Error fetching claims:", error);
      setClaims([]);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (userRole) {
      fetchStats();
      if (hasPermission("users")) fetchUsers();
      if (hasPermission("passes")) fetchPasses();
      if (hasPermission("events")) fetchEventRegistrations();
      if (hasPermission("claims")) fetchClaims();
    }
  }, [userRole, fetchStats, fetchUsers, fetchPasses, fetchEventRegistrations, fetchClaims]);

  // Check Clerk-admin status by calling backend debug endpoint (no adminSecret)
  const checkClerkAdmin = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/admin/debug-admin-secret`, {
        method: 'GET',
        credentials: 'include',
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
      const form = new URLSearchParams();
      form.append('action', action);
      form.append('adminNotes', adminNotes);

      const response = await fetch(`${API_BASE_URL}/admin/claims/${claimId}/action`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Claim ${action}d successfully`);
        fetchClaims(); // Refresh claims list
        fetchStats(); // Refresh stats
        fetchPasses(); // Refresh passes if approved
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

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.college && user.college.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

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

  // Filter claims
  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      searchQuery === "" ||
      claim.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.bookingId?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedPasses = filteredPasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(
    (activeTab === "users" ? filteredUsers.length :
     activeTab === "passes" ? filteredPasses.length : filteredRegistrations.length) /
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
                  if (hasPermission("claims")) fetchClaims();
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

          {/* Users Tab */}
          {hasPermission("users") && (
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        {filteredUsers.length} users found
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
                          fetchUsers();
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
                            {paginatedUsers.map((user) => (
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
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Expanded User Details */}
                    {expandedRows.size > 0 && (
                      <div className="space-y-4">
                        {filteredUsers
                          .filter((user) => expandedRows.has(user.id))
                          .map((user) => (
                            <Card key={`details-${user.id}`} className="border-l-4 border-l-primary">
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  {user.fullName || user.firstName + " " + user.lastName || "User Details"}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
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
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}

                    {/* Pagination */}
                    {filteredUsers.length > itemsPerPage && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Showing {paginatedUsers.length} of {filteredUsers.length} users
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage * itemsPerPage >= filteredUsers.length}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
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
                        {filteredRegistrations.length} registrations found
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
                        {paginatedRegistrations.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
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

          {/* Pass Claims Tab */}
          {hasPermission("claims") && (
            <TabsContent value="claims">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Pass Claims</CardTitle>
                      <CardDescription>
                        {filteredClaims.length} claims found
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
                        onClick={() => fetchClaims()}
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
                    {filteredClaims.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No pass claims found</p>
                      </div>
                    ) : (
                      filteredClaims.map((claim) => (
                        <Card key={claim.id} className="border-l-4 border-l-amber-500">
                          <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{claim.attendeeName}</h3>
                                  <Badge variant={claim.status === 'pending' ? 'default' : claim.status === 'approved' ? 'default' : 'destructive'}>
                                    {claim.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{claim.email}</p>
                                <p className="text-sm text-muted-foreground">{claim.phone} • {claim.college}</p>
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
                                  <div>
                                    <p className="text-sm text-muted-foreground">KonfHub Order ID</p>
                                    <p className="font-mono text-sm">{claim.konfhubOrderId || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="font-medium">₹{claim.price || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Reason</p>
                                    <p className="text-sm">{claim.reason}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Ticket URL */}
                              {claim.ticketUrl && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Ticket URL</p>
                                  <a
                                    href={claim.ticketUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm break-all"
                                  >
                                    {claim.ticketUrl}
                                  </a>
                                </div>
                              )}

                              {/* Ticket File */}
                              {claim.ticketFileUrl && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Uploaded Ticket File</p>
                                  <a
                                    href={claim.ticketFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    View Uploaded File
                                  </a>
                                </div>
                              )}

                              {/* Admin Notes */}
                              {claim.adminNotes && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Admin Notes</p>
                                  <p className="text-sm bg-muted p-2 rounded">{claim.adminNotes}</p>
                                </div>
                              )}

                              {/* Action Buttons */}
                              {claim.status === 'pending' && (
                                <div className="flex gap-2 pt-4 border-t">
                                  <Button
                                    size="sm"
                                    onClick={() => handleClaimAction(claim.id, 'approve')}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleClaimAction(claim.id, 'reject')}
                                    className="flex-1"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
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
          
          {selectedRegistration?.formData ? (
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
