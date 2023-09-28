export type RoadmapMeta = {
  id: string;
  name: string;
  roadMapReferenceId: string;
  userEmail: string;
};

export type RoadMapMetaList = {
  roadMapMetaList: RoadmapMeta[];
};

export type Roadmap = {
  id: string;
  obj: string;
};

export type RoadmapDTO = {
  name: string;
  roadMap: string;
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
      image?: string | null | undefined;
    }
  | undefined;

export type CardProps = {
  user: UserProfile;
};
