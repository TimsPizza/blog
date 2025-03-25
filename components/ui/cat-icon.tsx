import { TrendingUpIcon } from "lucide-react";
import React from "react";
import { FiBookOpen, FiDatabase, FiTrendingUp } from "react-icons/fi";
import { FaBicycle, FaCode, FaReact, FaTools } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
export function getCategoryLogoByName(category: string) {
  switch (category) {
    case "lifetyle":
      return <FiBookOpen className="h-5 w-5" />;
    case "programming":
      return <FaCode className="h-5 w-5" />;
    case "technology":
      return <TrendingUpIcon className="h-5 w-5" />;
    case "travel":
      return <FaBicycle className="h-5 w-5" />;
    case "uncategorized":
      return <FaMagnifyingGlass className="h-5 w-5" />;
    case "toolrecommendation":
      return <FaTools className="h-5 w-5" />;
    case "essay":
      return <FiBookOpen className="h-5 w-5" />;
    case "frontend":
      return <FaReact className="h-5 w-5" />;
    case "backend":
      return <FiDatabase className="h-5 w-5" />;
    default:
      return <FiBookOpen className="h-5 w-5" />;
  }
}
const CatIconByName = ({ category }: { category: string }) => {
  return getCategoryLogoByName(category.split(" ").join("").toLowerCase());
};

export default CatIconByName;
