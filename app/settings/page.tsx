"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/devlens/AppSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Bell,
  Shield,
  LogOut,
  Trash2,
  Brain,
  Zap,
  Save,
  Check,
  Settings as SettingsIcon,
  Github,
  RefreshCw,
} from "lucide-react";
import { UserDb } from "@/types/database/user/user";
import axios, { AxiosError } from "axios";
import { DisabledOverlay } from "../components/devlens/DisabledOverlay";
import { signIn, signOut } from "next-auth/react";

const aiModels = [
  { value: "gpt-4", label: "GPT-4 Turbo", description: "Most capable" },
  { value: "gpt-3.5", label: "GPT-3.5", description: "Fast & efficient" },
  { value: "claude-3", label: "Claude 3", description: "Great for analysis" },
  { value: "gemini", label: "Gemini Pro", description: "Google's latest" },
];

const codeStyles = [
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
  { value: "beginner", label: "Beginner-friendly" },
];

const difficultyOptions = [
  {
    value: "easy",
    label: "Easy",
    activeClass: "bg-success/10 text-success border-success/30",
  },
  {
    value: "medium",
    label: "Medium",
    activeClass: "bg-warning/10 text-warning border-warning/30",
  },
  {
    value: "hard",
    label: "Hard",
    activeClass: "bg-destructive/10 text-destructive border-destructive/30",
  },
];

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserDb>();
  const [aiSummaries, setAiSummaries] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([
    "easy",
    "medium",
    "hard",
  ]);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [codeStyle, setCodeStyle] = useState("concise");
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [cacheResults, setCacheResults] = useState(true);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleDelete = useCallback(async () => {
    try {
      const res = await axios.delete("/api/user");
      await signOut({
        callbackUrl: "/",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 401:
            signOut({ callbackUrl: "/" });
            break;
          case 500:
            toast({
              title: "Something went wrong",
              description: "Unable to delete your account at the moment",
            });

          default:
            toast({
              title: "Something went wrong",
              description: "Unable to delete your account at the moment",
            });
            break;
        }
      }
    }
  }, []);

  const loadPageData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/user");
      const fetchedUser = res.data.user;
      setUser(fetchedUser);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 401:
            signOut({ callbackUrl: "/" });
            break;
          case 500:
            toast({
              title: "Something went wrong",
              description: "Unable to fetch your details at the moment",
            });

          default:
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleSync = async () => {
    await loadPageData();
  };

  const toggleDifficulty = (value: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const handleSave = () => {
    setSaved(true);
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Configure your preferences
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleSync}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                {isLoading ? "Syncing..." : "Sync"}
              </Button>
              <Button
                onClick={handleSave}
                className="gap-2"
                disabled={isLoading}
              >
                {saved ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saved ? "Saved!" : "Save"}
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI & Models */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-base">AI & Models</CardTitle>
                        <CardDescription className="text-xs">
                          Choose your AI model and preferences
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <DisabledOverlay reason="Under development">
                    <CardContent className="space-y-4">
                      {isLoading ? (
                        <>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t">
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm">AI Model</Label>
                              <Select
                                value={selectedModel}
                                onValueChange={setSelectedModel}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {aiModels.map((model) => (
                                    <SelectItem
                                      key={model.value}
                                      value={model.value}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span>{model.label}</span>
                                        <span className="text-xs text-muted-foreground">
                                          • {model.description}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm">
                                Explanation Style
                              </Label>
                              <Select
                                value={codeStyle}
                                onValueChange={setCodeStyle}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {codeStyles.map((style) => (
                                    <SelectItem
                                      key={style.value}
                                      value={style.value}
                                    >
                                      {style.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div>
                                <Label
                                  htmlFor="auto-analyze"
                                  className="text-sm"
                                >
                                  Auto-Analyze
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Analyze issues on view
                                </p>
                              </div>
                              <Switch
                                id="auto-analyze"
                                checked={autoAnalyze}
                                onCheckedChange={setAutoAnalyze}
                              />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div>
                                <Label
                                  htmlFor="cache-results"
                                  className="text-sm"
                                >
                                  Cache Results
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Faster loading
                                </p>
                              </div>
                              <Switch
                                id="cache-results"
                                checked={cacheResults}
                                onCheckedChange={setCacheResults}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </DisabledOverlay>
                </Card>
              </motion.div>

              {/* Analysis Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Analysis Preferences
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Control how AI assists you
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <DisabledOverlay reason="Under development">
                    <CardContent className="space-y-4">
                      {isLoading ? (
                        <>
                          <div className="grid sm:grid-cols-3 gap-3">
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50 border-t">
                            <Skeleton className="h-4 w-24 mb-3" />
                            <div className="flex gap-2">
                              <Skeleton className="h-10 w-16 rounded-lg" />
                              <Skeleton className="h-10 w-20 rounded-lg" />
                              <Skeleton className="h-10 w-14 rounded-lg" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid sm:grid-cols-3 gap-3">
                            {[
                              {
                                id: "ai-summaries",
                                label: "Summaries",
                                desc: "Issue summaries",
                                checked: aiSummaries,
                                onChange: setAiSummaries,
                              },
                              {
                                id: "ai-difficulty",
                                label: "Difficulty",
                                desc: "Difficulty levels",
                                checked: aiDifficulty,
                                onChange: setAiDifficulty,
                              },
                              {
                                id: "ai-recommendations",
                                label: "Recommendations",
                                desc: "Smart suggestions",
                                checked: aiRecommendations,
                                onChange: setAiRecommendations,
                              },
                            ].map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                              >
                                <div>
                                  <Label htmlFor={item.id} className="text-sm">
                                    {item.label}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    {item.desc}
                                  </p>
                                </div>
                                <Switch
                                  id={item.id}
                                  checked={item.checked}
                                  onCheckedChange={item.onChange}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="p-4 rounded-lg bg-muted/50 border-t">
                            <Label className="text-sm mb-3 block">
                              Difficulty Levels
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {difficultyOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => toggleDifficulty(option.value)}
                                  className={cn(
                                    "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                                    selectedDifficulties.includes(option.value)
                                      ? option.activeClass
                                      : "border-border bg-background text-muted-foreground hover:border-muted-foreground/50"
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {selectedDifficulties.length === 0
                                ? "Select at least one difficulty level"
                                : `Showing: ${selectedDifficulties
                                    .map(
                                      (d) =>
                                        d.charAt(0).toUpperCase() + d.slice(1)
                                    )
                                    .join(", ")}`}
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </DisabledOverlay>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">Notifications</CardTitle>
                    </div>
                  </CardHeader>
                  <DisabledOverlay reason="Under development">
                    <CardContent className="space-y-3">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-16 w-full rounded-lg" />
                          <Skeleton className="h-16 w-full rounded-lg" />
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <Label
                                htmlFor="email-notifications"
                                className="text-sm"
                              >
                                Email Alerts
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Issue updates
                              </p>
                            </div>
                            <Switch
                              id="email-notifications"
                              checked={emailNotifications}
                              onCheckedChange={setEmailNotifications}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <Label
                                htmlFor="weekly-digest"
                                className="text-sm"
                              >
                                Weekly Digest
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Recommendations
                              </p>
                            </div>
                            <Switch
                              id="weekly-digest"
                              checked={weeklyDigest}
                              onCheckedChange={setWeeklyDigest}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </DisabledOverlay>
                </Card>
              </motion.div>

              {/* Account */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">Account</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-14 w-full rounded-lg" />
                        <div className="space-y-2 pt-2 border-t">
                          <Skeleton className="h-9 w-full" />
                          <Skeleton className="h-9 w-full" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center border">
                            <Github className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">GitHub</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              @{user?.githubUsername}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {user?.githubUsername
                              ? "Connected"
                              : "Disconnected"}
                          </Badge>
                        </div>

                        <div className="space-y-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 h-9"
                            size="sm"
                            onClick={() => {
                              signOut();
                            }}
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 h-9 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                            size="sm"
                            onClick={handleDelete}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI Status */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-accent/20 bg-accent/5">
                  <DisabledOverlay reason="Under development">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="font-medium text-sm">AI Status</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Model</span>
                          <span className="font-medium">
                            {
                              aiModels.find((m) => m.value === selectedModel)
                                ?.label
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Requests today
                          </span>
                          <span className="font-medium">42 / 100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Response time
                          </span>
                          <span className="font-medium text-success">
                            ~1.2s
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-success" />
                        <span className="text-success font-medium">Active</span>
                      </div>
                    </CardContent>
                  </DisabledOverlay>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
