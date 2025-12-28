"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/devlens/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Award,
  TrendingUp,
  Target,
  Flame,
  Star,
  GitCommit,
  Users,
  Zap,
  Trophy,
  Code2,
  Heart,
} from "lucide-react";
import { User } from "@/types/database/user/user";
import axios from "axios";

const userData = {
  name: "Alex Developer",
  username: "alexdev",
  email: "alex@developer.io",
  bio: "Full-stack developer passionate about open source. Contributing to make the web better, one commit at a time.",
  location: "San Francisco, CA",
  website: "https://alexdev.io",
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
    color: "from-emerald-500/20 to-green-500/20",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    icon: "🌿",
    desc: "Some experience",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    value: "advanced",
    label: "Advanced",
    icon: "🌳",
    desc: "Seasoned contributor",
    color: "from-violet-500/20 to-purple-500/20",
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
  const [profile, setProfile] = useState<User>();
  const [selectedInterests, setSelectedInterests] = useState(
    userData.interests
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  const fetechUserDetails = useCallback(async () => {
    try {
      const res = await axios.get("/api/user");
      setProfile(res.data.user);
      console.log(res.data);
    } catch (error) {
      toast({
        title: "Error fetching user details",
      });
    }
  }, []);

  useEffect(() => {
    fetechUserDetails();
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSave = () => {
    // setProfile({ ...profile, interests: selectedInterests });
    setIsEditing(false);
    toast({
      title: "Profile saved",
      description: "Your changes have been saved.",
    });
  };

  const stats = [
    {
      icon: Target,
      label: "Tracked",
      value: "dum1",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: GitPullRequest,
      label: "PRs Merged",
      value: "dm2",
      color: "from-accent to-emerald-500",
      bgColor: "from-accent/20 to-emerald-500/20",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: "dm3",
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-500/20 to-amber-500/20",
    },
    {
      icon: GitCommit,
      label: "Commits",
      value: "dm4",
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-500/20 to-purple-500/20",
    },
  ];

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
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Mouse-following glow */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] transition-all duration-500 ease-out"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
              left: mousePosition.x - 300,
              top: mousePosition.y - 300,
            }}
          />

          {/* Static orbs */}
          <div className="absolute top-40 left-20 w-80 h-80 rounded-full bg-violet-500/10 blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />

          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-30" />
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8"
          >
            <div className="relative p-6 lg:p-8 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-violet-500/5 to-transparent pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative group">
                    <div className="h-28 w-28 lg:h-32 lg:w-32 rounded-full bg-gradient-to-br from-accent via-violet-500 to-purple-600 flex items-center justify-center text-4xl lg:text-5xl font-bold text-white shadow-2xl shadow-accent/30">
                      {/* {profile?.name} */}
                      <img
                        src={profile?.image!}
                        alt=""
                        className="rounded-full"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-success flex items-center justify-center border-4 border-background">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent to-violet-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />
                  </div>

                  {/* Experience Badge */}
                  <div className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-violet-500/20 border border-accent/30">
                    <span className="text-sm font-medium">
                      {
                        experienceLevels.find((l) => l.value === "begginer")
                          ?.icon
                      }{" "}
                      {
                        experienceLevels.find((l) => l.value === "begginer")
                          ?.label
                      }
                    </span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                          <Input
                            value={profile?.name}
                            // onChange={(e) =>
                            //   setProfile({ ...profile, name: e.target.value })
                            // }
                            placeholder="Name"
                            className="text-xl font-bold bg-background/50"
                          />
                          <Input
                            value={profile?.email!}
                            // onChange={(e) =>
                            //   setProfile({ ...profile, email: e.target.value })
                            // }
                            placeholder="Email"
                            type="email"
                            className="bg-background/50"
                          />
                          <Textarea
                            value={profile?.bio!}
                            // onChange={(e) =>
                            //   setProfile({ ...profile, bio: e.target.value })
                            // }
                            placeholder="Bio"
                            rows={3}
                            className="bg-background/50"
                          />
                        </div>
                      ) : (
                        <>
                          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                            {profile?.name}
                          </h1>
                          {/* <p className="text-muted-foreground mt-1 font-mono">
                            @{profile?.}
                          </p> */}
                          <p className="text-sm text-muted-foreground mt-1">
                            {profile?.email}
                          </p>
                          <p className="text-muted-foreground mt-4 max-w-xl">
                            {profile?.bio}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-center lg:justify-end">
                      {!isEditing ? (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            className="gap-2 bg-background/50"
                          >
                            <Edit2 className="h-4 w-4" /> Edit Profile
                          </Button>
                        </motion.div>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => setIsEditing(false)}
                              className="gap-2"
                            >
                              <X className="h-4 w-4" /> Cancel
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={handleSave}
                              className="gap-2 bg-gradient-to-r from-accent to-accent/80"
                            >
                              <Save className="h-4 w-4" /> Save
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-border/50 text-sm text-muted-foreground justify-center lg:justify-start">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                      <MapPin className="h-4 w-4 text-accent" />
                      {isEditing ? (
                        <Input
                          value={"location"}
                          // onChange={(e) =>
                          //   setProfile({ ...profile, location: e.target.value })
                          // }
                          className="h-7 w-32 text-xs bg-background/50"
                        />
                      ) : (
                        " profile.location"
                      )}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                      <LinkIcon className="h-4 w-4 text-accent" />
                      {isEditing ? (
                        <Input
                          value={"profile.website"}
                          // onChange={(e) =>
                          //   setProfile({ ...profile, website: e.target.value })
                          // }
                          className="h-7 w-40 text-xs bg-background/50"
                        />
                      ) : (
                        <a
                          href={"/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent transition-colors"
                        >
                          {"profile.website"}
                        </a>
                      )}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                      <Calendar className="h-4 w-4 text-accent" />
                      Joined {"profile.joinedDate"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={cn(
                  "relative p-5 rounded-xl border border-border/50 backdrop-blur-sm overflow-hidden group",
                  "bg-gradient-to-br",
                  stat.bgColor
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Experience Level */}
              <motion.div variants={itemVariants}>
                <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        Experience Level
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {experienceLevels.map((level) => (
                        <motion.button
                          key={level.value}
                          whileHover={{ scale: isEditing ? 1.02 : 1 }}
                          whileTap={{ scale: isEditing ? 0.98 : 1 }}
                          // onClick={() =>
                          //   isEditing &&
                          //   setProfile({
                          //     ...profile,
                          //     experienceLevel: level.value,
                          //   })
                          // }
                          className={cn(
                            "p-5 rounded-xl border text-center transition-all bg-gradient-to-br",
                            level.color,
                            "profile.experienceLevel" === level.value
                              ? "border-accent ring-2 ring-accent/20 shadow-lg"
                              : "border-border/50 hover:border-accent/50",
                            !isEditing &&
                              " profile.experienceLevel" !== level.value &&
                              "opacity-50",
                            isEditing && "cursor-pointer"
                          )}
                        >
                          <div className="text-3xl mb-2">{level.icon}</div>
                          <p className="font-semibold">{level.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {level.desc}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Skills & Interests */}
              <motion.div variants={itemVariants}>
                <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-emerald-500 flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        Skills & Interests
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allInterests.map((interest) => (
                        <motion.div
                          key={interest}
                          whileHover={{ scale: isEditing ? 1.05 : 1 }}
                          whileTap={{ scale: isEditing ? 0.95 : 1 }}
                        >
                          <Badge
                            variant={
                              selectedInterests.includes(interest)
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              "cursor-pointer text-sm px-4 py-2 transition-all",
                              !isEditing && "cursor-default",
                              selectedInterests.includes(interest)
                                ? "bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-lg shadow-accent/20"
                                : "hover:border-accent/50 bg-background/50"
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
                        </motion.div>
                      ))}
                    </div>
                    {isEditing && (
                      <p className="text-xs text-muted-foreground mt-4">
                        Click to toggle interests. Selected:{" "}
                        {selectedInterests.length}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contribution Summary */}
              <motion.div variants={itemVariants}>
                <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold">Contributions</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          icon: Target,
                          label: "Issues Tracked",
                          value: "profile.stats.tracked",
                        },
                        {
                          icon: GitPullRequest,
                          label: "PRs Opened",
                          value: "profile.stats.prsOpened",
                        },
                        {
                          icon: Award,
                          label: "PRs Merged",
                          value: "profile.stats.prsMerged",
                        },
                        {
                          icon: Star,
                          label: "Stars Earned",
                          value: "profile.stats.totalStars",
                        },
                        {
                          icon: Users,
                          label: "Repos Following",
                          value: "profile.stats.repos",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </span>
                          <span className="font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* AI Personalization */}
              <motion.div variants={itemVariants}>
                <div className="relative p-6 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-violet-500/10 to-transparent" />
                  <div className="absolute inset-0 ai-surface" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold">AI Personalization</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your profile and interests help us recommend the perfect
                      issues for your skill level.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Match accuracy
                        </span>
                        <span className="font-medium text-accent">94%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                        <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-accent to-violet-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs pt-3 border-t border-border/30">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      <span className="text-success font-medium">
                        Active & Learning
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Connected Accounts */}
              <motion.div variants={itemVariants}>
                <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">Connected</h3>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/30"
                  >
                    <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                      <Github className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">GitHub</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        @{profile?.name}
                      </p>
                    </div>
                    <Badge className="text-xs bg-accent/20 text-accent border-accent/40">
                      Connected
                    </Badge>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
