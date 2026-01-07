import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { API_BASE_URL } from "../lib/api";
import { Loader2 } from "lucide-react";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onSuccess: () => void;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  college?: string;
  user_type?: string;
  startup_name?: string;
  startup_stage?: string;
  company_name?: string;
  designation?: string;
  bookingId?: string;
  hasValidPass?: boolean;
  passes?: any[];
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onSuccess,
}: EventRegistrationModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [registrationType, setRegistrationType] = useState<string>("");

  // Ten Minute Deal Form
  const [tenMinuteMillionForm, setTenMinuteMillionForm] = useState({
    startupName: "",
    cin: "",
    dpiitCertified: "",
    startupStage: "",
    problemStatement: "",
    solution: "",
    usp: "",
    demoLink: "",
    pitchDeckLink: "",
  });

  // Angel Investor Roundtable Form
  const [angelRoundtableForm, setAngelRoundtableForm] = useState({
    attendeeType: "", // student, entrepreneur, company
    startupStage: "",
    problemStatement: "",
    solution: "",
    usp: "",
    demoLink: "",
    pitchDeckLink: "",
  });

  // Pitch Arena Form
  const [pitchArenaForm, setPitchArenaForm] = useState({
    attendeeType: "", // student, startup
    ideaBrief: "",
    documentLink: "",
    pitchDeckLink: "",
  });

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user profile
        const profileResponse = await fetch(`${API_BASE_URL}/users/profile/${user.id}`);
        let profileData = null;
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          if (data.success) {
            profileData = data.data.user;
          }
        }

        // Fetch user passes
        const passesResponse = await fetch(`${API_BASE_URL}/passes/user/${user.id}`);
        let passes = [];
        let hasValidPass = false;
        if (passesResponse.ok) {
          const data = await passesResponse.json();
          if (data.success && data.data.passes.length > 0) {
            passes = data.data.passes;
            hasValidPass = data.data.passes.some((pass: any) => pass.status === 'Active');
          }
        }

        // Combine profile and pass data
        setUserProfile({
          fullName: profileData?.fullName || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: profileData?.email || user.primaryEmailAddress?.emailAddress || '',
          phone: profileData?.phone || user.phoneNumbers?.[0]?.phoneNumber,
          college: profileData?.college,
          user_type: profileData?.user_type,
          startup_name: profileData?.startup_name,
          startup_stage: profileData?.startup_stage,
          company_name: profileData?.company_name,
          designation: profileData?.designation,
          bookingId: passes.length > 0 ? passes[0].bookingId : profileData?.bookingId || null,
          hasValidPass: hasValidPass,
          passes: passes,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Set basic profile from Clerk user
        setUserProfile({
          fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.primaryEmailAddress?.emailAddress || '',
          phone: user.phoneNumbers?.[0]?.phoneNumber,
          bookingId: null,
        });
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [user?.id, isOpen]);

  // Reset forms when modal opens
  useEffect(() => {
    if (isOpen) {
      setTenMinuteMillionForm({
        startupName: userProfile?.startup_name || "",
        cin: "",
        dpiitCertified: "",
        startupStage: userProfile?.startup_stage || "",
        problemStatement: "",
        solution: "",
        usp: "",
        demoLink: "",
        pitchDeckLink: "",
      });

      setAngelRoundtableForm({
        registrationType: userProfile?.user_type === "entrepreneur" ? "entrepreneur" :
                         userProfile?.user_type === "company" ? "company" : "student",
        startupStage: userProfile?.startup_stage || "",
        problemStatement: "",
        solution: "",
        usp: "",
        demoLink: "",
        pitchDeckLink: "",
      });

      setPitchArenaForm({
        attendeeType: userProfile?.user_type === "student" ? "student" : "startup",
        ideaBrief: "",
        documentLink: "",
        pitchDeckLink: "",
      });
    }
  }, [isOpen, userProfile]);

  const handleTenMinuteMillionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validate required fields
    if (!tenMinuteMillionForm.startupName.trim()) {
      toast.error("📝 Please enter your startup name.");
      return;
    }
    if (!tenMinuteMillionForm.problemStatement.trim()) {
      toast.error("Problem statement is required");
      return;
    }
    if (!tenMinuteMillionForm.solution.trim()) {
      toast.error("Solution is required");
      return;
    }
    if (!tenMinuteMillionForm.usp.trim()) {
      toast.error("Unique selling proposition is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/events/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          eventId,
          ...(userProfile?.bookingId && { bookingId: userProfile.bookingId }),
          formData: {
            registrationType: "ten_minute_million",
            ...tenMinuteMillionForm,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Successfully registered for The Ten Minute Deal!");
        onSuccess();
        onClose();
      } else {
        // Handle specific error cases
        if (data.error === 'ALREADY_REGISTERED') {
          toast.error("You are already registered for this event!");
          onClose();
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAngelRoundtableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validate required fields
    if (!angelRoundtableForm.attendeeType) {
      toast.error("Attendee type is required");
      return;
    }
    if (!angelRoundtableForm.problemStatement.trim()) {
      toast.error("Problem statement is required");
      return;
    }
    if (!angelRoundtableForm.solution.trim()) {
      toast.error("Solution is required");
      return;
    }
    if (!angelRoundtableForm.usp.trim()) {
      toast.error("Unique selling proposition is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/events/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          eventId,
          ...(userProfile?.bookingId && { bookingId: userProfile.bookingId }),
          formData: {
            registrationType: "angel_roundtable",
            ...angelRoundtableForm,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Successfully registered for Angel Investors Roundtable!");
        onSuccess();
        onClose();
      } else {
        // Handle specific error cases
        if (data.error === 'ALREADY_REGISTERED') {
          toast.error("You are already registered for this event!");
          onClose();
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePitchArenaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validate required fields
    if (!pitchArenaForm.attendeeType) {
      toast.error("Attendee type is required");
      return;
    }
    if (!pitchArenaForm.ideaBrief.trim()) {
      toast.error("Idea brief is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/events/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          eventId,
          ...(userProfile?.bookingId && { bookingId: userProfile.bookingId }),
          formData: {
            registrationType: "pitch_arena",
            ...pitchArenaForm,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Successfully registered for Pitch Arena!");
        onSuccess();
        onClose();
      } else {
        // Handle specific error cases
        if (data.error === 'ALREADY_REGISTERED') {
          toast.error("You are already registered for this event!");
          onClose();
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimpleRegistration = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/events/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          eventId,
          ...(userProfile?.bookingId && { bookingId: userProfile.bookingId }),
          formData: {
            registrationType: "simple",
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully registered for ${eventTitle}!`);
        onSuccess();
        onClose();
      } else {
        // Handle specific error cases
        if (data.error === 'ALREADY_REGISTERED') {
          toast.error("You are already registered for this event!");
          onClose();
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTenMinuteMillionForm = () => (
    <form onSubmit={handleTenMinuteMillionSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startupName">Name of Startup *</Label>
          <Input
            id="startupName"
            value={tenMinuteMillionForm.startupName}
            onChange={(e) => setTenMinuteMillionForm(prev => ({ ...prev, startupName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="cin">CIN (if registered)</Label>
          <Input
            id="cin"
            value={tenMinuteMillionForm.cin}
            onChange={(e) => setTenMinuteMillionForm(prev => ({ ...prev, cin: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label>DPIIT Certified *</Label>
        <RadioGroup
          value={tenMinuteMillionForm.dpiitCertified}
          onValueChange={(value) => setTenMinuteMillionForm(prev => ({ ...prev, dpiitCertified: value }))}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="dpiit-yes" />
            <Label htmlFor="dpiit-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="dpiit-no" />
            <Label htmlFor="dpiit-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="startupStage">Stage of Startup *</Label>
        <Select
          value={tenMinuteMillionForm.startupStage}
          onValueChange={(value) => setTenMinuteMillionForm(prev => ({ ...prev, startupStage: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select startup stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ideation">Ideation</SelectItem>
            <SelectItem value="pre-revenue">Pre-revenue</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="problemStatement">Problem Statement *</Label>
        <Textarea
          id="problemStatement"
          value={tenMinuteMillionForm.problemStatement}
          onChange={(e) => setTenMinuteMillionForm(prev => ({ ...prev, problemStatement: e.target.value }))}
          placeholder="Describe the problem your startup is solving"
          required
        />
      </div>

      <div>
        <Label htmlFor="solution">Solution *</Label>
        <Textarea
          id="solution"
          value={tenMinuteMillionForm.solution}
          onChange={(e) => setTenMinuteMillionForm(prev => ({ ...prev, solution: e.target.value }))}
          placeholder="Describe your solution"
          required
        />
      </div>

      <div>
        <Label htmlFor="usp">USP (Unique Selling Proposition) *</Label>
        <Textarea
          id="usp"
          value={tenMinuteMillionForm.usp}
          onChange={(e) => setTenMinuteMillionForm(prev => ({ ...prev, usp: e.target.value }))}
          placeholder="What makes your solution unique?"
          required
        />
      </div>

      <div>
        <Label htmlFor="demoLink">Demo/Product Link (if available)</Label>
        <Input
          id="demoLink"
          type="url"
          value={tenMinuteMillionForm.demoLink}
          onChange={(e) => setTenMinuteMillionForm(prev => ({ ...prev, demoLink: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div>
        <Label htmlFor="pitchDeckLink">Pitch Deck Link *</Label>
        <Input
          id="pitchDeckLink"
          type="url"
          value={tenMinuteMillionForm.pitchDeckLink}
          onChange={(e) => setTenMinuteMillionForm(prev => ({ ...prev, pitchDeckLink: e.target.value }))}
          placeholder="https://..."
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Register
        </Button>
      </div>
    </form>
  );

  const renderAngelRoundtableForm = () => (
    <form onSubmit={handleAngelRoundtableSubmit} className="space-y-4">
      <div>
        <Label>Register as *</Label>
        <RadioGroup
          value={angelRoundtableForm.attendeeType}
          onValueChange={(value) => setAngelRoundtableForm(prev => ({ ...prev, attendeeType: value }))}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student">Student</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="entrepreneur" id="entrepreneur" />
            <Label htmlFor="entrepreneur">Entrepreneur</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company">Company</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="startupStage">Stage of Startup *</Label>
        <Select
          value={angelRoundtableForm.startupStage}
          onValueChange={(value) => setAngelRoundtableForm(prev => ({ ...prev, startupStage: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select startup stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ideation">Ideation</SelectItem>
            <SelectItem value="pre-revenue">Pre-revenue</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="problemStatement">Problem Statement *</Label>
        <Textarea
          id="problemStatement"
          value={angelRoundtableForm.problemStatement}
          onChange={(e) => setAngelRoundtableForm(prev => ({ ...prev, problemStatement: e.target.value }))}
          placeholder="Describe the problem your startup is solving"
          required
        />
      </div>

      <div>
        <Label htmlFor="solution">Solution *</Label>
        <Textarea
          id="solution"
          value={angelRoundtableForm.solution}
          onChange={(e) => setAngelRoundtableForm(prev => ({ ...prev, solution: e.target.value }))}
          placeholder="Describe your solution"
          required
        />
      </div>

      <div>
        <Label htmlFor="usp">USP (Unique Selling Proposition) *</Label>
        <Textarea
          id="usp"
          value={angelRoundtableForm.usp}
          onChange={(e) => setAngelRoundtableForm(prev => ({ ...prev, usp: e.target.value }))}
          placeholder="What makes your solution unique?"
          required
        />
      </div>

      <div>
        <Label htmlFor="demoLink">Demo/Product Link (if available)</Label>
        <Input
          id="demoLink"
          type="url"
          value={angelRoundtableForm.demoLink}
          onChange={(e) => setAngelRoundtableForm(prev => ({ ...prev, demoLink: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div>
        <Label htmlFor="pitchDeckLink">Pitch Deck Link *</Label>
        <Input
          id="pitchDeckLink"
          type="url"
          value={angelRoundtableForm.pitchDeckLink}
          onChange={(e) => setAngelRoundtableForm(prev => ({ ...prev, pitchDeckLink: e.target.value }))}
          placeholder="https://..."
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Register
        </Button>
      </div>
    </form>
  );

  const renderPitchArenaForm = () => (
    <form onSubmit={handlePitchArenaSubmit} className="space-y-4">
      <div>
        <Label>Register as *</Label>
        <RadioGroup
          value={pitchArenaForm.attendeeType}
          onValueChange={(value) => setPitchArenaForm(prev => ({ ...prev, attendeeType: value }))}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student">Student</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="startup" id="startup" />
            <Label htmlFor="startup">Startup</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="ideaBrief">Brief about Idea *</Label>
        <Textarea
          id="ideaBrief"
          value={pitchArenaForm.ideaBrief}
          onChange={(e) => setPitchArenaForm(prev => ({ ...prev, ideaBrief: e.target.value }))}
          placeholder="Describe your idea briefly"
          required
        />
      </div>

      <div>
        <Label htmlFor="documentLink">Document Link *</Label>
        <Input
          id="documentLink"
          type="url"
          value={pitchArenaForm.documentLink}
          onChange={(e) => setPitchArenaForm(prev => ({ ...prev, documentLink: e.target.value }))}
          placeholder="https://..."
          required
        />
      </div>

      <div>
        <Label htmlFor="pitchDeckLink">Pitch Deck Link *</Label>
        <Input
          id="pitchDeckLink"
          type="url"
          value={pitchArenaForm.pitchDeckLink}
          onChange={(e) => setPitchArenaForm(prev => ({ ...prev, pitchDeckLink: e.target.value }))}
          placeholder="https://..."
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Register
        </Button>
      </div>
    </form>
  );

  const renderSimpleRegistration = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You will be registered for {eventTitle} using your profile information.
      </p>
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSimpleRegistration} disabled={loading} className="flex-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Register
        </Button>
      </div>
    </div>
  );

  const getFormContent = () => {
    // Show loading while fetching user data
    if (!userProfile) {
      return (
        <div className="space-y-4">
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading your information...</p>
          </div>
        </div>
      );
    }

    // Check if user has a valid pass
    if (!userProfile?.hasValidPass) {
      return (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Pass Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You need a valid E-Summit pass to register for events. Please purchase a pass first.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      );
    }

    if (eventId.includes("ten-minute-million")) {
      return renderTenMinuteMillionForm();
    } else if (eventId.includes("angel-roundtable")) {
      return renderAngelRoundtableForm();
    } else if (eventId.includes("pitch-arena")) {
      return renderPitchArenaForm();
    } else {
      return renderSimpleRegistration();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {eventTitle}</DialogTitle>
          <DialogDescription>
            Please fill out the registration form below.
          </DialogDescription>
        </DialogHeader>
        {getFormContent()}
      </DialogContent>
    </Dialog>
  );
}