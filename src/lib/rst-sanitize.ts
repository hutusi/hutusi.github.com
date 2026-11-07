import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  ...(sanitizeHtml.defaults.allowedTags ?? []),
  'section',
  'img',
  'source',
  'figure',
  'figcaption',
  'aside',
  // Tabbed code groups (CSS-only via radio + label). Without these on the
  // allowlist, the rST path drops to stacked code blocks with no tabs.
  // transformTags below restricts `input` to type="radio" only.
  'input',
  'label',
  // MathML (KaTeX output). Deliberately NOT annotation-xml: with a free-form
  // encoding attribute it is a known mXSS surface, and nothing we render
  // emits it (KaTeX uses <annotation encoding="application/x-tex">).
  'math',
  'annotation',
  'maction',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mi',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mprescripts',
  'mroot',
  'mrow',
  'ms',
  'mspace',
  'msqrt',
  'mstyle',
  'msub',
  'msubsup',
  'msup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'semantics',
];

// Shiki emits inline `style="--shiki-light:#...; --shiki-dark:#..."` CSS vars on
// every token <span> when running in dual-theme mode, plus our custom transformers
// add `data-language`, `data-line-numbers`, `data-highlighted-line`, and `data-title`
// to <pre>/<span>. Stripping any of these silently kills syntax highlighting in rST
// output while leaving Markdown unaffected — covered by RstRenderer.test.tsx.
const codeBlockAttrs = ['style', 'data-language', 'data-line', 'data-line-numbers', 'data-highlighted-line', 'data-title', 'tabindex'];

const allowedAttributes: sanitizeHtml.IOptions['allowedAttributes'] = {
  ...sanitizeHtml.defaults.allowedAttributes,
  '*': ['id', 'class', 'title', 'lang', 'dir', 'role', 'aria-label', 'aria-hidden'],
  a: ['href', 'name', 'target', 'rel', 'id', 'class', 'title'],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'decoding', 'class', 'id'],
  source: ['src', 'srcset', 'type'],
  td: ['colspan', 'rowspan', 'align'],
  th: ['colspan', 'rowspan', 'align', 'scope'],
  ol: ['start', 'reversed', 'type'],
  li: ['value'],
  math: ['display', 'xmlns'],
  annotation: ['encoding'],
  pre: ['class', 'style', ...codeBlockAttrs],
  code: ['class', 'style', ...codeBlockAttrs],
  span: ['class', 'style', ...codeBlockAttrs],
  div: ['class', 'style', 'data-group-id', 'data-panel', ...codeBlockAttrs],
  // Tabbed code groups: input is restricted to type=radio via transformTags.
  // Defense-in-depth: even if an unexpected attr slips in, the CSS-only tab
  // mechanism can't do anything dangerous with a stray radio button.
  input: ['type', 'name', 'id', 'checked', 'data-idx', 'aria-controls', 'tabindex', 'class'],
  label: ['for', 'class', 'role', 'aria-controls', 'tabindex', 'data-cg-icon'],
};

/**
 * Sanitize docutils-rendered rST HTML for embedding via dangerouslySetInnerHTML
 * (RstRenderer) or a feed's <content:encoded> (feed-utils). One shared config:
 * the allowlist decisions above are load-bearing for Shiki output and the
 * radio-tab code groups, and the two consumers must not drift apart.
 */
export function sanitizeRenderedRstHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    allowProtocolRelative: false,
    transformTags: {
      // Restrict <input> to type="radio" only. Anything else gets stripped.
      // Prevents an rST author from injecting password/file/etc. inputs.
      input: (tagName, attribs) => {
        if (attribs.type !== 'radio') {
          return { tagName: 'span', attribs: {} };
        }
        return { tagName, attribs };
      },
    },
  });
}
