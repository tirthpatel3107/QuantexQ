import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/pages/Dashboard/components/CategoryCard";
import { ROUTES } from "@/shared/constants/routes";

interface NetworkSectionProps {
  cards: {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
}

export function NetworkSection({ cards }: NetworkSectionProps) {
  const navigate = useNavigate();

  const handleCardClick = (cardId: string) => {
    // Extract the section name from card id (e.g., "ov-sources" -> "sources")
    const section = cardId.startsWith("ov-") ? cardId.slice(3) : cardId;
    navigate(`${ROUTES.NETWORK}/${section}`);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 items-start">
      {cards.map((card) => (
        <CategoryCard
          key={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
          onClick={() => handleCardClick(card.id)}
        />
      ))}
    </div>
  );
}
