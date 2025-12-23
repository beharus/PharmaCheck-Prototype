import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Camera,
  QrCode,
  Barcode,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

// API Configuration
const API_BASE_URL = "https://pharmacheck.pythonanywhere.com/api";

// Types
interface Recommendation {
  name: string;
  brand: string;
  cost_status: string;
  imageExample: string;
}

interface Pharmacy {
  uuid: string;
  name: string;
  brand: string;
  brandCertLink: string;
  brandLicenceLink: string;
  dosageForm: string;
  strength: string;
  activeingredients: string | null;
  gtin: string;
  batch: string;
  manufactureDate: string;
  expiryDate: string;
  StorageConditions: string;
  regulatoryInfo: string;
  imageExample: string;
  is_read: boolean;
  cost_status: string;
  created_at: string;
  updated_at: string;
  recommendations: Recommendation[];
}

interface LatestBlock {
  index: number;
  timestamp: number;
  data: string;
  previous_hash: string;
  hash: string;
}

interface PharmacyData {
  pharmacy: Pharmacy;
  latest_block: LatestBlock;
}

interface QRScannerProps {
  onScanComplete: (data: PharmacyData) => void;
}

type ScanMode = "camera" | "qr" | "barcode";
type ScanStatus = "idle" | "camera_active" | "scanning" | "success" | "error";

// Mock data for demo
const mockPharmacyData: PharmacyData = {
  pharmacy: {
    uuid: "4a43bbb0-68b1-413a-bcf8-b50fd0174d05",
    name: "Asperine",
    brand: "Medlink",
    brandCertLink: "http://google.com",
    brandLicenceLink: "http://google.com",
    dosageForm: "Syrup",
    strength: "500mg",
    activeingredients: "Acetylsalicylic acid",
    gtin: "34567654567",
    batch: "345676556",
    manufactureDate: "2025-09-20",
    expiryDate: "2026-01-15",
    StorageConditions: "Dry room, below 25°C",
    regulatoryInfo: "Only for Uzbekistan",
    imageExample:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    is_read: false,
    cost_status: "high",
    created_at: "2025-09-20T13:48:22.559546Z",
    updated_at: "2025-12-03T14:46:19.099462Z",
    recommendations: [
      {
        name: "Qupen Forte",
        brand: "Medlabs",
        cost_status: "medium",
        imageExample:
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200",
      },
    ],
  },
  latest_block: {
    index: 87,
    timestamp: 1764782747.8565,
    data: "4a43bbb0-68b1-413a-bcf8-b50fd0174d05",
    previous_hash:
      "6db4190087b7e3924142e42987aa44d311aec632ac46ef6b4803baec012df7df",
    hash: "8fd2b511479304d6fad1495a624ad30cdb3ec29527aa8f8feec76c7575902789",
  },
};

const QRScanner = ({ onScanComplete }: QRScannerProps) => {
  const [scanMode, setScanMode] = useState<ScanMode>("camera");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [scannedUUID, setScannedUUID] = useState<string>("");
  const [cameraError, setCameraError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [permissionAsked, setPermissionAsked] = useState<boolean>(false);
  const [showPermissionScreen, setShowPermissionScreen] =
    useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  // Initialize ZXing code reader
  useEffect(() => {
    console.log("🔧 Initializing ZXing code reader...");
    codeReader.current = new BrowserMultiFormatReader();

    return () => {
      console.log("🧹 Cleanup: Disposing code reader...");
      stopCamera();
      if (codeReader.current) {
        codeReader.current.reset();
        codeReader.current = null;
      }
    };
  }, []);

  // Extract UUID from various formats
  const extractUUID = (text: string): string | null => {
    console.log("🔍 Extracting UUID from text:", text);

    if (!text) {
      console.warn("⚠️ No text provided to extractUUID");
      return null;
    }

    text = text.trim();
    console.log("📝 Trimmed text:", text);

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(text)) {
      console.log("✅ Valid UUID format detected:", text);
      return text;
    }

    const pathMatch = text.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    );
    if (pathMatch) {
      console.log("✅ UUID found in path:", pathMatch[0]);
      return pathMatch[0];
    }

    if (text.includes("/api/")) {
      console.log("🔗 Detected API URL, extracting UUID...");
      const parts = text.split("/api/");
      if (parts.length > 1) {
        const uuidPart = parts[1].split("/")[0];
        console.log("📍 UUID part extracted:", uuidPart);
        if (uuidRegex.test(uuidPart)) {
          console.log("✅ Valid UUID from URL:", uuidPart);
          return uuidPart;
        }
      }
    }

    console.error("❌ No valid UUID found in text:", text);
    return null;
  };

// Real API call function
  const fetchPharmacyData = async (
    uuid: string
  ): Promise<PharmacyData | null> => {
    try {
      console.log("🌐 =================================");
      console.log("🌐 Starting API call for UUID:", uuid);
      console.log("🌐 API Endpoint:", `${API_BASE_URL}/${uuid}/?format=json`);
      console.log("🌐 =================================");

      setScanStatus("scanning");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(`${API_BASE_URL}/${uuid}/?format=json`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("📡 Response status:", response.status);
      console.log("📡 Response OK:", response.ok);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        if (response.status === 404) {
          console.error("❌ 404 Error: Product not found in database");
          throw new Error("Product not found in database - Possibly FAKE!");
        } else if (response.status === 500) {
          console.error("❌ 500 Error: Server error");
          throw new Error("Server error - please try again");
        } else if (response.status === 0) {
          console.error("❌ Network Error: Possible CORS issue");
          throw new Error("Network error - check your connection");
        }
        console.error("❌ API Error with status:", response.status);
        
        // Try to get error message from response
        const errorText = await response.text();
        console.error("❌ Error response body:", errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Unexpected content type:", contentType);
        const text = await response.text();
        console.error("❌ Response body:", text.substring(0, 200));
        throw new Error("Invalid response format from server");
      }

      const data: PharmacyData = await response.json();
      console.log("✅ API Response received successfully");
      console.log("📦 Product data:", data.pharmacy?.name || "Unknown");
      console.log("🔐 Is already read:", data.pharmacy?.is_read);

      if (data.pharmacy?.is_read) {
        console.warn("⚠️ DUPLICATE SCAN DETECTED!");
        setScanStatus("error");
        setErrorMessage("DUPLICATE WARNING! This QR code was already scanned!");
        return null;
      }

      console.log("✅ Product verification successful!");
      return data;
    } catch (error) {
      console.error("❌ =================================");
      console.error("❌ API fetch error:", error);
      console.error("❌ Error type:", error instanceof Error ? error.name : typeof error);
      console.error("❌ =================================");

      setScanStatus("error");
      
      // Better error messages
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrorMessage("Request timeout - please try again");
        } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          setErrorMessage("Network error - check your internet connection or CORS settings");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("Failed to verify product - unknown error");
      }
      
      return null;
    }
  };

  // Handle detected QR code
  const handleQRDetected = (qrText: string) => {
    if (isProcessingRef.current) {
      console.log("⚠️ Already processing a QR code, ignoring...");
      return;
    }

    isProcessingRef.current = true;
    console.log("🎯 =================================");
    console.log("🎯 QR CODE DETECTED!");
    console.log("🎯 Raw QR text:", qrText);
    console.log("🎯 =================================");

    const uuid = extractUUID(qrText);

    if (!uuid) {
      console.error("❌ Invalid QR code format");
      setScanStatus("error");
      setErrorMessage("Invalid QR code format. Please try again.");
      isProcessingRef.current = false;
      return;
    }

    console.log("✅ Valid UUID found, stopping scanner...");
    setScannedUUID(uuid);
    stopCamera();

    console.log("🚀 Processing UUID:", uuid);
    processScannedUUID(uuid);
  };

  // Process the scanned UUID
  const processScannedUUID = async (uuid: string) => {
    console.log("🔄 =================================");
    console.log("🔄 Processing scanned UUID:", uuid);
    console.log("🔄 =================================");

    const data = await fetchPharmacyData(uuid);

    if (data) {
      console.log("✅ Product verified successfully!");
      console.log("✅ Product name:", data.pharmacy.name);
      setScanStatus("success");

      console.log("⏰ Waiting 1.5 seconds before navigation...");
      setTimeout(() => {
        console.log("🚀 Navigating to product details...");
        isProcessingRef.current = false;
        onScanComplete(data);
      }, 1500);
    } else {
      console.error("❌ Product verification failed");
      isProcessingRef.current = false;
    }
  };

  // New function to check and request permission correctly
  const requestCameraPermission = async () => {
    try {
      setCameraError("");

      // 1. First, check the current permission state
      const permissionStatus = await navigator.permissions.query({
        name: "camera",
      });

      console.log("🔍 Current permission state:", permissionStatus.state);

      // 2. If already denied, inform the user
      if (permissionStatus.state === "denied") {
        setCameraError(
          "Camera access denied. Please allow camera permissions in your browser settings."
        );
        setHasPermission(false);
        setPermissionAsked(true);
        return;
      }

      // 3. If not denied, proceed to request via getUserMedia
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // IMPORTANT: Immediately stop tracks after permission is granted
      stream.getTracks().forEach((track) => track.stop());

      setHasPermission(true);
      setPermissionAsked(true);
      setShowPermissionScreen(false);

      // Start camera after permission is confirmed
      setTimeout(() => {
        startCamera();
      }, 300);
    } catch (error) {
      console.error("❌ Error requesting camera:", error);
      handleCameraError(error);
    }
  };

  // Modified startCamera - complete implementation
  const startCamera = async () => {
    // Remove the hasPermission check here since we handle it in requestCameraPermission
    if (!codeReader.current) {
      console.log("⚠️ Code reader not initialized");
      return;
    }

    try {
      setCameraError("");
      setScanStatus("camera_active");
      isProcessingRef.current = false;

      // Directly request stream - browser will use cached permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      console.log("✅ Camera stream obtained");

      // Set up the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");

        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current && videoRef.current.readyState >= 4) {
            resolve();
          } else if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve();
          }
        });

        console.log("✅ Video ready");
        console.log(
          "📏 Video dimensions:",
          videoRef.current.videoWidth,
          "x",
          videoRef.current.videoHeight
        );
      }

      // Start ZXing QR/Barcode detection
      console.log("🔍 Starting ZXing QR/Barcode detection...");
      codeReader.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, error) => {
          if (result && !isProcessingRef.current) {
            console.log("🎉 QR/Barcode detected by ZXing:", result.getText());
            handleQRDetected(result.getText());
          } else if (error && !(error instanceof NotFoundException)) {
            console.warn("⚠️ ZXing scanning error:", error);
          }
        }
      );

      console.log("✅ ZXING SCANNER STARTED");
    } catch (error) {
      console.error("❌ Camera error:", error);
      handleCameraError(error);
    }
  };
  // Handle camera errors
  const handleCameraError = (error: any) => {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      setCameraError("Camera access denied. Please allow camera permissions.");
    } else if (
      error.name === "NotFoundError" ||
      error.name === "OverconstrainedError"
    ) {
      setCameraError("Camera not found or settings incompatible.");
    } else {
      setCameraError(
        "Failed to start camera: " + (error.message || "Unknown error")
      );
    }

    setScanStatus("idle");
  };

  // Stop camera
  const stopCamera = () => {
    console.log("🛑 Stopping camera...");

    try {
      if (codeReader.current) {
        codeReader.current.reset();
        console.log("✅ ZXing reader reset");
      }
    } catch (e) {
      console.warn("⚠️ Error resetting ZXing reader:", e);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("⏹️ Stopped track:", track.kind);
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (scanStatus === "camera_active") {
      setScanStatus("idle");
    }
  };

  const handleRetry = () => {
    console.log("🔄 Retrying scanner...");
    stopCamera();
    setScanStatus("idle");
    setErrorMessage("");
    setScannedUUID("");
    setCameraError("");
    isProcessingRef.current = false;

    if (!hasPermission) {
      setShowPermissionScreen(true);
    } else {
      setTimeout(() => {
        startCamera();
      }, 500);
    }
  };

  const resetScanner = () => {
    console.log("🔄 Resetting scanner...");
    stopCamera();
    setScanStatus("idle");
    setErrorMessage("");
    setScannedUUID("");
    setCameraError("");
    isProcessingRef.current = false;
  };

  // Demo functions
  const handleDemoValidScan = () => {
    console.log("🎬 DEMO: Valid Scan");
    setScanStatus("scanning");
    setErrorMessage("");
    setScannedUUID("4a43bbb0-68b1-413a-bcf8-b50fd0174d05");

    setTimeout(() => {
      setScanStatus("success");
      setTimeout(() => {
        onScanComplete(mockPharmacyData);
      }, 1500);
    }, 1000);
  };

  const handleDemoInvalidScan = () => {
    console.log("🎬 DEMO: Invalid/Duplicate Scan");
    setScanStatus("scanning");
    setErrorMessage("");
    setScannedUUID("4a43bbb0-68b1-413a-bcf8-b50fd0174d05");

    setTimeout(() => {
      setScanStatus("error");
      setErrorMessage("This QR code was already scanned!");
    }, 1000);
  };

  const handleDemoFakeProduct = () => {
    console.log("🎬 DEMO: Fake Product");
    setScanStatus("scanning");
    setErrorMessage("");
    setScannedUUID("12345678-1234-1234-1234-123456789012");

    setTimeout(() => {
      setScanStatus("error");
      setErrorMessage("Product not found in database - Possibly FAKE!");
    }, 1000);
  };
  
  return (
    <div className="max-w-md mx-auto">
      {/* Scanner Preview Area */}
      <div className="relative min-h-[500px] bg-muted rounded-2xl overflow-hidden mb-6 shadow-card">
        {/* Camera Video Feed - Always present but only visible when camera is active */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            scanStatus === "camera_active" ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Camera Preview Placeholder - Only shows when NOT in camera_active mode */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            scanStatus === "camera_active"
              ? "opacity-0 pointer-events-none" // Hidden when camera is active
              : "opacity-100 bg-gradient-to-br from-muted to-muted-foreground/10"
          }`}
        >
          {scanStatus === "idle" && (
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-dashed border-primary/50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-16 h-16 text-primary/50" />
              </div>
              <p className="text-muted-foreground text-sm">
                Click below to start camera scanning
              </p>
              {cameraError && (
                <p className="text-destructive text-xs mt-2 px-4">
                  {cameraError}
                </p>
              )}
            </div>
          )}

          {/* Show scanning/verification states over the video */}
          {scanStatus === "scanning" && (
            <div className="text-center bg-background/90 backdrop-blur-sm rounded-xl p-6 z-10">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <p className="text-foreground font-medium">Verifying...</p>
              <p className="text-muted-foreground text-sm">
                Checking blockchain for UUID: {scannedUUID.slice(0, 8)}...
              </p>
            </div>
          )}

          {scanStatus === "success" && (
            <div className="text-center animate-scale-in bg-background/90 backdrop-blur-sm rounded-xl p-6 z-10">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <p className="text-green-600 font-bold text-lg">Verified!</p>
              <p className="text-muted-foreground text-sm">
                Product is authentic
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                UUID: {scannedUUID.slice(0, 8)}...
              </p>
            </div>
          )}

          {scanStatus === "error" && (
            <div className="text-center animate-scale-in px-4 bg-background/90 backdrop-blur-sm rounded-xl p-6 z-10">
              <div className="w-20 h-20 rounded-full bg-destructive flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>

              {/* Show different message for fake product vs duplicate */}
              {errorMessage.includes("not found") || errorMessage.includes("Invalid QR code format") ? (
                <>
                  <p className="text-destructive font-bold text-xl">
                    ⚠️ FAKE PRODUCT ALERT!
                  </p>
                  <p className="text-destructive font-semibold text-sm mt-2">
                    {errorMessage}
                  </p>
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mt-3 text-left">
                    <p className="text-destructive text-xs font-medium mb-2">
                      This medicine is NOT registered in our system!
                    </p>
                    <ul className="text-destructive/80 text-xs space-y-1">
                      <li>• Likely counterfeit product</li>
                      <li>• Not approved by regulatory authorities</li>
                      <li>• May contain harmful substances</li>
                    </ul>
                    <p className="text-destructive font-bold text-xs mt-2">
                      DO NOT PURCHASE - Report immediately!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-destructive font-bold text-xl">
                    ⚠️ DUPLICATE WARNING!
                  </p>
                  <p className="text-destructive font-semibold text-sm mt-2">
                    {errorMessage}
                  </p>
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mt-3 text-left">
                    <p className="text-destructive text-xs font-medium mb-2">
                      This medicine may be:
                    </p>
                    <ul className="text-destructive/80 text-xs space-y-1">
                      <li>• A counterfeit copy</li>
                      <li>• Resold/returned product</li>
                      <li>• Stolen merchandise</li>
                    </ul>
                    <p className="text-destructive font-bold text-xs mt-2">
                      DO NOT PURCHASE - Report to pharmacy!
                    </p>
                  </div>
                </>
              )}

              {scannedUUID && (
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  UUID: {scannedUUID.slice(0, 8)}...
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={resetScanner}
                className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Scan Another Product
              </Button>
            </div>
          )}
        </div>

        {/* Scanning Frame Overlay - Only shows when camera is active */}
        {scanStatus === "camera_active" && (
          <div className="absolute inset-8 border-2 border-primary/70 rounded-xl pointer-events-none z-20">
            <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
            <div className="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
            <div className="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
            <div className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

            {/* Scanning Line Animation */}
            <div
              className="absolute inset-x-0 top-0 h-1 bg-primary"
              style={{
                animation: "scanLine 2s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {/* Camera Close Button - Only shows when camera is active */}
        {scanStatus === "camera_active" && (
          <button
            onClick={stopCamera}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 z-30"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Scan Mode Selector */}
      <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
        <button
          onClick={() => {
            setScanMode("camera");
            resetScanner();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-smooth ${
            scanMode === "camera"
              ? "bg-card text-primary shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-sm font-medium">Camera</span>
        </button>
        <button
          onClick={() => {
            setScanMode("qr");
            stopCamera();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-smooth ${
            scanMode === "qr"
              ? "bg-card text-primary shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-sm font-medium">QR Code</span>
        </button>
        <button
          onClick={() => {
            setScanMode("barcode");
            stopCamera();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-smooth ${
            scanMode === "barcode"
              ? "bg-card text-primary shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Barcode className="w-5 h-5" />
          <span className="text-sm font-medium">Barcode</span>
        </button>
      </div>

      {/* Manual Input Section for QR/Barcode Modes */}
      {scanMode !== "camera" && (
        <div className="mb-6 p-4 bg-card rounded-xl border">
          <p className="text-sm text-muted-foreground mb-3">
            {scanMode === "qr"
              ? "Enter QR code data manually:"
              : "Enter barcode number manually:"}
          </p>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={
                  scanMode === "qr"
                    ? "Enter QR code or UUID"
                    : "Enter barcode number"
                }
                className="flex-1 px-4 py-2 border rounded-lg"
                value={scannedUUID}
                onChange={(e) => setScannedUUID(e.target.value)}
              />
              <Button
                onClick={async () => {
                  if (scannedUUID) {
                    const uuid = extractUUID(scannedUUID);
                    if (uuid) {
                      await processScannedUUID(uuid);
                    } else {
                      setErrorMessage("Invalid QR code format");
                      setScanStatus("error");
                    }
                  }
                }}
                disabled={!scannedUUID || scanStatus === "scanning"}
              >
                Verify
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Example UUID: 4a43bbb0-68b1-413a-bcf8-b50fd0174d05
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {scanMode === "camera" && scanStatus === "idle" && (
          <Button
            onClick={requestCameraPermission} // Change from startCamera to requestCameraPermission
            className="w-full h-14 text-lg gradient-hero text-primary-foreground hover:opacity-90"
          >
            <Camera className="w-5 h-5 mr-2" />
            Start Camera Scanner
          </Button>
        )}

        {scanStatus === "camera_active" && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
            <p className="text-sm text-primary font-medium">
              📱 Point your camera at the QR code
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              For demo: Click "Simulate QR Scan" button above
            </p>
          </div>
        )}

        {/* Demo Buttons - Static, no camera involved */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={handleDemoValidScan}
            disabled={
              scanStatus === "scanning" || scanStatus === "camera_active"
            }
            className="text-sm"
          >
            Valid Scan
          </Button>
          <Button
            variant="outline"
            onClick={handleDemoInvalidScan}
            disabled={
              scanStatus === "scanning" || scanStatus === "camera_active"
            }
            className="text-sm text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            Duplicate
          </Button>
          <Button
            variant="outline"
            onClick={handleDemoFakeProduct}
            disabled={
              scanStatus === "scanning" || scanStatus === "camera_active"
            }
            className="text-sm text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            Fake Product
          </Button>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-6 space-y-3">
        <p className="text-center text-muted-foreground text-sm">
          Scratch the protective layer on your medicine's QR code before
          scanning
        </p>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-primary font-medium text-center">
            🔒 <strong>One-Time Security:</strong> Each QR code works only once.
            After your scan, it's marked as "used" in our blockchain -
            protecting you from counterfeits!
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(280px); opacity: 0.5; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
