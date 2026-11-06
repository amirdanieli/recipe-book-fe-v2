import type { ReactNode } from "react";
import { useRichTextLogic } from "./RichTextLogic";
import type { RichTextProps } from "./RichTextTypes";

/** Renders text with safe inline formatting (no raw HTML is ever injected). */
const RichText = (props: RichTextProps) => {
  const { state } = useRichTextLogic(props);

  return (
    <>
      {state.segments.map((segment, index) => {
        let node: ReactNode = segment.text;
        if (segment.underline) node = <u>{node}</u>;
        if (segment.italic) node = <em>{node}</em>;
        if (segment.bold) node = <strong>{node}</strong>;
        return <span key={index}>{node}</span>;
      })}
    </>
  );
};

export default RichText;
