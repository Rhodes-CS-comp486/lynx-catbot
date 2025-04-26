import { useEffect, useState } from "react";
import api from "@/api";
import { group } from "console";

interface PopularSuggestion {
  suggestion_text: string;
  times_selected: number;
}

interface QuestionSuggestion {
  subcategory: string;
  question: string;
}

interface DatasetItem {
  category: string;
  subcategory: string;
  question: string;
}

export const useSuggestions = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [popularSuggestions, setPopularSuggestions] = useState<PopularSuggestion[]>([]);
  const [groupedSubcategories, setGroupedSubcategories] = useState<Record<string, string[]>>({});
  const [groupedQuestions, setGroupedQuestions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const [suggestionsRes, fullDatasetRes] = await Promise.all([
          api.get("suggestions/", {
            headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
          }),
          api.get("fixed-content/", {
            headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
          }),
        ]);
        const cats = suggestionsRes.data.categories || [];
        const subs = suggestionsRes.data.subcategories || [];
        const ques = suggestionsRes.data.questions || [];
        const popular = (suggestionsRes.data.popular_suggestions || []).map((s: any) => ({
          suggestion_text: s.suggestion_text,
          times_selected: s.times_selected,
        }));



        const fullDataset: DatasetItem[] = fullDatasetRes.data || [];

        const grouped: Record<string, string[]> = {};
        const groupedques: Record<string, string[]> = {};
        const counts: Record<string, Record<string, number>> = {};

        fullDataset.forEach((item: DatasetItem) => {
          if(!groupedques[item.subcategory]){
            groupedques[item.subcategory] = [item.question];
          }
          else{
            (groupedques[item.subcategory]).push(item.question);
          }
          if (!counts[item.category]) {
            counts[item.category] = {};
          }
          if (!counts[item.category][item.subcategory]) {
            counts[item.category][item.subcategory] = 0;
          }
          counts[item.category][item.subcategory]++;
        })

        for (const category in counts) {
          grouped[category] = Object.entries(counts[category])
            .sort((a, b) => b[1] - a[1])
            .map(([subcategory, _count]) => subcategory);
        }

        setCategories(cats);
        setSubcategories(subs);
        setPopularSuggestions(popular);
        setGroupedSubcategories(grouped);
        setGroupedQuestions(groupedques);

      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  return { categories, subcategories, popularSuggestions, groupedSubcategories, groupedQuestions};
};