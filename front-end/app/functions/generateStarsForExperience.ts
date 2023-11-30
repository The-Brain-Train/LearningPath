export const generateStarsforExperienceLevel = (difficultyLevel: string) => {
  switch (difficultyLevel) {
    case "beginner":
      return "⭐";
    case "intermediate":
      return "⭐⭐";
    case "expert":
      return "⭐⭐⭐";
    default:
      return "";
  }
};