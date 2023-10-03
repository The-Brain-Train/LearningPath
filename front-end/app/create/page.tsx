"use client"
import { useState } from "react";
import IndentedTree from "../components/IndentedTree";
import InputForm from "../components/InputForm";
import { useSession } from "next-auth/react";


export default function  Create() {
  const [hours, setHours] = useState<number | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string| null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const {data: session} = useSession();

  const resetForm = () => {
    setHours(null);
    setExperienceLevel(null);
    setTopic(null);
  };

  return (
    <main className="main-background">
      <InputForm setTopic={setTopic} setHours={setHours} setExperienceLevel={setExperienceLevel} resetForm={resetForm}/>
      <IndentedTree topic={topic} experienceLevel={experienceLevel} hours={hours} userEmail={session?.user?.email} />
    </main>
  );
}
