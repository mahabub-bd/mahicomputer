/**
 * Renders schema.org JSON-LD. Escapes "<" so admin-entered content can
 * never break out of the <script> tag.
 */
const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);

export default JsonLd;
