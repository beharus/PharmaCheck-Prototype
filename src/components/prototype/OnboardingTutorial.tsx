import { useState } from "react";
import { Button } from "../ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ScanLine,
  Shield,
  Package,
  Handshake,
  AlertTriangle,
} from "lucide-react";

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: ScanLine,
    title: "Scan QR Code",
    description:
      "Find the scratch-off QR code on your medicine packaging. Use a coin to reveal the hidden QR code underneath.",
    tip: "The scratch layer ensures the code hasn't been used before!",
  },
  {
    icon: Shield,
    title: "One-Time Verification",
    description:
      "Each QR code works ONLY ONCE. After scanning, the code becomes invalid. This prevents counterfeiters from copying and reselling fake medicines.",
    tip: "⚠️ If you see 'Already Scanned' warning - BE CAREFUL! It may be a duplicate!",
    warning: true,
  },
  {
    icon: AlertTriangle,
    title: "Duplicate Protection",
    description:
      "If someone already scanned this QR code, you'll see a warning. This means the medicine may be counterfeit or resold. Don't buy it!",
    tip: "Trust the first scan only. If it's already used - walk away and report!",
    warning: true,
  },
  {
    icon: Package,
    title: "Safe to Purchase",
    description:
      "If verification is successful and the QR is scanned for the first time - you're safe to buy! View complete product details and cheaper alternatives.",
    tip: "Green checkmark = Safe to buy. The QR is now marked as used.",
  },
  {
    icon: Handshake,
    title: "Trusted Partners",
    description:
      "We partner with verified pharmaceutical manufacturers who add our secure QR codes during production.",
    tip: "Look for the PharmaCheck seal on certified products!",
  },
];

const OnboardingTutorial = ({ onComplete }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onComplete}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-6 bg-primary"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="pt-14 pb-6 px-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center shadow-glow">
              <Icon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>

          {/* Step Number */}
          <div className="text-center mb-2">
            <span className="text-sm font-medium text-primary">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-foreground mb-4">
            {currentStepData.title}
          </h2>

          {/* Description */}
          <p className="text-center text-muted-foreground mb-4 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Tip Box */}
          <div
            className={`rounded-xl p-4 mb-6 ${
              (currentStepData as any).warning
                ? "bg-destructive/10 border border-destructive/20"
                : "bg-primary/10 border border-primary/20"
            }`}
          >
            <p
              className={`text-sm font-medium text-center ${
                (currentStepData as any).warning
                  ? "text-destructive"
                  : "text-primary"
              }`}
            >
              {(currentStepData as any).warning ? "⚠️" : "💡"}{" "}
              {currentStepData.tip}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrev} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 gradient-hero text-primary-foreground hover:opacity-90"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>

          {/* Skip Link */}
          {currentStep < steps.length - 1 && (
            <button
              onClick={onComplete}
              className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-smooth"
            >
              Skip tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
