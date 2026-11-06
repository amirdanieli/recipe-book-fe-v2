import type { RichTextSegment } from "../../utils/richText";

export interface RichTextProps {
  /** Text that may contain <strong>/<b>/<em>/<i>/<u>/<br> tags. */
  text: string;
}

export interface RichTextState {
  segments: RichTextSegment[];
}

export type RichTextActions = Record<string, never>;

export interface RichTextLogic {
  state: RichTextState;
  actions: RichTextActions;
}
