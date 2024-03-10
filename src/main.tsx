import { createRoot } from "react-dom/client";
import { Router } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

root.render(<App />);
