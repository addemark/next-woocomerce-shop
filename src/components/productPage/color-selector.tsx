'use client';

import { resolveColor } from "@/constants/colors";

type ColorSelectorProps = {
  colors: string[];
  value?: string;
  onChange?: (value: string) => void;
};

export function ColorSelector({
  colors,
  value,
  onChange,
}: ColorSelectorProps) {
  if (!colors.length) return null;

  const normalize = (val: string) => val.trim().toLowerCase();
  const selectedValue = value ?? colors[0] ?? "";

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-600">Color</h3>

      <fieldset aria-label="Choose a color" className="mt-2">
        <div className="flex flex-wrap items-center gap-3">
          {colors.map((color, index) => (
            <label
              key={`${color}-${index}`}
              className="flex items-center gap-2 rounded-full px-2 py-1 outline -outline-offset-1 outline-black/10"
            >
              {/*
                Use a deterministic color palette so custom names (e.g. "charcoal" or "navy")
                still show a sensible swatch; fall back to the raw color string if unknown.
              */}
              <input
                checked={normalize(color) === normalize(selectedValue)}
                name="color"
                type="radio"
                aria-label={color}
                className="size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3"
                style={{ backgroundColor: resolveColor(color) }}
                readOnly={!onChange}
                onChange={() => onChange?.(color)}
              />
              <span className="text-sm text-gray-700">{color}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
