import { createRoot } from "react-dom/client";
import { CustomizeBarPage } from "./CustomizeBarPage";

const rootEl = document.getElementById("root");
if (rootEl) {
	createRoot(rootEl).render(<CustomizeBarPage />);
}
