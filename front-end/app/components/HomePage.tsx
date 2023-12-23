"use client";
import Link from "next/link";
import Image from "next/image";
import TextAnimation from "./TextAnimation";

export default function HomePage() {
  return (
    <main className="main-background text-white">
      <section className="flex flex-col p-3 gap-2 mt-5 sm:items-center">
        <h1 className="text-center pb-5 text-5xl font-extrabold sm:text-7xl sm:my-5 lg:text-8xl">
          Welcome to LearningPath
        </h1>
        <div className="flex flex-col items-center max-w-xl md:max-w-6xl md:flex-row-reverse sm:gap-3">
          <Image
            src="/roadmap1.jpeg"
            alt="Create Roadmap"
            className="mt-0 my-5 lg:w-80 basis-full rounded-xl"
            height={280}
            width={280}
            priority
          />
          <div className="basis-full">
            <p className="text-center text-xl pb-5 sm:text-2xl leading-10 sm:text-left">
              LearningPath is an exciting and innovative learning management
              tool that&apos;s designed to set you up on the best path for
              learning. Here you can create or explore roadmaps for any skill you wish to learn.
            </p>
            <div className="flex justify-center gap-4 mt-3 sm:text-xl md:justify-start">
              <Link
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2"
                href="/explore"
              >
                Explore
              </Link>
              <Link
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2"
                href="/create"
              >
                Create
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-8 max-w-xl md:max-w-6xl text-center">
          <h2 className="text-4xl mb-8 text-center font-bold sm:text-5xl lg:text-6xl">
            Features of LearningPath
          </h2>
          <div className="space-y-2 flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center md:items-start lg:items-center md:flex-row-reverse md:gap-3 md:text-left">
                <div className="mb-6">
                  <h3 className="text-white text-2xl font-bold mb-2 md:text-3xl md:text-left lg:mb-5">
                    Create your Roadmap
                  </h3>
                  <p className="mb-6 text-lg md:mb-14 md:text-xl leading-10">
                    Create an individualized learning plan tailored to your
                    available hours and skill level, whether your aim is to
                    become proficient in a new programming language or to
                    explore the culinary arts.
                  </p>
                  <Link
                    className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2"
                    href="/create"
                  >
                    Create Roadmap
                  </Link>
                </div>
                <Image
                  src="/roadmap3.jpeg"
                  alt="Create Roadmap"
                  className="mt-2 mb-3 basis-11/12 rounded-xl sm:mt-0 max-w-md"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center md:items-start lg:items-center md:flex-row md:gap-3 md:text-left">
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
                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-bold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2"
                    href="/signin"
                  >
                    Sign in
                  </Link>
                </div>
                <Image
                  src="/roadmap4.jpg"
                  alt="Create Roadmap"
                  className="mt-2 mb-3 basis-11/12 rounded-xl sm:mt-0 max-w-md"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center md:items-start lg:items-center md:flex-row-reverse md:item md:gap-3 md:text-left">
                <div className="mb-6">
                  <h3 className="text-white text-2xl font-bold mb-2 md:text-3xl lg:mb-5">
                    Track your Progress
                  </h3>
                  <p className="mb-6 text-lg md:mb-14 md:text-xl leading-10">
                    Track your progress while delving into your new skill
                    through the use of a progress tracker. Easily get a clear
                    overview of your completed tasks and what remains. Create an
                    account to get started.
                  </p>
                </div>
                <Image
                  src="/progress-tracking.jpg"
                  alt="Create Roadmap"
                  className="mt-2 mb-3 basis-full rounded-xl sm:mt-0 max-w-md"
                  height={250}
                  width={250}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center md:items-start lg:items-center md:flex-row md:gap-3 md:text-left">
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
                    className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-2"
                    href="/explore"
                  >
                    Explore Roadmaps
                  </Link>
                </div>
                <Image
                  src="/roadmap2.jpeg"
                  alt="Create Roadmap"
                  className="mt-2 mb-3 basis-11/12 rounded-xl sm:mt-0 max-w-md"
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
