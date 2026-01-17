export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  error,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`input ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
      />

      {error && (
        <span className="text-xs text-red-600 mt-1">{error}</span>
      )}
    </div>
  );
}
