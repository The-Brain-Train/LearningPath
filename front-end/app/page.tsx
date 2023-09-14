"use client";
import Header from "./components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="flex flex-col p-3 gap-2 mt-5">
        <div 
            className="rounded p-5 border relative text-white" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/roadmap2.jpeg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              minHeight: '300px'
            }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In facere
          unde ex earum, impedit molestias culpa similique hic maxime mollitia
          saepe illo voluptatibus necessitatibus exercitationem beatae, quod
          eveniet! Rem, accusamus.
        </div>

        <div className="flex justify-center gap-2 mt-5">
    <Link href="/explore">
        <div
            className="relative text-center p-4 rounded cursor-pointer group transition-opacity duration-300"
            style={{ 
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/roadmap1.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                width: '150px',
                height: '100px',
                opacity: 0.7
            }}
        >
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold group-hover:text-black">
                Explore
            </span>
        </div>
    </Link>
    
    <Link href="/create">
        <div
            className="relative text-center p-4 rounded cursor-pointer group transition-opacity duration-300"
            style={{ 
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/roadmap3.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                width: '150px',
                height: '100px',
                opacity: 0.7
            }}
        >
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold group-hover:text-black">
                Create
            </span>
        </div>
    </Link>
</div>
      </section>
    </main>
  );
}
