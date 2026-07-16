"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Code } from "lucide-react";

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  category: string;
  author: string;
  coverImage: string;
  isPublished: boolean;
}

interface Props {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => void;
  saving: boolean;
  error: string;
  submitLabel: string;
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-700 placeholder-gray-400";
const labelCls = "text-[10px] font-semibold text-gray-400 uppercase tracking-widest";

// Helper functions for Plain Text <-> HTML conversion
function parseInline(text: string): string {
  let res = text;
  // Bold **text**
  res = res.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic *text*
  res = res.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Links [text](url)
  res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return res;
}

function markdownToHtml(md: string): string {
  if (!md) return "";
  const text = md.replace(/\r\n/g, "\n");
  const blocks = text.split(/\n\s*\n/);
  const htmlBlocks: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Headings
    if (trimmed.startsWith("## ")) {
      htmlBlocks.push(`<h2>${parseInline(trimmed.substring(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      htmlBlocks.push(`<h3>${parseInline(trimmed.substring(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      htmlBlocks.push(`<h2>${parseInline(trimmed.substring(2))}</h2>`);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      htmlBlocks.push(`<blockquote>${parseInline(trimmed.substring(2))}</blockquote>`);
      continue;
    }

    // Unordered List
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const lines = trimmed.split("\n");
      const listItems = lines.map(line => {
        const itemText = line.replace(/^[-*]\s+/, "");
        return `  <li>${parseInline(itemText)}</li>`;
      });
      htmlBlocks.push(`<ul>\n${listItems.join("\n")}\n</ul>`);
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(trimmed)) {
      const lines = trimmed.split("\n");
      const listItems = lines.map(line => {
        const itemText = line.replace(/^\d+\.\s+/, "");
        return `  <li>${parseInline(itemText)}</li>`;
      });
      htmlBlocks.push(`<ol>\n${listItems.join("\n")}\n</ol>`);
      continue;
    }

    // Custom check for table/div tags to pass through
    if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
      htmlBlocks.push(trimmed);
      continue;
    }

    // Paragraph with soft breaks mapped to <br />
    const content = parseInline(trimmed).replace(/\n/g, "<br />");
    htmlBlocks.push(`<p>${content}</p>`);
  }

  return htmlBlocks.join("\n");
}

function htmlToMarkdown(html: string): string {
  if (!html) return "";
  let res = html;

  // Lists
  res = res.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, p1) => {
    const listItems = p1.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    return "\n" + listItems.map((li: string) => {
      const content = li.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "$1");
      return `- ${content.trim()}`;
    }).join("\n") + "\n\n";
  });

  res = res.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, p1) => {
    const listItems = p1.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    let idx = 1;
    return "\n" + listItems.map((li: string) => {
      const content = li.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "$1");
      return `${idx++}. ${content.trim()}`;
    }).join("\n") + "\n\n";
  });

  // Headings
  res = res.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n");
  res = res.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n");
  res = res.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "## $1\n\n");

  // Blockquotes
  res = res.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n\n");

  // Paragraphs
  res = res.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n");

  // Inline formatting
  res = res.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  res = res.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
  res = res.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  res = res.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");

  // Links
  res = res.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // Breaks
  res = res.replace(/<br\s*\/?>/gi, "\n");

  res = res
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  res = res.replace(/\n{3,}/g, "\n\n").trim();
  return res;
}

export default function BlogForm({ initialData, onSubmit, saving, error, submitLabel }: Props) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    bodyHtml: initialData?.bodyHtml ?? "",
    category: initialData?.category ?? "Term Insurance",
    author: initialData?.author ?? "Priya Sharma",
    coverImage: initialData?.coverImage ?? "",
    isPublished: initialData?.isPublished ?? false,
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [editorMode, setEditorMode] = useState<"text" | "html">("text");
  const [bodyText, setBodyText] = useState(() => htmlToMarkdown(initialData?.bodyHtml ?? ""));

  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setFormData((prev) => {
      const updated: BlogFormData = { ...prev, title: titleVal };
      if (!prev.slug || prev.slug === slugify(prev.title)) {
        updated.slug = slugify(titleVal);
      }
      return updated;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/);
      let titleIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== "") {
          titleIndex = i;
          break;
        }
      }

      if (titleIndex !== -1) {
        const rawTitle = lines[titleIndex].trim();
        const cleanTitle = rawTitle.replace(/^#+\s*/, "");
        
        const bodyLines = lines.slice(titleIndex + 1);
        const rawBodyText = bodyLines.join("\n").trim();

        setFormData(prev => {
          const updated = {
            ...prev,
            title: cleanTitle,
            slug: slugify(cleanTitle),
            bodyHtml: markdownToHtml(rawBodyText),
          };
          return updated;
        });
        setBodyText(rawBodyText);
        setEditorMode("text");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleModeChange = (mode: "text" | "html") => {
    if (mode === editorMode) return;
    if (mode === "html") {
      setFormData((prev) => ({ ...prev, bodyHtml: markdownToHtml(bodyText) }));
    } else {
      setBodyText(htmlToMarkdown(formData.bodyHtml));
    }
    setEditorMode(mode);
  };

  const handleBodyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBodyText(val);
    setFormData((prev) => ({ ...prev, bodyHtml: markdownToHtml(val) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalHtml = editorMode === "text" ? markdownToHtml(bodyText) : formData.bodyHtml;
    onSubmit({
      ...formData,
      bodyHtml: finalHtml,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
          <h2 className="text-sm font-bold text-gray-900">Basic Information</h2>
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-[11px] font-bold text-blue-600 cursor-pointer transition-colors">
            <span>Import .txt / .md File</span>
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Post Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. Complete Guide to Term Insurance in India"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelCls}>Slug (URL friendly)</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
              placeholder="e.g. term-insurance-guide"
              className={formData.slug ? inputCls : `${inputCls} border-red-300 bg-red-50/20`}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={inputCls}
            >
              <option value="Term Insurance">Term Insurance</option>
              <option value="Health Insurance">Health Insurance</option>
              <option value="Motor Insurance">Motor Insurance</option>
              <option value="Life Insurance">Life Insurance</option>
              <option value="Car Insurance">Car Insurance</option>
              <option value="Two Wheeler Insurance">Two Wheeler Insurance</option>
              <option value="Family Health Insurance">Family Health Insurance</option>
              <option value="Group Health Insurance">Group Health Insurance</option>
              <option value="Travel Insurance">Travel Insurance</option>
              <option value="Home Insurance">Home Insurance</option>
              <option value="Term Insurance for Women">Term Insurance for Women</option>
              <option value="Return of Premium Term Plans">Return of Premium Term Plans</option>
              <option value="Guaranteed Return Plans">Guaranteed Return Plans</option>
              <option value="Child Savings Plans">Child Savings Plans</option>
              <option value="Retirement Plans">Retirement Plans</option>
              <option value="Guides">Guides</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelCls}>Author Name</label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Author's name..."
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelCls}>Cover Image URL</label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="e.g. /images/blog/cover.jpg (optional)"
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Short Excerpt</label>
          <textarea
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="A brief summary of the blog post shown in the listing grid..."
            className={inputCls}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-gray-900">Blog Content</h2>
            <div className="flex bg-gray-100 border border-gray-200 rounded-lg p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleModeChange("text")}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  editorMode === "text" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Plain Text
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("html")}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  editorMode === "html" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                HTML Code
              </button>
            </div>
          </div>
          <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-0.5 text-xs font-semibold self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === "edit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Live Preview
            </button>
          </div>
        </div>

        {activeTab === "edit" ? (
          <div className="flex flex-col gap-2">
            {editorMode === "text" ? (
              <>
                <textarea
                  required
                  rows={15}
                  value={bodyText}
                  onChange={handleBodyTextChange}
                  placeholder="Paste or write plain text here... Use double spacing between paragraphs.
Use ## for headings.
Use - for bullet points.
Use **bold** for emphasis."
                  className={`${inputCls} font-sans text-sm`}
                />
                <p className="text-[10px] text-gray-400 leading-normal">
                  Note: Write or paste plain text. It will be converted to HTML automatically.
                  Use <code>## Heading</code> for titles, <code>- item</code> for bullet points, <code>1. item</code> for lists, and <code>**bold**</code> or <code>*italic*</code> for formatting.
                </p>
              </>
            ) : (
              <>
                <textarea
                  required
                  rows={15}
                  value={formData.bodyHtml}
                  onChange={(e) => setFormData({ ...formData, bodyHtml: e.target.value })}
                  placeholder="<h2>Heading</h2><p>Write your HTML code here...</p>"
                  className={`${inputCls} font-mono text-xs`}
                />
                <p className="text-[10px] text-gray-400 leading-normal">
                  Note: You are editing raw HTML. You can use standard elements like <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code>, <code>&lt;strong&gt;</code>, and <code>&lt;table&gt;</code>.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-6 min-h-[300px]">
            <article
              className="
                text-gray-700 text-sm leading-relaxed max-w-none
                [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-5 [&_h3]:mb-2
                [&_p]:mb-4 [&_p]:leading-[1.7]
                [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:list-disc
                [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:list-decimal
                [&_li]:leading-relaxed
                [&_strong]:font-bold [&_strong]:text-gray-900
                [&_em]:italic [&_em]:text-gray-600
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 [&_blockquote]:pl-4 [&_blockquote]:my-5 [&_blockquote]:text-gray-500 [&_blockquote]:italic
                [&_table]:w-full [&_table]:text-xs [&_table]:mb-6 [&_table]:border-collapse
                [&_thead]:bg-gray-100
                [&_th]:font-bold [&_th]:text-gray-700 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:border-b-2 [&_th]:border-gray-200
                [&_td]:px-3 [&_td]:py-2 [&_td]:border-b [&_td]:border-gray-100 [&_td]:text-gray-600
              "
              dangerouslySetInnerHTML={{ __html: formData.bodyHtml || '<p class="text-gray-400 italic">No content to preview</p>' }}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.isPublished ? "bg-emerald-500" : "bg-gray-200"}`}
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${formData.isPublished ? "translate-x-4" : "translate-x-1"}`} />
          </button>
          <div>
            <p className="text-xs font-semibold text-gray-800">Publish Immediately</p>
            <p className="text-[10px] text-gray-400">If disabled, the post will save as a Draft.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="text-xs font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2 shadow-sm"
          >
            {saving ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
