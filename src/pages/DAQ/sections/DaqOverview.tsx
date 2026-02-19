import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { ROUTES } from "@/constants/routes";
import { SECTION_CARDS } from "../constants";

export function DaqOverview() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 items-start">
      {SECTION_CARDS.daq.map((card) => (
        <CategoryCard
          key={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
          onClick={() => navigate(`${ROUTES.DAQ}/${card.id.replace("ov-", "")}`)}
        />
      ))}
    </div>
  );
}
