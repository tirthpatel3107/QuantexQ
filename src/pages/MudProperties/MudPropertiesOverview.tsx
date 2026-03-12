// React & Hooks
import { useNavigate } from "react-router-dom";

// Form & Validation

// Hooks

// Services & API

// Types & Schemas

// Components - Local
import { CategoryCard } from "@/components/features/dashboard/CategoryCard";

// Utils & Constants
import { ROUTES } from "@/app/routes/routeEndpoints";
import { MUD_OVERVIEW_CARDS } from "@/utils/constants";

// Icons & Utils

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
