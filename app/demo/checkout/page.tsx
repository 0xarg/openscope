"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Check,
  Shield,
  Zap,
  Building2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const plans = {
  pro: {
    name: "Pro",
    icon: Zap,
    monthlyPrice: 12,
    yearlyPrice: 99,
    features: [
      "Unlimited tracked issues",
      "Advanced AI analysis",
      "Unlimited repositories",
      "Priority email support",
    ],
  },
  team: {
    name: "Team",
    icon: Building2,
    monthlyPrice: 39,
    yearlyPrice: 349,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Admin dashboard",
      "SSO & Security",
    ],
  },
};

export default function Checkout() {
  const planKey = "pro";
  const billingCycle = "monthly";
  const plan = plans[planKey] || plans.pro;

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("United States");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const { toast } = useToast();

  const price = plan.monthlyPrice;
  const period = "/month";
  const savings = 0;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: `Welcome to DevLens ${plan.name}! Your subscription is now active.`,
      });
    }, 2000);
  };

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "India",
    "Brazil",
    "Netherlands",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/demo/pricing"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pricing
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Secure checkout
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">
                Complete your purchase
              </h1>
              <p className="text-muted-foreground">
                Enter your payment details below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 h-12 bg-card border-border/50 focus:border-accent"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Payment Details */}
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Payment Details
                </h2>

                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                  {/* Card Number */}
                  <div className="p-4 border-b border-border/50">
                    <Label
                      htmlFor="cardNumber"
                      className="text-xs text-muted-foreground"
                    >
                      Card number
                    </Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="cardNumber"
                        placeholder="1234 1234 1234 1234"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        maxLength={19}
                        className="h-12 bg-transparent border-0 focus:ring-0 focus-visible:ring-0 pl-0 text-lg font-mono"
                        required
                      />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <div className="h-6 w-10 rounded bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">
                            VISA
                          </span>
                        </div>
                        <div className="h-6 w-10 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                          <div className="flex">
                            <div className="h-3 w-3 rounded-full bg-red-600 opacity-80" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500 -ml-1.5 opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-2 divide-x divide-border/50">
                    <div className="p-4">
                      <Label
                        htmlFor="expiry"
                        className="text-xs text-muted-foreground"
                      >
                        Expiration
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(formatExpiry(e.target.value))
                        }
                        maxLength={5}
                        className="mt-1.5 h-12 bg-transparent border-0 focus:ring-0 focus-visible:ring-0 pl-0 text-lg font-mono"
                        required
                      />
                    </div>
                    <div className="p-4">
                      <Label
                        htmlFor="cvc"
                        className="text-xs text-muted-foreground"
                      >
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) =>
                          setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        maxLength={4}
                        className="mt-1.5 h-12 bg-transparent border-0 focus:ring-0 focus-visible:ring-0 pl-0 text-lg font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <Label htmlFor="name" className="text-sm">
                    Cardholder name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Full name on card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 h-12 bg-card border-border/50 focus:border-accent"
                    required
                  />
                </div>

                {/* Country */}
                <div className="relative">
                  <Label className="text-sm">Billing country</Label>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full mt-1.5 h-12 px-4 bg-card border border-border/50 rounded-md flex items-center justify-between text-left hover:border-muted-foreground/50 transition-colors"
                  >
                    <span>{country}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        showCountryDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute z-20 w-full mt-1 py-2 bg-card border border-border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {countries.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-base rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Pay ${price}
                    {period}
                  </div>
                )}
              </Button>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4" />
                  <span>PCI Compliant</span>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-8">
              <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden">
                {/* Plan Header */}
                <div className="p-6 border-b border-border/50 bg-gradient-to-b from-accent/5 to-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <plan.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold">DevLens {plan.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">
                        {billingCycle} billing
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground">{period}</span>
                  </div>

                  {/* {billingCycle === "yearly" && savings > 0 && (
                    <Badge className="mt-3 bg-success/10 text-success border-success/20">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Save ${savings} per year
                    </Badge>
                  )} */}
                </div>

                {/* Features */}
                <div className="p-6 space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">
                    What's included
                  </p>
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-accent" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-border/50" />

                {/* Total */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ${price}
                      {period}
                    </span>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="p-4 bg-muted/20 border-t border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        30-day money-back guarantee
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Not satisfied? Get a full refund, no questions asked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust elements */}
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  By subscribing, you agree to our{" "}
                  <Link href="#" className="underline hover:text-foreground">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
