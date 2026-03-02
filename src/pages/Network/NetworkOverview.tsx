// Components - Local
import { NetworkSection } from "../../components/network/NetworkSection";

// Constants
import { NETWORK_SECTION_CARDS as SECTION_CARDS } from "@/utils/constants";

/**
 * NetworkOverview Component
 *
 * Displays a grid of cards providing a high-level overview of the Network module.
 *
 * @returns JSX.Element
 */
export function NetworkOverview() {
  return <NetworkSection cards={SECTION_CARDS.network} />;
}
