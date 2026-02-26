# Project Restructuring Migration Guide

## Overview
This guide outlines the migration from the current structure to a feature-based architecture for better scalability and maintainability.

## New Structure

```
src/
├── app/                    # Application setup
│   ├── providers/         # All context providers
│   ├── store/            # State management (if needed)
│   └── routes.tsx        # Route definitions
│
├── features/             # Feature modules
│   ├── settings/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── pages/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── network/
│   ├── daq/
│   ├── mud-properties/
│   └── simulation/
│
├── shared/               # Shared resources
│   ├── components/      # Reusable UI components
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Toast/
│   │   ├── Loader/
│   │   └── Tooltip/
│   ├── hooks/           # Shared hooks
│   ├── utils/           # Utility functions
│   ├── constants/       # App constants
│   └── types/           # Shared types
│
├── services/            # External services
│   ├── api/
│   │   ├── client.ts
│   │   ├── interceptors.ts
│   │   └── endpoints.ts
│   └── socket/
│
├── pages/               # Top-level page components
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   └── NotFound.tsx
│
├── assets/              # Static assets
│   ├── images/
│   ├── icons/
│   └── styles/
│
├── config/              # Configuration
│   ├── env.ts
│   └── app.config.ts
│
├── types/               # Global types
└── main.tsx
```

## Migration Steps

### Phase 1: Setup New Structure (COMPLETED)
- ✅ Created `app/` folder with providers and routes
- ✅ Created `config/` folder
- ✅ Updated App.tsx to use new structure

### Phase 2: Move Shared Components
**From:** `src/components/common/` and `src/components/ui/`
**To:** `src/shared/components/`

Organize by component type:
- Button components → `shared/components/Button/`
- Modal/Dialog → `shared/components/Modal/`
- Toast → `shared/components/Toast/`
- Loader → `shared/components/Loader/`
- Form components → `shared/components/Form/`
- Table → `shared/components/Table/`
- Layout → `shared/components/Layout/`

### Phase 3: Move Constants
**From:** `src/constants/`
**To:** `src/shared/constants/`

### Phase 4: Move Hooks
**From:** `src/hooks/`
**To:** `src/shared/hooks/`

### Phase 5: Move Utils
**From:** `src/utils/`
**To:** `src/shared/utils/`

### Phase 6: Create Feature Modules

#### Settings Feature
**From:** `src/pages/Settings/`, `src/context/Settings/`
**To:** `src/features/settings/`
```
features/settings/
├── components/        # Settings-specific components
├── hooks/            # useSettings, etc.
├── services/         # Settings API calls
├── pages/            # Settings.tsx
├── types.ts          # Settings types
└── index.ts          # Public exports
```

#### Network Feature
**From:** `src/pages/Network/`, `src/context/Network/`
**To:** `src/features/network/`

#### DAQ Feature
**From:** `src/pages/DAQ/`, `src/context/DAQ/`
**To:** `src/features/daq/`

#### Mud Properties Feature
**From:** `src/pages/MudProperties/`, `src/context/MudProperties/`
**To:** `src/features/mud-properties/`

#### Simulation Feature
**From:** `src/context/Simulation/`
**To:** `src/features/simulation/`

### Phase 7: Move Dashboard Components
**From:** `src/components/dashboard/`
**To:** `src/pages/Dashboard/components/` or create `src/features/dashboard/`

### Phase 8: Update Services
**Current:** `src/services/`
**Action:** Reorganize into cleaner structure
```
services/
├── api/
│   ├── client.ts         # Axios instance
│   ├── interceptors.ts   # Request/response interceptors
│   └── endpoints.ts      # API endpoints
└── socket/
    └── client.ts         # Socket.io setup
```

### Phase 9: Update Imports
Update all import paths throughout the codebase:
- `@/components/common/*` → `@/shared/components/*`
- `@/components/ui/*` → `@/shared/components/*`
- `@/constants/*` → `@/shared/constants/*`
- `@/hooks/*` → `@/shared/hooks/*`
- `@/utils/*` → `@/shared/utils/*`
- `@/context/*` → `@/features/*/context/*` or `@/app/providers/*`

## Import Path Aliases

Update `tsconfig.json` paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/services/*": ["./src/services/*"],
      "@/config/*": ["./src/config/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

## Benefits

1. **Feature Isolation**: Each feature is self-contained with its own components, hooks, and services
2. **Scalability**: Easy to add new features without cluttering the codebase
3. **Maintainability**: Clear separation of concerns
4. **Reusability**: Shared components are clearly identified
5. **Testing**: Easier to test features in isolation
6. **Team Collaboration**: Multiple developers can work on different features without conflicts

## Next Steps

1. Run the migration script (to be created)
2. Update all imports
3. Test each feature module
4. Update documentation
5. Remove old folders after verification

## Rollback Plan

If issues arise:
1. Git revert to previous commit
2. Address specific issues
3. Retry migration in smaller chunks
