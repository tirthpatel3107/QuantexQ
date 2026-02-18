import { DaqSection } from "../components/DaqSection";
import { SECTION_CARDS } from "../constants";

export function DaqOverview() {
  return <DaqSection cards={SECTION_CARDS.daq} />;
}
