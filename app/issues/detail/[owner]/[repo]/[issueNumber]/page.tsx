"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  AsteriskIcon,
  Bookmark,
  Calendar,
  GitBranch,
  GithubIcon,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { useCallback, useEffect, useState } from "react";
import Showdown from "showdown";
import axios from "axios";
import { Issue } from "@/app/issues/[name]/page";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AIStatsIssue } from "@/types/ai";
import { safeParseAI } from "@/lib/utils/parseAIRes";
import CustomSpinner from "@/app/components/CustomSpinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function IssueDetail({
  params,
}: {
  params: { owner: string; repo: string; issueNumber: string };
}) {
  const router = useRouter();
  const [issue, setIssue] = useState<Issue>();
  const [aiStats, setAIStats] = useState<AIStatsIssue>();
  const [ailoader, setAiLoader] = useState(true);
  const [trackLoader, setTrackLoader] = useState(false);
  let repo = "";

  const converter = new Showdown.Converter({
    tables: true,
    ghCompatibleHeaderId: true,
    ghCodeBlocks: true,
    strikethrough: true,
    tasklists: true,
    simpleLineBreaks: true,
    emoji: true,
    simplifiedAutoLink: true,
    openLinksInNewWindow: true,
    metadata: true,
  });
  converter.setFlavor("github");

  useEffect(() => {
    const fetchIssue = async () => {
      const paramData = await params;
      const owner = paramData.owner;
      repo = paramData.repo;

      const issueNumber = paramData.issueNumber;
      try {
        const res = await axios.get(
          `https://api.github.com/repos/${owner}/${decodeURIComponent(
            repo
          )}/issues/${issueNumber}`
        );
        console.log(res.data);
        const markdownHTML = converter.makeHtml(res.data.body);

        setIssue({
          ...res.data,
          owner,
          name: repo,
          number: issueNumber,
          htmlBody: markdownHTML,
        });

        await axios
          .post("/api/ai/issue/stats", {
            issue: res.data,
            repo,
            owner,
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res.data);
              const data = safeParseAI(res.data.issue.content);
              setAIStats(data);
              toast("AI Response Fetched");
              setAiLoader(false);
            } else if (res.status === 202) {
              const data = res.data.issue;
              setAIStats(data);
              setAiLoader(false);
              toast("Response Fetched from DB");
            } else {
              toast("Error getting response from AI");
              return;
            }
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchIssue();
  }, []);
  if (!issue) return <div className="p-8">Loading issue...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="mb-6 hover-scale"
              onClick={() => router.push(`/issues/${issue.name}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Issues
            </Button>
            {trackLoader && <CustomSpinner />}
            {!trackLoader && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"outline"}
                    onClick={async () => {
                      setTrackLoader(true);
                      await axios
                        .post(`/api/ai/issue/track?id=${aiStats?.id}`, {
                          issue,
                        })
                        .then((res) => {
                          if (res.status === 200) {
                            toast("Issue added track list!");
                            setTrackLoader(false);
                          } else if (res.status === 202) {
                            toast("Issue already in Track List!");
                            setTrackLoader(false);
                          } else {
                            toast("Error while tracking Issue!");
                            setTrackLoader(false);
                            return;
                          }
                        });
                      return;
                    }}
                  >
                    <Bookmark />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Track Issue</TooltipContent>
              </Tooltip>
            )}
          </div>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl mb-2">
                      {issue?.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">
                        {issue?.owner}/{issue?.name}
                      </span>
                      <span>•</span>
                      <span>#{issue?.number}</span>
                    </CardDescription>
                  </div>
                  <Badge
                    variant={issue?.state === "open" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {issue?.state}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {issue?.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{issue?.comments} comments</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {issue?.labels
                    .map((l: any) => l.name)
                    .map((label) => (
                      <Badge key={label} variant="outline">
                        {label}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-w-none mt-6"
                dangerouslySetInnerHTML={{ __html: issue.htmlBody }}
              />

              <div className="mt-8 pt-6 border-t">
                <Button variant="outline" className="hover-scale" asChild>
                  <a
                    href={`https://github.com/${issue?.owner}/${issue?.name}/issues/${issue?.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitBranch className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="shadow-lg p-7 dark:text-white  hover:shadow-xl transition duration-200 border-neutral-200 border rounded-xl mt-5 ">
            {!ailoader && (
              <div>
                <h1 className="text-2xl mb-2 inline-block text-transparent bg-clip-text  bg-linear-to-r from-black via-red-600 to-neutral-700 text-clip font-semibold  ">
                  AI's Take
                </h1>
                <p className=" flex gap-3 text-neutral-600 font-medium">
                  {aiStats?.labels?.map((label, index) => (
                    <Badge key={index} variant={"outline"}>
                      {label}
                    </Badge>
                  ))}
                </p>

                <div className="flex flex-col gap-2 ">
                  <h3 className="text-xl mt-3  font-semibold text-neutral-700">
                    Description
                  </h3>
                  <p className="text-sm dark:text-neutral-100 text-black font-medium ">
                    {aiStats?.summary}
                  </p>
                  <h3 className="text-xl mt-3 font-semibold text-neutral-700">
                    Difficulty
                  </h3>
                  <Badge
                    variant={"secondary"}
                    className="text-sm dark:text-neutral-100  "
                  >
                    {aiStats?.difficulty}
                  </Badge>
                  <h3 className="text-xl mt-3 font-semibold text-neutral-700">
                    Cause
                  </h3>
                  <p className="text-sm dark:text-neutral-100 text-black font-medium ">
                    {aiStats?.cause}
                  </p>
                  <h3 className="text-xl mt-3 font-semibold text-neutral-700">
                    Skills Required
                  </h3>
                  <div className="flex gap-2">
                    {aiStats?.skills?.map((skill, index) => (
                      <Badge
                        key={index}
                        className="font-semibold text-transparent bg-clip-text  bg-linear-to-r from-sky-600 via-yellow-600 to-sky-700 text-clip  "
                        variant={"outline"}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Badge
                  variant={"outline"}
                  className="mt-7 font-semibold text-transparent bg-clip-text  bg-linear-to-r from-neutral-900 via-red-600 to-neutral-700 text-clip "
                >
                  <AsteriskIcon className="text-black" /> DevAI
                </Badge>
              </div>
            )}

            {ailoader && <CustomSpinner />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
