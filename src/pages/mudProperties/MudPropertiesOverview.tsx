import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/components/features/dashboard/CategoryCard";
import { ROUTES } from "@/app/routes/clientRoutes";
import { MUD_OVERVIEW_CARDS } from "@/utils/constants";

export function MudPropertiesOverview() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-start">
      {MUD_OVERVIEW_CARDS.map((card) => (
        <CategoryCard
          key={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
          onClick={() => navigate(`${ROUTES.MUD_PROPERTIES}/${card.id}`)}
        />
      ))}
    </div>
  );
}
