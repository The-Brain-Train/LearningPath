"use client";
import Link from "next/link";
import TextAnimation from "./components/TextAnimation";
import { useSession } from "next-auth/react";
import { User } from "./types";
import { useEffect } from "react";
import { addUser } from "./functions/httpRequests";

const topSectionButtonStyles = (backgroundImageUrl: string) => ({
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center center",
  width: "120px",
  height: "50px",
  transition: "opacity 0.7s ease",
});

export default function Home() {
  const { data: session, status } = useSession();

  const user: User = {
    email: session?.user?.email!,
    name: session?.user?.name!,
  };

  useEffect(() => {
    if (status === "authenticated") {
      addUser(user);
    }
  }, [status]);

  return (
    <main className="main-background">
      <section className="flex flex-col p-3 gap-2 mt-5">
        <div className="info">
          <TextAnimation />
        </div>

        <div className="flex justify-center gap-4 mt-5 pt-32">
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
          <h2 className="text-white text-3xl mb-4">About LearningPath</h2>
          <div className="rounded p-5 relative text-white text-base space-y-4">
            <p>
              LearningPath is an exciting and innovative AI-powered learning
              management tool that's designed to make your learning journey both
              enjoyable and productive.
            </p>
            <img
              src="/home-about-img.jpeg"
              alt="Create Roadmap"
              className="ml-2 w-70 h-60"
            />
          </div>
          <div className="flex flex-col justify-center items-center pt-8">
            <h2 className="text-white text-3xl mb-4">Features of LearningPath</h2>
            <div className="ml-6 space-y-2">
              <div className="flex items-center mb-2">
                <h2 className="text-white text-xl">Create Your Roadmap:</h2>
              </div>
              <p className="text-white">
                Craft personalized learning roadmaps tailored to your goals and
                aspirations. Whether you want to master a new programming
                language, become a design guru, or explore the depths of
                astrophysics.
              </p>
              <div className="flex items-center mb-2">
                <h2 className="text-white text-xl">
                  Save and Manage Your Roadmaps:
                </h2>
              </div>
              <p className="text-white">
                Organize your learning journey by saving your roadmaps. Easily
                access and update them as you progress toward your goals.
              </p>
              <div className="flex items-center mb-2">
                <h2 className="text-white text-xl">Explore and Vote:</h2>
              </div>
              <p className="text-white">
                Dive into a world of learning possibilities by exploring
                roadmaps created by fellow learners. Give a thumbs-up to the
                ones you find most valuable, helping others discover the best
                learning paths for specific skills.
              </p>
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
