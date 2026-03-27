import { FolderSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-24 px-4 text-center bg-slate-50 rounded-2xl border border-slate-100">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <FolderSearch className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}
