import "katex/dist/katex.min.css";

// Imported by MarkdownRenderer only when a post has latex: true.
// Keeping it in a separate file lets Next.js chunk the CSS independently
// so non-math pages never download it.
export default function KatexStyles() {
  return null;
}
