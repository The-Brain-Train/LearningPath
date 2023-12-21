import Link from "next/link";
import { TreeNode } from "@/app/util/types";
import { CircularProgress } from "@mui/material";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addResourcesToRoadmap } from "@/app/functions/httpRequests";
import { requestPromptOnlyResources } from "../functions/chatPreHistory";
import { getResponseFromOpenAI } from "../functions/openAIChat";
import useMediaQuery from "@mui/material/useMediaQuery";
import OpenInNew from "@mui/icons-material/OpenInNew";
import SuggestResourceForm from "../explore/[roadmapmetaid]/SuggestResourceForm";

type RoadmapResourcesSectionProps = {
  treeNode: TreeNode | null;
  userOwnsRoadmap: boolean;
  queriesToInvalidate: string[];
  roadmapMetaId: string | undefined;
  userEmail: string | null | undefined;
  cookiesUser: string;
};

export const RoadmapResourcesSection = (
  props: RoadmapResourcesSectionProps
) => {
  const queryClient = useQueryClient();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const { mutateAsync: handleAddResources, isLoading: generatingResources } =
    useMutation({
      mutationFn: async () => {
        const response = await getResponseFromOpenAI(
          requestPromptOnlyResources(props.treeNode?.name || null)
        );
        const resourcesJsonData = await JSON.parse(
          response.choices[0].message.content
        );
        await addResourcesToRoadmap(
          props.userEmail,
          props.roadmapMetaId,
          resourcesJsonData,
          props.cookiesUser
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries(props.queriesToInvalidate);
      },
    });

  const handleSuggestResources = () => {
    queryClient.setQueryData(["showSuggestResourceForm"], true);
    queryClient.invalidateQueries(["showSuggestResourceFormQuery"]);
  };

  return (
    <>
      <div className="pb-12 text-white flex flex-col">
        {((props.userOwnsRoadmap && props.roadmapMetaId) ||
          (props.treeNode && props.treeNode.resources)) && (
            <div className="mt-10 flex flex-left">
              <p className="text-xl text-center font-bold text-white md:text-3xl pl-4">
                Learning Resources
              </p>
            </div>
          )}
        <div className="mt-5 mx-10 md:mt-0 md:mx-0">
          {!isSmallScreen &&
            props.treeNode &&
            props.treeNode.resources &&
            props.treeNode.resources.map((r, index) => (
              <table
                key={`${r.type}-${index}`}
                className="table-fixed w-full md:mx-4"
              >
                <tbody>
                  <tr>
                    <td className="md:w-1/6 md:text-xl font-bold text-left align-middle pr-4 py-2">
                      {r.type}
                    </td>

                    <td className="md:w-5/6 hover:text-blue-500 hover:font-bold align-middle py-4 underline">
                      {r.link &&
                        <Link
                          href={r.link} target="_blank" rel="noopener noreferrer">
                          {r.name}
                        </Link>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
          {isSmallScreen &&
            props.treeNode &&
            props.treeNode.resources &&
            props.treeNode.resources.map((r, index) => (
              <ul key={`${r.type}-${index}`}>
                <li className="font-bold list-disc"> {r.type} </li>
                <li className="pl-2 pb-1">
                  <span className="mr-2">{r.name}</span>
                  {r.link &&
                    <Link href={r.link} target="_blank" rel="noopener noreferrer">
                      <OpenInNew />
                    </Link>
                  }
                </li>
              </ul>
            ))}
          {
            !generatingResources &&
            props.userOwnsRoadmap &&
            props.roadmapMetaId && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                onClick={() => handleAddResources()}
              >
                Add Resources
              </button>
            )}
          {generatingResources && props.roadmapMetaId && (
            <div className="flex flex-row items-center">
              <div className="text-left font-bold text-xl text-slate-300 mr-2">
                Generating Resources
              </div>
              <CircularProgress />
            </div>
          )}
          {
            !generatingResources &&
            !props.userOwnsRoadmap &&
            props.roadmapMetaId && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                onClick={() => handleSuggestResources()}
              >
                Suggest Resources
              </button>
            )}
          <SuggestResourceForm
            roadmapMetaId={props.roadmapMetaId}
            userEmail={props.userEmail}
            cookiesUser={props.cookiesUser}
          />
        </div>
      </div>
    </>
  );
};
