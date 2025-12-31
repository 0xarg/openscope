"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/devlens/app-sidebar-demo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DisabledOverlay } from "@/components/devlens/DisabledOverlay";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Github,
  MapPin,
  Link as LinkIcon,
  Sparkles,
  Edit2,
  Save,
  X,
  Calendar,
  GitPullRequest,
  Target,
  GitCommit,
  TrendingUp,
  Star,
  ExternalLink,
  RefreshCw,
  User,
} from "lucide-react";

const userData = {
  name: "Alex Developer",
  username: "alexdev",
  email: "alex@developer.io",
  bio: "Full-stack developer passionate about open source. Contributing to make the web better, one commit at a time.",
  location: "San Francisco, CA",
  website: "https://alexdev.io",
  image: "",
  joinedDate: "January 2024",
  experienceLevel: "intermediate",
  interests: ["React", "TypeScript", "Node.js", "Rust"],
  stats: {
    tracked: 24,
    completed: 8,
    repos: 12,
    streak: 15,
    contributions: 127,
    prsOpened: 18,
    prsMerged: 14,
    totalStars: 342,
  },
};

const experienceLevels = [
  {
    value: "beginner",
    label: "Beginner",
    icon: "🌱",
    desc: "Just getting started",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    icon: "🌿",
    desc: "Some experience",
  },
  {
    value: "advanced",
    label: "Advanced",
    icon: "🌳",
    desc: "Seasoned contributor",
  },
];

const allInterests = [
  "React",
  "Vue",
  "TypeScript",
  "Node.js",
  "Python",
  "Rust",
  "Go",
  "DevOps",
  "Frontend",
  "Backend",
  "AI/ML",
  "Web3",
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [profile, setProfile] = useState(userData);
  const [selectedInterests, setSelectedInterests] = useState(
    userData.interests
  );
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({ title: "Syncing profile...", description: "Fetching latest data" });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSyncing(false);
    toast({
      title: "Sync complete",
      description: "Profile data is now up to date",
    });
  };

  const handleSave = () => {
    setProfile({ ...profile, interests: selectedInterests });
    setIsEditing(false);
    toast({
      title: "Profile saved",
      description: "Your changes have been saved.",
    });
  };

  const stats = [
    { icon: Target, label: "Tracked", value: profile.stats.tracked },
    {
      icon: GitPullRequest,
      label: "PRs Merged",
      value: profile.stats.prsMerged,
    },
    { icon: GitCommit, label: "Commits", value: profile.stats.contributions },
    { icon: Star, label: "Stars", value: profile.stats.totalStars },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your account
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleSync}
              disabled={isSyncing || isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Syncing..." : "Sync"}
            </Button>
          </motion.div>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center sm:items-start">
                      <Skeleton className="h-24 w-24 rounded-xl" />
                      <Skeleton className="h-5 w-24 mt-3 rounded-full" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-7 w-48" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full max-w-md" />
                      <div className="flex gap-3 pt-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center sm:items-start">
                      <div className="h-24 w-24 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-3xl font-bold text-accent">
                        {profile.name.charAt(0)}
                      </div>
                      <Badge variant="outline" className="mt-3 text-xs">
                        {
                          experienceLevels.find(
                            (l) => l.value === profile.experienceLevel
                          )?.icon
                        }{" "}
                        {
                          experienceLevels.find(
                            (l) => l.value === profile.experienceLevel
                          )?.label
                        }
                      </Badge>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          {isEditing ? (
                            <div className="space-y-3 max-w-md mx-auto sm:mx-0">
                              <Input
                                value={profile.name}
                                onChange={(e) =>
                                  setProfile({
                                    ...profile,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Name"
                                className="text-lg font-semibold"
                              />
                              <Input
                                value={profile.email}
                                onChange={(e) =>
                                  setProfile({
                                    ...profile,
                                    email: e.target.value,
                                  })
                                }
                                placeholder="Email"
                                type="email"
                              />
                              <Textarea
                                value={profile.bio}
                                onChange={(e) =>
                                  setProfile({
                                    ...profile,
                                    bio: e.target.value,
                                  })
                                }
                                placeholder="Bio"
                                rows={2}
                              />
                            </div>
                          ) : (
                            <>
                              <h1 className="text-2xl font-bold">
                                {profile.name}
                              </h1>
                              <p className="text-muted-foreground text-sm font-mono">
                                @{profile.username}
                              </p>
                              <p className="text-muted-foreground text-sm mt-2">
                                {profile.bio}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-center sm:justify-end shrink-0">
                          {!isEditing ? (
                            <Button
                              onClick={() => setIsEditing(true)}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Edit2 className="h-4 w-4" /> Edit
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={handleSave}
                                size="sm"
                                className="gap-2"
                              >
                                <Save className="h-4 w-4" /> Save
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t text-sm text-muted-foreground justify-center sm:justify-start">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {isEditing ? (
                            <Input
                              value={profile.location}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  location: e.target.value,
                                })
                              }
                              className="h-7 w-28 text-xs"
                            />
                          ) : (
                            profile.location
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <LinkIcon className="h-3.5 w-3.5" />
                          {isEditing ? (
                            <Input
                              value={profile.website}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  website: e.target.value,
                                })
                              }
                              className="h-7 w-36 text-xs"
                            />
                          ) : (
                            <a
                              href={profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-accent transition-colors"
                            >
                              {profile.website}
                            </a>
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Joined {profile.joinedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <Card key={i} className="h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-6 w-12" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Experience Level */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">
                      Experience Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {experienceLevels.map((level) => (
                        <button
                          key={level.value}
                          onClick={() =>
                            isEditing &&
                            setProfile({
                              ...profile,
                              experienceLevel: level.value,
                            })
                          }
                          disabled={!isEditing}
                          className={cn(
                            "p-4 rounded-lg border text-center transition-all",
                            profile.experienceLevel === level.value
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-muted-foreground/50",
                            !isEditing &&
                              profile.experienceLevel !== level.value &&
                              "opacity-50",
                            isEditing && "cursor-pointer hover:bg-muted/50"
                          )}
                        >
                          <div className="text-2xl mb-1">{level.icon}</div>
                          <p className="font-medium text-sm">{level.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {level.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills & Interests */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">
                      Skills & Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {allInterests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={
                            selectedInterests.includes(interest)
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "text-sm px-3 py-1.5 transition-all",
                            !isEditing && "cursor-default",
                            isEditing && "cursor-pointer",
                            selectedInterests.includes(interest) &&
                              "bg-accent hover:bg-accent/90"
                          )}
                          onClick={() =>
                            isEditing &&
                            setSelectedInterests((prev) =>
                              prev.includes(interest)
                                ? prev.filter((x) => x !== interest)
                                : [...prev, interest]
                            )
                          }
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Click to toggle • Selected: {selectedInterests.length}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contributions */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base font-medium">
                      Activity
                    </CardTitle>
                  </div>
                </CardHeader>
                <DisabledOverlay reason="Under Development">
                  <CardContent className="space-y-2">
                    {[
                      { label: "Issues Tracked", value: profile.stats.tracked },
                      { label: "PRs Opened", value: profile.stats.prsOpened },
                      { label: "PRs Merged", value: profile.stats.prsMerged },
                      { label: "Repos Following", value: profile.stats.repos },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </DisabledOverlay>
              </Card>

              {/* AI Match */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-accent/20 bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span className="font-medium text-sm">
                        AI Personalization
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Your profile helps us recommend issues for your skill
                      level.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Match accuracy
                        </span>
                        <span className="font-medium text-accent">94%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[94%] rounded-full bg-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Connected Account */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">
                      Connected Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center border">
                        <Github className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">GitHub</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          @{profile.username}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
