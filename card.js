export function Card({ children, className }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}
export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
