export default function InsightCard({ title, value, subtitle, trend, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center`}>
            <span className="text-xl">{icon}</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm font-medium text-gray-900">{title}</div>
            {subtitle && (
              <div className="text-sm text-gray-600">{subtitle}</div>
            )}
          </div>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}