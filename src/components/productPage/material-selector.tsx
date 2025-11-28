'use client';

type MaterialSelectorProps = {
  materials: string[];
  value?: string;
  onChange?: (value: string) => void;
};

export function MaterialSelector({
  materials,
  value,
  onChange,
}: MaterialSelectorProps) {
  if (!materials.length) return null;

  const normalize = (val: string) => val.trim().toLowerCase();
  const selectedValue = value ?? materials[0] ?? "";

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-600">Material</h3>

      <fieldset aria-label="Choose a material" className="mt-2">
        <div className="flex flex-wrap items-center gap-3">
          {materials.map((material, index) => (
            <label
              key={`${material}-${index}`}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 shadow-sm transition hover:border-gray-300"
            >
              <input
                checked={normalize(material) === normalize(selectedValue)}
                name="material"
                type="radio"
                aria-label={material}
                className="sr-only peer"
                readOnly={!onChange}
                onChange={() => onChange?.(material)}
              />
              <span className="size-2.5 rounded-full border border-gray-300 bg-white peer-checked:border-indigo-500 peer-checked:bg-indigo-500" />
              <span>{material}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
