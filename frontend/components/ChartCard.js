export default function ChartCard({
  title,
  subtitle,
  children,
  className = '',
  height = 'h-64'
}) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className={`${height} flex items-center justify-center`}>
        {children}
      </div>
    </div>
  );
}