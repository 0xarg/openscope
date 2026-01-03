"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Github,
  Chrome,
  Mail,
  ArrowRight,
  Check,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/page-transition";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { signIn } from "next-auth/react";

const oauthProviders = [
  {
    name: "GitHub",
    icon: Github,
    color: "text-white",
    bgColor: "bg-[#24292F] hover:bg-[#1a1e22]",
  },
  // {
  //   name: "Google",
  //   icon: Chrome,
  //   color: "text-white",
  //   bgColor: "bg-[#4285F4] hover:bg-[#357ae8]",
  // },
  // {
  //   name: "Email",
  //   icon: Mail,
  //   color: "text-accent",
  //   bgColor: "bg-accent/10 hover:bg-accent/20 border border-accent/30",
  // },
];

const benefits = [
  "Track unlimited issues across repositories",
  "AI-powered smart recommendations",
  "Detailed contribution analytics",
  "Priority community support",
  "Collaborative tools for teams",
  "Real-time issue tracking",
];

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleOAuthClick = (provider: string) => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Navigation Bar */}
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
                  <Link href="/">Back</Link>
                </Button>
              </div>
            </div>
          )}
        </header>

        <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-24 lg:px-8">
          <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Branding & Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-6"
            >
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5">
                  <span className="text-accent text-sm font-medium">
                    Developer Platform
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                  Start Contributing to Open Source
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Join thousands of developers discovering meaningful
                  contributions. Track issues, get AI-powered recommendations,
                  and accelerate your open source journey.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="flex items-start gap-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/40 p-3"
                  >
                    <div className="mt-0.5 rounded-full bg-accent/20 p-1">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-sm font-medium leading-relaxed">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-accent/20 to-primary/20"
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-muted-foreground">
                    Trusted by{" "}
                    <span className="font-semibold text-foreground">
                      10,000+
                    </span>{" "}
                    developers
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md space-y-6">
                {/* Mode Toggle */}
                <div className="bg-muted/50 border-border/50 flex items-center gap-1 rounded-2xl border p-1 backdrop-blur-xl">
                  <button
                    onClick={() => {
                      setMode("signin");
                      setShowEmailForm(false);
                    }}
                    className={cn(
                      "flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300",
                      mode === "signin"
                        ? "bg-background text-foreground shadow-lg shadow-accent/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMode("signup");
                      setShowEmailForm(false);
                    }}
                    className={cn(
                      "flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300",
                      mode === "signup"
                        ? "bg-background text-foreground shadow-lg shadow-accent/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Auth Card */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="space-y-2 pb-6">
                    <CardTitle className="text-2xl font-bold">
                      {showEmailForm
                        ? `${
                            mode === "signin" ? "Sign in" : "Sign up"
                          } with email`
                        : mode === "signin"
                        ? "Welcome back"
                        : "Create account"}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {showEmailForm
                        ? `Enter your credentials to ${
                            mode === "signin" ? "access" : "create"
                          } your account`
                        : mode === "signin"
                        ? "Select your preferred method to sign in"
                        : "Choose your preferred sign up method"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <AnimatePresence mode="wait">
                      {!showEmailForm ? (
                        <motion.div
                          key="oauth-buttons"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          {oauthProviders.map((provider) => (
                            <Button
                              key={provider.name}
                              variant="outline"
                              size="lg"
                              className={cn(
                                "w-full justify-start gap-3 border-0 text-left hover:text-accent/20 font-semibold transition-all duration-200 hover:scale-[1.02]",
                                provider.bgColor,
                                provider.color
                              )}
                              onClick={() => handleOAuthClick(provider.name)}
                            >
                              <provider.icon className="h-5 w-5 " />
                              <span className="flex-1 .">
                                Continue with {provider.name}
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-60" />
                            </Button>
                          ))}

                          <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-card px-2 text-muted-foreground">
                                Or
                              </span>
                            </div>
                          </div>

                          <p className="text-center text-xs text-muted-foreground leading-relaxed">
                            By continuing, you agree to our{" "}
                            <Link
                              href="#"
                              className="text-accent hover:underline underline-offset-4 font-medium"
                            >
                              Terms
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="#"
                              className="text-accent hover:underline underline-offset-4 font-medium"
                            >
                              Privacy Policy
                            </Link>
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="email-form"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          {mode === "signup" && (
                            <div className="space-y-2">
                              <Label
                                htmlFor="name"
                                className="text-sm font-medium"
                              >
                                Full Name
                              </Label>
                              <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="h-11 border-border/50 bg-background/50 focus:border-accent transition-colors"
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="text-sm font-medium"
                            >
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="name@example.com"
                              className="h-11 border-border/50 bg-background/50 focus:border-accent transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                              >
                                Password
                              </Label>
                              {mode === "signin" && (
                                <Link
                                  href="#"
                                  className="text-accent text-xs hover:underline font-medium"
                                >
                                  Forgot password?
                                </Link>
                              )}
                            </div>
                            <Input
                              id="password"
                              type="password"
                              className="h-11 border-border/50 bg-background/50 focus:border-accent transition-colors"
                              placeholder={
                                mode === "signup"
                                  ? "Create a strong password"
                                  : "••••••••"
                              }
                            />
                          </div>
                          {mode === "signup" && (
                            <div className="space-y-2">
                              <Label
                                htmlFor="confirm-password"
                                className="text-sm font-medium"
                              >
                                Confirm Password
                              </Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11 border-border/50 bg-background/50 focus:border-accent transition-colors"
                              />
                            </div>
                          )}
                          <div className="flex gap-3 pt-2">
                            <Button
                              variant="outline"
                              size="lg"
                              className="flex-1 font-semibold bg-transparent"
                              onClick={() => setShowEmailForm(false)}
                            >
                              Back
                            </Button>
                            <Button
                              size="lg"
                              className="glow-accent flex-1 font-semibold hover:scale-[1.02] transition-transform"
                            >
                              {mode === "signin" ? "Sign In" : "Create Account"}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="bg-accent/5 absolute top-1/4 left-1/4 h-[600px] w-[600px] animate-pulse rounded-full blur-[120px]" />
          <div
            className="bg-accent/8 absolute bottom-1/4 right-1/4 h-[500px] w-[500px] animate-pulse rounded-full blur-[100px]"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="bg-primary/5 absolute top-1/2 right-1/3 h-[400px] w-[400px] animate-pulse rounded-full blur-[80px]"
            style={{ animationDelay: "2s" }}
          />
          <div className="dot-pattern absolute inset-0 opacity-20" />
        </div>
      </div>
    </PageTransition>
  );
}
