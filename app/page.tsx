"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Zap,
  BadgeDollarSign,
  HeartHandshake,
  BrainCircuit,
  GitMerge,
  ShieldCheck,
  BookOpen,
  Wrench,
  Sun,
  Moon,
  Github,
  Twitter,
  Mail,
  Quote,
  Check,
  Menu,
  X,
  Terminal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/page-transition";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const features = [
  {
    icon: Zap,
    title: "Ease of use",
    description:
      "Focus on contributing, not learning our tool. 2 min setup time.",
  },
  {
    icon: BadgeDollarSign,
    title: "Pricing like no other",
    description: "Our plans are by far the most generous on the market.",
  },
  {
    icon: HeartHandshake,
    title: "Open source love",
    description:
      "Earn recognition on every issue you tackle — even recurring impact.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Insights",
    description:
      "Leverage AI to understand issue difficulty and get approach guidance.",
  },
  {
    icon: GitMerge,
    title: "Many Integrations",
    description:
      "We support GitHub, GitLab, Bitbucket, and many more out of the box.",
  },
  {
    icon: ShieldCheck,
    title: "Secure with your data",
    description: "Your data is stored securely in the cloud and never sold.",
  },
  {
    icon: BookOpen,
    title: "Detailed Docs & Support",
    description:
      "Tons of developer documentation and a deeply knowledgeable support team.",
  },
  {
    icon: Wrench,
    title: "And anything else",
    description:
      "We do things that don't scale — ask and we'll try to make it happen!",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    handle: "@sarahdev",
    role: "Full Stack Developer",
    avatar: "SC",
    text: "DevLens helped me find my first open source contribution. The AI difficulty ratings are spot on!",
    date: "Dec 15, 2024",
  },
  {
    name: "Marcus Johnson",
    handle: "@marcusj",
    role: "Software Engineer at Stripe",
    avatar: "MJ",
    text: "Finally a tool that understands what makes an issue 'good first issue'. Been using it daily.",
    date: "Dec 18, 2024",
  },
  {
    name: "Priya Sharma",
    handle: "@priyacode",
    role: "CS Student",
    avatar: "PS",
    text: "Got my GSoC acceptance thanks to DevLens. The skill matching is incredibly helpful.",
    date: "Dec 20, 2024",
  },
  {
    name: "Alex Rivera",
    handle: "@alexr_dev",
    role: "Open Source Maintainer",
    avatar: "AR",
    text: "As a maintainer, I love how DevLens helps new contributors find appropriate issues.",
    date: "Dec 22, 2024",
  },
  {
    name: "Jordan Lee",
    handle: "@jordanlee",
    role: "Frontend Developer",
    avatar: "JL",
    text: "The approach suggestions save me hours of code exploration. Highly recommend!",
    date: "Dec 23, 2024",
  },
  {
    name: "Emma Wilson",
    handle: "@emmawilson",
    role: "DevRel Engineer",
    avatar: "EW",
    text: "Been recommending DevLens to every developer I meet. It's a game changer.",
    date: "Dec 25, 2024",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "5 tracked issues",
      "Basic AI insights",
      "3 repositories",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For serious contributors",
    features: [
      "Unlimited tracking",
      "Advanced AI analysis",
      "Unlimited repos",
      "Priority support",
      "Custom notes",
      "Export data",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$39",
    period: "/month",
    description: "For teams & organizations",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Admin dashboard",
      "SSO & Security",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
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
    <PageTransition>
      <div className="bg-background relative min-h-screen overflow-hidden">
        {/* Animated background effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Dynamic glow following mouse */}
          <div
            className="absolute h-[600px] w-[600px] rounded-full opacity-20 blur-[120px] transition-all duration-1000 ease-out"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
              left: mousePosition.x - 300,
              top: mousePosition.y - 300,
            }}
          />

          {/* Static orbs */}
          <div className="bg-accent/10 absolute top-1/4 left-1/4 h-[500px] w-[500px] animate-pulse rounded-full blur-[100px]" />
          <div
            className="bg-accent/15 absolute bottom-1/4 right-1/4 h-[400px] w-[400px] animate-pulse rounded-full blur-[80px]"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="bg-primary/10 absolute top-1/2 right-1/3 h-[300px] w-[300px] animate-pulse rounded-full blur-[60px]"
            style={{ animationDelay: "2s" }}
          />

          {/* Grid overlay */}
          <div className="grid-pattern absolute inset-0 opacity-30" />

          {/* Lightning/Electric effect lines */}
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="lightning-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--accent))"
                  stopOpacity="0"
                />
                <stop
                  offset="50%"
                  stopColor="hsl(var(--accent))"
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--accent))"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M0,200 Q200,100 400,200 T800,200"
              fill="none"
              stroke="url(#lightning-gradient)"
              strokeWidth="1"
              className="animate-pulse"
            />
            <path
              d="M0,400 Q300,300 600,400 T1200,400"
              fill="none"
              stroke="url(#lightning-gradient)"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </svg>
        </div>

        {/* Dot pattern overlay */}
        <div className="dot-pattern fixed inset-0 pointer-events-none opacity-50" />

        {/* Navigation */}
        <header className="sticky top-4 z-50 mx-auto max-w-4xl px-4">
          <nav className="floating-navbar flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link href="/" className="group flex items-center gap-1">
                <span className="brand-text">Dev</span>
                <span className="brand-text brand-text-accent">Lens</span>
              </Link>
              <div className="hidden items-center gap-6 md:flex">
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Reviews
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                className="hidden rounded-full px-4 sm:flex sm:px-5"
                asChild
              >
                <Link href="/auth">Sign up / Log in</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
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
            <div className="bg-background/95 animate-fade-in mt-2 rounded-xl border border-border p-4 shadow-lg backdrop-blur-xl md:hidden">
              <div className="flex flex-col gap-3">
                <a
                  href="#pricing"
                  className="hover:text-accent text-sm py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#features"
                  className="hover:text-accent text-sm py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="hover:text-accent text-sm py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reviews
                </a>
                <Button className="mt-2 w-full" asChild>
                  <Link href="/dashboard">Sign up / Log in</Link>
                </Button>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative px-4 pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left side - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                {/* Announcement badge */}
                <Link href="/dashboard">
                  <Badge
                    variant="outline"
                    className="border-accent/30 hover:bg-accent/10 mb-6 cursor-pointer px-4 py-2 text-sm font-normal transition-all hover:scale-105"
                  >
                    <Sparkles className="text-accent h-3.5 w-3.5 mr-2 animate-pulse" />
                    AI-powered matching
                    <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Badge>
                </Link>

                {/* Main headline */}
                <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                  Find Issues That
                  <br />
                  <span className="gradient-text">Match Your Skills</span>
                </h1>

                {/* Subtitle */}
                <p className="text-muted-foreground mx-auto mb-8 max-w-lg text-lg lg:mx-0">
                  Stop scrolling through endless issues. DevLens uses AI to
                  analyze repositories and match you with contributions that fit
                  your expertise.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:items-start lg:justify-start">
                  <Button
                    size="lg"
                    className="glow-accent h-12 rounded-full px-8 text-base group"
                    asChild
                  >
                    <Link href="/auth">
                      <Terminal className="h-4 w-4 mr-2" />
                      Start Contributing
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border/50 hover:border-accent/50 h-12 gap-2 rounded-full text-base group bg-transparent"
                    asChild
                  >
                    <Link
                      href="/"
                      onClick={() =>
                        signIn("github", { callbackUrl: "/dashboard" })
                      }
                    >
                      <Github className="h-4 w-4" />
                      Connect GitHub
                    </Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="border-border/50 mt-10 flex items-center justify-center gap-8 border-t pt-8 lg:justify-start">
                  <div>
                    <div className="text-accent text-2xl font-bold">10K+</div>
                    <div className="text-muted-foreground text-sm">
                      Issues Analyzed
                    </div>
                  </div>
                  <div>
                    <div className="text-accent text-2xl font-bold">2.5K+</div>
                    <div className="text-muted-foreground text-sm">
                      Contributors
                    </div>
                  </div>
                  <div>
                    <div className="text-accent text-2xl font-bold">500+</div>
                    <div className="text-muted-foreground text-sm">
                      Repositories
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right side - Terminal Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Glow effect behind terminal */}
                <div className="bg-accent/20 absolute -inset-4 opacity-50 blur-3xl rounded-3xl" />

                <div className="bg-card/80 border-border/50 relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl">
                  {/* Terminal Header */}
                  <div className="border-border bg-muted/50 flex items-center gap-2 border-b px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex flex-1 justify-center">
                      <div className="bg-background/50 text-muted-foreground flex items-center gap-2 rounded-md px-4 py-1 font-mono text-xs">
                        <Terminal className="h-3 w-3" />
                        devlens scan --match
                      </div>
                    </div>
                  </div>

                  {/* Terminal Content */}
                  <div className="bg-background/50 p-5 font-mono text-sm">
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-muted-foreground flex items-center gap-2"
                      >
                        <span className="text-accent">❯</span>
                        <span className="typing-effect">
                          Analyzing your skill profile...
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="border-border/50 overflow-hidden rounded-lg border"
                      >
                        <div className="border-border/50 bg-muted/20 text-muted-foreground grid grid-cols-12 gap-2 border-b px-4 py-2.5 text-xs">
                          <div className="col-span-5">REPOSITORY</div>
                          <div className="col-span-2">MATCH</div>
                          <div className="col-span-3">TECH</div>
                          <div className="col-span-2 text-right">LEVEL</div>
                        </div>

                        <div className="divide-border/50 divide-y">
                          {[
                            {
                              repo: "vercel/next.js",
                              match: "98%",
                              tech: "TypeScript",
                              techColor: "blue",
                              level: "Easy",
                              levelColor: "emerald",
                            },
                            {
                              repo: "facebook/react",
                              match: "94%",
                              tech: "JavaScript",
                              techColor: "yellow",
                              level: "Medium",
                              levelColor: "amber",
                            },
                            {
                              repo: "tailwind/tailwindcss",
                              match: "91%",
                              tech: "TypeScript",
                              techColor: "blue",
                              level: "Easy",
                              levelColor: "emerald",
                            },
                          ].map((item, i) => (
                            <motion.div
                              key={item.repo}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1 + i * 0.15 }}
                              className="hover:bg-accent/5 group grid grid-cols-12 items-center gap-2 px-4 py-3 transition-colors cursor-pointer"
                            >
                              <div className="col-span-5 text-foreground group-hover:text-accent transition-colors">
                                {item.repo}
                              </div>
                              <div
                                className={`col-span-2 font-medium text-${item.levelColor}-500`}
                              >
                                {item.match}
                              </div>
                              <div className="col-span-3">
                                <span
                                  className={`bg-${item.techColor}-500/15 text-${item.techColor}-500 rounded px-2 py-1 text-xs`}
                                >
                                  {item.tech}
                                </span>
                              </div>
                              <div
                                className={`col-span-2 text-right text-${item.levelColor}-500`}
                              >
                                {item.level}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-muted-foreground flex items-center gap-2 pt-2"
                      >
                        <span className="text-accent">✓</span>
                        <span>
                          Found{" "}
                          <span className="font-semibold text-foreground">
                            24 issues
                          </span>{" "}
                          matching your profile
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Grid style */}
        <section id="features" className="relative px-4 py-16 sm:py-24">
          <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              A lightweight tool with{" "}
              <span className="gradient-text">everything</span> you need
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base">
              From automatic issue analysis to collaborative tracking, DevLens
              has your contribution journey totally covered.
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="border-border grid border-t border-l md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="feature-cell group">
                  <feature.icon
                    className="text-foreground group-hover:text-accent mb-3 h-5 w-5 transition-colors sm:mb-4 sm:h-6 sm:w-6"
                    strokeWidth={1.5}
                  />
                  <h3 className="group-hover:text-accent mb-2 text-base font-semibold transition-colors sm:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="bg-muted/30 relative px-4 py-16 sm:py-24"
        >
          <div className="grid-pattern pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative mx-auto mb-12 max-w-4xl text-center sm:mb-16">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Love from all over the{" "}
              <span className="gradient-text">universe</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {" "}
              Developers around the world are using DevLens to level up their
              open source journey.
            </p>
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="testimonial-card break-inside-avoid"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                      <AvatarImage src="/" />
                      <AvatarFallback className="bg-accent/20 text-accent text-xs">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                    <Quote className="text-accent/30 ml-auto h-5 w-5" />
                  </div>
                  <p className="mb-3 text-xs sm:text-sm">{testimonial.text}</p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative px-4 py-16 sm:py-24">
          <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 sm:gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`hover-card-effect relative rounded-xl border bg-card p-6 transition-all sm:rounded-2xl sm:p-8 ${
                  plan.popular
                    ? "border-accent glow-accent shadow-xl md:scale-105"
                    : "border-border hover:border-accent/30"
                }`}
              >
                {plan.popular && (
                  <Badge className="bg-accent text-accent-foreground absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold sm:text-4xl">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
                    {plan.description}
                  </p>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-xs sm:text-sm"
                    >
                      <Check className="text-accent h-4 w-4 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full ${
                    plan.popular ? "bg-accent hover:bg-accent/90" : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/dashboard">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-muted-foreground mb-4 text-base sm:text-lg">
              Join hundreds of developers already using DevLens
            </p>
            <Button
              size="lg"
              className="h-11 gap-2 rounded-full px-6 group sm:h-12 sm:px-8"
              asChild
            >
              <Link href="/dashboard">
                Get Started Today
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-border relative border-t px-4 py-6 sm:py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-muted-foreground order-2 text-[10px] font-normal uppercase tracking-wider md:order-1 sm:text-xs">
              © 2025 All Rights Reserved
            </p>
            <div className="order-1 flex items-center gap-1 md:order-2">
              <span className="text-sm font-semibold tracking-tight">DEV</span>
              <span className="text-accent dark:drop-shadow-[0_0_8px_hsl(346,84%,60%)] text-sm font-semibold tracking-tight">
                LENS
              </span>
            </div>
            <div className="order-3 flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-accent flex items-center gap-1 text-[10px] uppercase tracking-wider transition-colors sm:gap-2 sm:text-xs"
              >
                <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Twitter</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-accent flex items-center gap-1 text-[10px] uppercase tracking-wider transition-colors sm:gap-2 sm:text-xs"
              >
                <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-accent flex items-center gap-1 text-[10px] uppercase tracking-wider transition-colors sm:gap-2 sm:text-xs"
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Contact</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
