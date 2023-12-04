import { error } from "console";
import {
  RoadmapMetaList,
  Roadmap,
  RoadmapDTO,
  RoadmapMeta,
} from "../util/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const signUp = async (formData: any) => {
  return await fetch(`${BACKEND_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then(response => {
    if (response.status === 409) {
      throw new Error("Email address already in use. Please sign in or use a different email.");
    }
  })
};

export const signIn = async (formData: any) => {
  const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (response.ok) {
    const data = await response.json();
    return data.token;
  } else {
    console.error("Error submitting form data:", response.statusText);
  }
  if (response.status === 403) {
    throw new Error("Incorrect password. Please try again.");
  }
  if (response.status === 401) {
    throw new Error("Invalid Email. Please try again or sign up.");
  }
}

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

export const getRoadmapByMetaId = async (roadmapMetaId: string) => {
  const response = await fetch(`${BACKEND_URL}/api/roadmaps/findByMeta/${roadmapMetaId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch roadmap");
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

export const postRoadmap = async (roadmap: RoadmapDTO, token: string) => {

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

export const getUsersRoadmapMetas = async (userEmail: string, token: string) => {
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
  token: string
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
  token: string
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
  token: string
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
  token: string
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

export const getRoadmapProgressOfUser = async (
  userEmail: string | null | undefined,
  roadmapMetaId: string | undefined,
  token: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/roadmaps/${userEmail}/progress/${roadmapMetaId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch progress of user's roadmap. Status code: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching progress of user's roadmap:", error);
  }
};

export const addResourcesToRoadmap = async (
  userEmail: string | null | undefined,
  roadmapMetaId: string | undefined,
  chatGptResourceResponse: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/roadmaps/${userEmail}/resource/${roadmapMetaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(chatGptResourceResponse),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to add resources to roadmap. Status code: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error adding resources to roadmap:", error);
  }
};

export const updateUsersCompletedTopic = async (
  userEmail: string | null | undefined,
  roadmapMetaId: string,
  completedTask: string,
  token: string
) => {
  const response = await fetch(
    `${BACKEND_URL}/api/roadmaps/${userEmail}/completedTopic/${roadmapMetaId}`,
    {
      method: "PUT",
      body: completedTask,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Topic failed to add to completed list");
  }
  const data: Roadmap = await response.json();
  return data;
};

export const addRoadmapMetaToUserFavorites = async (
  userEmail: string | null | undefined,
  roadmapMeta: RoadmapMeta,
  token: string
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
  token: string
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
  token: string
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
  token: string
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
  token: string
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
