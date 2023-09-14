"use client";
import Header from "./components/Header";
import Link from "next/link";
import TextAnimation from "./components/TextAnimation";
import './home.css'

export default function Home() {
  
  return (
    <main className="home">
      <TextAnimation />
      <section className="flex flex-col p-3 gap-2 mt-5">
      <div className="flex justify-center items-center">
    <div className="info rounded p-5 relative text-white">

          LearningPath is an AI-powered learning management tool. 
          It designs personalized learning plans, estimates time required to reach skill levels, 
          and offers a structured roadmap with attainable goals. These plans are tailored to users' academic levels, 
          available study time, and pre-existing skills.
        </div>
        </div>

        <div className="flex justify-center gap-2 mt-5">
    <Link href="/explore">
        <div
            className="relative text-center p-4 rounded cursor-pointer group transition-opacity duration-300"
            style={{ 
                backgroundImage: 'url("/roadmap1.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                width: '150px',
                height: '100px',
                opacity: 1
            }}
        >
            <span className="absolute inset-0 flex items-center justify-center text-black font-bold group-hover:text-black">
                Explore
            </span>
        </div>
    </Link>
    
    <Link href="/create">
        <div
            className="relative text-center p-4 rounded cursor-pointer group transition-opacity duration-300"
            style={{ 
                backgroundImage: 'url("/roadmap3.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                width: '150px',
                height: '100px',
                opacity: 1
            }}
        >
            <span className="absolute inset-0 flex items-center justify-center text-black font-bold group-hover:text-black">
                Create
            </span>
        </div>
    </Link>
</div>
      </section>
    </main>
  );
}
