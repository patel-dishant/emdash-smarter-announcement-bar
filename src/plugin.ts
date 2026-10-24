import type { SandboxedPlugin } from "emdash/plugin";
import type { Block, BlockResponse } from "@emdash-cms/blocks/server";

// ---------------------------------------------------------------------------
// DASHBOARD BLOCKS
// ---------------------------------------------------------------------------

const dashboardBlocks: Block[] = [
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
			{
				label: "⚡ Flash Sales & Urgency",
				value: "Drive instant purchases with automated countdown timers.",
			},
			{
				label: "🎁 Coupon & Discount Codes",
				value: "Share discount codes with easy one-click copy.",
			},
			{
				label: "💌 Email Lead Capture",
				value: "Turn visitors into subscribers with seamless opt-in forms.",
			},
			{
				label: "🎯 Smart Targeting",
				value: "Control where and when your bars appear across devices.",
			},
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

// ---------------------------------------------------------------------------
// CUSTOMIZE BAR BLOCKS
// ---------------------------------------------------------------------------

const customizeBarBlocks: Block[] = [
	{
		type: "actions",
		elements: [
			{
				type: "link",
				label: "← Dashboard",
				target: { kind: "plugin-page" as const, path: "/dashboard" },
				appearance: "secondary",
			},
			{
				type: "button",
				action_id: "tab-customize-bar",
				label: "1. Customize Bar",
				style: "primary",
			},
			{
				type: "button",
				action_id: "tab-customize-design",
				label: "2. Customize Design",
				style: "secondary",
			},
			{
				type: "button",
				action_id: "tab-display-rules",
				label: "3. Display Rules",
				style: "secondary",
			},
			{
				type: "button",
				action_id: "preview-device-desktop",
				label: "Desktop",
				style: "primary",
			},
			{
				type: "button",
				action_id: "preview-device-mobile",
				label: "Mobile",
				style: "secondary",
			},
			{
				type: "button",
				action_id: "publish-bar",
				label: "Publish Bar",
				style: "primary",
			},
		],
	},
	{
		type: "banner",
		title: "🎉 Get 30% off your first purchase",
		description: "Button: [ Submit ]   Close Icon: [ x ]",
		variant: "default",
	},
	{ type: "divider" },
	{ type: "header", text: "1. Customize Bar" },
	{
		type: "form",
		submit: {
			label: "Next →",
			action_id: "customize-bar-next",
		},
		fields: [
			{
				type: "toggle",
				action_id: "bar_enabled",
				label: "Bar Status",
				description: "Turn this announcement bar active or inactive on your site.",
				initial_value: true,
			},
			{
				type: "text_input",
				action_id: "bar_name",
				label: "Bar Name",
				initial_value: "Smarter Announcement Bar",
				placeholder: "Enter a recognizable name for this bar",
			},
			{
				type: "radio",
				action_id: "position",
				label: "Position",
				options: [
					{ label: "Top", value: "top" },
					{ label: "Bottom", value: "bottom" },
				],
				initial_value: "top",
			},
			{
				type: "checkbox",
				action_id: "show_close_button",
				label: "Show Close Button on",
				options: [
					{ label: "Desktop", value: "desktop" },
					{ label: "Mobile", value: "mobile" },
				],
				initial_value: ["desktop", "mobile"],
			},
			{
				type: "radio",
				action_id: "text_type",
				label: "Text Type",
				options: [
					{ label: "Static", value: "static" },
					{ label: "Sliding (ticker)", value: "sliding" },
				],
				initial_value: "static",
			},
			{
				type: "text_input",
				action_id: "bar_text",
				label: "Announcement Text",
				initial_value: "Get 30% off your first purchase",
				placeholder: "Enter the text shown in the bar",
				multiline: true,
			},
			{
				type: "checkbox",
				action_id: "show_button",
				label: "Show Call-to-Action Button on",
				options: [
					{ label: "Desktop", value: "desktop" },
					{ label: "Mobile", value: "mobile" },
				],
				initial_value: ["desktop", "mobile"],
			},
			{
				type: "text_input",
				action_id: "button_text",
				label: "Button Text",
				initial_value: "Submit",
				placeholder: "e.g. Shop Now, Claim Offer",
			},
			{
				type: "select",
				action_id: "attention_effect",
				label: "Attention Effect",
				options: [
					{ label: "None", value: "none" },
					{ label: "Pulse", value: "pulse" },
					{ label: "Bounce", value: "bounce" },
					{ label: "Flash", value: "flash" },
				],
				initial_value: "none",
			},
			{
				type: "select",
				action_id: "action_on_click",
				label: "Action On Button Click",
				options: [
					{ label: "Close the bar", value: "close" },
					{ label: "Open URL in new tab", value: "open_url" },
					{ label: "Copy coupon code", value: "copy_code" },
				],
				initial_value: "close",
			},
			{
				type: "select",
				action_id: "bar_appearance_after_click",
				label: "Bar Behaviour After Button Click",
				options: [
					{ label: "Don't show the bar again for this visitor", value: "dont_show" },
					{ label: "Show again next session", value: "next_session" },
					{ label: "Always show", value: "always" },
				],
				initial_value: "dont_show",
			},
			{
				type: "toggle",
				action_id: "countdown_enabled",
				label: "Countdown Timer",
				description:
					"Add a live countdown element to your bar to create urgency, announce flash sales, and boost conversion.",
				initial_value: false,
			},
			{
				type: "toggle",
				action_id: "lead_form_enabled",
				label: "Contact Lead Form",
				description:
					"Collect visitor name and email directly from the bar. Captured leads appear on the Contact page.",
				initial_value: false,
			},
			{
				type: "toggle",
				action_id: "discount_enabled",
				label: "Discount / Coupon Code",
				description:
					"Add a coupon to your bar — visitors can click to copy the code and use it at checkout.",
				initial_value: false,
			},
		],
	},
];

function comingSoonPage(area: string): Block[] {
	return [
		{ type: "header", text: "Smarter Announcement Bar" },
		{ type: "section", text: `${area} is coming soon.` },
		{ type: "section", text: "This feature is being developed by Dishant Patel." },
		{
			type: "fields",
			fields: [
				{ label: "Status", value: "In development" },
				{ label: "Area", value: area },
			],
		},
	];
}

const adminPagesMeta: Record<string, string> = {
	"/pricing": "Plans",
	"/bar-analytics": "Analytics",
	"/contact-form-leads": "Contact",
	"/faqs": "FAQs",
};

// ---------------------------------------------------------------------------
// Sandboxed plugin definition
// ---------------------------------------------------------------------------

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
			handler: async (routeCtx): Promise<BlockResponse> => {
				const input = routeCtx.input;
				const isRecord = typeof input === "object" && input !== null;

				const pagePath =
					isRecord && "page" in input && typeof input.page === "string"
						? input.page
						: "/dashboard";

				const actionId =
					isRecord && "action_id" in input && typeof input.action_id === "string"
						? input.action_id
						: undefined;

				const inputType =
					isRecord && "type" in input && typeof input.type === "string"
						? input.type
						: undefined;

				if (pagePath === "/dashboard") {
					if (actionId === "create-announcement-bar") {
						return { blocks: customizeBarBlocks };
					}
					if (actionId === "back-to-dashboard") {
						return { blocks: dashboardBlocks };
					}
					if (actionId === "show-coupon-code") {
						return {
							blocks: dashboardBlocks,
							toast: { message: "Preview coupon code: WELCOME20", type: "info" },
						};
					}
					if (actionId === "claim-discount") {
						return {
							blocks: dashboardBlocks,
							toast: {
								message: "Email sign-up is a preview and is not connected yet.",
								type: "info",
							},
						};
					}
					if (actionId === "explore-templates") {
						return {
							blocks: dashboardBlocks,
							toast: {
								message:
									"Templates preview: Explore flash sales, urgency countdowns, and email captures below.",
								type: "info",
							},
						};
					}
					return { blocks: dashboardBlocks };
				}

				if (pagePath === "/customize-bar") {
					if (actionId === "publish-bar") {
						return {
							blocks: dashboardBlocks,
							toast: { message: "Announcement bar published successfully!", type: "success" },
						};
					}
					if (inputType === "form_submit" && actionId === "customize-bar-next") {
						return {
							blocks: customizeBarBlocks,
							toast: {
								message: "Step 1 configuration saved! Proceeding to Customize Design.",
								type: "success",
							},
						};
					}
					if (actionId === "back-to-dashboard") {
						return { blocks: dashboardBlocks };
					}
					return { blocks: customizeBarBlocks };
				}

				const area = adminPagesMeta[pagePath];
				if (area) {
					return { blocks: comingSoonPage(area) };
				}

				// Fallback
				return {
					blocks: [
						{ type: "header", text: "Smarter Announcement Bar" },
						{
							type: "banner",
							title: "Page not found",
							description: `The page at "${pagePath}" does not exist.`,
							variant: "error",
						},
					],
				};
			},
		},
	},
};

export default plugin;
