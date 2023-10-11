"use client";
import Link from "next/link";
import TextAnimation from "./components/TextAnimation";
import CreateIcon from "@mui/icons-material/Create";
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import SaveIcon from '@mui/icons-material/Save';
import { useCookies } from 'react-cookie';
import jwtDecode from "jwt-decode";
import { useEffect } from "react";

const topSectionButtonStyles = (backgroundImageUrl: string) => ({
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center center",
  width: "120px",
  height: "50px",
  transition: "opacity 0.7s ease",
});

export default function Home() {
  return (
    <main className="main-background">
      <section className="flex flex-col p-3 gap-2 mt-5">
        <div className="mb-16 text-center">
          <TextAnimation />
        </div>
        <div className="flex justify-center gap-4 mt-5 pt-32 mb-6">
          <Link href="/explore">
            <div
              className="relative text-center rounded cursor-pointer group transition-opacity duration-300 border-2"
              style={topSectionButtonStyles("/roadmap2.jpeg")}
            >
              <span className="absolute inset-0 flex items-center justify-center text-black font-bold">
                Explore
              </span>
            </div>
          </Link>
          <Link href="/create">
            <div
              className="relative text-center rounded cursor-pointer group transition-opacity duration-300 border-2"
              style={topSectionButtonStyles("/roadmap3.jpeg")}
            >
              <span className="absolute inset-0 flex items-center justify-center text-black font-bold">
                Create
              </span>
            </div>
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center pt-8">
          <h2 className="text-white text-4xl mb-4 text-center font-bold">
            About LearningPath
          </h2>
          <div className="rounded p-5 relative text-white text-base space-y-4 text-left">
            <p>
              LearningPath is an exciting and innovative AI-powered learning
              management tool that's designed to make your learning journey both
              enjoyable and productive.
            </p>
            <img
              src="/home-about-img.jpeg"
              alt="Create Roadmap"
              className="ml-2 w-70 h-52"
            />
          </div>
          <div className="flex flex-col justify-center items-center pt-8">
            <h2 className="text-white text-4xl mb-8 text-center font-bold">
              Features of LearningPath
            </h2>
            <div className="ml-6 space-y-2 flex flex-col gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <h2 className="text-white text-xl font-bold mb-2">
                    <CreateIcon className="mr-2" />
                    Create Your Roadmap:
                  </h2>
                </div>
                <p className="text-white">
                  Craft personalized learning roadmaps tailored to your goals
                  and aspirations. Whether you want to master a new programming
                  language or learn how to cook.
                </p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <h2 className="text-white text-xl font-bold mb-2">
                    <SaveIcon className="mr-2"/>Save & Manage Roadmaps:
                  </h2>
                </div>
                <p className="text-white">
                  Organize your learning journey by saving your roadmaps. Easily
                  access and update them as you progress toward your goals.
                </p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <h2 className="text-white text-xl font-bold mb-2">
                    <ThumbsUpDownIcon className="mr-2"/>Explore & Vote:
                  </h2>
                </div>
                <p className="text-white">
                  Dive into a world of learning possibilities by exploring
                  roadmaps created by fellow learners. Upvote the
                  ones you find most valuable, helping others discover the best
                  learning paths for specific skills.
                </p>
              </div>
            </div>
            <p className="text-white text-l mt-10">
              Start your journey with LearningPath today, and unlock the door to
              a world of knowledge and skill acquisition like never before.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
