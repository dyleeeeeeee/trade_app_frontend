import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  useTheme();

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface-overlay group-[.toaster]:text-text-primary group-[.toaster]:border-hairline/[0.08] group-[.toaster]:shadow-elevation-4 group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-text-secondary",
          actionButton: "group-[.toast]:bg-interactive group-[.toast]:text-interactive-foreground",
          cancelButton: "group-[.toast]:bg-surface-raised group-[.toast]:text-text-secondary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
