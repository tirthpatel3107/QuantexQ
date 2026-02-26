# Automated Migration Steps

## Manual Steps Required

Due to the complexity of this refactor, here are the recommended manual steps:

### 1. Move Constants (Low Risk)
```bash
# Move constants to shared
mv src/constants src/shared/constants
```

### 2. Move Hooks (Low Risk)
```bash
# Move hooks to shared
mv src/hooks src/shared/hooks
```

### 3. Move Utils (Low Risk)
```bash
# Move utils to shared
mv src/utils src/shared/utils
```

### 4. Reorganize Shared Components (Medium Risk)

Create component folders:
```bash
mkdir -p src/shared/components/{Button,Modal,Toast,Loader,Form,Table,Layout,Sidebar,Tooltip}
```

Move UI components:
- `src/components/ui/button.tsx` → `src/shared/components/Button/button.tsx`
- `src/components/ui/dialog.tsx` → `src/shared/components/Modal/dialog.tsx`
- `src/components/ui/toast.tsx` → `src/shared/components/Toast/toast.tsx`
- `src/components/ui/toaster.tsx` → `src/shared/components/Toast/toaster.tsx`
- `src/components/ui/sonner.tsx` → `src/shared/components/Toast/sonner.tsx`
- `src/components/ui/tooltip.tsx` → `src/shared/components/Tooltip/tooltip.tsx`
- `src/components/common/PageLoader.tsx` → `src/shared/components/Loader/PageLoader.tsx`

### 5. Create Feature Modules (High Risk - Do Carefully)

#### Settings Feature
```bash
mkdir -p src/features/settings/{components,hooks,services,pages}
mv src/pages/Settings src/features/settings/pages/Settings
mv src/context/Settings src/features/settings/context
```

#### Network Feature
```bash
mkdir -p src/features/network/{components,hooks,services,pages}
mv src/pages/Network src/features/network/pages/Network
mv src/context/Network src/features/network/context
```

#### DAQ Feature
```bash
mkdir -p src/features/daq/{components,hooks,services,pages}
mv src/pages/DAQ src/features/daq/pages/DAQ
mv src/context/DAQ src/features/daq/context
```

#### Mud Properties Feature
```bash
mkdir -p src/features/mud-properties/{components,hooks,services,pages}
mv src/pages/MudProperties src/features/mud-properties/pages/MudProperties
mv src/context/MudProperties src/features/mud-properties/context
```

#### Simulation Feature
```bash
mkdir -p src/features/simulation/{context,hooks,types}
mv src/context/Simulation src/features/simulation/context
```

### 6. Update Imports

Use find and replace in your IDE:

**Constants:**
- Find: `@/constants/`
- Replace: `@/shared/constants/`

**Hooks:**
- Find: `@/hooks/`
- Replace: `@/shared/hooks/`

**Utils:**
- Find: `@/utils/`
- Replace: `@/shared/utils/`

**Common Components:**
- Find: `@/components/common/`
- Replace: `@/shared/components/`

**UI Components:**
- Find: `@/components/ui/button`
- Replace: `@/shared/components/Button/button`

(Repeat for each UI component)

**Context Imports:**
- Find: `@/context/Settings`
- Replace: `@/features/settings/context`

(Repeat for each feature)

### 7. Update tsconfig.json

Add these path aliases:
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
      "@/types/*": ["./src/types/*"],
      "@/pages/*": ["./src/pages/*"]
    }
  }
}
```

### 8. Test After Each Phase

```bash
# Check for TypeScript errors
npm run lint

# Try to build
npm run build

# Run tests
npm run test
```

### 9. Clean Up Old Folders

After verifying everything works:
```bash
# Remove old folders (ONLY after verification)
rm -rf src/components/common
rm -rf src/components/ui
rm -rf src/context
```

## Recommended Order

1. ✅ Setup new structure (DONE)
2. Move constants → Test
3. Move hooks → Test
4. Move utils → Test
5. Create one feature module → Test
6. Create remaining feature modules → Test
7. Reorganize shared components → Test
8. Clean up old folders

## Safety Tips

- Commit after each successful phase
- Use Git branches for the migration
- Keep the old structure until fully verified
- Test thoroughly before removing old folders
