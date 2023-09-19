"use client";
import Link from "next/link";
import TextAnimation from "./components/TextAnimation";

export default function Home() {
  const topSectionButtonStyles = (backgroundImageUrl: string) => ({
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    width: "120px",
    height: "50px",
    opacity: 0.7,
  });

  return (
    <main className="main-background">
      <section className="flex flex-col p-3 gap-2 mt-5">
        <div className="info">
          <TextAnimation />
        </div>

        <div className="flex justify-center gap-4 mt-5 pt-36">
          <Link href="/explore">
            <div
              className="relative text-center rounded cursor-pointer group transition-opacity duration-300 border-2"
              style={topSectionButtonStyles("/roadmap2.jpeg")}
            >
              <span className="absolute inset-0 flex items-center justify-center text-black font-bold group-hover:text-black">
                Explore
              </span>
            </div>
          </Link>

          <Link href="/create">
            <div
              className="relative text-center rounded cursor-pointer group transition-opacity duration-300 border-2"
              style={topSectionButtonStyles("/roadmap3.jpeg")}
            >
              <span className="absolute inset-0 flex items-center justify-center text-black font-bold group-hover:text-black">
                Create
              </span>
            </div>
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center pt-8">
          <h2 className="text-white text-3xl">About LearningPath</h2>
          <div className="rounded p-5 relative text-white text-base">
            LearningPath is an AI-powered learning management tool. It designs
            personalized learning plans, estimates time required to reach skill
            levels, and offers a structured roadmap with attainable goals. These
            plans are tailored to users' academic levels, available study time,
            and pre-existing skills.
          </div>
        </div>
      </section>
    </main>
  );
}
