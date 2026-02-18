import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { ROUTES } from "@/constants/routes";
import { CATEGORY_CARDS } from "../constants";

export function SettingsOverview() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 items-start">
      {CATEGORY_CARDS.map((cat) => (
        <CategoryCard
          key={cat.id}
          title={cat.title}
          description={cat.description}
          icon={cat.icon}
          onClick={() => navigate(`${ROUTES.SETTINGS}/${cat.id}`)}
        />
      ))}
    </div>
  );
}
