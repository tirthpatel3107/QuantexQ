import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/components/features/dashboard/CategoryCard";
import { ROUTES } from "@/services/routes/clientRoutes";
import { SETTINGS_CATEGORY_CARDS as CATEGORY_CARDS } from "@/utils/constants";

export function SettingsOverview() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-start">
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
