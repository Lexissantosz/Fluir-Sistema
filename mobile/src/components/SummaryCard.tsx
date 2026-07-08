type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
};

export function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  );
}