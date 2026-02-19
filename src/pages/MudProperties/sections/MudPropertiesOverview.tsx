import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { ROUTES } from "@/constants/routes";
import { MUD_OVERVIEW_CARDS } from "../constants";

export function MudPropertiesOverview() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 items-start">
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
