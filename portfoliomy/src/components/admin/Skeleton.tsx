interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

export default function Skeleton({
  className = "",
  width,
  height,
  borderRadius = "rounded-lg",
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-white/5 ${borderRadius} ${className}`}
      style={{ width, height }}
    />
  );
}
