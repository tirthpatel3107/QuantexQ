import { NetworkSection } from "../components/NetworkSection";
import { SECTION_CARDS } from "../constants";

export function NetworkOverview() {
  return <NetworkSection cards={SECTION_CARDS.network} />;
}
