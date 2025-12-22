import { Button } from "../ui/button";
import {
  ArrowLeft,
  Shield,
  Calendar,
  Package,
  Pill,
  Building2,
  FileText,
  Thermometer,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
} from "lucide-react";
import type { PharmacyData } from "../../pages/AppPrototype";

interface PharmacyDetailsProps {
  data: PharmacyData;
  onBack: () => void;
}

const PharmacyDetails = ({ data, onBack }: PharmacyDetailsProps) => {
  const { pharmacy, latest_block } = data;
  console.log(data);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(pharmacy.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry < 90;
  };

  const getCostBadgeColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "high":
        return "bg-red-500/20 text-red-600 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="max-w-md mx-auto pb-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Scan Another
      </Button>

      {/* Verification Badge */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-green-600">Verified Authentic</h3>
          <p className="text-sm text-muted-foreground">
            This product has been verified on our blockchain
          </p>
        </div>
      </div>

      {/* Product Card */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-6">
        {/* Product Image */}
        <div className="aspect-video bg-muted relative">
          <img
            src={pharmacy.imageExample}
            alt={pharmacy.name}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border ${getCostBadgeColor(
              pharmacy.cost_status
            )}`}
          >
            {pharmacy.cost_status.toUpperCase()} COST
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {pharmacy.name}
              </h2>
              <p className="text-muted-foreground">{pharmacy.brand}</p>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {pharmacy.dosageForm}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Pill className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">
              Strength: {pharmacy.strength}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 mb-6">
        {/* Dates */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Important Dates
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Manufactured</p>
              <p className="font-medium text-foreground">
                {formatDate(pharmacy.manufactureDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expires</p>
              <p
                className={`font-medium ${
                  isExpiringSoon() ? "text-destructive" : "text-foreground"
                }`}
              >
                {formatDate(pharmacy.expiryDate)}
                {isExpiringSoon() && (
                  <AlertTriangle className="w-4 h-4 inline ml-1" />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Batch & GTIN */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Product Identifiers
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Batch Number</p>
              <p className="font-mono font-medium text-foreground">
                {pharmacy.batch}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">GTIN</p>
              <p className="font-mono font-medium text-foreground">
                {pharmacy.gtin}
              </p>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Storage Conditions
          </h3>
          <p className="text-foreground">{pharmacy.StorageConditions}</p>
        </div>

        {/* Regulatory */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Regulatory Information
          </h3>
          <p className="text-foreground">{pharmacy.regulatoryInfo}</p>
        </div>

        {/* Brand Links */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Manufacturer Documents
          </h3>
          <div className="flex gap-2">
            <a
              href={pharmacy.brandCertLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-smooth text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Certificate
            </a>
            <a
              href={pharmacy.brandLicenceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-smooth text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              License
            </a>
          </div>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Blockchain Verification
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Block Index</span>
            <span className="font-mono text-foreground">
              #{latest_block.index}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Timestamp</span>
            <span className="font-mono text-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(latest_block.timestamp * 1000).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Hash</span>
            <p className="font-mono text-xs text-foreground break-all bg-muted p-2 rounded mt-1">
              {latest_block.hash}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {pharmacy.recommendations && pharmacy.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">
            💊 Recommended Alternatives
          </h3>
          <div className="space-y-3">
            {pharmacy.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={
                      rec.imageExample.startsWith("/")
                        ? `https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100`
                        : rec.imageExample
                    }
                    alt={rec.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{rec.name}</h4>
                  <p className="text-sm text-muted-foreground">{rec.brand}</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${getCostBadgeColor(
                      rec.cost_status
                    )}`}
                  >
                    {rec.cost_status.toUpperCase()} COST
                  </span>
                </div>
                <LinkIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDetails;
