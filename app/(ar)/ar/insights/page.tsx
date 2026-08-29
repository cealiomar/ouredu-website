import { InsightsIndex } from "@/components/InsightsIndex";
import { CopyProvider } from "@/lib/copy";

export default function InsightsPage() {
  return (
    <CopyProvider lang="ar">
      <InsightsIndex />
    </CopyProvider>
  );
}
