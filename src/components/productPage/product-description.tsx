type ProductDescriptionProps = {
  html: string;
};

export function ProductDescription({ html }: ProductDescriptionProps) {
  if (!html) return null;

  return (
    <div className="mt-6">
      <h3 className="sr-only">Description</h3>

      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="space-y-6 text-base text-gray-700"
      />
    </div>
  );
}
