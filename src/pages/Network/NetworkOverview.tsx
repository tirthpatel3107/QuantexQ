import { NetworkSection } from "../../components/network/NetworkSection";
import { NETWORK_SECTION_CARDS as SECTION_CARDS } from "@/utils/constants";

export function NetworkOverview() {
  return <NetworkSection cards={SECTION_CARDS.network} />;
}
