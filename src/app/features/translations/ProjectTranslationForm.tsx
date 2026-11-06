// src/features/translations/ProjectTranslationForm.tsx
"use client";

import Panel from "@/components/ui/Panel";
import FormActions from "@/features/projects/FormActions";
import { useSectionForm } from "@/features/projects/hooks/useSectionForm";
import { resolvePreviewSrc } from "@/lib/imageUrl";
import {
  getTranslationProgress,
  LIST_KEYS,
  type TranslationFormValues,
  type TranslationListKey,
  type TranslationReference,
} from "@/lib/translation/form";
import { validateProjectTranslation } from "@/lib/validation/projectTranslation";
import TranslateRow from "./TranslateRow";

type Props = {
  projectId: string;
  initialValues: TranslationFormValues;
  reference: TranslationReference;
};

const LIST_LABELS: Record<TranslationListKey, string> = {
  features: "Feature",
  responsibilities: "Responsibility",
  challenges: "Challenge",
  solutions: "Solution",
};

export default function ProjectTranslationForm({ projectId, initialValues, reference }: Props) {
  const form = useSectionForm<TranslationFormValues>({
    endpoint: `/api/projects/${encodeURIComponent(projectId)}/translations/zh`,
    initialValues,
    validate: validateProjectTranslation,
  });

  const { values, errors, setField } = form;
  const progress = getTranslationProgress(reference, values);
  const percent = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100);

  // ---------- 更新的小函式 ----------
  // 表单的值是「嵌套」的，React 要求不能直接修改，每一层都要展开成新物件。
  // 这几个函式把「改某一格」包起来，画面里只要写「哪一格、新内容」。

  /** 改一个列表的某一项。
   *  setListItem("features", 1, "图片预加载")：features ["a","","c"] → ["a","图片预加载","c"] */
  function setListItem(key: TranslationListKey, index: number, text: string) {
    setField(
      key,
      values[key].map((item, i) => (i === index ? text : item)),
    );
  }

  function setStory(patch: Partial<TranslationFormValues["story"]>) {
    setField("story", { ...values.story, ...patch });
  }

  function setStoryNote(index: number, text: string) {
    setStory({
      architecture: values.story.architecture.map((item, i) => (i === index ? text : item)),
    });
  }

  /** setGalleryField("gallery-1", "title", "首页")
   *  gallery: { "gallery-1": { title: "", ... } } → { "gallery-1": { title: "首页", ... } } */
  function setGalleryField(id: string, field: "title" | "description", text: string) {
    const current = values.gallery[id] ?? { title: "", description: "" };
    setField("gallery", { ...values.gallery, [id]: { ...current, [field]: text } });
  }

  function setArchitectureField(field: "title" | "description", text: string) {
    if (!values.architecture) return;
    setField("architecture", { ...values.architecture, [field]: text });
  }

  function setNodeField(id: string, field: "title" | "description" | "details", text: string) {
    if (!values.architecture) return;
    const current = values.architecture.nodes[id] ?? { title: "", description: "", details: "" };

    setField("architecture", {
      ...values.architecture,
      nodes: { ...values.architecture.nodes, [id]: { ...current, [field]: text } },
    });
  }

  return (
    <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
      <Panel title="Text" tag="title · summary · description">
        <div className="space-y-6">
          <TranslateRow
            id="tr-title"
            label="Title"
            english={reference.title}
            value={values.title}
            onChange={(next) => setField("title", next)}
            error={errors.title}
          />
          <TranslateRow
            id="tr-summary"
            label="Summary"
            english={reference.summary}
            value={values.summary}
            onChange={(next) => setField("summary", next)}
            multiline
            rows={3}
            error={errors.summary}
          />
          <TranslateRow
            id="tr-description"
            label="Description"
            english={reference.description}
            value={values.description}
            onChange={(next) => setField("description", next)}
            multiline
            rows={6}
            error={errors.description}
          />
        </div>
      </Panel>

      <Panel title="Lists" tag="features · responsibilities · challenges · solutions">
        <div className="space-y-10">
          {LIST_KEYS.map((key) =>
            reference[key].length === 0 ? null : (
              <section key={key} className="space-y-6">
                <h3 className="font-display text-xl text-paper">{LIST_LABELS[key]}s</h3>
                {reference[key].map((english, index) => (
                  <TranslateRow
                    key={`${key}-${index}`}
                    id={`tr-${key}-${index}`}
                    label={`${LIST_LABELS[key]} ${index + 1}`}
                    english={english}
                    value={values[key][index] ?? ""}
                    onChange={(next) => setListItem(key, index, next)}
                    multiline
                    rows={2}
                    error={errors[`${key}.${index}`]}
                  />
                ))}
              </section>
            ),
          )}
        </div>
      </Panel>

      <Panel title="Story" tag="problem · approach · notes · outcome">
        <div className="space-y-6">
          <TranslateRow
            id="tr-story-problem"
            label="Problem"
            english={reference.story.problem}
            value={values.story.problem}
            onChange={(next) => setStory({ problem: next })}
            multiline
            rows={5}
            error={errors["story.problem"]}
          />
          <TranslateRow
            id="tr-story-approach"
            label="Approach"
            english={reference.story.approach}
            value={values.story.approach}
            onChange={(next) => setStory({ approach: next })}
            multiline
            rows={5}
            error={errors["story.approach"]}
          />
          {reference.story.architecture.map((english, index) => (
            <TranslateRow
              key={`note-${index}`}
              id={`tr-story-note-${index}`}
              label={`Architecture note ${index + 1}`}
              english={english}
              value={values.story.architecture[index] ?? ""}
              onChange={(next) => setStoryNote(index, next)}
              multiline
              rows={2}
              error={errors[`story.architecture.${index}`]}
            />
          ))}
          <TranslateRow
            id="tr-story-outcome"
            label="Outcome"
            english={reference.story.outcome}
            value={values.story.outcome}
            onChange={(next) => setStory({ outcome: next })}
            multiline
            rows={5}
            error={errors["story.outcome"]}
          />
        </div>
      </Panel>

      {reference.gallery.length > 0 && (
        <Panel title="Gallery" tag={`${reference.gallery.length} images`}>
          <div className="space-y-10">
            {reference.gallery.map((image, index) => {
              const preview = resolvePreviewSrc(image.imageUrl);
              const entry = values.gallery[image.id] ?? { title: "", description: "" };

              return (
                <section key={image.id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden border border-line bg-ink">
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="hud-label text-gold-dim">No preview</span>
                      )}
                    </div>
                    <h3 className="font-display text-xl text-paper">
                      Image {String(index + 1).padStart(2, "0")}
                    </h3>
                  </div>

                  <TranslateRow
                    id={`tr-gallery-${image.id}-title`}
                    label="Title"
                    english={image.title}
                    value={entry.title}
                    onChange={(next) => setGalleryField(image.id, "title", next)}
                    error={errors[`gallery.${image.id}.title`]}
                  />
                  <TranslateRow
                    id={`tr-gallery-${image.id}-description`}
                    label="Description"
                    english={image.description}
                    value={entry.description}
                    onChange={(next) => setGalleryField(image.id, "description", next)}
                    multiline
                    rows={2}
                    error={errors[`gallery.${image.id}.description`]}
                  />
                </section>
              );
            })}
          </div>
        </Panel>
      )}

      {reference.architecture && values.architecture && (
        <Panel title="Architecture" tag={`${reference.architecture.nodes.length} nodes`}>
          <div className="space-y-8">
            <TranslateRow
              id="tr-arch-title"
              label="Diagram title"
              english={reference.architecture.title}
              value={values.architecture.title}
              onChange={(next) => setArchitectureField("title", next)}
              error={errors["architecture.title"]}
            />
            <TranslateRow
              id="tr-arch-description"
              label="Diagram description"
              english={reference.architecture.description}
              value={values.architecture.description}
              onChange={(next) => setArchitectureField("description", next)}
              multiline
              rows={3}
              error={errors["architecture.description"]}
            />

            {/* 摊平的节点清单：depth 决定缩排，一看就知道谁是谁的孩子 */}
            {reference.architecture.nodes.map((node) => {
              const entry = values.architecture?.nodes[node.id] ?? {
                title: "",
                description: "",
                details: "",
              };
              const base = `architecture.nodes.${node.id}`;

              return (
                <section
                  key={node.id}
                  className="space-y-4 border-l border-line pl-4"
                  style={{ marginLeft: node.depth * 16 }}
                >
                  <h3 className="font-display text-lg text-paper">{node.title}</h3>
                  <TranslateRow
                    id={`tr-node-${node.id}-title`}
                    label="Title"
                    english={node.title}
                    value={entry.title}
                    onChange={(next) => setNodeField(node.id, "title", next)}
                    error={errors[`${base}.title`]}
                  />
                  <TranslateRow
                    id={`tr-node-${node.id}-description`}
                    label="Description"
                    english={node.description}
                    value={entry.description}
                    onChange={(next) => setNodeField(node.id, "description", next)}
                    error={errors[`${base}.description`]}
                  />
                  <TranslateRow
                    id={`tr-node-${node.id}-details`}
                    label="Details"
                    english={node.details}
                    value={entry.details}
                    onChange={(next) => setNodeField(node.id, "details", next)}
                    multiline
                    rows={3}
                    error={errors[`${base}.details`]}
                  />
                </section>
              );
            })}
          </div>
        </Panel>
      )}

      {/* 底部固定的保存列：页面很长，不用滚到最下面才能保存，也随时看得到完成度 */}
      <div className="sticky bottom-0 z-20 -mx-6 bg-ink/90 px-6 pb-4 backdrop-blur md:-mx-10 md:px-10">
        <div className="mb-2 flex items-center justify-between pt-4">
          <span className="hud-label text-gold-dim">
            {progress.done} / {progress.total} fields translated
          </span>
          <span className="hud-label text-gold">{percent}%</span>
        </div>
        <div className="h-1 bg-line">
          <div className="h-full bg-gold transition-all" style={{ width: `${percent}%` }} />
        </div>
        <FormActions
          dirty={form.dirty}
          saving={form.saving}
          message={form.message}
          onDiscard={form.handleDiscard}
        />
      </div>
    </form>
  );
}