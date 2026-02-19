import { CategoryCard } from "@/components/dashboard/CategoryCard";

interface NetworkSectionProps {
  cards: {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
}

export function NetworkSection({ cards }: NetworkSectionProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 items-start">
      {cards.map((card) => (
        <CategoryCard
          key={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
          onClick={() => {}}
        />
      ))}
    </div>
  );
}
