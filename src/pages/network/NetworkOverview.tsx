// React & Hooks

// Form & Validation

// Hooks

// Third-party

// Components - UI

// Components - Common

// Components - Local
import { NetworkSection } from "@/components/features/network/NetworkSection";

// Services & API

// Types & Schemas

// Contexts

// Utils & Constants
import { NETWORK_SECTION_CARDS as SECTION_CARDS } from "@/utils/constants";

// Icons & Utils


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
