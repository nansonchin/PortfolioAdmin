import { ArchitectureNode, ProjectArchitectureSection } from "@/types/project";
import z from "zod";
import { countNodes, findDuplicateIds, getDepth } from "../architecture";
import { ValidationResult } from "./shared";
import { issuesToFieldErrors } from "./projectBasic";

const MAX_NODES=100;
const MAX_DEPTH = 8;

const nodeSchema: z.ZodType<ArchitectureNode> = z.lazy(() =>
  z.object({
    id: z.string().trim().min(1, "Missing node id").max(100),
    title: z.string().trim().min(1, "Title is required").max(80, "Max 80 characters"),
    description: z.string().max(300, "Max 300 characters").optional(),
    details: z.string().max(2000, "Max 2000 characters").optional(),
    children: z.array(nodeSchema).max(30, "At most 30 children per node").optional(),
  }),
);
export const projectArchitectureSchema = z
  .object({
    architecture: z
      .object({
        title: z.string().trim().min(1, "Title is required").max(120, "Max 120 characters"),
        description: z.string().trim().max(1000, "Max 1000 characters"),
        root: nodeSchema,
      })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const architecture = data.architecture;
    if (!architecture) return;

    const { root } = architecture;

    if (countNodes(root) > MAX_NODES) {
      ctx.addIssue({
        code: "custom",
        path: ["architecture", "root"],
        message: `At most ${MAX_NODES} nodes in total`,
      });
    }

    if (getDepth(root) > MAX_DEPTH) {
      ctx.addIssue({
        code: "custom",
        path: ["architecture", "root"],
        message: `At most ${MAX_DEPTH} levels deep`,
      });
    }

    if (findDuplicateIds(root).length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["architecture", "root"],
        message: "Duplicate node ids found",
      });
    }
  });

export type ProjectArchitectureFormValues = ProjectArchitectureSection;

export function validateProjectArchitecture(
  values: ProjectArchitectureFormValues,
): ValidationResult {
  const result = projectArchitectureSchema.safeParse(values);

  return result.success
    ? { ok: true }
    : { ok: false, errors: issuesToFieldErrors(result.error.issues) };
}