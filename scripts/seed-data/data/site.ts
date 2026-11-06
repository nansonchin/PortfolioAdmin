// scripts/seed-data/site.ts
//
// 从作品集复制：data/profile.ts 的 profile、data/developerContext.ts 的 developerContext、
// il8n/contents/zh.ts 的 profileZh 和 developerContextZh。

import type {
  DeveloperContext,
  DeveloperContextTranslation,
  Profile,
  ProfileTranslation,
} from "../../../src/types/site";

export const profile: Profile = {
  headline: ["I try builded interfaces", "I try to study design"],
  intro: [
    "I' m a frontend developer with an IT diploma and a little background in UI/UX design. I like about thespace between design and engineering:  interfaces that are fast, well structured.",
    "Late I've been combining  React, TypeScript and GSAP with AI integration. This portfolio is the proof of concept: visitors can simply ask JARVIS to take them anywhere",
  ],
  location: "",
  status: "Open",
  email: "",
  github: "https://github.com/nansonchin",
  linkedin: "",
  focus: ["React", "TypeScript", "Vue", "AI Integration"],
  skillGroups: [
    { title: "Frontend", items: ["React", "TypeScript", "Vue", "Tailwind CSS", "SCSS"] },
    { title: "Motion", items: ["GSAP", "ScrollTrigger", "Lenis", "Interaction design"] },
    { title: "Data & Tooling", items: ["TanStack Query", "Vite", "Git", "REST APIs"] },
    { title: "AI", items: ["Gemini API", "Function calling", "Prompt design"] },
  ],
};

export const developerContext: DeveloperContext = {
  name: "Chin",
  role: "Frontend Developer",
  description: "",
  background: ["IT Diploma", "Frontend Development", "UI/UX Design Experience"],
  skills: ["React", "Typescript", "Tailwind CSS", "Vue"],
  goals: [
    "Building high performance frontend applications",
    "Learning AI intergration",
    "Improving system architecture",
  ],
};

export const profileZh: ProfileTranslation = {
  headline: ["我构建界面", "我钻研设计"],
  intro: [
    "我是一名前端开发者，拥有 IT 文凭，也有一点 UI/UX 设计背景。我喜欢设计与工程之间的那片空间：快速、结构清晰的界面。",
    "最近我在把 React、TypeScript 和 GSAP 与 AI 集成结合起来。这个作品集就是概念验证：访客只需要让 JARVIS 带路，就能去任何地方。",
  ],
  status: "开放合作",
  skillGroupTitles: {
    Frontend: "前端",
    Motion: "动效",
    "Data & Tooling": "数据与工具",
    AI: "AI",
  },
};

export const developerContextZh: DeveloperContextTranslation = {
  role: "前端开发者",
  background: ["IT 文凭", "前端开发", "UI/UX 设计经验"],
  goals: ["构建高性能的前端应用", "学习 AI 集成", "改进系统架构"],
};