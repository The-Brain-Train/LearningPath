export const chatHistory = (topic: string | null) => {
  return [
    {
      role: "user",
      content: `I will provide you with JSON format, Please use it to generate a hierarchical roadmap for learning ${topic} with expected learning time for an average person.  Please only provide the data and nothing else as it will be parsed. { "name": "${topic}" "children": [] "value": 10`,
    },
  ];
};
