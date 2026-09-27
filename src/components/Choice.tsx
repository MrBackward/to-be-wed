"use client";

type Option = { value: string; label: string };

export function Choice({
  name,
  legend,
  options,
  value,
  onChange,
  onBlur,
  error,
}: {
  name: string;
  legend: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-serif text-xl text-maroon-deep">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.value} className="block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
              className="peer sr-only"
            />
            <span className="flex min-h-12 items-center justify-center rounded-md border border-maroon/30 bg-white px-4 py-3 text-center font-medium text-maroon-deep transition-colors select-none peer-checked:border-maroon peer-checked:bg-maroon peer-checked:text-ivory peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 active:scale-[0.99]">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-maroon">
          {error}
        </p>
      )}
    </fieldset>
  );
}
