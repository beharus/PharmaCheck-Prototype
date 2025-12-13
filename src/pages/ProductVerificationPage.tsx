import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Pill,
  Clock,
  Shield,
  Thermometer,
  Calendar,
  Package,
  Info,
  ArrowLeft
} from "lucide-react";
import { Button } from "../components/ui/button";

interface ToastProps {
  type?: "valid" | "counterfeit" | "undefined";
}

interface ProductData {
  uuid: string;
  name: string;
  brand: string;
  strength: string;
  dosageForm: string;
  manufactureDate: string;
  expiryDate: string;
  batch: string;
  activeIngredients: string;
  storageConditions: string;
  imageExample: string;
  status: "valid" | "counterfeit" | "duplicate" | "undefined";
  recommendations: Array<{
    name: string;
    brand: string;
    cost_status: string;
  }>;
}

const ProductVerificationPage = ({ type }: ToastProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for Yoshlik eliksiri (Youth Elixir)
  const yoshlikEliksiri: ProductData = {
    uuid: id || "unknown-uuid",
    name: "Yoshlik Eliksiri",
    brand: "MediLife Pharmaceuticals",
    strength: "250mg/5ml",
    dosageForm: "Syrup",
    manufactureDate: "2024-01-15",
    expiryDate: "2025-12-31",
    batch: "YLK-2024-002",
    activeIngredients: "Multivitamin complex (A, C, D, E, B12), Zinc, Ginseng extract",
    storageConditions: "Store in a cool, dry place below 25°C. Protect from light.",
    imageExample: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    status: "valid",
    recommendations: [
      { name: "VitaBoost Complex", brand: "HealthPlus", cost_status: "medium" },
      { name: "ImmunoGuard Syrup", brand: "PharmaCare", cost_status: "low" },
      { name: "Youth Vitality Tonic", brand: "NaturalWell", cost_status: "high" }
    ]
  };

  // Alternative products data
  const alternatives = [
    {
      name: "ImmunoPlus Forte",
      brand: "MedTech Labs",
      description: "Immune system booster with Vitamin C & Zinc",
      price: "₩35,000",
      availability: "Available in most pharmacies"
    },
    {
      name: "VitaYouth Tonic",
      brand: "Natural Health",
      description: "Herbal tonic for energy and vitality",
      price: "₩28,000",
      availability: "Available in specialized stores"
    },
    {
      name: "MultiVita Complex",
      brand: "PharmaFirst",
      description: "Complete multivitamin supplement for all ages",
      price: "₩42,000",
      availability: "Widely available"
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setProductData({
        ...yoshlikEliksiri,
        status: type || "valid"
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [type, id]);

  const handleGoBack = () => {
    navigate("/");
  };

  const handleScanAnother = () => {
    navigate("/scanner");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product information...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The requested product information is not available.</p>
          <Button onClick={handleGoBack} className="px-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back to Scanner
          </Button>
        </div>
      </div>
    );
  }

  const isCounterfeit = productData.status === "counterfeit";
  const isDuplicate = productData.status === "duplicate";
  const isValid = productData.status === "valid";
  const isUndefined = productData.status === "undefined";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className={`p-4 ${isValid ? 'bg-green-500' : isCounterfeit ? 'bg-red-500' : 'bg-yellow-500'}`}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">PharmaCheck Verification</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Status Card */}
        <div className={`rounded-xl p-6 mb-6 ${
          isValid ? 'bg-green-100 border-green-300' : 
          isCounterfeit ? 'bg-red-100 border-red-300' : 
          'bg-yellow-100 border-yellow-300'
        } border-2`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${
              isValid ? 'bg-green-500' : 
              isCounterfeit ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}>
              {isValid ? (
                <CheckCircle2 className="w-8 h-8 text-white" />
              ) : (
                <AlertCircle className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isValid ? 'text-green-700' : 
                isCounterfeit ? 'text-red-700' : 
                'text-yellow-700'
              }`}>
                {isValid ? "✅ Product Verified & Authentic" :
                 isCounterfeit ? "⚠️ COUNTERFEIT PRODUCT ALERT" :
                 isDuplicate ? "⚠️ DUPLICATE SCAN DETECTED" :
                 "❓ PRODUCT STATUS UNDEFINED"}
              </h2>
              <p className={`${
                isValid ? 'text-green-600' : 
                isCounterfeit ? 'text-red-600' : 
                'text-yellow-600'
              } font-medium`}>
                UUID: {productData.uuid.slice(0, 8)}...
              </p>
            </div>
          </div>

          {isCounterfeit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-red-800 font-bold mb-2">⚠️ SAFETY WARNING:</p>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• This product is NOT registered in the official database</li>
                <li>• Likely contains harmful or ineffective ingredients</li>
                <li>• Not approved by health authorities</li>
                <li>• DO NOT CONSUME - Return to pharmacy immediately</li>
              </ul>
            </div>
          )}

          {isDuplicate && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 font-bold mb-2">⚠️ DUPLICATE ALERT:</p>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• This QR code was already scanned previously</li>
                <li>• Product may be resold, returned, or stolen</li>
                <li>• Could be a counterfeit copy</li>
                <li>• Report to pharmacy authorities</li>
              </ul>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            Product Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-1">{productData.name}</h4>
                <p className="text-gray-600">by {productData.brand}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Strength</p>
                    <p className="font-medium">{productData.strength}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Dosage Form</p>
                    <p className="font-medium">{productData.dosageForm}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Active Ingredients</p>
                    <p className="font-medium">{productData.activeIngredients}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Batch & Storage */}
            <div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Manufacture Date</p>
                    <p className="font-medium">{productData.manufactureDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-medium">{productData.expiryDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Batch Number</p>
                    <p className="font-medium">{productData.batch}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Storage:</span> {productData.storageConditions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* About Yoshlik Eliksiri */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">About Yoshlik Eliksiri</h4>
            <p className="text-gray-600 mb-3">
              Yoshlik Eliksiri is a premium multivitamin syrup designed to support overall health and vitality. 
              It contains a carefully balanced formula of essential vitamins and minerals to boost immunity, 
              enhance energy levels, and promote healthy growth and development.
            </p>
            <p className="text-gray-600">
              This formulation is particularly beneficial for individuals with active lifestyles, 
              students, and anyone looking to maintain optimal health during periods of increased physical or mental demands.
            </p>
          </div>
        </div>

        {/* Alternative Products */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recommended Alternatives</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {alternatives.map((alt, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 mb-1">{alt.name}</h4>
                <p className="text-sm text-gray-600 mb-2">by {alt.brand}</p>
                <p className="text-sm text-gray-700 mb-3">{alt.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">{alt.price}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {alt.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={handleScanAnother}
            className="px-8 py-3 text-lg"
          >
            Scan Another Product
          </Button>
          <Button 
            variant="outline"
            onClick={handleGoBack}
            className="px-8 py-3 text-lg"
          >
            Back to Home
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This verification result is based on the PharmaCheck blockchain database.</p>
          <p className="mt-1">Always consult with healthcare professionals before taking any medication.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductVerificationPage;