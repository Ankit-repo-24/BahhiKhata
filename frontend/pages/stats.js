export default function Stats() {
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dailyAvg, setDailyAvg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/stats/monthly'),
      api.get('/stats/by-category'),
      api.get('/stats/daily-average')
    ])
      .then(([m, c, d]) => {
        setMonthly(m.data);
        setCategories(c.data);
        setDailyAvg(d.data.daily_average);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-500">Loading stats…</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Spending Analytics</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Daily Average" value={`₹${dailyAvg}`} />
        <StatCard title="Categories" value={categories.length} />
        <StatCard title="Active Months" value={monthly.length} />
      </div>

      {/* Monthly Table */}
      <Section title="Monthly Spending">
        <Table
          headers={['Month', 'Total']}
          rows={monthly.map(m => [
            new Date(m.month).toLocaleString('default', { month: 'long', year: 'numeric' }),
            `₹${m.total}`
          ])}
        />
      </Section>

      {/* Category Table */}
      <Section title="By Category">
        <Table
          headers={['Category', 'Total']}
          rows={categories.map(c => [c.category, `₹${c.total}`])}
        />
      </Section>
    </Layout>
  );
}

/* ---------- Small Reusable Components ---------- */

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto bg-white border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-4 py-2 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
