/**
 * Application route paths. Use these for navigation and route definitions
 * to keep URLs consistent and easy to change.
 */
export const ROUTES = {
  HOME: "/",
  PROFILE: "/profile",
  MUD_PROPERTIES: "/mud-properties",
  SETTINGS: "/settings",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
