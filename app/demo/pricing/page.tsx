"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  ArrowRight,
  Shield,
  Clock,
  HeadphonesIcon,
  Github,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  CreditCard,
  Users,
  Infinity,
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Free",
    description: "For exploring open source",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Sparkles,
    features: [
      "5 tracked issues",
      "Basic AI insights",
      "3 repositories",
      "Community support",
      "GitHub integration",
    ],
    limitations: ["Limited AI analysis", "No export"],
    cta: "Get Started",
    ctaVariant: "outline" as const,
    gradient: "from-muted/50 to-muted/30",
  },
  {
    name: "Pro",
    description: "For serious contributors",
    monthlyPrice: 12,
    yearlyPrice: 99,
    icon: Zap,
    popular: true,
    features: [
      "Unlimited tracked issues",
      "Advanced AI analysis",
      "Unlimited repositories",
      "Priority email support",
      "Custom notes & approach",
      "Export to JSON/CSV",
      "Difficulty calibration",
      "Personalized recommendations",
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    gradient: "from-accent/20 to-accent/5",
  },
  {
    name: "Team",
    description: "For teams & organizations",
    monthlyPrice: 39,
    yearlyPrice: 349,
    icon: Building2,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Admin dashboard",
      "SSO & Security",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    gradient: "from-primary/10 to-primary/5",
  },
];

const faqs = [
  {
    question: "Can I try Pro for free?",
    answer:
      "Yes! Start with a 14-day free trial of Pro. No credit card required.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Cancel anytime and you'll retain access until the end of your billing period.",
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes! Students get 50% off Pro with a valid .edu email address.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "We offer a full refund within 30 days of purchase if you're not satisfied.",
  },
];

const comparisonFeatures = [
  {
    name: "Tracked Issues",
    free: "5",
    pro: "Unlimited",
    team: "Unlimited",
    icon: CreditCard,
  },
  {
    name: "Repositories",
    free: "3",
    pro: "Unlimited",
    team: "Unlimited",
    icon: Github,
  },
  { name: "Team Members", free: "1", pro: "1", team: "Unlimited", icon: Users },
  {
    name: "AI Analysis",
    free: "Basic",
    pro: "Advanced",
    team: "Advanced",
    icon: Sparkles,
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic glow following mouse */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] transition-all duration-1000 ease-out"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
          }}
        />

        {/* Static orbs */}
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[80px] animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[70px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      {/* Dot pattern overlay */}
      <div className="fixed inset-0 dot-pattern pointer-events-none opacity-40" />

      {/* Navigation - Matching Landing Page */}
      <header className="sticky top-4 z-50 mx-auto max-w-4xl px-4">
        <nav className="floating-navbar px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="brand-text">Open</span>
              <span className="brand-text brand-text-accent">Scope</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="text-sm text-accent font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/#testimonials"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Reviews
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              className="rounded-full px-4 sm:px-5 hidden sm:flex"
              asChild
            >
              <Link href="/demo/dashboard">Sign up / Log in</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-background/95 backdrop-blur-xl rounded-xl border border-border shadow-lg animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link
                href="/#features"
                className="text-sm py-2 hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/demo/pricing"
                className="text-sm py-2 text-accent font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#testimonials"
                className="text-sm py-2 hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </Link>
              <Button className="w-full mt-2" asChild>
                <Link href="/demo/dashboard">Sign up / Log in</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-28 pb-12 px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm font-normal border-accent/30 bg-accent/5"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2 text-accent animate-pulse" />
              Simple, transparent pricing
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Invest in Your
              <br />
              <span className="gradient-text">Open Source Journey</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Start free, upgrade when you're ready. No hidden fees, no
              surprises.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !isYearly
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  isYearly
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Yearly
                <Badge className="bg-success/10 text-success border-success/20 text-xs">
                  -30%
                </Badge>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards - Bento Style Layout */}
      <section className="pb-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const period = isYearly ? "/year" : "/month";

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative group ${
                    plan.popular ? "lg:-mt-4 lg:mb-4" : ""
                  }`}
                >
                  {/* Glass card */}
                  <div
                    className={`relative h-full p-8 rounded-2xl border backdrop-blur-xl transition-all duration-500 overflow-hidden ${
                      plan.popular
                        ? "border-accent/50 bg-gradient-to-b from-accent/10 to-background/80 shadow-2xl shadow-accent/10"
                        : "border-border/50 bg-card/50 hover:border-muted-foreground/30 hover:shadow-xl"
                    }`}
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`}
                    />

                    {/* Glow effect on hover */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        plan.popular ? "bg-accent/5" : "bg-muted/20"
                      }`}
                    />

                    {plan.popular && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                    )}

                    <div className="relative z-10">
                      {plan.popular && (
                        <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground px-3 py-1 shadow-lg">
                          <Zap className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}

                      <div className="mb-6">
                        <div
                          className={`h-12 w-12 rounded-xl ${
                            plan.popular
                              ? "bg-accent/20 border border-accent/30"
                              : "bg-muted"
                          } flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                        >
                          <plan.icon
                            className={`h-6 w-6 ${
                              plan.popular ? "text-accent" : "text-foreground"
                            }`}
                          />
                        </div>
                        <h3 className="font-bold text-2xl mb-1">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold tracking-tight">
                            ${price}
                          </span>
                          {price > 0 && (
                            <span className="text-muted-foreground">
                              {period}
                            </span>
                          )}
                        </div>
                        {isYearly && plan.monthlyPrice > 0 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="line-through opacity-60">
                              ${plan.monthlyPrice * 12}
                            </span>
                            <span className="ml-2 text-success">
                              Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}
                            </span>
                          </p>
                        )}
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 text-sm"
                          >
                            <div
                              className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                                plan.popular ? "bg-accent/20" : "bg-success/10"
                              }`}
                            >
                              <Check
                                className={`h-3 w-3 ${
                                  plan.popular ? "text-accent" : "text-success"
                                }`}
                              />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {plan.limitations?.map((limitation) => (
                          <li
                            key={limitation}
                            className="flex items-start gap-3 text-sm text-muted-foreground opacity-60"
                          >
                            <div className="h-5 w-5 shrink-0" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full rounded-xl h-12 text-base transition-all ${
                          plan.popular
                            ? "bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25 hover:shadow-accent/40"
                            : ""
                        }`}
                        variant={plan.ctaVariant}
                        size="lg"
                        asChild={plan.name !== "Free"}
                      >
                        {plan.name === "Free" ? (
                          <>
                            {plan.cta}
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </>
                        ) : (
                          <Link
                            href={`/demo/checkout?plan=${plan.name.toLowerCase()}&billing=${
                              isYearly ? "yearly" : "monthly"
                            }`}
                          >
                            {plan.cta}
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </Link>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-6 border-b border-border/50">
              <h3 className="text-xl font-bold">Quick Comparison</h3>
            </div>
            <div className="divide-y divide-border/50">
              {comparisonFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-4 gap-4 p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <feature.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{feature.name}</span>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {feature.free}
                  </div>
                  <div className="text-center text-sm font-medium text-accent">
                    {feature.pro}
                  </div>
                  <div className="text-center text-sm font-medium">
                    {feature.team}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted/10 text-xs text-muted-foreground">
              <div></div>
              <div className="text-center">Free</div>
              <div className="text-center text-accent">Pro</div>
              <div className="text-center">Team</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Secure Payments",
                desc: "256-bit SSL encryption",
                color: "success",
              },
              {
                icon: Clock,
                title: "14-Day Trial",
                desc: "No credit card required",
                color: "accent",
              },
              {
                icon: HeadphonesIcon,
                title: "Priority Support",
                desc: "Fast response times",
                color: "primary",
              },
            ].map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-muted-foreground/30 transition-all group"
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-${badge.color}/10 flex items-center justify-center transition-transform group-hover:scale-110`}
                >
                  <badge.icon className={`h-6 w-6 text-${badge.color}`} />
                </div>
                <div>
                  <p className="font-semibold">{badge.title}</p>
                  <p className="text-sm text-muted-foreground">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 text-xs border-border/50"
            >
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-border/50 rounded-xl px-6 bg-card/30 backdrop-blur-sm data-[state=open]:border-accent/30 transition-all"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-border/50 bg-gradient-to-b from-card/80 to-background/80 backdrop-blur-xl p-10 sm:p-14 text-center overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Contributing?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of developers finding their perfect open source
                contributions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 gap-2 glow-accent"
                  asChild
                >
                  <Link href="/demo/dashboard">
                    <Github className="h-5 w-5" />
                    Start Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 h-12 border-border/50 hover:border-accent/50"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="brand-text text-sm">Dev</span>
            <span className="brand-text brand-text-accent text-sm">Lens</span>
          </div>
          <p>© 2026 OpenScope. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
