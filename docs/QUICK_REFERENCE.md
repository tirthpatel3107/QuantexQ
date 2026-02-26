# Quick Reference Guide

## Common Import Paths

### Components
```typescript
// Shared UI components
import { Button } from '@/shared/components/Button';
import { Modal } from '@/shared/components/Modal';
import { PageLoader } from '@/shared/components/Loader';
import { PageLayout } from '@/shared/components/Layout';

// Feature components
import { SettingsPage } from '@/features/settings';
import { NetworkPage } from '@/features/network';
```

### Hooks
```typescript
// Shared hooks
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useToast } from '@/shared/components/Toast';

// Feature hooks
import { useSettings } from '@/features/settings';
import { useSimulation } from '@/features/simulation';
```

### Constants & Config
```typescript
import { ROUTES } from '@/shared/constants/routes';
import { COLORS } from '@/shared/constants/colors';
import { ENV } from '@/config/env';
import { APP_CONFIG } from '@/config/app.config';
```

### Services
```typescript
import { api } from '@/services/api/client';
import { socket } from '@/services/socket/client';
```

### Types
```typescript
import type { ApiResponse } from '@/shared/types/api';
import type { Settings } from '@/features/settings/types';
```

## File Locations

| Old Path | New Path |
|----------|----------|
| `src/components/common/*` | `src/shared/components/*` |
| `src/components/ui/*` | `src/shared/components/*` |
| `src/constants/*` | `src/shared/constants/*` |
| `src/hooks/*` | `src/shared/hooks/*` |
| `src/utils/*` | `src/shared/utils/*` |
| `src/context/Settings/*` | `src/features/settings/context/*` |
| `src/pages/Settings/*` | `src/features/settings/pages/*` |
| `src/pages/Index.tsx` | `src/pages/Dashboard.tsx` |

## Creating New Components

### Shared Component
```bash
# Create folder
mkdir src/shared/components/MyComponent

# Create files
touch src/shared/components/MyComponent/{MyComponent.tsx,index.ts}
```

```typescript
// MyComponent.tsx
export function MyComponent() {
  return <div>My Component</div>;
}

// index.ts
export { MyComponent } from './MyComponent';
```

### Feature Component
```bash
# Create in feature folder
touch src/features/my-feature/components/MyFeatureComponent.tsx
```

## Creating New Features

```bash
# Create feature structure
mkdir -p src/features/my-feature/{components,hooks,services,pages,context}

# Create core files
touch src/features/my-feature/{types.ts,index.ts}
touch src/features/my-feature/pages/MyFeature.tsx
```

```typescript
// index.ts - Public API
export { default as MyFeaturePage } from './pages/MyFeature';
export { useMyFeature } from './hooks/useMyFeature';
export type * from './types';

// types.ts
export interface MyFeatureState {
  // Define state
}

// pages/MyFeature.tsx
export default function MyFeature() {
  return <div>My Feature</div>;
}
```

## Adding Routes

```typescript
// app/routes.tsx
import MyFeature from '@/features/my-feature/pages/MyFeature';

// Add to Routes
<Route path="/my-feature" element={<MyFeature />} />
```

## Adding Providers

```typescript
// app/providers/MyProvider.tsx
export function MyProvider({ children }) {
  return <Context.Provider>{children}</Context.Provider>;
}

// app/providers/index.tsx
export { MyProvider } from './MyProvider';

// App.tsx
import { MyProvider } from '@/app/providers';

<MyProvider>
  {/* app content */}
</MyProvider>
```

## Common Patterns

### API Service
```typescript
// features/my-feature/services/myFeatureService.ts
import { api } from '@/services/api/client';

export const myFeatureService = {
  getAll: () => api.get('/my-feature'),
  getById: (id: string) => api.get(`/my-feature/${id}`),
  create: (data: any) => api.post('/my-feature', data),
  update: (id: string, data: any) => api.put(`/my-feature/${id}`, data),
  delete: (id: string) => api.delete(`/my-feature/${id}`),
};
```

### Custom Hook
```typescript
// features/my-feature/hooks/useMyFeature.ts
import { useQuery } from '@tanstack/react-query';
import { myFeatureService } from '../services/myFeatureService';

export function useMyFeature() {
  return useQuery({
    queryKey: ['my-feature'],
    queryFn: myFeatureService.getAll,
  });
}
```

### Context Provider
```typescript
// features/my-feature/context/MyFeatureContext.tsx
import { createContext, useContext, useState } from 'react';

const MyFeatureContext = createContext(null);

export function MyFeatureProvider({ children }) {
  const [state, setState] = useState({});
  
  return (
    <MyFeatureContext.Provider value={{ state, setState }}>
      {children}
    </MyFeatureContext.Provider>
  );
}

export const useMyFeature = () => useContext(MyFeatureContext);
```

## Troubleshooting

### Import not found
1. Check path alias in `tsconfig.json`
2. Verify file exists at expected location
3. Check `index.ts` exports
4. Restart TypeScript server

### Type errors after migration
1. Update import paths
2. Check type exports in `index.ts`
3. Verify type definitions exist

### Build errors
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Test
npm run test
```

## VS Code Tips

### Organize Imports
`Shift + Alt + O` - Organize imports

### Auto Import
Type component name, VS Code will suggest import

### Go to Definition
`F12` or `Ctrl + Click` - Jump to definition

### Find All References
`Shift + F12` - Find all usages

## Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture
2. Follow [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) for migration steps
3. Check [scripts/migrate-structure.md](../scripts/migrate-structure.md) for automation
