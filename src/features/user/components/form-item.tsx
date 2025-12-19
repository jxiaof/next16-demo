interface FormItemProps {
  label: string;
  children: React.ReactNode;
}

export function FormItem({ label, children }: FormItemProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}
