"use client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Calendar,
  GitBranch,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import { toast } from "sonner";
import CustomSpinner from "@/app/components/CustomSpinner";
import { safeParseAI } from "@/lib/utils/parseAIRes";
import { AIStatsIssue } from "@/types/ai";

export interface Issue {
  id: number;
  title: string;
  number: number;
  body: string;
  state: string;
  labels: string[];
  comments: number;
  createdAt: string;
  htmlBody: string;
  url: string;
  name: string;
  owner: string;
}

interface Repo {
  repoId: number;

  issues: Issue[];
}

const Issues = ({ params }: { params: { name: string } }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [aiStats, setAIStats] = useState<AIStatsIssue[]>([]);
  const [showAI, setShowAI] = useState<Boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchIssues = async () => {
      try {
        const paramsData = await params;
        const name = paramsData.name;
        await axios
          .post(`http://localhost:3000/api/issues/`, { name: name })
          .then((res) => {
            setIssues(res.data.filteredIssues);
            setLoading(false);
            setRefresh(false);
          });
      } catch (error) {
        console.log("Error fetching issues, ", error);
        toast("Error fetching issues;");
        setError(true);
      }
    };

    fetchIssues();
  }, [refresh]);

  const repos = [
    "all",
    "facebook/react",
    "microsoft/typescript",
    "vercel/next.js",
  ];
  const labels = [
    "all",
    "bug",
    "enhancement",
    "documentation",
    "typescript",
    "critical",
  ];
  const normalize = (label: string) =>
    label.toLowerCase().replace(/[^a-z0-9]+/gi, "-");
  const allLabels = [
    "all",
    ...Array.from(
      new Set(
        issues.flatMap((issue) => issue.labels.map((label) => normalize(label)))
      )
    ),
  ];

  const aiTake = useCallback(async () => {
    await axios
      .post("/api/ai/issue/stats", {
        issue: issues,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          const data = safeParseAI(res.data.issue.content);
          data.id = res.data.issueId;
          data.number = res.data.issueNumber;
          setAIStats((prev) => [...prev, res.data.issue]);
          setShowAI(true);
          toast("AI Response Fetched");
        } else if (res.status === 202) {
          const data = res.data.issue;
          setAIStats(data);
          setShowAI(true);
          toast("Response Fetched from DB");
        } else {
          toast("Error getting response from AI");
          return;
        }
      })
      .catch((error) => {
        toast("Error fetching AI response");
        console.log(error);
        return;
      });
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRepo =
      selectedRepo === "all" || `${issue.owner}/${issue.name}` === selectedRepo;
    const matchesLabel =
      selectedLabel === "all" ||
      issue.labels.some((label) => normalize(label) === selectedLabel);

    let matchesTime = true;
    if (timeFilter === "6months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12);
      matchesTime = new Date(issue.createdAt) >= sixMonthsAgo;
    }

    return matchesSearch && matchesRepo && matchesLabel && matchesTime;
  });

  const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      bug: "bg-destructive/10 text-destructive border-destructive/20",
      enhancement: "bg-primary/10 text-primary border-primary/20",
      documentation: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      typescript: "bg-blue-700/10 text-blue-700 border-blue-700/20",
      critical: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    };
    return colors[label] || "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">Issues</h1>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setRefresh(true)}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
            <p className="text-muted-foreground">
              All issues from your tracked repositories
            </p>
          </div>
          <Card className="p-6 mb-6 border-border/50">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                <SelectTrigger>
                  <SelectValue placeholder="All repositories" />
                </SelectTrigger>
                <SelectContent>
                  {repos.map((repo) => (
                    <SelectItem key={repo} value={repo}>
                      {repo === "all" ? "All repositories" : repo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                <SelectTrigger>
                  <SelectValue placeholder="All labels" />
                </SelectTrigger>
                <SelectContent>
                  {allLabels.map((label) => (
                    <SelectItem key={label} value={label}>
                      {label === "all" ? "All labels" : label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
          {loading ? (
            <CustomSpinner />
          ) : (
            <div className="space-y-4">
              {filteredIssues.length === 0 ? (
                <Card className="p-12 text-center border-border/50">
                  <h3 className="text-xl font-semibold mb-2">
                    No Issues Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or add more repositories
                  </p>
                  <Button asChild>
                    <Link href="/add-repo">Add Repository</Link>
                  </Button>
                </Card>
              ) : (
                filteredIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      key={issue.id}
                      className="p-6 hover:shadow-md  transition-shadow border-border/50 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/issues/detail/${issue.owner}/${encodeURIComponent(
                            issue.name
                          )}/${issue.id}`
                        )
                      }
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <h3 className="text-lg font-semibold leading-tight flex-1">
                              {issue.title}
                            </h3>
                            <a
                              href={issue.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>

                          <div className="flex justify-between  flex-wrap items-center gap-2">
                            <div className="">
                              <Badge variant="outline" className="gap-1">
                                <GitBranch className="w-3 h-3" />
                                {issue.owner}/{issue.name}
                              </Badge>
                              {issue.labels.map((label) => (
                                <Badge
                                  key={label}
                                  variant="outline"
                                  className={getLabelColor(label)}
                                >
                                  {label}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              variant={"outline"}
                              onClick={(e) => {
                                e.stopPropagation();
                                aiTake();
                              }}
                            >
                              AI's Take
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {issue.comments} comments
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {aiStats && (
                            <div className=" flex items-center gap-4">
                              {aiStats
                                .filter(
                                  (stats) => stats.issueNumber === issue.number
                                )
                                .flatMap((stats) => stats.skills)
                                .map((skill, index) => (
                                  <Badge
                                    key={index}
                                    className="font-semibold text-transparent bg-clip-text  bg-linear-to-r from-sky-600 via-yellow-600 to-sky-700 text-clip  "
                                    variant={"outline"}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              {aiStats
                                .filter(
                                  (stats) => stats.issueNumber === issue.number
                                )
                                .map((stats, index) => (
                                  <Badge
                                    key={index}
                                    variant={"secondary"}
                                    className="text-sm dark:text-neutral-100  "
                                  >
                                    {stats.difficulty}
                                  </Badge>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Issues;
