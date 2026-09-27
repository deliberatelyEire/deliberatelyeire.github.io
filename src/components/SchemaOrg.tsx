interface SchemaOrgProps {
  schemas: object | object[];
}

export function SchemaOrg({ schemas }: SchemaOrgProps) {
  const arr = Array.isArray(schemas) ? schemas : [schemas];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(arr) }}
    />
  );
}