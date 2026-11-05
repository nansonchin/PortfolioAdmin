import type { ProjectTranslation } from "../../src/types/translation";

export const projectsZh: Record<string, ProjectTranslation> = {
  "manga-reader": {
    summary: "基于 React Query 构建的高性能漫画阅读器",
    description:
      "一个 React 项目，使用 TanStack Query、无限滚动、图片预加载、虚拟化渲染，并接入 MangaDex API。",
    features: ["无限章节加载", "优化的图片渲染", "阅读器性能系统"],
    responsibilities: ["前端架构", "API 集成", "性能优化"],
    gallery: {
      "gallery-1": { title: "首页", description: "Manga Reader 的落地页。" },
      "gallery-2": { title: "详情页", description: "项目详情界面。" },
      "gallery-3": { title: "阅读器", description: "长条漫画阅读体验。" },
      "gallery-4": { title: "章节列表", description: "无限章节加载。" },
    },
    architecture: {
      title: "Manga Reader 架构",
      description: "分层架构，将漫画数据、应用逻辑、渲染和用户界面的职责分开。",
      nodes: {
        "manga-reader": {
          description: "用于浏览和阅读漫画的 Web 应用。",
        },
        "data-layer": {
          title: "数据层",
          description: "获取并管理远程数据。",
        },
      },
    },
  },
};