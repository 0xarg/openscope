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
  ExternalLinkIcon,
  GitBranch,
  GithubIcon,
  Link,
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
import { UserIssues } from "../page";

export default function IssueDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [issue, setIssue] = useState<UserIssues>();
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
      const id = paramData.id;
      try {
        const res = await axios.post(`/api/user/track/issues?id=${id}`);
        console.log(res.data);

        setIssue({
          ...res.data.userIssues,
        });
        setAiLoader(false);
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
              onClick={() => router.push(`/user/track/issues`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Issues
            </Button>
          </div>

          {/* <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl mb-2">
                      {issue?.issue.title}
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
          </Card> */}

          <div className="shadow-lg p-7 dark:text-white  hover:shadow-xl transition duration-200 border-neutral-200 border rounded-xl mt-5 ">
            {!ailoader && (
              <div>
                {/* <h1 className="text-2xl  mb-2 inline-block text-transparent bg-clip-text  bg-linear-to-r from-black via-red-600 to-neutral-700 text-clip font-semibold  ">
                  AI's Take
                </h1> */}
                <h2 className="text-3xl font-medium my-6">
                  {issue.issue.title}
                </h2>
                <div className="flex items-center justify-between ">
                  <div className=" flex gap-3 text-neutral-600 font-medium">
                    {issue.issue?.labels?.map((label, index) => (
                      <Badge key={index} variant={"outline"}>
                        {label}
                      </Badge>
                    ))}
                    <p>#{issue.issue.githubId}</p>
                  </div>
                  <a
                    href={issue.issue.githubUrl}
                    className="hover:text-sky-700  transition duration-200"
                    target="blank"
                  >
                    <ExternalLinkIcon size={18} />
                  </a>
                </div>
                <div className="flex flex-col gap-2 ">
                  <h3 className="text-xl mt-3  font-semibold text-neutral-700">
                    Approach
                  </h3>
                  <p className="text-sm dark:text-neutral-100 text-black font-medium ">
                    {issue.approach}
                  </p>
                  <h3 className="text-xl mt-3  font-semibold text-neutral-700">
                    Recommendations
                  </h3>
                  <p className="text-sm dark:text-neutral-100 text-black font-medium ">
                    {issue.recommendation}
                  </p>
                  <h3 className="text-xl mt-3  font-semibold text-neutral-700">
                    Summary
                  </h3>
                  <p className="text-sm dark:text-neutral-100 text-black font-medium ">
                    {issue.issue.summary}
                  </p>
                  <h3 className="text-xl mt-3 font-semibold text-neutral-700">
                    Difficulty
                  </h3>
                  <Badge
                    variant={"secondary"}
                    className="text-sm dark:text-neutral-100  "
                  >
                    {issue.issue?.difficulty}
                  </Badge>
                  <h3 className="text-xl mt-3 font-semibold text-neutral-700">
                    Cause
                  </h3>
                  <p className="text-sm dark:text-neutral-100 text-black font-medium ">
                    {issue.issue?.cause}
                  </p>
                  <h3 className="text-xl mt-3 font-semibold text-neutral-700">
                    Skills Required
                  </h3>
                  <div className="flex gap-2">
                    {issue.issue?.skills?.map((skill, index) => (
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
