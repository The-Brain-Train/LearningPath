export const chatHistory = (topic: string | null, experienceLevel: string | null, hours: number | null) => {
  return [
    {
      role: "user",
      content: `Generate a hierarchical roadmap for learning ${topic} with expected learning time for an person with ${experienceLevel} experience level using the provided JSON format. {"name": "${topic}", "children": [], "value": 10}. "value" should only be present in the last children and should total approximately ${hours}, but this does not need to be calculated. Only include the JSON format data.`
      },
  ];
};
