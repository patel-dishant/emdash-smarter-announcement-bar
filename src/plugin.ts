import type { SandboxedPlugin } from "emdash/plugin";

const adminPages = [
	{ path: "/dashboard", label: "Dashboard" },
	{ path: "/pricing", label: "Plans" },
	{ path: "/bar-analytics", label: "Analytics" },
	{ path: "/contact-form-leads", label: "Contact" },
	{ path: "/faqs", label: "FAQs" },
];

const dashboardBlocks = [
	{ type: "header", text: "Smarter Announcement Bar" },
	{
		type: "banner",
		title: "No active announcement bars",
		description:
			"Create customized notification bars to engage and convert your visitors. Highlight promotions, run flash sales with countdown timers, or collect newsletter subscribers.",
	},
	{
		type: "actions",
		elements: [
			{
				type: "button",
				action_id: "create-announcement-bar",
				label: "Create Announcement Bar",
				style: "primary",
			},
		],
	},
	{
		type: "fields",
		fields: [
			{ label: "⚡ Flash Sales & Urgency", value: "Drive instant purchases with automated countdown timers." },
			{ label: "🎁 Coupon & Discount Codes", value: "Share discount codes with easy one-click copy." },
			{ label: "💌 Email Lead Capture", value: "Turn visitors into subscribers with seamless opt-in forms." },
			{ label: "🎯 Smart Targeting", value: "Control where and when your bars appear across devices." },
		],
	},
	{ type: "divider" },
	{
		type: "banner",
		title: "🎉 Preview: Flat 20% Off All Orders with code WELCOME20",
		description: "Sample preview of an active top announcement bar on your store.",
		variant: "alert",
	},
	{
		type: "actions",
		elements: [
			{
				type: "button",
				action_id: "show-coupon-code",
				label: "Copy Coupon Code",
				style: "secondary",
			},
		],
	},
	{
		type: "context",
		text: "💡 Tip: Sticky announcement bars increase click-through rates by up to 28%.",
	},
];

/**
 * Sandboxed plugin entry. The explicit `SandboxedPlugin` annotation gives TypeScript per-hook /
 * per-route inference (`ctx` is `PluginContext` automatically; hook
 * `event` parameters are typed by hook name).
 */
const plugin: SandboxedPlugin = {
	routes: {
		hello: {
			handler: async (_routeCtx, ctx) => {
				ctx.log.info("hello route called", { pluginId: ctx.plugin.id });
				return { greeting: "hello", pluginId: ctx.plugin.id };
			},
		},
		admin: {
			request: { body: "json" },
			methods: ["POST"],
			handler: async (routeCtx) => {
				const input = routeCtx.input;
				const isRecord = typeof input === "object" && input !== null;
				const pagePath =
					isRecord &&
					"page" in input &&
					typeof input.page === "string"
						? input.page
						: "/dashboard";

				if (pagePath === "/dashboard") {
					const actionId = isRecord && "action_id" in input ? input.action_id : undefined;
					const toast =
						actionId === "create-announcement-bar"
							? { message: "The announcement bar builder is coming soon.", type: "info" as const }
							: actionId === "show-coupon-code"
								? { message: "Preview coupon code: WELCOME20", type: "info" as const }
							: actionId === "claim-discount"
								? { message: "Email sign-up is a preview and is not connected yet.", type: "info" as const }
							: actionId === "explore-templates"
								? { message: "Templates preview: Explore flash sales, urgency countdowns, and email captures below.", type: "info" as const }
								: undefined;

					return { blocks: dashboardBlocks, ...(toast ? { toast } : {}) };
				}

				const pageLabel = adminPages.find((page) => page.path === pagePath)?.label ?? "Dashboard";

				return {
					blocks: [
						{ type: "header", text: "Smarter Announcement Bar" },
						{ type: "section", text: `${pageLabel} is coming soon.` },
						{ type: "section", text: "This feature is being developed by Dishant Patel." },
						{
							type: "fields",
							fields: [
								{ label: "Status", value: "In development" },
								{ label: "Area", value: pageLabel },
							],
						},
					],
				};
			},
		},
	},
};

export default plugin;
