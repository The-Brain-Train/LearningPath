import { Dispatch, SetStateAction } from "react";

export type RoadmapMeta = {
  id: string;
  name: string;
  roadmapReferenceId: string;
  userEmail: string;
  experienceLevel: string;
  hours: number;
  upVotes: number;
  downVotes: number;
  progressPercentage: number;
};

export type PersonalRoadmapCardProps = {
  currentUser: User;
  roadmapMeta: RoadmapMeta;
  handleDelete: (roadmapMeta: RoadmapMeta) => void;
};

export type FavoriteRoadmapCardProps = {
  roadmapMeta: RoadmapMeta;
  removeFavorite: (roadmapMeta: RoadmapMeta) => void;
};

export type RoadmapMetaList = {
  roadmapMetaList: RoadmapMeta[];
};

export type Roadmap = {
  id: string;
  obj: string;
  userEmail: string;
  experienceLevel: string;
  hours: number;
};

export type RoadmapDTO = {
  name: string;
  roadmap: string;
  userEmail: string;
  experienceLevel: string | null;
  hours: number | null;
};

export type User = {
  email: string | null;
  name: string | null;
  profilePicture: string | null;
};

export type UserProps = {
  currentUser: User;
};

export type CreateIndentedTreeProps = {
  data: TreeNode | null;
  isLoading: boolean;
  createError: string | null;
  saveRoadmap: () => Promise<void>;
  setData: Dispatch<SetStateAction<TreeNode | null>>;
  currentUser: User | null | undefined;
};

export type ExploreIndentedTreeProps = {
  data: TreeNode | undefined;
  updateCompletedTopic: (completedTask: string) => Promise<Roadmap | undefined>;
  isCreator: boolean;
};

export type TreeNode = {
  name: string;
  children: TreeNode[];
  value: number;
  resources: ResourceType[];
  completedTopic: boolean;
}

export type ResourceType = {
  name: string;
  type: string;
  link: string;
}

export interface CustomNode extends d3.HierarchyPointNode<any> {
  index: number;
}

export type CreateRoadmapFormData = {
  topic: string | null;
  hours: number | null;
  experienceLevel: string | null;
  resources: boolean;
};

export type InputFormProps = {
  setRoadmapInputData: Dispatch<SetStateAction<{
    topic: string | null;
    hours: number | null;
    experienceLevel: string | null;
    resources: boolean;
  }>>;
  resetForm: () => void;
  data: TreeNode | null;
};

export type BurgerMenuProps = {
  handleSignOut: () => void;
}

export type ResourcesSectionProps = {
  treeNode: TreeNode | null | undefined;
  userOwnsRoadmap: boolean;
  queriesToInvalidate: string[];
  roadmapId: string | undefined;
  userEmail: string | null | undefined;
  cookiesUser: string;
};

export type RoadmapObjectData = {
  name: string;
  children: RoadmapObjectData[] | null;
  completedTopic: boolean;
  value: number;
};