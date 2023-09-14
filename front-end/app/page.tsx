// "use client";
// import Image from "next/image";
// import Header from "./components/Header";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main>
//       <section className="flex flex-col p-3 gap-2 mt-5">
//         <div className="bg-white rounded p-5 border">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. In facere
//           unde ex earum, impedit molestias culpa similique hic maxime mollitia
//           saepe illo voluptatibus necessitatibus exercitationem beatae, quod
//           eveniet! Rem, accusamus.
//         </div>
//         <div className="flex justify-center gap-2">
//           <Link
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             href="/explore"
//           >
//             Explore
//           </Link>
//           <Link
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             href="/create"
//           >
//             Create
//           </Link>
//         </div>
//       </section>
//     </main>
//   );
// }



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
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("/roadmap2.jpeg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              minHeight: '300px'
            }}
        >
          LearningPath is an AI-driven learning management tool that creates personalized learning plans, 
          estimates time required to reach skill levels, and provides a guided roadmap with achievable goals based on users' 
          academic level, available learning time, and existing skills. Personalized Learning Plans.
        </div>
        <div className="flex justify-center gap-2">
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
      </section>
    </main>
  );
}

