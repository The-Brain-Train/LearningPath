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
      <section className="flex flex-col p-3 gap-2 mt-5 sm:items-center">
        <h1 className="text-center pb-5 text-5xl font-extrabold sm:text-7xl sm:mb-5 sm:py-10">
          Welcome to LearningPath
        </h1>
        <div className="flex flex-col items-center max-w-4xl sm:flex-row-reverse sm:item sm:gap-3">
          <Image
            src="/roadmap1.jpeg"
            alt="Create Roadmap"
            className="mt-0 pb-5 lg:w-80 basis-full rounded-lg"
            height={280}
            width={280}
          />
          <div>
            <p className="text-center text-xl pb-5 sm:text-left sm:text-2xl sm:leading-8">
              LearningPath is an exciting and innovative AI-powered learning
              management tool that&apos;s designed to make your learning journey
              both enjoyable and productive.
            </p>
            <div className="flex justify-center gap-4 mt-3 sm:justify-start sm:text-xl">
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
        <div className="flex flex-col pt-8 max-w-4xl text-center">
          <h2 className="text-3xl mb-8 text-center font-bold sm:text-5xl">
            Features of LearningPath
          </h2>
          <div className="space-y-2 flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col items-center sm:ite">
              <div className="flex mb-2">
                <h2 className="text-white text-2xl font-bold mb-2 sm:text-3xl sm:pt-5 sm:text-left">
                  <CreateIcon className="mr-2 sm:text-3xl" />
                  Create Your Roadmap
                </h2>
              </div>
              <div className="flex flex-col items-center sm:flex-row-reverse sm:item sm:gap-3 sm:text-left">
                <div className="mb-6">
                  <p className="mb-6 text-lg sm:mb-14 sm:text-xl">
                    Craft personalized learning roadmaps tailored to your goals
                    and aspirations. Whether you want to master a new
                    programming language or learn how to cook.
                  </p>
                  <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded sm:text-xl"
                    href="/create"
                  >
                    Create Roadmap
                  </Link>
                </div>
                <Image
                  src="/roadmap3.jpeg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3 basis-9/12 rounded-lg"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <h2 className="text-white text-2xl font-bold mb-2 sm:text-3xl">
                  <SaveIcon className="mr-2 sm:text-3xl" />
                  Save &amp; Manage Roadmaps
                </h2>
              </div>
              <div className="flex flex-col items-center sm:flex-row sm:gap-3 sm:text-left">
                <div className="mb-6">
                  <p className="mb-6 text-lg sm:mb-14 sm:text-xl">
                    Organize your learning journey by creating an account and saving your roadmaps.
                    Easily access roadmaps you have created and progress towards your
                    goals.
                  </p>
                  <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded sm:text-xl"
                    href="/signup"
                  >
                    Sign Up
                  </Link>
                </div>
                <Image
                  src="/roadmap4.jpg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3 basis-9/12 rounded-lg"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <h2 className="text-white text-2xl font-bold mb-2 sm:text-3xl">
                  <ThumbsUpDownIcon className="mr-2 sm:text-3xl" />
                  Explore Community Roadmaps
                </h2>
              </div>
              <div className="flex flex-col items-center sm:flex-row-reverse sm:item sm:gap-3 sm:text-left">
                <div className="mb-6">
                  <p className="mb-6 text-lg sm:mb-14 sm:text-xl">
                    Dive into a world of learning possibilities by exploring
                    roadmaps created by fellow learners. Upvote the ones you
                    find most valuable, helping others discover the best
                    learning paths for specific skills.
                  </p>
                  <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded sm:text-xl"
                    href="/explore"
                  >
                    Explore
                  </Link>
                </div>
                <Image
                  src="/roadmap2.jpeg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3 basis-10/12 rounded-lg"
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
