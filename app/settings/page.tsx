"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarLayout } from "@/components/devlens/sidebar-layout";
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
  Brain,
  Zap,
  Database,
  Eye,
  Code2,
  Cpu,
  Save,
  Check,
  SettingsIcon,
  Layers,
  Palette,
} from "lucide-react";

const aiModels = [
  { value: "gpt-4", label: "GPT-4 Turbo", description: "Most capable, slower" },
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
    color: "text-emerald-500 border-emerald-500/40 bg-emerald-500/10",
  },
  {
    value: "medium",
    label: "Medium",
    color: "text-amber-500 border-amber-500/40 bg-amber-500/10",
  },
  {
    value: "hard",
    label: "Hard",
    color: "text-rose-500 border-rose-500/40 bg-rose-500/10",
  },
];

export default function SettingsPage() {
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <SidebarLayout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] transition-all duration-500 ease-out"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
              left: mousePosition.x - 300,
              top: mousePosition.y - 300,
            }}
          />
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-accent/10 blur-[100px] animate-pulse" />
          <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent via-accent/80 to-primary flex items-center justify-center shadow-lg shadow-accent/25">
                    <SettingsIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                    Settings
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Configure AI, notifications, and account preferences
                  </p>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSave}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-lg shadow-accent/25"
                >
                  {saved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              {[
                {
                  icon: Brain,
                  label: "AI Model",
                  value: "GPT-4 Turbo",
                  color: "from-violet-500/20 to-purple-500/20",
                },
                {
                  icon: Layers,
                  label: "Features",
                  value: "3 Active",
                  color: "from-accent/20 to-emerald-500/20",
                },
                {
                  icon: Bell,
                  label: "Notifications",
                  value: "Weekly",
                  color: "from-blue-500/20 to-cyan-500/20",
                },
                {
                  icon: Shield,
                  label: "Security",
                  value: "Connected",
                  color: "from-amber-500/20 to-orange-500/20",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative p-4 rounded-xl border border-border/50 backdrop-blur-sm overflow-hidden group bg-gradient-to-br",
                    stat.color
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <stat.icon className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold text-sm">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">AI & Models</CardTitle>
                        <CardDescription>
                          Choose which AI model powers your insights
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 relative">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-violet-400" />
                          AI Model
                        </Label>
                        <Select
                          value={selectedModel}
                          onValueChange={setSelectedModel}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {aiModels.map((model) => (
                              <SelectItem key={model.value} value={model.value}>
                                <div className="flex flex-col">
                                  <span>{model.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {model.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-violet-400" />
                          Explanation Style
                        </Label>
                        <Select value={codeStyle} onValueChange={setCodeStyle}>
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {codeStyles.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                            <Eye className="h-5 w-5 text-violet-400" />
                          </div>
                          <div>
                            <Label
                              htmlFor="auto-analyze"
                              className="font-medium text-sm"
                            >
                              Auto-Analyze
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Analyze issues automatically
                            </p>
                          </div>
                        </div>
                        <Switch
                          id="auto-analyze"
                          checked={autoAnalyze}
                          onCheckedChange={setAutoAnalyze}
                        />
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                            <Database className="h-5 w-5 text-violet-400" />
                          </div>
                          <div>
                            <Label
                              htmlFor="cache-results"
                              className="font-medium text-sm"
                            >
                              Cache Results
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Store for faster loading
                            </p>
                          </div>
                        </div>
                        <Switch
                          id="cache-results"
                          checked={cacheResults}
                          onCheckedChange={setCacheResults}
                        />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center shadow-lg shadow-accent/25">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          Analysis Preferences
                        </CardTitle>
                        <CardDescription>
                          Control how AI assists you in DevLens
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        {
                          id: "ai-summaries",
                          label: "Summaries",
                          desc: "Generate issue summaries",
                          checked: aiSummaries,
                          onChange: setAiSummaries,
                        },
                        {
                          id: "ai-difficulty",
                          label: "Difficulty",
                          desc: "Assess difficulty levels",
                          checked: aiDifficulty,
                          onChange: setAiDifficulty,
                        },
                        {
                          id: "ai-recommendations",
                          label: "Smart Recs",
                          desc: "Personalized suggestions",
                          checked: aiRecommendations,
                          onChange: setAiRecommendations,
                        },
                      ].map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/30"
                        >
                          <div>
                            <Label
                              htmlFor={item.id}
                              className="font-medium text-sm"
                            >
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
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-br from-muted/60 to-muted/30 border border-border/30">
                      <Label className="font-medium text-sm mb-3 block flex items-center gap-2">
                        <Palette className="h-4 w-4 text-accent" />
                        Preferred Difficulty Levels
                      </Label>
                      <p className="text-xs text-muted-foreground mb-4">
                        Select which difficulty levels to show in issue lists
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {difficultyOptions.map((option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleDifficulty(option.value)}
                            className={cn(
                              "px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200",
                              selectedDifficulties.includes(option.value)
                                ? option.color
                                : "border-border bg-background/50 text-muted-foreground hover:border-muted-foreground/50"
                            )}
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </SidebarLayout>
  );
}
