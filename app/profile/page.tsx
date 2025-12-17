"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import CustomSpinner from "../components/CustomSpinner";
import { GitBranch, GithubIcon } from "lucide-react";
import { RepoCard } from "../components/RepoCard";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import prisma from "@/db/prisma";
import { toast } from "sonner";
import { User } from "@/types/user";
import axios from "axios";
import { Input } from "@/components/ui/input";

export default function () {
  const { data: session, status } = useSession();
  const [editBio, setEditbio] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [user, setUser] = useState<User>();
  const [skills, setSkills] = useState<string[]>([]);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  function enterSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    console.log("inside enterSkill");
    if (e.key === "Enter") {
      e.preventDefault();
      const value = skillInputRef.current?.value.trim();

      if (value) {
        console.log("before setSkills");
        setSkills((prev) => {
          const updatedSkills = [...prev, value];
          console.log("calling be for skills add");
          const skillsFiltered = updatedSkills.filter(
            (skill) => skill.length > 0
          );
          axios
            .post("/api/user", {
              skills: skillsFiltered,
            })
            .then((res) => {
              setEditSkills(false);
              toast("Skills updated");
            })
            .catch((error) => {
              setEditSkills(false);
              toast("Error in updating skills");
            });
          return updatedSkills;
        });
        if (skillInputRef.current) {
          skillInputRef.current.value = "";
        }
      }
      // console.log(skills);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/user`);
      console.log(res.data.user);
      setUser(res.data.user);
      setSkills((prev) => [...prev, ...res.data.user.skills]);
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      {session?.user?.image ? (
        <div className="flex flex-col  gap-8  rounded-lg mt-20 max-w-7xl p-5 mx-auto">
          <Image
            src={session?.user.image}
            alt="userPic"
            width={100}
            height={100}
            loading="lazy"
            className="rounded-full"
          />

          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">
              {session?.user.name}
            </h1>
            <p className="text-neutral-600 font-medium">
              {session?.user.email}
            </p>
            {/* <h1>
              user skills
              <br />
              {skills.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </h1>
            <Input onKeyDown={enterSkill} ref={skillInputRef} /> */}

            <Badge variant={"outline"} className="mt-7 font-semibold ">
              <GithubIcon /> repository
            </Badge>
            <div className="flex  w-full gap-2 mt-3 ">
              {skills?.map((skill, index) => (
                <Badge variant={"outline"} key={index}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          {editSkills ? (
            <InputGroup>
              {/* <InputGroupTextarea
                placeholder="Add skills"
                ref={skillInputRef}
              /> */}
              <Input
                placeholder="Add skills"
                onKeyDown={enterSkill}
                ref={skillInputRef}
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="text-muted-foreground text-xs">
                  Press Enter to add Skill
                </InputGroupText>
                <InputGroupButton
                  size="sm"
                  className="ml-auto"
                  variant="default"
                  onClick={async () => {
                    // const skillsFiltered = skills.filter(
                    //   (skill) => skill.length > 0
                    // );
                    // await axios.post("/api/user", {
                    //   skills: skillsFiltered,
                    // });
                    setEditSkills(false);
                    // toast("Skills updated");
                  }}
                >
                  Done
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          ) : (
            <InputGroup>
              <Input placeholder="Skills" disabled />

              <InputGroupAddon align="block-end">
                <InputGroupButton
                  size="sm"
                  className="ml-auto"
                  variant="ghost"
                  onClick={() => {
                    setEditSkills(true);
                  }}
                >
                  Edit
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          )}
          {editBio ? (
            <InputGroup>
              <InputGroupTextarea placeholder="Add to your bio" ref={bioRef} />
              <InputGroupAddon align="block-end">
                <InputGroupText className="text-muted-foreground text-xs">
                  Make it detailed so that AI can filter easily
                </InputGroupText>
                <InputGroupButton
                  size="sm"
                  className="ml-auto"
                  variant="default"
                  onClick={async () => {
                    await axios.post("/api/user", {
                      bio: bioRef.current?.value,
                    });
                    setEditbio(false);
                    toast("Bio updated");
                  }}
                >
                  Submit
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          ) : (
            <InputGroup>
              <InputGroupTextarea
                placeholder="User Bio"
                disabled
                value={user?.bio}
              />
              <InputGroupAddon align="block-end">
                <InputGroupButton
                  size="sm"
                  className="ml-auto"
                  variant="ghost"
                  onClick={() => {
                    setEditbio(true);
                  }}
                >
                  Edit
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          )}
        </div>
      ) : (
        <CustomSpinner />
      )}
      <div className="max-w-7xl mx-auto mt-9">
        <h1 className="text-3xl my-4 text-neutral-800 font-medium">
          Your Repository
        </h1>
        <RepoCard />
      </div>
    </>
  );
}
