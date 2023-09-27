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
  userEmail: string
};

export type User = {
  email: string | null;
  name: string | null;
};
