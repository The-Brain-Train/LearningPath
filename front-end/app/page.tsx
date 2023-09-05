import Image from 'next/image'
import Header from './components/Header'
import Link from 'next/link'

export default function Home() {
  return (
   <main>
    <section className='flex flex-col p-3 gap-2 mt-5'>
      <div className='bg-white rounded p-5 border'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. In facere unde ex earum, impedit molestias culpa similique hic maxime mollitia saepe illo voluptatibus necessitatibus exercitationem beatae, quod eveniet! Rem, accusamus.
      </div>
      <div className='flex justify-center gap-2'>
        <Link className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' href="/explore">Explore</Link>
        <Link className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' href="/create">Create</Link>
      </div>
    </section>
   </main>
  )
}
