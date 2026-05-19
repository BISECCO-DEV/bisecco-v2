type Schema = Record<string, unknown>;

/**
 * Injecte un (ou plusieurs) bloc(s) JSON-LD schema.org.
 * Usage : <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", ... }} />
 */
export function JsonLd({ data }: { data: Schema | Schema[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
