import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { toast } from "sonner";
import { API_BASE_URL } from "../lib/api";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const TCET_BRANCHES = [
  "B.E. Computer Engineering",
  "B.E. Information Technology",
  "B.E. Electronics & Telecommunication Engineering",
  "B.E. Electronics and Computer Science",
  "B.E. Mechanical Engineering",
  "B.E. Civil Engineering",
  "B.Tech Artificial Intelligence and Data Science",
  "B.Tech Computer Science & Engineering (IoT)",
  "B.Tech Artificial Intelligence and Machine Learning",
  "B.E. Computer Science and Engineering (Cyber Security)",
  "B.E - Mechanical and Mechatronics Engineering (Additive Manufacturing)",
  "B.E. Computer Engineering (Working Professional)",
  "B.Tech Artificial Intelligence & Data Science (Working Professional)",
  "Bachelor Of Computer Application (BCA)",
  "Bachelor Of Business Administration (BBA)",
  "B.Voc Artificial Intelligence and Data Science",
  "B.Voc Software Development",
  "B.Voc Animation & Graphic Designing",
  "B.Voc Data Analytics",
  "B.Voc Data Science",
  "B.Voc Artificial Intelligence",
];

type UserType = "tcet-student" | "company" | "entrepreneur" | "student" | null;

export function ProfileCompletionModal({
  isOpen,
  onComplete,
}: ProfileCompletionModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const isTCETStudent = user?.primaryEmailAddress?.emailAddress?.toLowerCase().endsWith("@tcetmumbai.in");

  // Initialize userType based on email domain
  useEffect(() => {
    if (isTCETStudent) {
      setUserType("tcet-student");
    }
  }, [isTCETStudent]);

  // TCET Student Form
  const [tcetFormData, setTcetFormData] = useState({
    countryCode: "+91",
    phone: "",
    college: "Thakur College of Engineering and Technology",
    branch: "",
    yearOfStudy: "",
    rollNumber: "",
  });

  // Company Form
  const [companyFormData, setCompanyFormData] = useState({
    countryCode: "+91",
    phone: "",
    companyName: "",
    cin: "",
    gstin: "",
    companySize: "",
    industry: "",
    designation: "",
    website: "",
  });

  // Entrepreneur Form
  const [entrepreneurFormData, setEntrepreneurFormData] = useState({
    countryCode: "+91",
    phone: "",
    professionalBackground: "",
    yearsOfExperience: "",
    expertise: "",
    currentStatus: "",
    linkedinProfile: "",
    portfolio: "",
  });

  // Student Form
  const [studentFormData, setStudentFormData] = useState({
    countryCode: "+91",
    phone: "",
    college: "",
    yearOfStudy: "",
    rollNumber: "",
    course: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let dataToSubmit: any = {
      clerkUserId: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      fullName: user?.fullName,
      firstName: user?.firstName,
      lastName: user?.lastName,
      imageUrl: user?.imageUrl,
      userType: userType,
    };

    // Validate and prepare data based on user type
    if (userType === "tcet-student") {
      if (!tcetFormData.phone || !tcetFormData.branch || !tcetFormData.yearOfStudy) {
        toast.error("Please fill in all required fields");
        return;
      }
      dataToSubmit = { 
        ...dataToSubmit, 
        ...tcetFormData,
        phone: `${tcetFormData.countryCode}${tcetFormData.phone}`
      };
    } else if (userType === "company") {
      if (!companyFormData.phone || !companyFormData.companyName || !companyFormData.industry) {
        toast.error("Please fill in all required fields");
        return;
      }
      dataToSubmit = { 
        ...dataToSubmit, 
        ...companyFormData,
        phone: `${companyFormData.countryCode}${companyFormData.phone}`
      };
    } else if (userType === "entrepreneur") {
      if (!entrepreneurFormData.phone || !entrepreneurFormData.professionalBackground || !entrepreneurFormData.expertise) {
        toast.error("Please fill in all required fields");
        return;
      }
      dataToSubmit = { 
        ...dataToSubmit, 
        ...entrepreneurFormData,
        phone: `${entrepreneurFormData.countryCode}${entrepreneurFormData.phone}`
      };
    } else if (userType === "student") {
      if (!studentFormData.phone || !studentFormData.college || !studentFormData.yearOfStudy) {
        toast.error("Please fill in all required fields");
        return;
      }
      dataToSubmit = { 
        ...dataToSubmit, 
        ...studentFormData,
        phone: `${studentFormData.countryCode}${studentFormData.phone}`
      };
    } else {
      toast.error("Please select a registration type");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to complete profile");
      }

      toast.success("Profile completed successfully!");
      onComplete();
    } catch (error) {
      console.error("Profile completion error:", error);
      toast.error("Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6" hideClose>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-sm">
            We need a few more details to personalize your E-Summit experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* User Type Selection (only for non-TCET users) */}
          {!isTCETStudent && !userType && (
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-sm sm:text-base">I am registering as:</Label>
              <RadioGroup value={userType || ""} onValueChange={(value: string) => setUserType(value as UserType)}>
                <div className="flex items-center space-x-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company" className="cursor-pointer flex-1">
                    <div className="font-semibold text-sm sm:text-base">Startup/Company</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Registered business or startup</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="entrepreneur" id="entrepreneur" />
                  <Label htmlFor="entrepreneur" className="cursor-pointer flex-1">
                    <div className="font-semibold text-sm sm:text-base">Individual/Entrepreneur</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Solo entrepreneur or freelancer</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="cursor-pointer flex-1">
                    <div className="font-semibold text-sm sm:text-base">Student</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Currently enrolled in an educational institution</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* TCET Student Form */}
          {userType === "tcet-student" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                <p className="text-sm font-medium">🎓 TCET Student Registration</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={tcetFormData.countryCode}
                    onValueChange={(value: string) => setTcetFormData({ ...tcetFormData, countryCode: value })}
                  >
                    <SelectTrigger className="w-[90px] sm:w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                      <SelectItem value="+65">🇸🇬 +65</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    value={tcetFormData.phone}
                    onChange={(e) => setTcetFormData({ ...tcetFormData, phone: e.target.value.replace(/\D/g, '') })}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College/Institution</Label>
                <Input
                  id="college"
                  value={tcetFormData.college}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">
                  Branch/Course <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={tcetFormData.branch}
                  onValueChange={(value: string) => setTcetFormData({ ...tcetFormData, branch: value })}
                  required
                >
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {TCET_BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearOfStudy">
                  Year of Study <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={tcetFormData.yearOfStudy}
                  onValueChange={(value: string) => setTcetFormData({ ...tcetFormData, yearOfStudy: value })}
                  required
                >
                  <SelectTrigger id="yearOfStudy">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number (Optional)</Label>
                <Input
                  id="rollNumber"
                  placeholder="Your roll number"
                  value={tcetFormData.rollNumber}
                  onChange={(e) => setTcetFormData({ ...tcetFormData, rollNumber: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Company Form */}
          {userType === "company" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-3">
                <p className="text-sm font-medium">🏢 Company/Startup Registration</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={companyFormData.countryCode}
                    onValueChange={(value: string) => setCompanyFormData({ ...companyFormData, countryCode: value })}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                      <SelectItem value="+65">🇸🇬 +65</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="companyPhone"
                    type="tel"
                    placeholder="98765 43210"
                    value={companyFormData.phone}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, phone: e.target.value.replace(/\D/g, '') })}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Your company name"
                  value={companyFormData.companyName}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cin">CIN (Optional)</Label>
                  <Input
                    id="cin"
                    placeholder="L12345MH2020PTC123456"
                    value={companyFormData.cin}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, cin: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN (Optional)</Label>
                  <Input
                    id="gstin"
                    placeholder="22AAAAA0000A1Z5"
                    value={companyFormData.gstin}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, gstin: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">
                  Company Size <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={companyFormData.companySize}
                  onValueChange={(value: string) => setCompanyFormData({ ...companyFormData, companySize: value })}
                  required
                >
                  <SelectTrigger id="companySize">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={companyFormData.industry}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, industry: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Your Designation</Label>
                <Input
                  id="designation"
                  placeholder="e.g., CEO, CTO, Manager"
                  value={companyFormData.designation}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, designation: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Company Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={companyFormData.website}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, website: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Entrepreneur Form */}
          {userType === "entrepreneur" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 p-3">
                <p className="text-sm font-medium">💡 Entrepreneur Registration</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entrepreneurPhone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={entrepreneurFormData.countryCode}
                    onValueChange={(value: string) => setEntrepreneurFormData({ ...entrepreneurFormData, countryCode: value })}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                      <SelectItem value="+65">🇸🇬 +65</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="entrepreneurPhone"
                    type="tel"
                    placeholder="98765 43210"
                    value={entrepreneurFormData.phone}
                    onChange={(e) => setEntrepreneurFormData({ ...entrepreneurFormData, phone: e.target.value.replace(/\D/g, '') })}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="professionalBackground">
                  Professional Background <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="professionalBackground"
                  placeholder="e.g., Software Developer, Marketing Professional, Designer"
                  value={entrepreneurFormData.professionalBackground}
                  onChange={(e) => setEntrepreneurFormData({ ...entrepreneurFormData, professionalBackground: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expertise">
                  Area of Expertise <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expertise"
                  placeholder="e.g., Web Development, Digital Marketing, UI/UX Design"
                  value={entrepreneurFormData.expertise}
                  onChange={(e) => setEntrepreneurFormData({ ...entrepreneurFormData, expertise: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">
                  Years of Experience <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={entrepreneurFormData.yearsOfExperience}
                  onValueChange={(value: string) => setEntrepreneurFormData({ ...entrepreneurFormData, yearsOfExperience: value })}
                  required
                >
                  <SelectTrigger id="yearsOfExperience">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentStatus">
                  Current Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={entrepreneurFormData.currentStatus}
                  onValueChange={(value: string) => setEntrepreneurFormData({ ...entrepreneurFormData, currentStatus: value })}
                  required
                >
                  <SelectTrigger id="currentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="Looking for Opportunities">Looking for Opportunities</SelectItem>
                    <SelectItem value="Working Professional">Working Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinProfile">LinkedIn Profile (Optional)</Label>
                <Input
                  id="linkedinProfile"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={entrepreneurFormData.linkedinProfile}
                  onChange={(e) => setEntrepreneurFormData({ ...entrepreneurFormData, linkedinProfile: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
                <Input
                  id="portfolio"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={entrepreneurFormData.portfolio}
                  onChange={(e) => setEntrepreneurFormData({ ...entrepreneurFormData, portfolio: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Student Form */}
          {userType === "student" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3">
                <p className="text-sm font-medium">📚 Student Registration</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentPhone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={studentFormData.countryCode}
                    onValueChange={(value: string) => setStudentFormData({ ...studentFormData, countryCode: value })}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                      <SelectItem value="+65">🇸🇬 +65</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="studentPhone"
                    type="tel"
                    placeholder="98765 43210"
                    value={studentFormData.phone}
                    onChange={(e) => setStudentFormData({ ...studentFormData, phone: e.target.value.replace(/\D/g, '') })}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCollege">
                  College/Institution <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="studentCollege"
                  placeholder="Your college name"
                  value={studentFormData.college}
                  onChange={(e) => setStudentFormData({ ...studentFormData, college: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course/Degree</Label>
                <Input
                  id="course"
                  placeholder="e.g., B.Tech, MBA, BBA"
                  value={studentFormData.course}
                  onChange={(e) => setStudentFormData({ ...studentFormData, course: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentYear">
                  Year of Study <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={studentFormData.yearOfStudy}
                  onValueChange={(value: string) => setStudentFormData({ ...studentFormData, yearOfStudy: value })}
                  required
                >
                  <SelectTrigger id="studentYear">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentRoll">Roll Number (Optional)</Label>
                <Input
                  id="studentRoll"
                  placeholder="Your roll number"
                  value={studentFormData.rollNumber}
                  onChange={(e) => setStudentFormData({ ...studentFormData, rollNumber: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          {userType && (
            <div className="flex justify-end gap-2 pt-4">
              {!isTCETStudent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUserType(null)}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button type="submit" disabled={loading} className="min-w-[150px]">
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
