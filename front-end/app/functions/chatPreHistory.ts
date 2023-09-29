export const chatHistory = (topic: string | null, experienceLevel: string | null, hours: number | null) => {
  return [
    {
      role: "user",
      content: `Generate a hierarchical roadmap for learning ${topic} for a person with ${experienceLevel} experience level using the provided JSON format.

      The JSON structure should follow this format:
      {
        "name": "${topic}",
        "children": [],
      }
      in the last set of children in the data there should be a '"value": provide hours for task' that represents the hours for that task. These combined should equal around ${hours} hours.
      ` },
  ];
};
