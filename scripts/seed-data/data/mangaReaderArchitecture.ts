import type { ProjectArchitecture as ProjectArchitectureModel } from "../../../src/types/project";

export const mangaReaderArchitecture: ProjectArchitectureModel = {
  title: "Manga Reader Architecture",
  description:
    "A layered architecture designed to separate manga data, application logic, rendering, and user interface responsibilities.",
  root: {
    id: "manga-reader",
    title: "Manga Reader",
    description: "A web application for browsing and reading manga.",
    details:
      "The application brings together data fetching, reader state, image rendering, and navigation into a single manga-reading experience.",
    children: [
      {
        id: "data-layer",
        title: "Data Layer",
        description: "Fetching and managing remote data.",
        details:
          "The data layer communicates with the MangaDex API and uses TanStack Query to manage server-state requests and caching.",
        children: [
          {
            id: "mangadex",
            title: "MangaDex API",
            description: "Remote manga data source.",
            details:
              "Provides manga metadata, cover relationships, chapter information, and chapter page data through API requests.",
          },
          {
            id: "tanstack-query",
            title: "TanStack Query",
            description: "Server-state and cache management.",
            details:"Manages asynchronous server state, query caching, loading and error states, and request reuse. Query keys should reflect the resource being fetched.",
          },
        ],
      },
      {
        id: "logic-layer",
        title: "Logic Layer",
        description: "Reusable application behaviour.",
        details:
          "Custom hooks encapsulate reusable fetching, navigation, and reader behaviour so UI components do not need to own every piece of application logic.",
        children: [
          {
            id: "custom-hooks",
            title: "Custom Hooks",
            description: "Reusable React logic.",
            details:
              "Encapsulate repeatable behaviours such as chapter fetching, keyboard navigation, and reader page coordination.",
          },
          {
            id: "reader-state",
            title: "Reader State",
            description: "Current page and navigation state.",
            details:
              "Coordinates reader-related state such as the current page and navigation targets. Keep server data and local interaction state separate where practical.",
          },
        ],
      },
      {
        id: "render-layer",
        title: "Rendering Layer",
        description: "Efficient page and image rendering.",
        details:
          "The rendering layer controls which reader images are mounted, how they are loaded, and how nearby pages are prepared for navigation.",
        children: [
          {
            id: "virtualization",
            title: "Virtualization",
            description: "Limits mounted reader content.",
            details:
              "Renders the relevant portion of a long page list instead of mounting every page at once, helping control DOM size and rendering work.",
          },
          {
            id: "image-pipeline",
            title: "Image Pipeline",
            description: "Image loading and display.",
            details:
              "Coordinates image loading, responsive image sources, loading feedback, and failure handling. Browser caching can help avoid unnecessary repeat downloads.",
          },
        ],
      },
      {
        id: "ui-layer",
        title: "UI Layer",
        description: "User-facing reading experience.",
        details:
          "Presents manga browsing and reading controls while relying on the data and logic layers for application behaviour.",
        children: [
          {
            id: "reader-ui",
            title: "Reader Interface",
            description: "The interface used to read chapters.",
            details:
              "Displays chapter pages and reader navigation. Components should focus on presentation and user interaction while reusable hooks handle shared behaviour.",
          },
        ],
      },
    ],
  },
};