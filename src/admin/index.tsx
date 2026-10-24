import { DashboardPage } from "./DashboardPage";
import { CustomizeBarPage } from "./CustomizeBarPage";

export const pages: Record<string, React.ComponentType> = {
	"/dashboard": DashboardPage,
	"/customize-bar": CustomizeBarPage,
};

export default { pages };
