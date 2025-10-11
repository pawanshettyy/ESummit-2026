import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Scan,
  CheckCircle2,
  XCircle,
  User,
  Ticket,
  Calendar,
  Building,
  Phone,
  Mail,
  AlertCircle,
  Camera,
  CameraOff,
  Keyboard,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import "./qr-scanner.css";

interface PassData {
  passId: string;
  passType: string;
  status: string;
  hasMeals: boolean;
  hasMerchandise: boolean;
  hasWorkshopAccess: boolean;
  purchaseDate: string;
  user: {
    email: string;
    fullName: string;
    phone?: string;
    college?: string;
    yearOfStudy?: string;
  };
}

interface ScanResult {
  success: boolean;
  message: string;
  pass?: PassData;
  alreadyCheckedIn?: boolean;
  checkIn?: any;
  cooldownRemaining?: number;
}

export function QRScanner() {
  const [qrData, setQrData] = useState("");
  const [eventId, setEventId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scanMode, setScanMode] = useState<"camera" | "manual">("camera");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);
  const isInitializingRef = useRef(false);

  // Initialize camera scanner
  useEffect(() => {
    // Prevent double initialization (React Strict Mode)
    if (isInitializingRef.current) {
      return;
    }

    if (scanMode === "camera" && qrReaderRef.current && !scannerRef.current) {
      isInitializingRef.current = true;

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: function(viewfinderWidth, viewfinderHeight) {
            // Make QR box responsive based on screen size
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.7); // 70% of the smaller dimension
            return {
              width: qrboxSize,
              height: qrboxSize,
            };
          },
          aspectRatio: 1.0,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          // Mobile-friendly settings
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true, // Flashlight for mobile
          showZoomSliderIfSupported: true,  // Zoom controls
          defaultZoomValueIfSupported: 2,   // Default zoom level
        },
        false
      );

      scanner.render(
        (decodedText) => {
          // Successfully scanned QR code
          setQrData(decodedText);
          setIsCameraActive(false);
          scanner.clear().catch(console.error);
          scannerRef.current = null;
          isInitializingRef.current = false;
          // Auto-trigger scan
          handleScanWithData(decodedText);
        },
        (error) => {
          // Scan error (ignore - happens continuously when no QR detected)
        }
      );

      scannerRef.current = scanner;
      setIsCameraActive(true);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      isInitializingRef.current = false;
      setIsCameraActive(false);
    };
  }, [scanMode]);

  const handleScanWithData = async (data: string) => {
    if (!data.trim()) {
      setScanResult({
        success: false,
        message: "Please enter QR code data",
      });
      setShowResult(true);
      return;
    }

    setIsScanning(true);

    try {
      // Parse the QR data - it could be JSON or just a pass ID
      let qrDataToSend = data.trim();
      
      // If it looks like a pass ID (starts with ESUMMIT-2025-), wrap it in JSON
      if (data.trim().startsWith('ESUMMIT-2025-')) {
        qrDataToSend = JSON.stringify({
          passId: data.trim(),
          type: 'ESUMMIT_2025_PASS',
          timestamp: new Date().toISOString(),
          version: '1.0',
        });
      }
      
      const response = await fetch("http://localhost:5000/api/v1/checkin/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrData: qrDataToSend,
          eventId: eventId || null,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setScanResult({
          success: true,
          message: responseData.message,
          pass: responseData.data.pass,
          alreadyCheckedIn: responseData.data.alreadyCheckedIn,
          checkIn: responseData.data.checkIn,
          cooldownRemaining: responseData.data.cooldownRemaining,
        });
        
        // Dispatch custom event to notify admin panel of successful check-in
        window.dispatchEvent(new CustomEvent('checkin-success'));
      } else {
        setScanResult({
          success: false,
          message: responseData.message || "Failed to verify QR code",
        });
      }

      setShowResult(true);
      setQrData(""); // Clear input for next scan
    } catch (error) {
      console.error("Scan error:", error);
      setScanResult({
        success: false,
        message: "Network error. Please check your connection.",
      });
      setShowResult(true);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = async () => {
    handleScanWithData(qrData);
  };

  const handleVerifyOnly = async () => {
    if (!qrData.trim()) {
      setScanResult({
        success: false,
        message: "Please enter QR code data",
      });
      setShowResult(true);
      return;
    }

    setIsScanning(true);

    try {
      // Parse the QR data - same logic as scan
      let qrDataToSend = qrData.trim();
      
      // If it looks like a pass ID (starts with ESUMMIT-2025-), wrap it in JSON
      if (qrData.trim().startsWith('ESUMMIT-2025-')) {
        qrDataToSend = JSON.stringify({
          passId: qrData.trim(),
          type: 'ESUMMIT_2025_PASS',
          timestamp: new Date().toISOString(),
          version: '1.0',
        });
      }

      const response = await fetch("http://localhost:5000/api/v1/checkin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrData: qrDataToSend,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setScanResult({
          success: data.data.valid,
          message: data.data.valid ? "Pass is valid" : "Pass is inactive",
          pass: data.data.pass,
        });
      } else {
        setScanResult({
          success: false,
          message: data.message || "Failed to verify pass",
        });
      }

      setShowResult(true);
    } catch (error) {
      console.error("Verify error:", error);
      setScanResult({
        success: false,
        message: "Network error. Please check your connection.",
      });
      setShowResult(true);
    } finally {
      setIsScanning(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-muted-foreground">
              🎫 <strong>Multi-Event Scanning:</strong> Each pass can be scanned at up to 30 different events
            </p>
            <p className="text-sm text-muted-foreground">
              ⏱️ <strong>Duplicate Prevention:</strong> Same event = 30-minute cooldown • Different events = Unlimited scans
            </p>
            <p className="text-sm text-muted-foreground">
              📍 <strong>General Entry:</strong> Leave Event ID empty for venue-wide check-in (allows multiple scans)
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scan Mode Tabs */}
          <Tabs value={scanMode} onValueChange={(value: string) => {
            setScanMode(value as "camera" | "manual");
            setQrData("");
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Camera Scanner
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            {/* Camera Scanner Tab */}
            <TabsContent value="camera" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Camera QR Scanner</Label>
                <div 
                  id="qr-reader" 
                  ref={qrReaderRef}
                  className="rounded-lg overflow-hidden border w-full"
                  style={{ minHeight: '300px' }}
                ></div>
                {!isCameraActive && (
                  <div className="text-center p-8 border rounded-lg bg-muted/50">
                    <CameraOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Camera will initialize automatically
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Grant camera permission when prompted
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Manual Entry Tab */}
            <TabsContent value="manual" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="qrData">Pass ID or QR Data</Label>
                <Input
                  id="qrData"
                  placeholder='ESUMMIT-2025-XXXXX'
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleScan();
                    }
                  }}
                  className="font-mono text-sm"
                />
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-xs text-amber-900 dark:text-amber-100 mb-2">
                    📝 <strong>Supported Formats:</strong>
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-amber-800 dark:text-amber-200 font-mono">
                      1. Pass ID: <span className="font-bold">ESUMMIT-2025-VUSS3CY</span>
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-200 font-mono">
                      2. Full JSON: {'{'}&#34;passId&#34;:&#34;ESUMMIT-2025-XXXXX&#34;,...{'}'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleScan}
                  disabled={isScanning || !qrData.trim()}
                  className="flex-1"
                >
                  <Scan className="mr-2 h-4 w-4" />
                  {isScanning ? "Scanning..." : "Scan & Check-In"}
                </Button>
                <Button
                  onClick={handleVerifyOnly}
                  disabled={isScanning || !qrData.trim()}
                  variant="outline"
                  className="flex-1"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isScanning ? "Verifying..." : "Verify Only"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Event ID - Shown for both modes */}
          <div className="space-y-2">
            <Label htmlFor="eventId">Event ID (Optional)</Label>
            <Input
              id="eventId"
              placeholder="keynote-day1, workshop-ai, panel-discussion, etc."
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            />
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
              <p className="text-xs text-blue-900 dark:text-blue-100 mb-1">
                <strong>Event ID Guide:</strong>
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
                <li><strong>With Event ID:</strong> Attendee can check in to 30 different events. Same event has 30-min cooldown.</li>
                <li><strong>Without Event ID (General Entry):</strong> Multiple scans allowed - use this for venue entry gates.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {scanResult?.success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-green-500">Scan Successful</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-500">Scan Failed</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Already checked in warning (same event duplicate) */}
            {scanResult?.alreadyCheckedIn && scanResult?.cooldownRemaining && (
              <div className="flex items-start gap-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 p-4 border border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    Already Scanned for This Event
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This pass was already checked in for <strong>{eventId || "general entry"}</strong> recently.
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    ⏱️ Cooldown: <strong>{scanResult.cooldownRemaining} minutes remaining</strong>
                  </p>
                  <div className="mt-2 pt-2 border-t border-yellow-300 dark:border-yellow-700">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      ✅ <strong>Multi-Event Pass:</strong> This pass can still be scanned at other events (up to 30 different events)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General error messages */}
            {!scanResult?.success && !scanResult?.alreadyCheckedIn && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">{scanResult?.message}</p>
              </div>
            )}

            {scanResult?.success && scanResult?.pass && (
              <div className="space-y-4">
                {/* Pass Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{scanResult.pass.passType}</h3>
                        <p className="text-sm text-muted-foreground">
                          {scanResult.pass.passId}
                        </p>
                      </div>
                      <Badge
                        variant={
                          scanResult.pass.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {scanResult.pass.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Purchased: {formatDate(scanResult.pass.purchaseDate)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {scanResult.pass.hasMeals && (
                        <Badge variant="outline" className="text-xs">
                          Meals Included
                        </Badge>
                      )}
                      {scanResult.pass.hasMerchandise && (
                        <Badge variant="outline" className="text-xs">
                          Merchandise
                        </Badge>
                      )}
                      {scanResult.pass.hasWorkshopAccess && (
                        <Badge variant="outline" className="text-xs">
                          Workshop Access
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* User Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Attendee Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{scanResult.pass.user.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{scanResult.pass.user.email}</span>
                      </div>
                      {scanResult.pass.user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{scanResult.pass.user.phone}</span>
                        </div>
                      )}
                      {scanResult.pass.user.college && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {scanResult.pass.user.college}
                            {scanResult.pass.user.yearOfStudy &&
                              ` - ${scanResult.pass.user.yearOfStudy}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {scanResult.checkIn && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Check-in Recorded
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Entry logged successfully at{" "}
                      {new Date(scanResult.checkIn.checkInTime).toLocaleString()}
                    </p>
                    {eventId && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        📍 Event: <strong>{eventId}</strong>
                      </p>
                    )}
                    {!eventId && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        📍 General venue entry (no specific event)
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowResult(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
