export const chatHistory = (topic: string | null, experienceLevel: string | null, hours: number | null) => {
  return [
    {
      role: "user",
      content: `Generate a hierarchical roadmap for learning ${topic} for a person with ${experienceLevel} experience level using the provided JSON format.

      The JSON structure should follow this format:
      {
        "name": "${topic}",
        "children": [],
        "value": ${hours}
      }
      Ensure that the "value" field is only present in the last children. The total value should approximate ${hours} hours.
      ` },
  ];
};
