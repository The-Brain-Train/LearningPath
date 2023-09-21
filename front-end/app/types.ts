export type RoadmapMeta = {
    id: string,
    name: string
    roadMapReferenceId: string
}

export type RoadMapMetaList = {
    roadMapMetaList: RoadmapMeta[]
}

export type Roadmap = {
    id: string,
    obj: string
}

export type RoadmapDTO = {
    name: string,
    roadMap: string
}