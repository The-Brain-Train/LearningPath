import {
  RoadmapMetaList,
  Roadmap,
  RoadmapDTO,
  RoadmapMeta,
} from "../util/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getRoadmaps = async () => {
  const response = await fetch(`${BACKEND_URL}/api/roadmaps`);
  if (!response.ok) {
    throw Error("Failed to fetch roadmaps");
  }
  const data: RoadmapMetaList = await response.json();
  return data;
};

export const getRoadmapsFilteredPaged = async (
  name: string, experienceLevel: string | null | undefined, 
  fromHour: number | null | undefined, toHour: number | null | undefined,
  page: number, size: number) => {
  const response = await fetch(
    `${BACKEND_URL}/api/roadmaps/filter?` +
    `name=${name}&experienceLevel=${experienceLevel}&` +
    `fromHour=${fromHour}&toHour=${toHour}&` +
    `page=${page}&size=${size}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data = await response.json();
  return data;
}

export const getRoadmap = async (roadMapId: string) => {
  const response = await fetch(`${BACKEND_URL}/api/roadmaps/${roadMapId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data: Roadmap = await response.json();
  return data;
};

export const deleteRoadmap = async (roadMapId: string) => {
  const response = await fetch(`${BACKEND_URL}/api/roadmaps/${roadMapId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete roadmap");
  }
  return roadMapId;
};

export const postRoadmap = async (roadmap: RoadmapDTO, token: any) => {

  return await fetch(`${BACKEND_URL}/api/roadmaps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(roadmap),
  }).then(response => {
    if (response.status === 400) {
      return response.text().then(txt => {
        throw new Error(txt);
      });
    }
    if (!response.ok) {
      throw new Error("Failed to add roadmap");
    }
    return response.json();
  })
};

export const getUsersRoadmapMetas = async (userEmail: string, token: any) => {
  const response = await fetch(
    `${BACKEND_URL}/api/roadmaps/${userEmail}/roadmapMetas`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data: RoadmapMetaList = await response.json();
  return data;
};

export const getUserFavorites = async (
  userEmail: string | null,
  token: any
) => {
  const response = await fetch(
    `${BACKEND_URL}/api/roadmaps/${userEmail}/favorites`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user favorites");
  }
  const data = await response.json();
  return data.favorites;
};

export const getUserUpVotesDownVotes = async (
  userEmail: string | null,
  token: any
) => {
  const response = await fetch(
    `${BACKEND_URL}/api/roadmaps/${userEmail}/votes`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user votes");
  }
  const data = await response.json();
  return data;
};

export const upVoteRoadmap = async (
  userEmail: string | null | undefined,
  roadmapMetaId: string,
  token: any
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/roadmaps/${userEmail}/upvote/${roadmapMetaId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
    if (!response.ok) {
      throw new Error(
        `Failed to upVote roadmap. Status code: ${response.status}`
      );
    }

    return response.text();
  } catch (error) {
    console.error("Error upVoting roadmap:", error);
    return -1;
  }
};

export const downVoteRoadmap = async (
  userEmail: string | null | undefined,
  roadmapMetaId: string,
  token: any
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/roadmaps/${userEmail}/downvote/${roadmapMetaId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to downVote roadmap. Status code: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error downVoting roadmap:", error);
  }
};

export const addRoadmapMetaToUserFavorites = async (
  userEmail: string | null | undefined,
  roadmapMeta: RoadmapMeta,
  token: any
) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/roadmaps/${userEmail}/favorites`,
      {
        method: "POST",
        body: JSON.stringify(roadmapMeta),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!res.ok) {
      throw new Error(
        `Failed to add roadmap to favorites. Status code: ${res.status}`
      );
    }
  } catch (error) {
    console.error("Error adding roadmap to favorites:", error);
  }
};

export const removeRoadmapMetaFromUserFavorites = async (
  userEmail: string | null | undefined,
  roadmapMeta: RoadmapMeta,
  token: any
) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/roadmaps/${userEmail}/favorites`,
      {
        method: "DELETE",
        body: JSON.stringify(roadmapMeta),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!res.ok) {
      throw new Error(
        `Failed to remove roadmap from favorties. Status code: ${res.status}`
      );
    }
  } catch (error) {
    console.error("Error removing roadmap from favorites:", error);
  }
};

export const getUserProfilePicture = async (
  userEmail: string | null,
  token: any
) => {
  const response = await fetch(
    `${BACKEND_URL}/api/users/${userEmail}/profileImage`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users profile picture");
  }
  const data = await response.text();
  return data;
};

export const postUserProfilePicture = async (
  userEmail: string | null,
  formData: FormData,
  token: any
) => {
  const response = await fetch(
    `${BACKEND_URL}/api/users/${userEmail}/profileImage`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (response.status === 422) {
    throw new Error("Invalid file type. Please upload an image.");
  }
  if (!response.ok) {
    throw new Error("Profile picture upload failed");
  }
  const data: string = await response.text();
  return data;
};

export const getRoadmapCountOfUser = async (
  userEmail: string | null,
  token: any
) => {
  const response = await fetch(
    `${BACKEND_URL}/api/roadmaps/${userEmail}/count`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch roadmap count");
  }
  const data = await response.json();
  return data;
};
