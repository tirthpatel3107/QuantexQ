# Project Architecture

## Overview

This project follows a feature-based architecture pattern that promotes scalability, maintainability, and clear separation of concerns.

## Directory Structure

### `/src/app`
Application-level configuration and setup.

- **`/providers`**: All React context providers (Theme, Query, Simulation, etc.)
- **`/routes.tsx`**: Centralized route definitions
- **`/store`**: Global state management (if using Redux/Zustand)

### `/src/features`
Feature modules - each feature is self-contained with its own components, hooks, services, and types.

```
features/
├── settings/
│   ├── components/      # Feature-specific components
│   ├── hooks/          # Feature-specific hooks
│   ├── services/       # API calls for this feature
│   ├── context/        # Feature context (if needed)
│   ├── pages/          # Page components
│   ├── types.ts        # Feature types
│   └── index.ts        # Public API
```

**Benefits:**
- Easy to locate feature-related code
- Can be developed/tested in isolation
- Clear boundaries between features
- Easy to add/remove features

### `/src/shared`
Shared resources used across multiple features.

- **`/components`**: Reusable UI components organized by type
  - Button, Modal, Toast, Loader, Form, Table, Layout, etc.
- **`/hooks`**: Shared custom hooks
- **`/utils`**: Utility functions
- **`/constants`**: Application constants
- **`/types`**: Shared TypeScript types

### `/src/services`
External service integrations.

- **`/api`**: HTTP client setup, interceptors, endpoints
- **`/socket`**: WebSocket/Socket.io setup

### `/src/pages`
Top-level page components that compose features.

- Dashboard.tsx
- Profile.tsx
- NotFound.tsx

### `/src/config`
Application configuration.

- **`env.ts`**: Environment variables
- **`app.config.ts`**: App-wide configuration

### `/src/assets`
Static assets.

- `/images`
- `/icons`
- `/styles`

## Import Patterns

### Absolute Imports
Use path aliases for cleaner imports:

```typescript
// ✅ Good
import { Button } from '@/shared/components/Button';
import { useSettings } from '@/features/settings';
import { API_URL } from '@/config/env';

// ❌ Avoid
import { Button } from '../../../shared/components/Button';
```

### Feature Exports
Each feature exports its public API through `index.ts`:

```typescript
// features/settings/index.ts
export { default as SettingsPage } from './pages/Settings';
export { useSettings } from './hooks/useSettings';
export { SettingsProvider } from './context/SettingsContext';
export type * from './types';
```

Usage:
```typescript
import { SettingsPage, useSettings } from '@/features/settings';
```

## Component Organization

### Shared Components
Organized by component type in separate folders:

```
shared/components/
├── Button/
│   ├── button.tsx          # Base button (shadcn/ui)
│   ├── CommonButton.tsx    # App-specific button wrapper
│   └── index.ts            # Exports
├── Modal/
│   ├── dialog.tsx
│   ├── CommonDialog.tsx
│   └── index.ts
```

### Feature Components
Keep feature-specific components within the feature:

```
features/settings/
├── components/
│   ├── SettingsForm.tsx
│   ├── SettingsSidebar.tsx
│   └── index.ts
```

## State Management

### Local State
Use React hooks (useState, useReducer) for component-local state.

### Feature State
Use React Context for feature-level state:

```typescript
// features/settings/context/SettingsContext.tsx
export const SettingsProvider = ({ children }) => {
  // Feature state logic
};

export const useSettings = () => useContext(SettingsContext);
```

### Global State
Use app-level providers or state management library:

```typescript
// app/providers/QueryProvider.tsx
export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

## API Integration

### Service Layer
Centralize API calls in service files:

```typescript
// features/settings/services/settingsService.ts
export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
};
```

### Usage in Components
```typescript
import { settingsService } from '@/features/settings/services';

const { data } = useQuery({
  queryKey: ['settings'],
  queryFn: settingsService.getSettings,
});
```

## Type Safety

### Feature Types
Define types within features:

```typescript
// features/settings/types.ts
export interface Settings {
  theme: 'light' | 'dark';
  language: string;
}
```

### Shared Types
Common types in shared folder:

```typescript
// shared/types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

## Testing Strategy

### Unit Tests
Test components and hooks in isolation:
```
features/settings/
├── components/
│   ├── SettingsForm.tsx
│   └── SettingsForm.test.tsx
```

### Integration Tests
Test feature modules as a whole.

### E2E Tests
Test complete user flows across features.

## Best Practices

1. **Keep features independent**: Avoid direct imports between features
2. **Use shared resources**: Extract common code to `/shared`
3. **Consistent naming**: Follow established naming conventions
4. **Type everything**: Leverage TypeScript for type safety
5. **Export through index**: Use barrel exports for clean imports
6. **Colocate related code**: Keep related files close together
7. **Document complex logic**: Add comments for non-obvious code

## Migration from Old Structure

See [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) for detailed migration steps.

## Adding a New Feature

1. Create feature folder: `src/features/my-feature/`
2. Add subfolders: `components/`, `hooks/`, `services/`, `pages/`
3. Create `types.ts` for feature types
4. Create `index.ts` for public exports
5. Add route in `app/routes.tsx`
6. Add provider if needed in `app/providers/`

Example:
```bash
mkdir -p src/features/my-feature/{components,hooks,services,pages}
touch src/features/my-feature/{types.ts,index.ts}
```

## Resources

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Feature-Sliced Design](https://feature-sliced.design/)
