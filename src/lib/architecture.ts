import type { ArchitectureNode, ProjectArchitecture } from "@/types/project";
import { moveItem } from "./array";

export type NodePatch = Partial<Pick<ArchitectureNode, "title" | "description" | "details">>;


export function updateNode(
  node: ArchitectureNode,
  id: string,
  patch: NodePatch,
): ArchitectureNode {
  if (node.id === id) return { ...node, ...patch };
  if (!node.children) return node; 

  return {
    ...node,
    children: node.children.map((child) => updateNode(child, id, patch)),
  };
}

export function addChild(
  node: ArchitectureNode,
  parentId: string,
  child: ArchitectureNode,
): ArchitectureNode {
  if (node.id === parentId) {
    return { ...node, children: [...(node.children ?? []), child] };
  }
  if (!node.children) return node;

  return {
    ...node,
    children: node.children.map((c) => addChild(c, parentId, child)),
  };
}

export function removeNode(node: ArchitectureNode, id: string): ArchitectureNode {
  if (!node.children) return node;

  return {
    ...node,
    children: node.children
      .filter((child) => child.id !== id)
      .map((child) => removeNode(child, id)),
  };
}

export function moveNode(
  node: ArchitectureNode,
  id: string,
  delta: -1 | 1,
): ArchitectureNode {
  if (!node.children) return node;

  const index = node.children.findIndex((child) => child.id === id);

  if (index !== -1) {
    return { ...node, children: moveItem(node.children, index, delta) };
  }

  return {
    ...node,
    children: node.children.map((child) => moveNode(child, id, delta)),
  };
}

export function countNodes(node: ArchitectureNode): number {
  return 1 + (node.children ?? []).reduce((sum, child) => sum + countNodes(child), 0);
}

export function getDepth(node: ArchitectureNode): number {
  return 1 + Math.max(0, ...(node.children ?? []).map(getDepth));
}

function collectIds(node: ArchitectureNode, into: string[] = []): string[] {
  into.push(node.id);
  for (const child of node.children ?? []) collectIds(child, into);
  return into;
}

export function findDuplicateIds(root: ArchitectureNode): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const id of collectIds(root)) {
    if (seen.has(id)) duplicates.add(id);
    else seen.add(id);
  }

  return [...duplicates];
}

function normalizeNode(node: ArchitectureNode): ArchitectureNode {
  const description = node.description?.trim();
  const details = node.details?.trim();
  const children = (node.children ?? []).map(normalizeNode);

  return {
    id: node.id,
    title: node.title.trim(),
    ...(description ? { description } : {}),
    ...(details ? { details } : {}),
    ...(children.length > 0 ? { children } : {}),
  };
}

export function normalizeArchitecture(architecture: ProjectArchitecture): ProjectArchitecture {
  return {
    title: architecture.title.trim(),
    description: architecture.description.trim(),
    root: normalizeNode(architecture.root),
  };
}

export function flattenNodes(
  root:ArchitectureNode,
  depth=0
):{node:ArchitectureNode; depth:number}[]{
  return [
    {node: root,depth},
    ...(root.children??[]).flatMap((child)=>flattenNodes(child,depth+1))
  ]
}