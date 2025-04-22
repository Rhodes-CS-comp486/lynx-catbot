import api from "@/api";

export const useSuggestionTracker = () => {
  const updatePopularSuggestions = async (text?: string) => {
    try {
      await api.post("suggestion-usage/", {
        suggestion: text,
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {
      console.error("Error tracking suggestion usage:", error);
    }
  };

  return { updatePopularSuggestions };
};