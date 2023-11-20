export const chatHistory = (topic: string | null, experienceLevel: string | null, hours: number | null) => {
  return [
    {
      role: "user",
      content: `Generate a hierarchical roadmap for learning ${topic} for a person with ${experienceLevel} experience level, by spending exactly ${hours} hours, using the provided JSON format.

      The JSON structure should follow this format:
      {
        "name": "${topic}",
        "children": [],
      }
      in the last set of children in the data there should be a '"value": provide hours for task' that represents the hours for that task. These combined should equal around ${hours} hours.
      ` },
  ];
};

export const requestPromptWithResources = (
  topic: string | null,
  experienceLevel: string | null,
  hours: number | null,
  resources: boolean) => {

  return [
    {
      role: "user",

      content: `Generate a hierarchical roadmap for learning ${topic} for a person with ${experienceLevel} experience level, by spending exactly ${hours} hours, using the provided JSON format. 
        
        The JSON structure should follow this format:

        {
          "name": "${topic}",
          "children": [],
          "resources": [],
        }
        in the last set of children in the data there should be a '"value": provide hours for task' that represents the hours for that task. These combined should equal around ${hours} hours.
        Additionally, include a "resources" array with details of 5 recommended resources (books, courses, websites) for learning Java, each with a name, type, and with actual link to the resource.
        `,
    },
  ];

};

export const requestPromptOnlyResources = (
  topic: string | null,
) => {
  return [
    {
      role: "user",

      content: `Provide a "resources" array with details of 5 recommended resources (books, courses, websites) for learning ${topic}, each with a name, type, and with actual link to the resource. 
        Use the following JSON format:
        {
          “resources”: [],
        }`,
    },
  ];
};
