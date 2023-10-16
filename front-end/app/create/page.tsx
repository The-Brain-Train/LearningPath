"use client";
import { useEffect, useState } from "react";
import IndentedTree from "../components/IndentedTree";
import InputForm from "../components/InputForm";
import { useCookies } from "react-cookie";
import { CreateRoadmapFormData, RoadmapDTO, TreeNode, User } from "../types";
import jwtDecode from "jwt-decode";
import { postRoadmap } from "../functions/httpRequests";
import { getResponseFromOpenAI } from "../functions/openAIChat";
import { chatHistory } from "../functions/chatPreHistory";
import {
  calculateTotalValuesRecursive,
  scaleValues,
} from "../functions/roadmapHoursCalculator";
import { useQuery } from "@tanstack/react-query";

export default function Create() {
  const [data, setData] = useState<TreeNode | null>(null);
  const [formData, setFormData] = useState<CreateRoadmapFormData>({
    topic: null,
    hours: null,
    experienceLevel: null,
  });
  const [isLoading, setLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [cookies] = useCookies(["user"]);

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

  const resetForm = () => {
    setFormData({
      hours: null,
      experienceLevel: null,
      topic: null,
    });
  };

  const saveRoadMap = async () => {
    if (formData.topic == null || currentUser?.email == null) {
      return;
    }

    const requestData: RoadmapDTO = {
      name: formData.topic,
      roadmap: JSON.stringify(data),
      userEmail: currentUser.email,
      experienceLevel: formData.experienceLevel,
      hours: totalHours,
    };
    postRoadmap(requestData, cookies.user);
  };

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const response = await getResponseFromOpenAI(
        chatHistory(formData.topic, formData.experienceLevel, formData.hours)
      );
      const jsonData = await JSON.parse(response.choices[0].message.content);

      calculateTotalValuesRecursive(jsonData);
      const scaledJsonData = scaleValues(formData.hours, jsonData);
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

  useQuery(["sendMessage", formData.topic], handleSendMessage, {
    enabled: !!formData.topic,
  });

  return (
    <main className="main-background">
      <InputForm
        setTopic={(topic) =>
          setFormData((prevData) => ({ ...prevData, topic }))
        }
        setHours={(hours) =>
          setFormData((prevData) => ({ ...prevData, hours }))
        }
        setExperienceLevel={(experienceLevel) =>
          setFormData((prevData) => ({ ...prevData, experienceLevel }))
        }
        resetForm={resetForm}
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
