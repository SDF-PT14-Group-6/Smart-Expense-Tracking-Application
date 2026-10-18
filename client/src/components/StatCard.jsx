export default function StatCard({ label, value, type }) {
  // Determine text coloring classes dynamically
  const colorClass = type === 'income' ? 'pos' : type === 'expense' ? 'neg' : value >= 0 ? 'pos' : 'neg';
  
  return (
    <div className="score-card shadow-sm">
      <h3>{label}</h3>
      <p className={`amt-large ${colorClass}`}>\${value.toLocaleString()}</p>
    </div>
  );
}
