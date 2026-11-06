import { useMemo } from "react";
import { parseRichText } from "../../utils/richText";
import type { RichTextLogic, RichTextProps } from "./RichTextTypes";

export const useRichTextLogic = ({ text }: RichTextProps): RichTextLogic => {
  const segments = useMemo(() => parseRichText(text ?? ""), [text]);
  return { state: { segments }, actions: {} };
};
