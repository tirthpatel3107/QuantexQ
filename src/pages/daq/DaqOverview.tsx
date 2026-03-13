// React & Hooks

// Form & Validation

// Hooks

// Third-party

// Components - UI

// Components - Common

// Components - Local
import { CategoryCard } from "@/components/features/dashboard/CategoryCard";

// Services & API

// Types & Schemas

// Contexts

// Utils & Constants
import { DAQ_SECTION_CARDS } from "@/utils/constants";

// Icons & Utils

export function DaqOverview() {
  // const navigate = useNavigate();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-start">
      {DAQ_SECTION_CARDS.daq.map((card) => (
        <CategoryCard
          key={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
          // onClick={() =>
          //   navigate(`${ROUTES.DAQ}/${card.id.replace("ov-", "")}`)
          // }
        />
      ))}
    </div>
  );
}
