import { NetworkSection } from "../components/NetworkSection";
import { NETWORK_SECTION_CARDS as SECTION_CARDS } from "@/constants";

export function NetworkOverview() {
  return <NetworkSection cards={SECTION_CARDS.network} />;
}
