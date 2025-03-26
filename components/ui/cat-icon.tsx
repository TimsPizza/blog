import { TrendingUpIcon } from "lucide-react";
import { FaBicycle, FaCode, FaReact, FaTools } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FiBookOpen, FiDatabase } from "react-icons/fi";
export function getCategoryLogoByName(category: string, className?: string) {
  const overallClassName = `h-5 w-5 ${className}`;
  switch (category) {
    case "lifetyle":
      return <FiBookOpen className={overallClassName} />;
    case "programming":
      return <FaCode className={overallClassName} />;
    case "technology":
      return <TrendingUpIcon className={overallClassName} />;
    case "travel":
      return <FaBicycle className={overallClassName} />;
    case "uncategorized":
      return <FaMagnifyingGlass className={overallClassName} />;
    case "toolrecommendation":
      return <FaTools className={overallClassName} />;
    case "essay":
      return <FiBookOpen className={overallClassName} />;
    case "frontend":
      return <FaReact className={overallClassName} />;
    case "backend":
      return <FiDatabase className={overallClassName} />;
    default:
      return <FiBookOpen className={overallClassName} />;
  }
}
const CatIconByName = ({
  category,
  className,
}: {
  category: string;
  className?: string;
}) => {
  return getCategoryLogoByName(category.split(" ").join("").toLowerCase());
};

export default CatIconByName;
