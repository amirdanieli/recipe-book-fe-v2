/**
 * Minimal, safe handling of the few HTML formatting tags that can appear in
 * recipe text (e.g. "<strong>Grandma's</strong> pancakes").
 *
 * We never inject HTML into the page. Text is split into plain-text segments
 * with formatting flags, which React renders as real elements. Any tag that
 * isn't on the allow-list is dropped, so stored markup can't run scripts.
 */

export type RichTextFormat = "bold" | "italic" | "underline";

export interface RichTextSegment {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

const FORMAT_TAGS: Record<string, RichTextFormat> = {
  strong: "bold",
  b: "bold",
  em: "italic",
  i: "italic",
  u: "underline",
};

/** Tags that should become a line break (rendered via `white-space: pre-line`). */
const LINE_BREAK_TAGS = new Set(["br", "p", "div", "li"]);

// Anything that looks like an HTML tag: <tag>, </tag>, <tag attr="x">, <br/>.
// Requires a letter after "<" so text like "1 < 2" or "<3" is left alone.
const TAG_PATTERN = /<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

const decodeEntities = (text: string) =>
  text.replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (entity) => ENTITIES[entity] ?? entity);

export const parseRichText = (input: string): RichTextSegment[] => {
  const segments: RichTextSegment[] = [];
  const active: Record<RichTextFormat, boolean> = { bold: false, italic: false, underline: false };

  const pushText = (raw: string) => {
    if (!raw) return;
    const text = decodeEntities(raw);
    const last = segments[segments.length - 1];
    if (
      last &&
      last.bold === active.bold &&
      last.italic === active.italic &&
      last.underline === active.underline
    ) {
      last.text += text;
    } else {
      segments.push({ text, ...active });
    }
  };

  let cursor = 0;
  for (const match of input.matchAll(TAG_PATTERN)) {
    const [fullTag, slash, rawName] = match;
    const name = rawName.toLowerCase();
    pushText(input.slice(cursor, match.index));
    cursor = match.index + fullTag.length;

    const format = FORMAT_TAGS[name];
    if (format) {
      // A closing tag turns the format off. An opening tag while the format
      // is already on also turns it off, which handles "<strong>x<strong>".
      active[format] = slash ? false : !active[format];
    } else if (LINE_BREAK_TAGS.has(name) && (name === "br" || slash)) {
      pushText("\n");
    }
    // Any other tag is dropped.
  }
  pushText(input.slice(cursor));

  return segments;
};

/** Plain text with all tags removed, for alt text, confirm dialogs, etc. */
export const stripRichText = (input: string): string =>
  parseRichText(input)
    .map((segment) => segment.text)
    .join("");
