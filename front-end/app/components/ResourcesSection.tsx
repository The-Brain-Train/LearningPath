import Link from "next/link";
import { TreeNode } from "@/app/util/types";
import { CircularProgress } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addResourcesToRoadmap } from "@/app/functions/httpRequests";
import { requestPromptOnlyResources } from "../functions/chatPreHistory";
import { getResponseFromOpenAI } from "../functions/openAIChat";

type ResourcesSectionProps = {
  treeNode: TreeNode | null | undefined;
  userOwnsRoadmap: boolean;
  queriesToInvalidate: string[];
  roadmapId: string | undefined;
  userEmail: string | null | undefined;
  cookiesUser: string;
};

export const ResourcesSection = (props: ResourcesSectionProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: handleAddResources, isLoading: generatingResources } =
    useMutation({
      mutationFn: async () => {
        const response = await getResponseFromOpenAI(
          requestPromptOnlyResources(props.treeNode?.name || null) //
        );
        const resourcesJsonData = await JSON.parse(
          response.choices[0].message.content
        );
        const roadmap = await addResourcesToRoadmap(
          props.userEmail,
          props.roadmapId,
          resourcesJsonData,
          props.cookiesUser
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries(props.queriesToInvalidate);
      },
    });

  return (
    <>
      {((props.userOwnsRoadmap && props.roadmapId) ||
        (props.treeNode && props.treeNode.resources)) && (
        <div className="mt-10 flex flex-left">
          <p className="text-xl text-center font-bold text-white md:text-2xl">
            Resources to follow
          </p>
        </div>
      )}
      <div className="mt-5 mx-10">
        {props.treeNode &&
          props.treeNode.resources &&
          props.treeNode.resources.map((r, index) => (
            <table className="table-fixed w-full" key={index}>
              <tbody>
                <tr className="py-10">
                  <td>{r.type}</td>
                  <td>{r.name}</td>
                  <td>
                    <Link
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                        Visit Site
                      </button>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
        {(!props.treeNode || !props.treeNode.resources) &&
          !generatingResources &&
          props.userOwnsRoadmap &&
          props.roadmapId && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
              onClick={() => handleAddResources()}
            >
              Add Resources
            </button>
          )}
        {generatingResources && props.roadmapId && (
          <>
            <div className="font-bold text-xl text-slate-300">
              Generating Resources
            </div>
            <CircularProgress />
          </>
        )}
      </div>
    </>
  );
};
