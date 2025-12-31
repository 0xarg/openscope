"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  User,
  Clock,
  MessageSquare,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Circle,
  CheckCircle2,
  PlayCircle,
  Copy,
  Github,
  FileCode,
  Target,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { IssueWithAI } from "@/types/ai/issueAI";
import axiosInstance from "@/lib/axios";
import { UserIssueDb } from "@/types/database/user/UserIssue";
import { AppLayout } from "@/components/devlens/app-sidebar";
import axios from "axios";
import { DisabledOverlay } from "@/components/devlens/DisabledOverlay";
type PageProps = {
  params: Promise<{
    owner: string;
    name: string;
    githubNumber: string;
  }>;
};

const statusOptions = [
  {
    value: "not-started",
    label: "Planned",
    icon: Circle,
    color: "text-muted-foreground",
  },
  {
    value: "in-progress",
    label: "In Progress",
    icon: PlayCircle,
    color: "text-warning",
  },
  {
    value: "completed",
    label: "Done",
    icon: CheckCircle2,
    color: "text-accent",
  },
];

export default function IssueDetail({ params }: PageProps) {
  const [issue, setIssue] = useState<IssueWithAI>();
  const [status, setStatus] = useState<string>("not-started");
  const [blur, setBlur] = useState<boolean>(false);
  const [blurReason, setBlurReason] = useState<string>("Unknown reason");
  const [userIssue, setUserIssue] = useState<UserIssueDb>();
  const [notes, setNotes] = useState("");
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  const [showApproach, setShowApproach] = useState(true);
  const [trackingIds, setTrackedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [repoInfo, setRepoInfo] = useState<{ owner: string; name: string }>({
    owner: "",
    name: "",
  });
  const [isAILoading, setIsAILoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const fetchTrackedIssueIds = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/issues/tracked/ids");
      setTrackedIds(res.data.trackedIds);
      return res.data.trackedIds;
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchAIData = useCallback(async (issue: IssueWithAI) => {
    try {
      // console.log(issue);
      const res = await axiosInstance.post("/api/issue/ai/advance", {
        issue,
      });
      const data = res.data;
      setIssue({ ...issue, ai: { ...issue.ai, ...data.ai } });
      setIsAILoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.status;
        switch (status) {
          case 429:
            setBlur(true);
            setBlurReason("AI usage limit reached.");
            console.log("blur krdiya bhai");
            break;
          case 403:
            setBlur(true);
            setBlurReason("Contact support team");
            break;
          default:
            setBlur(true);
            setBlurReason("Unkown");
            break;
        }
      }
    }
  }, []);

  const getUserIssue = useCallback(async (githubId: string) => {
    try {
      const res = await axiosInstance.get(
        `/api/user/issue?githubId=${githubId}`
      );
      const fetchedUserIssue = res.data.userIssue;
      setUserIssue(fetchedUserIssue);
      setStatus(fetchedUserIssue.status);
      setNotes(fetchedUserIssue.notes ?? "");
    } catch (error) {
      return;
    }
  }, []);
  const loadPageData = useCallback(async () => {
    setIsLoading(true);
    toast({
      title: "Fetching latest data",
      description: "It may take few seconds to get latest data",
    });
    try {
      const { owner, name, githubNumber } = await params;
      setRepoInfo({ owner, name });
      const res = await axiosInstance.get(
        `/api/issue/info?owner=${owner}&name=${name}&githubNumber=${githubNumber}`
      );
      const fetchedIssue: IssueWithAI = res.data.issue;
      setIssue(fetchedIssue);
      await fetchAIData(fetchedIssue);
      const trackedIdsLocal = await fetchTrackedIssueIds();
      if (trackedIdsLocal.includes(fetchedIssue.githubId.toString())) {
        getUserIssue(fetchedIssue.githubId);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error getting issue info",
        description: "Please try again after sometime",
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchAIData, params, fetchTrackedIssueIds, toast]);

  const handleSync = useCallback(async () => {
    toast({
      title: "Syncing issue...",
      description: "Fetching latest data from GitHub",
    });
    await loadPageData();
    toast({ title: "Synced", description: "Everything is up to date" });
  }, []);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleSave = useCallback(
    async (overrides?: { notes?: string; status?: string }) => {
      if (!userIssue) {
        return;
      }
      const payload = {
        ...userIssue,
        status: overrides?.status ?? status,
        notes: overrides?.notes ?? notes,
      };
      if (
        payload.notes === userIssue.notes &&
        payload.status === userIssue.status
      ) {
        return;
      }

      try {
        const res = await axiosInstance.put("/api/user/issue", {
          payload,
        });
        toast({
          title: "Details updated",
        });
      } catch (error) {
        toast({
          title: "Error editing details",
        });
        loadPageData();
      }
    },
    [userIssue, status, notes]
  );

  const handleTrack = useCallback(
    async (issue: IssueWithAI) => {
      let alreadyTracked = false;

      if (trackingIds.includes(issue.githubId.toString())) {
        toast({
          title: "Already tracking",
          description: "Issue already tracked",
        });
        return;
      }

      setTrackedIds((prev) => [...prev, issue.githubId.toString()]);

      try {
        toast({
          title: "Tracking Issue",
          description: "Tracking issue may take few seconds",
        });
        const res = await axiosInstance.post("/api/issue/track", {
          issue,
          owner: repoInfo.owner,
          name: repoInfo.name,
          status: status,
        });

        toast({
          title: "Issue tracked",
          description: "Sucessfully added issue to tracking list",
        });
      } catch (error) {
        setTrackedIds((prev) =>
          prev.filter((id) => id !== issue.githubId.toString())
        );
        toast({
          title: "Something went wrong",
          description:
            "Due to server error, issue can't be tracked at the moment",
        });
      }
    },
    [trackingIds, repoInfo, status, toast]
  );

  const handleCopyLink = () => {
    if (issue) {
      navigator.clipboard.writeText(issue?.htmlUrl);
      toast({
        title: "Link copied",
        description: "Issue URL copied to clipboard",
      });
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Back navigation */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 gap-1.5 text-sm group"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            {isLoading || !issue ? (
              <>
                <Skeleton className="h-4 w-24" />
                <span className="text-muted-foreground">/</span>
                <Skeleton className="h-4 w-16" />
              </>
            ) : (
              <>
                <span className="font-mono text-sm text-muted-foreground">
                  {repoInfo.owner}/{repoInfo.name}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="font-mono text-sm text-muted-foreground">
                  #{issue.number}
                </span>
              </>
            )}
          </div>
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
            <span className="hidden sm:inline">
              {isLoading ? "Syncing..." : "Sync"}
            </span>
          </Button>
        </div>

        {/* Main grid layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left - GitHub content (3 cols) */}
          <div className="lg:col-span-3 space-y-4 animate-slide-up">
            {/* Issue header card */}
            <div className="p-5 rounded-xl bg-card border border-border">
              {isLoading || !issue ? (
                <>
                  <Skeleton className="h-7 w-full max-w-md mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Skeleton className="h-10 w-28 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-10 w-36 rounded-lg ml-auto" />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl font-semibold leading-tight mb-4">
                    {issue.title}
                  </h1>

                  {/* Labels */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                      {issue.state}
                    </Badge>
                    {issue.labels.map((label) => (
                      <Badge
                        key={label.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-4 border-b border-border">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{issue.author.login}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{issue.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4" />
                      <span>{issue.commentsCount} comments</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Button
                      variant={
                        trackingIds.includes(issue.githubId.toString())
                          ? "default"
                          : "outline"
                      }
                      className={`gap-2 ${
                        trackingIds.includes(issue.githubId.toString())
                          ? "bg-accent hover:bg-accent/90"
                          : ""
                      }`}
                      onClick={() => handleTrack(issue)}
                    >
                      {trackingIds.includes(issue.githubId.toString()) ? (
                        <>
                          <BookmarkCheck className="h-4 w-4" />
                          Tracked
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Track Issue
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="gap-2 ml-auto" asChild>
                      <a
                        href={issue.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="hidden sm:inline">Open on GitHub</span>
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Issue body */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Description</span>
              </div>
              {isLoading || !issue ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-transparent p-0 border-0">
                    {issue.body}
                  </pre>
                </div>
              )}
            </div>

            {/* Notes section */}
            {issue && trackingIds.includes(issue.githubId.toString()) && (
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Your Notes</span>
                </div>
                <Textarea
                  placeholder="Add your notes, ideas, or approach here..."
                  ref={notesRef}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() =>
                    handleSave({ notes: notesRef.current?.value ?? "" })
                  }
                  className="min-h-[120px] resize-none text-sm"
                />
              </div>
            )}
          </div>

          {/* Right - AI & Status (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Status tracker (if tracked) */}
            {issue && trackingIds.includes(issue.githubId.toString()) && (
              <div className="p-5 rounded-xl bg-card border border-border animate-slide-in-right">
                <p className="text-sm font-medium mb-3">Progress Status</p>
                <div className="flex gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={status === option.value ? "secondary" : "ghost"}
                      size="sm"
                      className={`flex-1 gap-1.5 text-xs h-9 ${
                        status === option.value ? option.color : ""
                      }`}
                      onClick={() => {
                        setStatus(option.value as typeof status);
                        handleSave({ status: option.value });
                        toast({ title: `Status updated to ${option.label}` });
                      }}
                    >
                      <option.icon className="h-3.5 w-3.5" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights Card */}
            <div
              className="rounded-xl ai-surface overflow-hidden animate-slide-in-right"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="p-5">
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-background/50">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-24 mb-2" />
                      <div className="flex flex-wrap gap-1.5">
                        <Skeleton className="h-6 w-20 rounded-md" />
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5 mt-1" />
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-1" />
                    </div>
                  </>
                ) : blur || !issue?.ai ? (
                  <DisabledOverlay reason={blurReason}>
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-background/50">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-24 mb-2" />
                      <div className="flex flex-wrap gap-1.5">
                        <Skeleton className="h-6 w-20 rounded-md" />
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5 mt-1" />
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-1" />
                    </div>
                  </DisabledOverlay>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl ai-gradient-border flex items-center justify-center animate-pulse-glow">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">AI Analysis</p>
                          <p className="text-xs text-muted-foreground">
                            {issue.ai.matchScore}% skill match
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick stats grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Difficulty
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            issue.ai.difficulty === "easy"
                              ? "text-accent border-accent/40 bg-accent/10"
                              : issue.ai.difficulty === "medium"
                              ? "text-warning border-warning/40 bg-warning/10"
                              : "text-destructive border-destructive/40 bg-destructive/10"
                          }`}
                        >
                          {issue.ai.difficulty}
                        </Badge>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Est. Time
                        </p>
                        <span className="font-semibold text-sm">
                          {issue.ai.estimatedTime}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Required Skills
                      </p>
                      {issue.ai.skills && (
                        <div className="flex flex-wrap gap-1.5">
                          {issue.ai.skills.map((skill) => (
                            <span
                              key={skill}
                              className="font-mono text-xs text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Summary
                      </p>
                      <p className="text-sm">{issue.ai.summary}</p>
                    </div>

                    {/* Root Cause */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Root Cause
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {issue.ai.cause}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Approach - collapsible */}
              {blur ? (
                <DisabledOverlay reason="">
                  <div className="border-t border-accent/20">
                    <button
                      onClick={() => setShowApproach(!showApproach)}
                      className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-accent" />
                        Suggested Approach
                      </div>
                      {showApproach ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {showApproach && issue?.ai && (
                      <div className="px-5 pb-5 animate-fade-in">
                        {issue.ai.approach && (
                          <div className="space-y-2">
                            {issue.ai.approach.map((step, i) => (
                              <p
                                key={i}
                                className="text-sm text-muted-foreground pl-4 border-l-2 border-accent/30"
                              >
                                {step}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Files to explore */}
                        <div className="mt-4 pt-4 border-t border-accent/20">
                          <p className="text-xs text-muted-foreground mb-2">
                            Files to explore
                          </p>
                          {issue.ai.filestoExplore && (
                            <div className="space-y-1">
                              {issue.ai.filestoExplore.map((file) => (
                                <code
                                  key={file}
                                  className="block text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded"
                                >
                                  {file}
                                </code>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </DisabledOverlay>
              ) : (
                <div className="border-t border-accent/20">
                  <button
                    onClick={() => setShowApproach(!showApproach)}
                    className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-accent" />
                      Suggested Approach
                    </div>
                    {showApproach ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {showApproach && issue?.ai && (
                    <div className="px-5 pb-5 animate-fade-in">
                      {issue.ai.approach && (
                        <div className="space-y-2">
                          {issue.ai.approach.map((step, i) => (
                            <p
                              key={i}
                              className="text-sm text-muted-foreground pl-4 border-l-2 border-accent/30"
                            >
                              {step}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Files to explore */}
                      <div className="mt-4 pt-4 border-t border-accent/20">
                        <p className="text-xs text-muted-foreground mb-2">
                          Files to explore
                        </p>
                        {issue.ai.filestoExplore && (
                          <div className="space-y-1">
                            {issue.ai.filestoExplore.map((file) => (
                              <code
                                key={file}
                                className="block text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded"
                              >
                                {file}
                              </code>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div
              className="p-5 rounded-xl bg-card border border-border animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-sm font-medium mb-3">Quick Actions</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 text-sm group"
                  asChild
                >
                  <a
                    href={`https://github.com/${repoInfo.owner}/${repoInfo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Repository
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 text-sm group"
                  asChild
                >
                  <a
                    href={`${issue?.htmlUrl}#issuecomment-new`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Add Comment
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
