import { useEffect, useState } from "react";
import api from "@/api";

interface PopularSuggestion {
  suggestion_text: string;
  times_selected: number;
}

interface DatasetItem {
  category: string;
  subcategory: string;
}

export const useSuggestions = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [popularSuggestions, setPopularSuggestions] = useState<PopularSuggestion[]>([]);
  const [groupedSubcategories, setGroupedSubcategories] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await api.get("suggestions/", {
          headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
        });

        const cats = response.data.categories || [];
        const subs = response.data.subcategories || [];
        const popular = (response.data.popular_suggestions || []).map((s: any) => ({
          suggestion_text: s.suggestion_text,
          times_selected: s.times_selected,
        }));

        const fullDataset: DatasetItem[] = response.data.full_dataset || [];

        const grouped = fullDataset.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = new Set();
          }
          acc[item.category].add(item.subcategory);
          return acc;
        }, {} as Record<string, Set<string>>);

        setCategories(cats);
        setSubcategories(subs);
        setPopularSuggestions(popular);
        setGroupedSubcategories(grouped);

      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  return { categories, subcategories, popularSuggestions, groupedSubcategories };
};