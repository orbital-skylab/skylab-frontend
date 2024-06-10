/**
 * Formats a forum post category for better display
 * @param {string} category Category string format
 * @returns {string} Category formatted for better display
 */

export const formatCategory = (category: string): string => {
  let formattedCategory = category.replace(/([A-Z])/g, " $1").trim();
  formattedCategory = formattedCategory
    .replace("One", " 1")
    .replace("Two", " 2")
    .replace("Three", " 3");

  return formattedCategory;
};

// Mapping of key value pairs for form submission
export const categoryType = {
  "MILESTONE 1": "MilestoneOne",
  "MILESTONE 2": "MilestoneTwo",
  "MILESTONE 3": "MilestoneThree",
  GENERAL: "General",
  "MENTOR MATCHING": "MentorMatching",
  OTHERS: "Others",
};

// Mapping of key value pairs for filtering
export const filterType = {
  "ALL POSTS": "All",
  "MY POSTS": "Author",
  "MILESTONE 1": "MilestoneOne",
  "MILESTONE 2": "MilestoneTwo",
  "MILESTONE 3": "MilestoneThree",
  GENERAL: "General",
  "MENTOR MATCHING": "MentorMatching",
  OTHERS: "Others",
};
