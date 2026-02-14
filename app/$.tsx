import type { Route } from "./routes/+types/$";
import PageNotFound from "./routes/../components/PageNotFound";

export default function NotFoundRoute({}: Route.ComponentProps) {
  return <PageNotFound />;
}