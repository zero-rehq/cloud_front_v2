Welcome to your new TanStack app!

# Cloud Front v2

A modern React application featuring:
- 🎯 **Feature-first architecture** for scalable codebase organization
- 🔄 **Redux Toolkit** for normalized state management
- ⚡ **Realtime updates** via Socket.IO with automatic reconnection
- 🎨 **Design system** with CVA (class-variance-authority)
- 🌐 **TanStack Router** for type-safe, file-based routing
- 🎭 **Tailwind CSS v4** with custom control tokens
- 📦 **Bun** for fast package management

# Getting Started

To run this application:

```bash
bun install
bun --bun run dev
```

The app will be available at http://localhost:3000

# Building For Production

To build this application for production:

```bash
bun --bun run build
```

Preview the production build:

```bash
bun --bun run serve
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun --bun run test
```

## Styling

This project uses [Tailwind CSS v4](https://tailwindcss.com/) with custom control tokens for consistent form styling across the application.

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
bun --bun run lint
bun --bun run format
bun --bun run check
```

## Project Structure

```
src/
  components/
    system/          # Reusable design system components (Button, Input, Card)
    layout/          # Layout components (Header, Footer)
  features/          # Feature-first domains (articles, tags, lists, locals)
    articles/
      components/    # Article-specific components
      hooks/         # Article-specific hooks
      services/      # Article API services
      schemas/       # Article types
  store/             # Redux Toolkit store
    middleware/      # Event router for realtime
    slices/          # Feature slices (articles, tags, etc.)
  rt/                # Realtime transport layer (Socket.IO)
  routes/            # TanStack Router routes
  styles/            # Global styles and control tokens
```

## Key Features

### State Management
Uses Redux Toolkit with normalized state via EntityAdapter. Each feature has its own slice created with the `makeCrudSlice` factory.

### Realtime Updates
Socket.IO integration with automatic reconnection and exponential backoff. Events are routed to Redux automatically.

### Design System (FarmaConnect Theme)

The project uses the **FarmaConnect** color palette with a unified design system:

**Color Palette:**
- 🔵 **Primary:** #0099D8 (Celestial Blue) - Light mode
- 🟠 **Primary:** #FDA042 (Sandy Brown) - Dark mode
- 🟠 **Secondary:** #FDA042 (Sandy Brown)
- 🔴 **Error:** #D32F2F
- 🟡 **Warning:** #EC9005 (Carrot Orange)
- 🟢 **Success:** #43A047

**CVA-based Components:**
All components in `src/components/system/` provide a consistent API:

```tsx
// Buttons
<Button variant="primary" size="md">Guardar</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="destructive">Eliminar</Button>

// Inputs
<Input size="lg" placeholder="Email..." />
<Input invalid={hasError} />

// Selects
<Select size="md">
  <option>Opción 1</option>
</Select>

// Textareas
<Textarea size="md" resize="vertical" />

// Cards
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
</Card>
```

**Design Tokens:**
The project uses semantic design tokens that automatically adapt to light/dark mode:
- Semantic tokens: `--background`, `--foreground`, `--primary`, `--secondary`
- Control tokens: `--control-bg`, `--control-border`, `--control-shadow`
- Surface tokens: `--surface-primary-95`, `--surface-primary-90`, `--surface-primary-65`

**📘 Full documentation:** See [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)

**Tailwind Utilities:**
```tsx
// Opacity (replaces legacy fade variables)
<div className="bg-primary/20 text-primary/70">

// Surface with primary mix
<div className="bg-[--surface-primary-95]">

// Animations
<div className="animate-fade-in animate-wiggle">
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
bun install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
bun install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
# cloud_front_v2
