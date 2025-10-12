import { useState } from "react";
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
import { toast } from "sonner";
import { API_BASE_URL } from "../lib/api";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function ProfileCompletionModal({
  isOpen,
  onComplete,
}: ProfileCompletionModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    college: "",
    yearOfStudy: "",
    rollNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.college || !formData.yearOfStudy) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Call your backend API to update user profile
      const response = await fetch(`${API_BASE_URL}/users/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          fullName: user?.fullName,
          firstName: user?.firstName,
          lastName: user?.lastName,
          imageUrl: user?.imageUrl,
          ...formData,
        }),
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
      <DialogContent className="sm:max-w-[500px]" hideClose>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            We need a few more details to personalize your E-Summit experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">
              College/Institution <span className="text-destructive">*</span>
            </Label>
            <Input
              id="college"
              placeholder="Your college name"
              value={formData.college}
              onChange={(e) =>
                setFormData({ ...formData, college: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearOfStudy">
              Year of Study <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.yearOfStudy}
              onValueChange={(value: string) =>
                setFormData({ ...formData, yearOfStudy: value })
              }
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
                <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number (Optional)</Label>
            <Input
              id="rollNumber"
              placeholder="Your roll number"
              value={formData.rollNumber}
              onChange={(e) =>
                setFormData({ ...formData, rollNumber: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Complete Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
