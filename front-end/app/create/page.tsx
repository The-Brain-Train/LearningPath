"use client";
import { useEffect, useState } from "react";
import IndentedTree from "../components/IndentedTree";
import InputForm from "../components/InputForm";
import { RoadmapDTO, TreeNode, User } from "../util/types";
import { postRoadmap } from "../functions/httpRequests";
import { getResponseFromOpenAI } from "../functions/openAIChat";
import { chatHistory } from "../functions/chatPreHistory";
import {
  calculateTotalValuesRecursive,
  scaleValues,
} from "../functions/roadmapHoursCalculator";
import jwtDecode from 'jwt-decode';
import { useCookies } from 'react-cookie';
import { useQuery } from "@tanstack/react-query";

export default function Create() {
  const [data, setData] = useState<TreeNode | null>(null);
  const [hours, setHours] = useState<number | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [cookies] = useCookies(["user"]);
  
  const resetForm = () => {
    setHours(null);
    setExperienceLevel(null);
    setTopic(null);
  };

  const { data: currentUser } = useQuery<User | null>(
    ["currentUser"],
    async () => {
      if (cookies.user) {
        const user = jwtDecode(cookies.user) as User | null;
        return user;
      }
      return null;
    }
  );

  const saveRoadMap = async () => {
    if (topic == null || currentUser?.email == null) {
      return;
    }

    const requestData: RoadmapDTO = {
      name: topic,
      roadmap: JSON.stringify(data),
      userEmail: currentUser.email,
      experienceLevel: experienceLevel,
      hours: totalHours,
    };
    postRoadmap(requestData, cookies.user);
  };
  
  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const response = await getResponseFromOpenAI(
        chatHistory(topic, experienceLevel, hours)
      );
      const jsonData = await JSON.parse(response.choices[0].message.content);

      calculateTotalValuesRecursive(jsonData);
      const scaledJsonData = scaleValues(hours, jsonData);
      calculateTotalValuesRecursive(scaledJsonData);

      setTotalHours(scaledJsonData.value);
      setData(scaledJsonData);
    } catch (error) {
      setCreateError(
        `Unable to generate roadmap. Please try again. Error: ${error}`
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic != null) {
      handleSendMessage();
    }
  }, [topic]);

  return (
    <main className="main-background">
      <InputForm
        data={data}
        setTopic={setTopic}
        setHours={setHours}
        setExperienceLevel={setExperienceLevel}
        resetForm={resetForm}
        setData={setData}
      />
      <IndentedTree
        data={data}
        createError={createError}
        isLoading={isLoading}
        saveRoadmap={saveRoadMap}
        setData={setData}
        currentUser={currentUser}
      />
    </main>
  );
}