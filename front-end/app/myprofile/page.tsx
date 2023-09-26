import React from 'react'
import UserCard from '../components/UserCard'
import { getServerSession } from "next-auth/next"
import { options } from '../api/auth/[...nextauth]/options'

const page = async () => {
    const session = await getServerSession(options)

  return (
    <>
    {session ? (
      <UserCard user={session?.user} pagetype={"My Profile"} />
    ) : (
      <h1 className="text-5xl">You Shall Not Pass!</h1>
    )}
  </>
  )
}

export default page
