import Skeleton from "@/components/admin/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton width="300px" height="40px" />
        <Skeleton width="400px" height="20px" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="120px" borderRadius="rounded-2xl" />
        ))}
      </div>
      <Skeleton height="300px" borderRadius="rounded-3xl" />
    </div>
  );
}
