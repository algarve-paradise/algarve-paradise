import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-10">
      <div className="space-y-4">
        <Skeleton className="h-4 w-40 rounded-full" />
        <Skeleton className="h-12 w-3/4 rounded-3xl" />
        <Skeleton className="h-6 w-2/3 rounded-full" />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Skeleton className="h-72 rounded-[2rem]" />
        <Skeleton className="h-72 rounded-[2rem]" />
      </div>
    </Container>
  );
}
