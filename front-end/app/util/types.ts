import { Dispatch, SetStateAction } from "react";

export type RoadmapMeta = {
  id: string;
  name: string;
  roadmapReferenceId: string;
  userEmail: string;
  experienceLevel: string;
  hours: number;
};

export type PersonalRoadmapCardProps = {
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
};

export type UserProfile =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      profilePicture?: string | null | undefined;
    }
  | undefined;

export type UserCardProps = {
  user: UserProfile;
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
};

export type TreeNode = {
  name: string;
  children: TreeNode[];
  value: number;
}

export interface CustomNode extends d3.HierarchyPointNode<any> {
  index: number;
}

export type CreateRoadmapFormData = {
  topic: string | null;
  hours: number | null;
  experienceLevel: string | null;
};