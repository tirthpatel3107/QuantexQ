import { CategoryCard } from "@/components/dashboard/CategoryCard";

interface DaqSectionProps {
  cards: { id: string; title: string; description: string; icon: React.ElementType }[];
}

export function DaqSection({ cards }: DaqSectionProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start mb-4">
      {cards.map((card) => (
        <CategoryCard
          key={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
