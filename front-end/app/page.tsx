"use client";
import Link from "next/link";
import TextAnimation from "./components/TextAnimation";
import CreateIcon from "@mui/icons-material/Create";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import SaveIcon from "@mui/icons-material/Save";
import Image from "next/image";

export default function Home() {
  return (
    <main className="main-background text-white">
      <section className="flex flex-col p-3 gap-2 mt-5 sm:content-center sm:items-center">
        <h1 className="text-center pb-5 text-4xl font-extrabold sm:text-5xl sm:mb-5">
          Welcome to LearningPath
        </h1>
        <div className="flex flex-col items-center max-w-3xl sm:flex-row-reverse sm:item sm:gap-3">
        <Image
            src="/roadmap1.jpeg"
            alt="Create Roadmap"
            className="mt-0 pb-5"
            height={280}
            width={280}
          />
          <div>
            <p className="text-center pb-5">
              LearningPath is an exciting and innovative AI-powered learning
              management tool that&apos;s designed to make your learning journey
              both enjoyable and productive.
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <Link
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                href="/explore"
              >
                Explore
              </Link>
              <Link
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                href="/create"
              >
                Create
              </Link>
            </div>
          </div>
          
        </div>
        <div className="flex flex-col pt-8 max-w-3xl text-center">
          <h2 className="text-3xl mb-8 text-center font-bold">
            Features of LearningPath
          </h2>
          <div className="space-y-2 flex flex-col gap-6">
            <div className="flex flex-col items-center sm:ite">
              <div className="flex mb-2">
                <h2 className="text-white text-2xl font-bold mb-2">
                  <CreateIcon className="mr-2" />
                  Create Your Roadmap
                </h2>
              </div>
              <div className="flex flex-col items-center sm:flex-row sm:item sm:gap-3">
                <p>
                  Craft personalized learning roadmaps tailored to your goals
                  and aspirations. Whether you want to master a new programming
                  language or learn how to cook.
                </p>
                <Image
                  src="/roadmap3.jpeg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <h2 className="text-white text-2xl font-bold mb-2">
                  <SaveIcon className="mr-2" />
                  Save &amp; Manage Roadmaps
                </h2>
              </div>
              <div className="flex flex-col items-center sm:flex-row sm:item sm:gap-3">
                <p>
                  Organize your learning journey by saving your roadmaps. Easily
                  access and update them as you progress toward your goals.
                </p>
                <Image
                  src="/roadmap4.jpg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <h2 className="text-white text-2xl font-bold mb-2">
                  <ThumbsUpDownIcon className="mr-2" />
                  Explore &amp; Vote
                </h2>
              </div>
              <div className="flex flex-col items-center sm:flex-row sm:item sm:gap-3">
                <p>
                  Dive into a world of learning possibilities by exploring
                  roadmaps created by fellow learners. Upvote the ones you find
                  most valuable, helping others discover the best learning paths
                  for specific skills.
                </p>
                <Image
                  src="/roadmap2.jpeg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="mt-8 text-center pb-48">
              <TextAnimation />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
