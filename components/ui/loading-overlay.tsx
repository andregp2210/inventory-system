import { Loader2 } from "lucide-react";

type Props = {
  message?: string;
};

export function LoadingOverlay({ message }: Props) {
  return (
    <div
      className="fixed  inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm opacity-80"
      style={{ margin: 0 }}
    >
      <div className="flex flex-col items-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Loading...</h2>
        <p className="text-sm text-muted-foreground">
          {message ? message : "Please wait while we bring the data."}
        </p>
      </div>
    </div>
  );
}
