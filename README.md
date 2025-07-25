# vue-frontend

This project is a modern Vue 3 frontend application, designed for scalability, accessibility, and maintainability. It leverages Vite for lightning-fast development and build times, TypeScript for type safety, Pinia for state management, and Tailwind CSS for utility-first styling. The project is structured to support modular development and easy integration with external component libraries.

---

## About the App

This application is a starter template for building modern web apps with authentication and content management.  
**Key features:**
- **User authentication:** Includes login, registration, and email verification flows.
- **Backend integration:** Connects to a headless [Strapi](https://strapi.io/) backend for user management and content APIs.
- **Secure:** Handles authentication tokens and user sessions securely.
- **Extensible:** Easily add more features or connect to additional Strapi collections.

---

## Features

- **Vue 3 + Vite**: Fast, modern frontend stack.
- **TypeScript**: Type-safe codebase for fewer runtime errors.
- **Pinia**: State management for scalable apps.
- **Vue Router**: File-based routing for easy navigation.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Dark Mode**: Easily toggle dark mode using the `.dark` class.
- **Component Library Integration**: Ready to use external libraries like `@justawebdev/histoire-library`.
- **Accessible Design**: Color palette and components optimized for accessibility.
- **Authentication**: Login, registration, and email verification with Strapi backend.

---

## Project Structure

```
src/
  assets/         # Static assets (images, CSS)
  composables/    # Reusable logic (composables)
  layouts/        # Layout components
  router/         # Vue Router configuration
  stores/         # Pinia stores (state management)
  types/          # TypeScript interfaces and types
  views/          # Page components (including Auth views)
  App.vue         # Root component
  main.ts         # App entry point
```

---

## Tailwind CSS Setup

Tailwind CSS is imported in [`src/assets/main.css`](src/assets/main.css):

```css
@import 'tailwindcss';
```

**Dark mode** is configured to use the `.dark` class selector for maximum flexibility:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This means you can toggle dark mode by adding or removing the `dark` class on the `<html>` or `<body>` element.

---

## Using Component Libraries

This project is set up to consume external Vue component libraries, such as [`@justawebdev/histoire-library`](https://github.com/justaweb-dev/histoire-library):

- Install or link the library (see their README for details).
- Import the library's CSS in your [`src/main.ts`](src/main.ts):

  ```ts
  import '@justawebdev/histoire-library/dist/histoire-comp-lib.css'
  ```

- Import and use components as needed:

  ```ts
  import { HButton } from '@justawebdev/histoire-library'
  ```

---

## Development

### Project Setup

```bash
pnpm install
```

### Compile and Hot-Reload for Development

```bash
pnpm dev
```

### Type-Check, Compile and Minify for Production

```bash
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```bash
pnpm lint
```

---

## Accessibility & Color Palette

- **Light mode:** Uses salmon tones for backgrounds and accents.
- **Dark mode:** Uses dark grays and neon colors for high contrast.
- All components and color choices are optimized for WCAG AA accessibility.

---

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) with [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur).

---

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we use `vue-tsc` for type checking. In editors, [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) is recommended.

---

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

---

## License

MIT

---