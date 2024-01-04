"use client";
import { useEffect, useState } from "react";
import IndentedTree from "./IndentedTree";
import { CreateRoadmapFormData, RoadmapDTO, TreeNode } from "../util/types";
import { postRoadmap } from "../functions/httpRequests";
import { getResponseFromOpenAI } from "../functions/openAIChat";
import {
  chatHistory,
  requestPromptWithResources,
} from "../functions/chatPreHistory";
import {
  calculateTotalValuesRecursive,
  scaleValues,
} from "../functions/roadmapHoursCalculator";
import { useCookies } from "react-cookie";
import useCurrentUserQuery from "../functions/useCurrentUserQuery";
import InputForm from "./InputForm";
import { RoadmapResourcesSection } from "../components/RoadmapResourcesSection";

export default function Create() {
  const [data, setData] = useState<TreeNode | null>(null);
  const [roadmapInputData, setRoadmapInputData] =
    useState<CreateRoadmapFormData>({
      topic: null,
      hours: null,
      experienceLevel: null,
      resources: false,
    });
  const [apiFetchLoading, setApiFetchLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const { currentUser } = useCurrentUserQuery();
  const [cookies] = useCookies(["user"]);

  const resetForm = () => {
    setRoadmapInputData({
      topic: null,
      hours: null,
      experienceLevel: null,
      resources: false,
    });
  };

  const saveRoadMap = async () => {
    if (roadmapInputData.topic == null || currentUser?.email == null) {
      return;
    }
    const requestData: RoadmapDTO = {
      name: roadmapInputData.topic,
      roadmap: JSON.stringify(data),
      userEmail: currentUser.email,
      experienceLevel: roadmapInputData.experienceLevel,
      hours: totalHours,
    };
    try {
      await postRoadmap(requestData, cookies.user);
    } catch (e) {
      throw e;
    }
  };

  const handleSendMessage = async () => {
    setApiFetchLoading(true);
    try {
      let response = null;
      if (roadmapInputData.resources) {
        response = await getResponseFromOpenAI(
          requestPromptWithResources(
            roadmapInputData.topic,
            roadmapInputData.experienceLevel,
            roadmapInputData.hours,
            roadmapInputData.resources
          )
        );
      } else {
        response = await getResponseFromOpenAI(
          chatHistory(
            roadmapInputData.topic,
            roadmapInputData.experienceLevel,
            roadmapInputData.hours
          )
        );
      }

      const jsonData = await JSON.parse(response.choices[0].message.content);

      calculateTotalValuesRecursive(jsonData);
      const scaledJsonData = scaleValues(roadmapInputData.hours, jsonData);
      calculateTotalValuesRecursive(scaledJsonData);

      setTotalHours(scaledJsonData.value);
      setData(scaledJsonData);
    } catch (error) {
      setCreateError(
        `Unable to generate roadmap. Please try again. Error: ${error}`
      );
      console.error(error);
    } finally {
      setApiFetchLoading(false);
    }
  };

  useEffect(() => {
    if (roadmapInputData.topic != null) {
      handleSendMessage();
    }
  }, [roadmapInputData]);

  return (
    <main className="main-background">
      <InputForm
        data={data}
        setRoadmapInputData={setRoadmapInputData}
        resetForm={resetForm}
      />
      <div className="flex flex-col px-3 justify-center items-center">
        <div className="max-w-screen-xl parent-roadmap-container">
          <IndentedTree
            data={data}
            createError={createError}
            isLoading={apiFetchLoading}
            saveRoadmap={saveRoadMap}
            setData={setData}
            currentUser={currentUser}
          />
          {!apiFetchLoading && (
            <RoadmapResourcesSection
              treeNode={data}
              userOwnsRoadmap={true}
              queriesToInvalidate={[""]}
              roadmapMetaId={undefined}
              userEmail={currentUser?.email}
              cookiesUser={cookies.user}
            />
          )}
        </div>
      </div>
    </main>
  );
}
