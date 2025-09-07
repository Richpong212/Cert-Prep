# Components Organization

This directory follows a well-structured pattern for maintainability:

## Structure

```
src/components/
├── layout/          # Layout components (NavBar, Header, Footer, etc.)
├── features/        # Feature-specific reusable components (Timer, etc.)
├── ui/             # Base UI components (shadcn/ui components)
└── index.ts        # Barrel exports for easy imports
```

## Usage

```typescript
// Import layout components
import { NavBar } from '@/components/layout/NavBar';

// Import feature components  
import { Timer } from '@/components/features/Timer';

// Import UI components directly
import { Button } from '@/components/ui/button';

// Or use barrel exports for multiple components
import { NavBar, Timer } from '@/components';
```

## Guidelines

- **Layout components**: Global layout elements used across multiple pages
- **Feature components**: Reusable components specific to app features
- **UI components**: Basic building blocks (buttons, cards, inputs, etc.)
- Always use semantic design tokens from the design system
- Create focused, single-responsibility components