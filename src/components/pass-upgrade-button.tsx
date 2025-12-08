import { useState } from "react";
import { ArrowUp, Loader2, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { API_BASE_URL } from "../lib/api";

interface PassUpgradeButtonProps {
  passId: string;
  currentPassType: string;
  onUpgradeSuccess?: () => void;
}

interface UpgradeOption {
  passType: string;
  name: string;
  price: number;
  upgradeFee: number;
}

export function PassUpgradeButton({
  passId,
  currentPassType,
  onUpgradeSuccess,
}: PassUpgradeButtonProps) {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState<UpgradeOption[]>([]);
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeOption | null>(null);
  const [canUpgrade, setCanUpgrade] = useState(false);
  const [ineligibilityReason, setIneligibilityReason] = useState<string>("");

  const checkUpgradeEligibility = async () => {
    setIsCheckingEligibility(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/passes/${passId}/upgrade/eligibility`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success && data.data.canUpgrade) {
        setCanUpgrade(true);
        setUpgradeOptions(data.data.upgradeOptions || []);
      } else {
        setCanUpgrade(false);
        setIneligibilityReason(data.data.reason || data.message);
        toast.error(data.data.reason || "Cannot upgrade pass");
      }
    } catch (error) {
      console.error("Error checking upgrade eligibility:", error);
      toast.error("Failed to check upgrade eligibility");
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleUpgradeClick = async () => {
    setShowUpgradeDialog(true);
    await checkUpgradeEligibility();
  };

  const handleSelectUpgrade = (option: UpgradeOption) => {
    setSelectedUpgrade(option);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedUpgrade) return;

    setIsUpgrading(true);

    try {
      // Note: Payment integration coming soon
      // For now, this is a placeholder that will be implemented with Razorpay
      
      toast.info("Payment integration coming soon! Contact admin for manual upgrade.");
      
      // TODO: Implement payment flow
      // 1. Create Razorpay order
      // 2. Open payment modal
      // 3. Verify payment
      // 4. Complete upgrade
      
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("An error occurred during upgrade");
    } finally {
      setIsUpgrading(false);
    }
  };

  // Don't show upgrade button for highest tier
  if (currentPassType.toLowerCase() === "quantum") {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleUpgradeClick}
        disabled={isCheckingEligibility}
        className="gap-2"
      >
        {isCheckingEligibility ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
        Upgrade Pass
      </Button>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upgrade Your Pass</DialogTitle>
            <DialogDescription>
              Choose a higher tier pass to unlock more events and features.
            </DialogDescription>
          </DialogHeader>

          {isCheckingEligibility ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !canUpgrade ? (
            <div className="py-8 text-center">
              <X className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-lg font-medium mb-2">Cannot Upgrade</p>
              <p className="text-sm text-muted-foreground">{ineligibilityReason}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Current Pass:{" "}
                  <Badge variant="secondary" className="ml-2">
                    {currentPassType.charAt(0).toUpperCase() + currentPassType.slice(1)} Pass
                  </Badge>
                </p>
              </div>

              <div className="grid gap-4">
                {upgradeOptions.map((option) => (
                  <Card
                    key={option.passType}
                    className={`cursor-pointer transition-all ${
                      selectedUpgrade?.passType === option.passType
                        ? "ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleSelectUpgrade(option)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{option.name}</h4>
                            {selectedUpgrade?.passType === option.passType && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">₹{option.upgradeFee}</span>
                            <span className="text-sm text-muted-foreground">
                              (Total: ₹{option.price})
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Pay only the difference to upgrade
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedUpgrade && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Upgrade Summary:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>From:</span>
                      <span className="font-medium text-foreground">{currentPassType} Pass</span>
                    </div>
                    <div className="flex justify-between">
                      <span>To:</span>
                      <span className="font-medium text-foreground">{selectedUpgrade.name}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Amount to pay:</span>
                      <span className="font-bold text-foreground text-lg">
                        ₹{selectedUpgrade.upgradeFee}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {canUpgrade && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowUpgradeDialog(false)}
                disabled={isUpgrading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmUpgrade}
                disabled={!selectedUpgrade || isUpgrading}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${selectedUpgrade?.upgradeFee || 0} & Upgrade`
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
