import {
  Handshake,
  Factory,
  QrCode,
  Shield,
  TrendingUp,
  Users,
  Bot,
  Scale,
  Sparkles,
  ListChecks,
  Smartphone,
  Apple,
  WifiOff
} from "lucide-react";
import { Button } from "../ui/button";

const partnerBenefits = [
  {
    icon: Shield,
    title: "Brand Protection",
    description:
      "Protect your products from counterfeiting with unique, one-time-use QR verification.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description:
      "Gain valuable data on product distribution and consumer engagement.",
  },
  {
    icon: Users,
    title: "Consumer Trust",
    description:
      "Build customer confidence with transparent product authentication.",
  },
];

const partnershipSteps = [
  {
    step: "01",
    title: "Sign Partnership Agreement",
    description:
      "Simple onboarding process with flexible terms for manufacturers of all sizes.",
  },
  {
    step: "02",
    title: "Integrate QR System",
    description:
      "We provide scratch-off QR labels to add to your production line.",
  },
  {
    step: "03",
    title: "Register Products",
    description:
      "Each product batch is registered on our secure blockchain database.",
  },
  {
    step: "04",
    title: "Consumers Verify",
    description:
      "End users scan and verify authenticity through our free mobile app.",
  },
];

const PartnershipSection = () => {
  return (
    <section className="mt-12 pt-12 border-t border-border">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full mb-4">
          <Handshake className="w-4 h-4" />
          <span className="text-sm font-medium">
            For Pharmaceutical Companies
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Partner With PharmaCheck
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Join our network of verified pharmaceutical manufacturers and protect
          your products from counterfeiting.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {partnerBenefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="bg-card rounded-xl p-5 shadow-card hover:shadow-soft transition-smooth"
            >
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* How Partnership Works */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Factory className="w-5 h-5 text-primary" />
          How It Works for Manufacturers
        </h3>

        <div className="space-y-4">
          {partnershipSteps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-sm">
                {step.step}
              </div>
              <div className="flex-1 pb-4 border-b border-border last:border-0">
                <h4 className="font-semibold text-foreground mb-1">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Label Preview */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-card rounded-xl shadow-soft flex items-center justify-center relative">
            <QrCode className="w-16 h-16 text-primary" />
            <div className="absolute inset-0 bg-muted/80 rounded-xl flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground text-center px-2">
                SCRATCH TO REVEAL
              </span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-foreground mb-2">
              Secure Scratch-Off QR Labels
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our tamper-evident labels feature a scratch-off layer that reveals
              a unique QR code. Once scratched, the label cannot be reapplied,
              ensuring first-use verification.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                Tamper-Evident
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                One-Time Use
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                Blockchain Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Future Plans 2026-2027 */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6 mb-8">
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold mb-3">
            🚀 ROADMAP 2026-2027
          </span>
          <h3 className="text-xl font-bold text-foreground">
            The Future of PharmaCheck
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Your medicine safety companion, evolving with advanced AI and
            mobile-first solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Mobile App */}
          <div className="bg-card rounded-xl p-4 shadow-card border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-foreground">Mobile App Launch</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Download our mobile app for on-the-go medicine checking. Scan
              barcodes, save favorites, and get alerts right from your phone.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                Q1 2026
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                📱 iOS & Android
              </span>
            </div>
          </div>

          {/* AI Chatbot */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-foreground">AI Health Assistant</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Get instant answers about your medicines from our AI chatbot. Ask
              about dosage, side effects, interactions, and more.
            </p>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              Q2 2026
            </span>
          </div>

          {/* Smart Comparison */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-accent" />
              </div>
              <h4 className="font-bold text-foreground">
                Smart Medicine Comparison
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              AI-powered comparison of medicines for same conditions. See pros,
              cons, prices, and effectiveness ratings side by side.
            </p>
            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
              Q3 2026
            </span>
          </div>

          {/* Quick Insights */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-foreground">
                Instant AI Summaries
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Scan any medicine and get a quick AI-generated summary: what it's
              for, who should avoid it, and key things to know.
            </p>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              Q4 2026
            </span>
          </div>

          {/* Pros & Cons */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ListChecks className="w-5 h-5 text-accent" />
              </div>
              <h4 className="font-bold text-foreground">
                Pros & Cons Analysis
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Before buying, see AI-analyzed pros and cons compared to
              alternatives. Make informed decisions about your health.
            </p>
            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
              Q1 2027
            </span>
          </div>

          {/* Offline Mode */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <WifiOff className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-foreground">
                Offline Medicine Database
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Access basic medicine information even without internet. Essential
              for remote areas or emergency situations.
            </p>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              Q2 2027
            </span>
          </div>
        </div>

        {/* 2027 Vision */}
        <div className="bg-card/50 border border-border rounded-xl p-4">
          <h4 className="font-bold text-foreground mb-3 text-center">
            ✨ 2027 Vision
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Full AI integration with personalized medicine recommendations, drug
            interaction warnings, and voice-enabled health consultations in
            local languages. Mobile-first approach ensuring accessibility for
            everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Mobile First
            </span>
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
              Uzbek Language AI
            </span>
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              Voice Commands
            </span>
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              Personalized Alerts
            </span>
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              Pharmacy Locator
            </span>
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              Family Health Profiles
            </span>
          </div>

          {/* App Store Previews */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h5 className="font-bold text-sm text-foreground mb-1">
                  Get Ready for Mobile
                </h5>
                <p className="text-xs text-muted-foreground">
                  Pre-register now and be among the first to access PharmaCheck
                  on your smartphone
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-smooth flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  Pre-register iOS
                </button>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-smooth flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Pre-register Android
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button className="h-12 px-8 gradient-hero text-primary-foreground hover:opacity-90">
          <Handshake className="w-5 h-5 mr-2" />
          Become a Partner
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          Contact us at{" "}
          <span className="text-primary font-medium">
            pharmacheck101@gmail.com
          </span>
        </p>
      </div>
    </section>
  );
};

export default PartnershipSection;
