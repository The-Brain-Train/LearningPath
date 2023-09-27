export const chatHistory = (topic: string | null, experienceLevel: string | null, hours: number | null) => {
  return [
    {
      role: "user",
      content: `Generate a hierarchical roadmap for learning ${topic} for a person with ${experienceLevel} experience level using the provided JSON format.

      The JSON structure should follow this format:
      {
        "name": "${topic}",
        "children": [
          {
            "name": "Stage 1",
            "children": [
              {
                "name": "Substage 1.1",
                "children": [],
                "value": 10
              },
              {
                "name": "Substage 1.2",
                "children": [],
                "value": 15
              }
            ]
          },
          {
            "name": "Stage 2",
            "children": [
              {
                "name": "Substage 2.1",
                "children": [],
                "value": 20
              }
            ]
          }
        ],
        "value": ${hours}
      }
      
      ` },
  ];
};
