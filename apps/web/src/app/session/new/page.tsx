import { redirect } from "next/navigation";

export default async function NewSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const childId = params.child;

  if (!childId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No child selected. Go back to the dashboard.</p>
      </div>
    );
  }

  redirect(`/session/active?child=${childId}`);
}
