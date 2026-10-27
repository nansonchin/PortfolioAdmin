import type { Project } from "../../../src/types/project";
import { mangaReaderArchitecture } from "./mangaReaderArchitecture";

export const projects: Project[] = [
  {
    id: "book-fairies",
    slug: "book-fairies",
    title: "Book Fairies",
    summary: "A runway-style web showcase built with React, GSAP, and route-based browsing.",
    description:
      "Book Fairies is a frontend web project built around a fashion and runway browsing experience. The repository includes multiple pages such as the home page, latest page, about page, and drop detail routes, with a structured data model for looks and collections.",
    year: 2026,
    category: "Frontend",
    featured: true,
    githubUrl: "https://github.com/nansonchin/BookFairy",
    demoUrl: "https://book-fairy.vercel.app/",
    thumbnail: "/images/projects/bookFairy/thumbnail.webp",
    technologies: ["React", "TypeScript", "GSAP", "React Router", "Vite", "SCSS"],
    heroImage: {
      src: "/images/projects/bookFairy/hero.webp",
      srcSet: `
        /images/projects/bookFairy/hero.webp 480w,
        /images/projects/bookFairy/hero.webp 768w,
        /images/projects/bookFairy/hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/bookFairy/Gallery/G1.webp",
        title: "Home Page",
        description: "Landing experience for the Book Fairies concept.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/bookFairy/Gallery/G2.webp",
        title: "Latest Collection",
        description: "Browse latest looks and drops in a collection-style view.",
      },
      {
        id: "gallery-3",
        imageUrl: "/images/projects/bookFairy/Gallery/G3.webp",
        title: "Drop Detail",
        description: "Detailed viewing experience for an individual item or look.",
      },
    ],
    features: [
      "Route-based web navigation",
      "Runway and look browsing",
      "Collection-style landing experience",
      "Drop detail views",
      "Motion and scroll-driven UI",
      "Structured data-driven interface",
    ],
    responsibilities: [
      "Built the route structure for the application",
      "Created the landing and detail page flow",
      "Worked on the visual presentation and browsing experience",
      "Structured content around look and drop data",
      "Implemented interaction and animation details",
    ],
    challenges: [
      "Designing a clean browsing experience for multiple pages and collections",
      "Structuring data for runway looks and drop details",
      "Managing motion and layout while keeping the UI readable",
      "Creating a coherent flow between home, latest, and detail pages",
    ],
    solutions: [
      "Used React Router to organize pages and detail routes",
      "Created reusable UI components for cards, detail blocks, and navigation",
      "Used GSAP to add motion and transition effects",
      "Kept the data model simple and focused on looks and collections",
    ],
    story: {
      problem:
        "A fashion-themed landing experience needs a clear way to present multiple looks, collections, and detail views without making the interface feel cluttered.",
      approach:
        "The project was structured around a collection-based browsing model with a consistent route flow, reusable UI pieces, and motion-enhanced transitions to improve the visual experience.",
      architecture: [
        "Home and landing page flow",
        "Collection and latest browsing",
        "Drop detail route structure",
        "Look and runway data model",
        "Motion and transition layer",
      ],
      outcome:
        "The project became a complete frontend web experience that demonstrates route handling, motion design, and collection-style presentation in a cohesive interface.",
    },
  },
  {
    id: "manga-reader",
    slug: "manga-reader",
    title: "Manga Reader",
    summary: "A manga reader web project built to practice React, data fetching, and reading flow.",
    description:
      "A frontend web project focused on building a manga browsing and reading experience using React and TanStack Query. The app centers on fetching manga data, presenting chapter information, and creating a smooth reading flow.",
    year: 2026,
    category: "Frontend",
    featured: true,
    githubUrl: "https://github.com/nansonchin/manga-webReactQuery",
    demoUrl: "",
    thumbnail: "/images/projects/mangaReader/thumbnail.webp",
    technologies: ["React", "TypeScript", "TanStack Query", "GSAP", "SCSS", "Vite"],
    heroImage: {
      src: "/images/projects/mangaReader/hero.webp",
      srcSet: `
        /images/projects/mangaReader/hero.webp 480w,
        /images/projects/mangaReader/hero.webp 768w,
        /images/projects/mangaReader/hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/mangaReader/Gallery/gallery-1.webp",
        title: "Home Page",
        description: "Manga browsing layout.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/mangaReader/Gallery/gallery-2.webp",
        title: "Detail Page",
        description: "Manga details and metadata view.",
      },
      {
        id: "gallery-3",
        imageUrl: "/images/projects/mangaReader/Gallery/gallery-3.webp",
        title: "Reader",
        description: "Reading interface and page flow.",
      },
      {
        id: "gallery-4",
        imageUrl: "/images/projects/mangaReader/Gallery/gallery-4.webp",
        title: "Chapter List",
        description: "Chapter list and browsing flow.",
      },
    ],
    features: [
      "Manga browsing UI",
      "Chapter detail and list flow",
      "Reading experience",
      "Data fetching with TanStack Query",
      "Image-heavy content handling",
    ],
    responsibilities: [
      "Built the frontend interface",
      "Worked with API data flow",
      "Practiced query caching and data loading",
      "Structured the reading experience",
    ],
    challenges: [
      "Handling a large number of images",
      "Reducing unnecessary API requests",
      "Keeping the reader readable and responsive",
    ],
    solutions: [
      "Used React Query for caching and request management",
      "Structured the app around manga data and reader flow",
      "Focused on a simple and readable UI",
    ],
    story: {
      problem:
        "A manga reader needs a clean browsing and reading flow while handling data and image-heavy content efficiently.",
      approach:
        "The project was built around a clear data-fetching layer, reader state, and a UI focused on browsing and reading.",
      architecture: [
        "MangaDex API integration",
        "React Query caching",
        "Reader state and page flow",
        "Image rendering and loading strategy",
        "UI navigation and chapter browsing",
      ],
      outcome:
        "The project became a practical example of building a browsing and reading interface with focused data handling and UI structure.",
    },
    architecture: mangaReaderArchitecture,
  },
  {
    id: "portfolio",
    slug: "portfolio",
    title: "Developer Portfolio",
    summary: "A portfolio website built with React and GSAP.",
    description:
      "A personal portfolio website with motion design, case-study style sections, and a terminal-style AI assistant. The project is organized around reusable frontend patterns and a data-driven project showcase.",
    year: 2026,
    category: "Frontend",
    featured: true,
    githubUrl: "https://github.com/nansonchin/PortFolio",
    demoUrl: "",
    thumbnail: "/images/projects/portfolio/thumbnail.webp",
    technologies: ["React", "TypeScript", "GSAP", "Tailwind CSS", "Lenis"],
    heroImage: {
      src: "/images/projects/portfolio/hero.webp",
      srcSet: `
        /images/projects/portfolio/hero.webp 480w,
        /images/projects/portfolio/hero.webp 768w,
        /images/projects/portfolio/hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/portfolio/Gallery/gallery-1.webp",
        title: "Landing Page",
        description: "Portfolio homepage with motion-heavy design.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/portfolio/Gallery/gallery-2.webp",
        title: "Project Detail",
        description: "Project showcase and detail presentation.",
      },
    ],
    features: [
      "Motion-driven portfolio layout",
      "Project showcase pages",
      "Interactive UI",
      "AI assistant integration",
    ],
    responsibilities: [
      "Frontend architecture",
      "Design implementation",
      "Interactive animation work",
      "Portfolio data structure",
    ],
    challenges: [
      "Balancing motion and usability",
      "Structuring reusable portfolio data",
      "Building a responsive interactive experience",
    ],
    solutions: [
      "Reusable component structure",
      "Project-driven data modeling",
      "GSAP-based motion system",
    ],
    story: {
      problem:
        "A portfolio needs to present work clearly while still feeling interactive and polished.",
      approach:
        "The project takes a component-based approach with motion, structured data, and a clear project narrative instead of a standard static portfolio page.",
      architecture: [
        "Portfolio data model",
        "Reusable UI sections",
        "Motion and interaction layer",
        "Project showcase structure",
      ],
      outcome:
        "The result is a portfolio experience that demonstrates both frontend implementation and visual presentation in a single project.",
    },
  },
  {
    id: "taskmanager-j",
    slug: "taskmanager-j",
    title: "Task Manager",
    summary: "A small React project built to practice state management and component structure.",
    description:
      "This project was created as a learning exercise to understand React fundamentals, especially component structure, events, and task state updates.",
    year: 2026,
    category: "Frontend",
    featured: true,
    githubUrl: "https://github.com/nansonchin/taskManagerJ",
    demoUrl: "",
    thumbnail: "/images/projects/taskManager/thumbnail.webp",
    technologies: ["React", "JavaScript", "Vite", "CSS"],
    heroImage: {
      src: "/images/projects/taskManager/hero.webp",
      srcSet: `
        /images/projects/taskManager/hero.webp 480w,
        /images/projects/taskManager/hero.webp 768w,
        /images/projects/taskManager/hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/taskManager/Gallery/gallery-1.webp",
        title: "Task Manager",
        description: "Main task interface.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/taskManager/Gallery/gallery-2.webp",
        title: "Task Creation",
        description: "Add task interaction.",
      },
      {
        id: "gallery-3",
        imageUrl: "/images/projects/taskManager/Gallery/gallery-3.webp",
        title: "Task Interaction",
        description: "Manage and update tasks through React interactions.",
      },
    ],
    features: [
      "Add task",
      "Delete task",
      "Update task state",
      "Task list rendering",
      "Simple React interaction model",
    ],
    responsibilities: [
      "Built a basic task UI",
      "Practiced React state updates",
      "Structured the app into reusable components",
    ],
    challenges: [
      "Understanding how state changes affect the UI",
      "Learning to break the app into smaller components",
      "Handling user events clearly",
    ],
    solutions: [
      "Kept the app small and focused",
      "Used React state for task logic",
      "Built the interface in simple, understandable components",
    ],
    story: {
      problem:
        "A small React app is a good way to learn how state, components, and events work together.",
      approach:
        "The project focused on a simple task workflow: add, update, and remove items while reinforcing the core React mental model.",
      architecture: [
        "Component structure",
        "Task list state",
        "Event handlers",
        "Dynamic rendering",
      ],
      outcome:
        "The project became a practical way to rebuild confidence in React fundamentals.",
    },
  },
  {
    id: "ai-resume",
    slug: "ai-resume",
    title: "AI Resume Analysis",
    summary: "A tutorial-based AI resume analysis app built to explore React, AI, and file upload flow.",
    description:
      "This project was built as a learning exercise to understand how a React app can integrate AI analysis, resume upload, PDF handling, and user feedback flow.",
    year: 2025,
    category: "AI / Frontend",
    featured: true,
    githubUrl: "https://github.com/nansonchin/AI_Resume_Analysis",
    demoUrl: "",
    thumbnail: "/images/projects/AiResume/Thumbnail.webp",
    technologies: [
      "React",
      "TypeScript",
      "React Router",
      "Tailwind CSS",
      "Vite",
      "Zustand",
      "Puter.js",
      "PDF.js",
      "React Dropzone",
    ],
    heroImage: {
      src: "/images/projects/AiResume/Hero.webp",
      srcSet: `
        /images/projects/AiResume/Hero.webp 480w,
        /images/projects/AiResume/Hero.webp 768w,
        /images/projects/AiResume/Hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/AiResume/Gallery/G1.webp",
        title: "Resume Dashboard",
        description: "Dashboard for viewing analyzed resumes.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/AiResume/Gallery/G2.webp",
        title: "Resume Upload",
        description: "Uploading resume and role information.",
      },
      {
        id: "gallery-3",
        imageUrl: "/images/projects/AiResume/Gallery/G3.webp",
        title: "AI Analysis",
        description: "Generated resume feedback and scoring.",
      },
      {
        id: "gallery-4",
        imageUrl: "/images/projects/AiResume/Gallery/G4.webp",
        title: "Feedback Detail",
        description: "Detailed summary of strengths and improvements.",
      },
    ],
    features: [
      "Resume upload",
      "PDF handling",
      "AI analysis flow",
      "Resume scoring and feedback",
      "Upload and review workflow",
    ],
    responsibilities: [
      "Followed tutorial implementation",
      "Built the frontend flow",
      "Used AI and upload features in a practical app",
      "Practiced state management",
    ],
    challenges: [
      "Understanding AI feature integration",
      "Working with PDF and file upload logic",
      "Understanding how results are presented to users",
    ],
    solutions: [
      "Followed a structured tutorial path",
      "Used PDF.js and upload tools to handle files",
      "Built a clean result-display flow",
    ],
    story: {
      problem:
        "AI-assisted resume review is a useful concept, but it needs a clear user flow and good UI structure to be understandable.",
      approach:
        "The project followed a tutorial-style architecture: upload resume, parse and summarize data, analyze against a role, and present feedback in a usable interface.",
      architecture: [
        "Upload flow",
        "PDF processing",
        "AI analysis layer",
        "State management",
        "Results UI",
      ],
      outcome:
        "The project served as a practical exercise in combining frontend development, AI integration, and user interaction.",
    },
  },
  {
    id: "gsap_mojito",
    slug: "gsap_mojito",
    title: "GSAP Mojito",
    summary: "A GSAP learning project focused on motion and landing-page animation.",
    description:
      "A React project created to study GSAP animation, motion timing, and page transitions in a landing page layout.",
    year: 2025,
    category: "Frontend / Animation",
    featured: true,
    githubUrl: "https://github.com/nansonchin/Gsap_Mojito",
    demoUrl: "",
    thumbnail: "/images/projects/Mojito/thumbnail.webp",
    technologies: ["React", "TypeScript", "GSAP", "Vite"],
    heroImage: {
      src: "/images/projects/Mojito/Hero.webp",
      srcSet: `
        /images/projects/Mojito/Hero.webp 480w,
        /images/projects/Mojito/Hero.webp 768w,
        /images/projects/Mojito/Hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/Mojito/Gallery/G1.webp",
        title: "Landing Page",
        description: "Animated landing page build.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/Mojito/Gallery/G2.webp",
        title: "Product Section",
        description: "Motion-driven product presentation.",
      },
      {
        id: "gallery-3",
        imageUrl: "/images/projects/Mojito/Gallery/G3.webp",
        title: "Animated Sections",
        description: "GSAP-based section transitions.",
      },
    ],
    features: [
      "GSAP animation",
      "Timeline control",
      "Animated product section",
      "Landing page motion design",
    ],
    responsibilities: [
      "Practiced animation timing",
      "Built an animated landing page",
      "Studied GSAP-driven transitions",
    ],
    challenges: [
      "Understanding how GSAP interacts with React",
      "Timing different animation sequences",
      "Creating smooth page motion without overcomplicating the structure",
    ],
    solutions: [
      "Used GSAP timelines to coordinate motion",
      "Kept the page layout simple and animation-focused",
      "Targeted DOM elements with refs and animation logic",
    ],
    story: {
      problem:
        "Animated landing pages need timing, structure, and user flow to feel polished without becoming chaotic.",
      approach:
        "The project focused on learning GSAP through a single-page product layout by splitting the content into animated sections and timing interactions carefully.",
      architecture: [
        "Page layout",
        "GSAP timeline",
        "Scroll and motion layers",
        "Content sections",
      ],
      outcome:
        "The project became a study in how animation can shape a webpage's tone and pacing.",
    },
  },
  {
    id: "gsap_award",
    slug: "gsap_award",
    title: "GSAP Award Winning",
    summary: "A GSAP practice project for advanced motion design and animated storytelling.",
    description:
      "This project was built as a motion-design learning exercise using React and GSAP. The emphasis was on timing, transitions, and page flow rather than business logic.",
    year: 2025,
    category: "Frontend / Animation",
    featured: true,
    githubUrl: "https://github.com/nansonchin/Gsap_Award_Winning",
    demoUrl: "",
    thumbnail: "/images/projects/GsapAward/thumbnail.webp",
    technologies: ["React", "TypeScript", "GSAP", "Vite"],
    heroImage: {
      src: "/images/projects/GsapAward/hero.webp",
      srcSet: `
        /images/projects/GsapAward/hero.webp 480w,
        /images/projects/GsapAward/hero.webp 768w,
        /images/projects/GsapAward/hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/GsapAward/Gallery/G1.webp",
        title: "Interactive Landing Page",
        description: "Motion-focused landing page layout.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/GsapAward/Gallery/G2.webp",
        title: "Animated Section",
        description: "Section-based GSAP transition.",
      },
      {
        id: "gallery-3",
        imageUrl: "/images/projects/GsapAward/Gallery/G3.webp",
        title: "Scroll Motion",
        description: "Scroll-based motion experiments.",
      },
    ],
    features: [
      "Animated storytelling sections",
      "Section transitions",
      "Motion-driven landing page",
      "Scroll-based interaction",
    ],
    responsibilities: [
      "Studied advanced motion design concepts",
      "Implemented timeline-based animation sequences",
      "Built the page as a practice project",
    ],
    challenges: [
      "Managing more complex animation timing",
      "Coordinating multiple moving elements",
      "Keeping animations readable instead of overly dense",
    ],
    solutions: [
      "Used GSAP timeline sequencing",
      "Built the experience around motion hierarchy",
      "Kept the structure simple enough to manage",
    ],
    story: {
      problem:
        "A premium-looking landing page requires careful motion design so it feels intentional and not noisy.",
      approach:
        "The build focused on motion composition, section transitions, and timing experiments to create a strong visual rhythm.",
      architecture: [
        "Animated sections",
        "Timeline sequencing",
        "Visual pacing",
        "Transition layer",
      ],
      outcome:
        "The project served as a practical study in motion design language and timing.",
    },
  },
  {
    id: "mika_pikazo",
    slug: "mika_pikazo",
    title: "Mika Pikazo",
    summary: "A portfolio-style project built to explore visual presentation and full-stack basics.",
    description:
      "This project was developed as a portfolio-style web application with a visual focus, routing, and basic backend structure. It combines frontend presentation with API and database-related setup.",
    year: 2025,
    category: "Full Stack",
    featured: true,
    githubUrl: "https://github.com/nansonchin/mikaPikazo",
    demoUrl: "",
    thumbnail: "/images/projects/Mika/thumbnail.webp",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Express",
      "Node.js",
      "PostgreSQL",
      "Axios",
      "JWT",
      "bcrypt",
      "React Router",
      "Swiper",
    ],
    heroImage: {
      src: "/images/projects/Mika/hero.webp",
      srcSet: `
        /images/projects/Mika/hero.webp 480w,
        /images/projects/Mika/hero.webp 768w,
        /images/projects/Mika/hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/Mika/Gallery/G1.webp",
        title: "Artist Landing Page",
        description: "Landing page for a visual portfolio concept.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/Mika/Gallery/G2.webp",
        title: "Artwork Showcase",
        description: "Presentation of artwork and portfolio sections.",
      },
      {
        id: "gallery-3",
        imageUrl: "/images/projects/Mika/Gallery/G3.webp",
        title: "Portfolio Experience",
        description: "Responsive portfolio sections combining artwork, navigation, and supporting content.",
      },
    ],
    features: [
      "Visual portfolio UI",
      "Responsive layout",
      "Artwork showcase",
      "Client-side routing",
      "Backend and API setup",
    ],
    responsibilities: [
      "Built the frontend interface",
      "Worked on visual presentation and layout",
      "Explored backend integration and auth structure",
    ],
    challenges: [
      "Balancing visual design and usability",
      "Handling image-heavy portfolio content",
      "Linking frontend and backend pieces together",
    ],
    solutions: [
      "Structured the project around reusable UI sections",
      "Used routing and content organization for clarity",
      "Added backend and auth-related infrastructure for practice",
    ],
    story: {
      problem:
        "A visual portfolio needs both strong presentation and a clean structure so the content remains usable across devices.",
      approach:
        "The project combined a frontend portfolio experience with a backend scaffold to practice how data and presentation can fit together in a full-stack project.",
      architecture: [
        "Frontend portfolio",
        "Routing layer",
        "API and backend setup",
        "Database and auth structure",
        "Content presentation",
      ],
      outcome:
        "The project served as a practical exploration of portfolio design and full-stack project structure.",
    },
  },
  {
    id: "komori-met",
    slug: "komori-met",
    title: "Komori Met Landing Page",
    summary: "A simple landing page built to practice React UI and section layout.",
    description:
      "A small landing page project created to practice React layout, component structure, and basic interactive UI work.",
    year: 2023,
    category: "Frontend",
    featured: false,
    githubUrl: "https://github.com/nansonchin/KomoriMet-React",
    demoUrl: "",
    thumbnail: "/images/projects/KomoriM/thumbnail.webp",
    technologies: ["React", "JavaScript", "Swiper", "Font Awesome"],
    heroImage: {
      src: "/images/projects/KomoriM/hero.webp",
      srcSet: `
        /images/projects/KomoriM/hero.webp 480w,
        /images/projects/KomoriM/hero.webp 768w,
        /images/projects/KomoriM/hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/KomoriM/Gallery/G1.webp",
        title: "Landing Page",
        description: "Main landing page with content sections.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/KomoriM/Gallery/G2.webp",
        title: "Content Section",
        description: "Basic UI layout and content presentation.",
      },
    ],
    features: [
      "Landing page layout",
      "Basic React UI",
      "Slider interaction",
      "Simple content sections",
    ],
    responsibilities: [
      "Built the landing page",
      "Practiced layout and simple UI structure",
      "Used third-party components for the interaction layer",
    ],
    challenges: [
      "Keeping the structure simple and clear",
      "Integrating reusable UI elements",
      "Learning how a small frontend app is organized",
    ],
    solutions: [
      "Used component-based layout",
      "Added a slider and icons to enrich the interface",
      "Kept the implementation straightforward and focused",
    ],
    story: {
      problem:
        "A simple landing page is a good project for learning how frontend layouts and components work together in a small app.",
      approach:
        "The project focused on building a clear visual structure and adding a few interactive elements without turning the app into something too complex.",
      architecture: [
        "Section layout",
        "Component structure",
        "UI interaction",
        "Simple landing-page flow",
      ],
      outcome:
        "The work helped sharpen the basics of React layout and UI composition.",
    },
  },
  {
    id: "slotmachine",
    slug: "slotmachine",
    title: "Slot Machine",
    summary: "A small browser game built to experiment with React interactivity and game logic.",
    description:
      "A small frontend game project used as a practice exercise in basic interactive design, state transitions, and simple game logic.",
    year: 2025,
    category: "Frontend / Game",
    featured: false,
    githubUrl: "https://github.com/nansonchin/Slotmachine",
    demoUrl: "",
    thumbnail: "/images/projects/Slot/thumbnail.webp",
    technologies: ["React", "JavaScript", "Vite"],
    heroImage: {
      src: "/images/projects/Slot/hero.webp",
      srcSet: `
        /images/projects/Slot/hero.webp 480w,
        /images/projects/Slot/hero.webp 768w,
        /images/projects/Slot/hero.webp 1920w
      `,
      sizes: "(max-width:768px) 100vw, 50vw",
    },
    gallery: [
      {
        id: "gallery-1",
        imageUrl: "/images/projects/Slot/Screenshot_7-10-2026_2326_localhost.webp",
        title: "Game Screen",
        description: "Main game interface.",
      },
      {
        id: "gallery-2",
        imageUrl: "/images/projects/Slot/Screenshot_7-10-2026_23331_localhost.webp",
        title: "Game Interaction",
        description: "User interaction and slot behavior.",
      },
    ],
    features: [
      "Slot machine interaction",
      "Game screen and buttons",
      "State-driven gameplay",
      "Simple browser game logic",
    ],
    responsibilities: [
      "Built the game interface",
      "Created interactive state transitions",
      "Explored React interactivity in a playful project",
    ],
    challenges: [
      "Designing a clear game flow",
      "Managing state updates during gameplay",
      "Keeping the game simple and understandable",
    ],
    solutions: [
      "Used a simple game loop and state model",
      "Structured the UI around clear actions and feedback",
      "Kept the project lightweight and easy to reason about",
    ],
    story: {
      problem:
        "A browser game is a practical way to learn interactive state handling and UI feedback.",
      approach:
        "The project focused on a small, game-like interaction model where state changes drive the result and the interface responds in real time.",
      architecture: [
        "Game UI",
        "State flow",
        "User interaction",
        "Result handling",
      ],
      outcome:
        "The project became a simple learning exercise for interactive React logic and UI response.",
    },
  },
];
