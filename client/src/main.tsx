import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RootLayout from "@/components/layouts/RootLayout";

import "./index.css";
import AppRoutes from "./routes/app.route";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootLayout>
      <AppRoutes />
    </RootLayout>
  </StrictMode>,
);
