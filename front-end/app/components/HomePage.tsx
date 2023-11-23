"use client";
import Link from "next/link";
import Image from "next/image";
import TextAnimation from "./TextAnimation";

export default function HomePage() {
  return (
    <main className="main-background text-white">
      <section className="flex flex-col p-3 gap-2 mt-5 sm:items-center">
        <h1 className="text-center pb-5 text-5xl font-extrabold sm:text-7xl sm:mb-5 sm:py-10 lg:text-8xl">
          Welcome to LearningPath
        </h1>
        <div className="flex flex-col items-center max-w-6xl sm:flex-row-reverse sm:item sm:gap-3">
          <Image
            src="/roadmap1.jpeg"
            alt="Create Roadmap"
            className="mt-0 pb-5 lg:w-80 basis-full rounded-lg"
            height={280}
            width={280}
            priority
          />
          <div>
            <p className="text-center text-xl pb-5 sm:text-left sm:text-2xl leading-10 ">
              LearningPath is an exciting and innovative AI-powered learning
              management tool that&apos;s designed to make your learning journey
              both enjoyable and productive.
            </p>
            <div className="flex justify-center gap-4 mt-3 sm:justify-start sm:text-xl">
              <Link
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xl"
                href="/explore"
              >
                Explore
              </Link>
              <Link
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xl"
                href="/create"
              >
                Create
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-8 max-w-6xl text-center">
          <h2 className="text-4xl mb-8 text-center font-bold sm:text-5xl lg:text-6xl">
            Features of LearningPath
          </h2>
          <div className="space-y-2 flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center md:flex-row-reverse md:item md:gap-3 md:text-left">
                <div className="mb-6">
                  <h3 className="text-white text-2xl font-bold mb-2 md:text-3xl md:pt-5 md:text-left lg:mb-5">
                    Create Your Roadmap
                  </h3>
                  <p className="mb-6 text-lg md:mb-14 md:text-xl leading-10">
                    Craft personalized learning roadmaps tailored to your goals
                    and aspirations. Whether you want to master a new
                    programming language or learn how to cook.
                  </p>
                  <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xl"
                    href="/create"
                  >
                    Create Roadmap
                  </Link>
                </div>
                <Image
                  src="/roadmap3.jpeg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3 basis-10/12 rounded-lg sm:mt-0"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center md:flex-row md:gap-3 md:text-left">
                <div className="mb-6">
                  <h3 className="text-white text-2xl font-bold mb-2 md:text-3xl lg:mb-5">
                    Save &amp; Manage Roadmaps
                  </h3>
                  <p className="mb-6 text-lg md:mb-14 md:text-xl leading-10">
                    Organize your learning journey by creating an account and
                    saving your roadmaps. Easily access roadmaps you have
                    created and progress towards your goals.
                  </p>
                  <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xl"
                    href="/signup"
                  >
                    Sign Up
                  </Link>
                </div>
                <Image
                  src="/roadmap4.jpg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3 basis-10/12 rounded-lg sm:mt-0"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center md:flex-row-reverse md:item md:gap-3 md:text-left">
                <div className="mb-6">
                  <h3 className="text-white text-2xl font-bold mb-2 md:text-3xl lg:mb-5">
                    Explore Community Roadmaps
                  </h3>
                  <p className="mb-6 text-lg md:mb-14 md:text-xl leading-10">
                    Dive into a world of learning possibilities by exploring
                    roadmaps created by fellow learners. Upvote the ones you
                    find most valuable, helping others discover the best
                    learning paths for specific skills.
                  </p>
                  <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xl"
                    href="/explore"
                  >
                    Explore
                  </Link>
                </div>
                <Image
                  src="/roadmap2.jpeg"
                  alt="Create Roadmap"
                  className="mt-2 pb-3 basis-full rounded-lg sm:mt-0"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="mt-8 text-center pb-52">
              <TextAnimation />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
