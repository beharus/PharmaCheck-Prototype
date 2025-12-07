import { useState } from "react";
import OnboardingTutorial from "../components/prototype/OnboardingTutorial";
import QRScanner from "../components/prototype/QRScanner";
import PharmacyDetails from "../components/prototype/PharmacyDetails";
import PartnershipSection from "../components/prototype/PartnershipSection";
import { Button } from "../components/ui/button";
import { HelpCircle } from "lucide-react";
import ChatbotWidget from "../components/prototype/Chatbot";

export interface PharmacyData {
  pharmacy: {
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
    recommendations: {
      name: string;
      brand: string;
      cost_status: string;
      imageExample: string;
    }[];
  };
  latest_block: {
    index: number;
    timestamp: number;
    data: string;
    previous_hash: string;
    hash: string;
  };
}

const AppPrototype = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentView, setCurrentView] = useState<"scanner" | "details">(
    "scanner"
  );
  const [pharmacyData, setPharmacyData] = useState<PharmacyData | null>(null);

  const handleScanComplete = (data: PharmacyData) => {
    setPharmacyData(data);
    setCurrentView("details");
  };

  const handleBackToScanner = () => {
    setCurrentView("scanner");
    setPharmacyData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <ChatbotWidget />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary">PharmaCheck App</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOnboarding(true)}
            className="text-muted-foreground hover:text-primary"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {currentView === "scanner" ? (
          <QRScanner onScanComplete={handleScanComplete} />
        ) : (
          <PharmacyDetails data={pharmacyData!} onBack={handleBackToScanner} />
        )}

        {/* Partnership Section */}
        <PartnershipSection />
      </main>

      {/* Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
};

export default AppPrototype;
