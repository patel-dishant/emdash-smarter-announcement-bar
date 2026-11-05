import type { SandboxedPlugin } from "emdash/plugin";
import type { Block, BlockResponse } from "@emdash-cms/blocks/server";

// ---------------------------------------------------------------------------
// BAR STATE TYPES & DEFAULTS
// ---------------------------------------------------------------------------

export interface BarState {
	enabled: boolean;
	name: string;
	position: string;
	showCloseButton: string[];
	textType: string;
	text: string;
	showButton: string[];
	buttonText: string;
	attentionEffect: string;
	actionOnClick: string;
	appearanceAfterClick: string;
	countdownEnabled: boolean;
	leadFormEnabled: boolean;
	discountEnabled: boolean;

	// Step 2: Customize Design
	backgroundType: string;
	backgroundColor: string;
	textColor: string;
	buttonBackgroundColor: string;
	buttonTextColor: string;
	closeButtonColor: string;
	fontFamily: string;
	fontSize: string;
	padding: string;
	customCss: string;

	// Step 3: Display Rules
	devices: string[];
	entryEffect: string;
	triggerType: string;
	triggerSeconds: number;
	triggerScrollPercentage: number;
	dateSchedulingTimezone: string;
	userTargeting: string;
	desktopOs: string;
	desktopBrowser: string;
	mobileOs: string;
	mobileBrowser: string;
	countryTargeting: string;
	languageTargetingEnabled: boolean;
	targetLanguage: string;
	targetPages: string;
	targetUrls: string;
}

const defaultBarState: BarState = {
	enabled: true,
	name: "Smarter Announcement Bar",
	position: "top",
	showCloseButton: ["desktop", "mobile"],
	textType: "static",
	text: "Get 30% off your first purchase",
	showButton: ["desktop", "mobile"],
	buttonText: "Submit",
	attentionEffect: "none",
	actionOnClick: "close",
	appearanceAfterClick: "dont_show",
	countdownEnabled: false,
	leadFormEnabled: false,
	discountEnabled: false,

	backgroundType: "color",
	backgroundColor: "#84cc16",
	textColor: "#000000",
	buttonBackgroundColor: "#000000",
	buttonTextColor: "#ffffff",
	closeButtonColor: "#000000",
	fontFamily: "Arial",
	fontSize: "md",
	padding: "normal",
	customCss: "",

	devices: ["desktop", "mobile"],
	entryEffect: "none",
	triggerType: "seconds",
	triggerSeconds: 0,
	triggerScrollPercentage: 50,
	dateSchedulingTimezone: "Central African Republic/Bangui",
	userTargeting: "all",
	desktopOs: "all",
	desktopBrowser: "all",
	mobileOs: "all",
	mobileBrowser: "all",
	countryTargeting: "all",
	languageTargetingEnabled: false,
	targetLanguage: "en",
	targetPages: "all",
	targetUrls: "",
};

let inMemoryBarState: BarState = { ...defaultBarState };
let inMemoryActiveTab: 1 | 2 | 3 = 1;
let inMemoryPreviewDevice: "desktop" | "mobile" = "desktop";

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
// BLOCK BUILDERS
// ---------------------------------------------------------------------------

function createActionsRow(activeTab: 1 | 2 | 3, previewDevice: "desktop" | "mobile"): Block {
	return {
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
				style: activeTab === 1 ? "primary" : "secondary",
			},
			{
				type: "button",
				action_id: "tab-customize-design",
				label: "2. Customize Design",
				style: activeTab === 2 ? "primary" : "secondary",
			},
			{
				type: "button",
				action_id: "tab-display-rules",
				label: "3. Display Rules",
				style: activeTab === 3 ? "primary" : "secondary",
			},
			{
				type: "button",
				action_id: "preview-device-desktop",
				label: "Desktop",
				style: previewDevice === "desktop" ? "primary" : "secondary",
			},
			{
				type: "button",
				action_id: "preview-device-mobile",
				label: "Mobile",
				style: previewDevice === "mobile" ? "primary" : "secondary",
			},
			{
				type: "button",
				action_id: "publish-bar",
				label: "Publish Bar",
				style: "primary",
			},
		],
	};
}

function createBannerPreview(state: BarState): Block {
	const displayText = state.text || "Get 30% off your first purchase";
	const btnText = state.buttonText || "Submit";
	return {
		type: "banner",
		title: `🎉 ${displayText}`,
		description: `Button: [ ${btnText} ]   Close Icon: [ x ]`,
		variant: "default",
	};
}

function buildCustomizeBarBlocks(state: BarState, previewDevice: "desktop" | "mobile"): Block[] {
	return [
		createActionsRow(1, previewDevice),
		createBannerPreview(state),
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
					initial_value: state.enabled,
				},
				{
					type: "text_input",
					action_id: "bar_name",
					label: "Bar Name",
					initial_value: state.name,
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
					initial_value: state.position,
				},
				{
					type: "checkbox",
					action_id: "show_close_button",
					label: "Show Close Button on",
					options: [
						{ label: "Desktop", value: "desktop" },
						{ label: "Mobile", value: "mobile" },
					],
					initial_value: state.showCloseButton,
				},
				{
					type: "radio",
					action_id: "text_type",
					label: "Text Type",
					options: [
						{ label: "Static", value: "static" },
						{ label: "Sliding (ticker)", value: "sliding" },
					],
					initial_value: state.textType,
				},
				{
					type: "text_input",
					action_id: "bar_text",
					label: "Announcement Text",
					initial_value: state.text,
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
					initial_value: state.showButton,
				},
				{
					type: "text_input",
					action_id: "button_text",
					label: "Button Text",
					initial_value: state.buttonText,
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
					initial_value: state.attentionEffect,
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
					initial_value: state.actionOnClick,
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
					initial_value: state.appearanceAfterClick,
				},
				{
					type: "toggle",
					action_id: "countdown_enabled",
					label: "Countdown Timer",
					description:
						"Add a live countdown element to your bar to create urgency, announce flash sales, and boost conversion.",
					initial_value: state.countdownEnabled,
				},
				{
					type: "toggle",
					action_id: "lead_form_enabled",
					label: "Contact Lead Form",
					description:
						"Collect visitor name and email directly from the bar. Captured leads appear on the Contact page.",
					initial_value: state.leadFormEnabled,
				},
				{
					type: "toggle",
					action_id: "discount_enabled",
					label: "Discount / Coupon Code",
					description:
						"Add a coupon to your bar — visitors can click to copy the code and use it at checkout.",
					initial_value: state.discountEnabled,
				},
			],
		},
	];
}

function buildCustomizeDesignBlocks(state: BarState, previewDevice: "desktop" | "mobile"): Block[] {
	return [
		createActionsRow(2, previewDevice),
		createBannerPreview(state),
		{ type: "divider" },
		{ type: "header", text: "2. Customize Design" },
		{
			type: "form",
			submit: {
				label: "Next →",
				action_id: "customize-design-next",
			},
			fields: [
				{
					type: "select",
					action_id: "background_type",
					label: "Background Type",
					options: [
						{ label: "Solid Color", value: "color" },
						{ label: "Gradient", value: "gradient" },
						{ label: "Image Pattern", value: "image" },
					],
					initial_value: state.backgroundType,
				},
				{
					type: "text_input",
					action_id: "background_color",
					label: "Background Color (Hex)",
					initial_value: state.backgroundColor,
					placeholder: "#84cc16",
				},
				{
					type: "text_input",
					action_id: "text_color",
					label: "Text Color (Hex)",
					initial_value: state.textColor,
					placeholder: "#000000",
				},
				{
					type: "text_input",
					action_id: "button_background_color",
					label: "Button Background Color (Hex)",
					initial_value: state.buttonBackgroundColor,
					placeholder: "#000000",
				},
				{
					type: "text_input",
					action_id: "button_text_color",
					label: "Button Text Color (Hex)",
					initial_value: state.buttonTextColor,
					placeholder: "#ffffff",
				},
				{
					type: "text_input",
					action_id: "close_button_color",
					label: "Close Button Color (Hex)",
					initial_value: state.closeButtonColor,
					placeholder: "#000000",
				},
				{
					type: "select",
					action_id: "font_family",
					label: "Font Family",
					options: [
						{ label: "Arial", value: "Arial" },
						{ label: "Helvetica", value: "Helvetica" },
						{ label: "Georgia", value: "Georgia" },
						{ label: "Times New Roman", value: "Times New Roman" },
						{ label: "System Sans-Serif", value: "sans-serif" },
					],
					initial_value: state.fontFamily,
				},
				{
					type: "select",
					action_id: "font_size",
					label: "Font Size",
					options: [
						{ label: "Small (14px)", value: "sm" },
						{ label: "Medium (16px)", value: "md" },
						{ label: "Large (18px)", value: "lg" },
					],
					initial_value: state.fontSize,
				},
				{
					type: "select",
					action_id: "padding",
					label: "Padding / Spacing",
					options: [
						{ label: "Compact", value: "compact" },
						{ label: "Normal", value: "normal" },
						{ label: "Spacious", value: "spacious" },
					],
					initial_value: state.padding,
				},
				{
					type: "text_input",
					action_id: "custom_css",
					label: "Custom CSS",
					initial_value: state.customCss,
					placeholder: ".smarter-announcement-bar-root { ... }",
					multiline: true,
				},
			],
		},
	];
}

function buildDisplayRulesBlocks(state: BarState, previewDevice: "desktop" | "mobile"): Block[] {
	return [
		createActionsRow(3, previewDevice),
		createBannerPreview(state),
		{ type: "divider" },
		{ type: "header", text: "3. Display Rules" },
		{
			type: "form",
			submit: {
				label: "Save Bar",
				action_id: "display-rules-save",
			},
			fields: [
				{
					type: "checkbox",
					action_id: "devices",
					label: "Target Devices",
					options: [
						{ label: "Desktop", value: "desktop" },
						{ label: "Mobile", value: "mobile" },
					],
					initial_value: state.devices,
				},
				{
					type: "radio",
					action_id: "entry_effect",
					label: "Entry Effect",
					options: [
						{ label: "No effect", value: "none" },
						{ label: "Slide in", value: "slide" },
						{ label: "Fade", value: "fade" },
					],
					initial_value: state.entryEffect,
				},
				{
					type: "radio",
					action_id: "trigger_type",
					label: "Trigger Type",
					options: [
						{ label: "After a few seconds", value: "seconds" },
						{ label: "After scroll", value: "scroll" },
					],
					initial_value: state.triggerType,
				},
				{
					type: "number_input",
					action_id: "trigger_seconds",
					label: "Trigger Delay (Seconds)",
					initial_value: state.triggerSeconds,
					min: 0,
				},
				{
					type: "number_input",
					action_id: "trigger_scroll_percentage",
					label: "Trigger Scroll Percentage (%)",
					initial_value: state.triggerScrollPercentage,
					min: 0,
					max: 100,
				},
				{
					type: "select",
					action_id: "date_scheduling_timezone",
					label: "Date Scheduling Timezone",
					options: [
						{ label: "Central African Republic/Bangui", value: "Central African Republic/Bangui" },
						{ label: "UTC", value: "UTC" },
						{ label: "America/New_York (Eastern)", value: "America/New_York" },
						{ label: "America/Chicago (Central)", value: "America/Chicago" },
						{ label: "America/Denver (Mountain)", value: "America/Denver" },
						{ label: "America/Los_Angeles (Pacific)", value: "America/Los_Angeles" },
						{ label: "Europe/London (GMT/BST)", value: "Europe/London" },
						{ label: "Europe/Paris (CET)", value: "Europe/Paris" },
						{ label: "Europe/Berlin", value: "Europe/Berlin" },
						{ label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
						{ label: "Asia/Dubai (GST)", value: "Asia/Dubai" },
						{ label: "Asia/Singapore (SGT)", value: "Asia/Singapore" },
						{ label: "Asia/Tokyo (JST)", value: "Asia/Tokyo" },
					],
					initial_value: state.dateSchedulingTimezone,
				},
				{
					type: "select",
					action_id: "user_targeting",
					label: "User Targeting",
					options: [
						{ label: "Show for all users", value: "all" },
						{ label: "Only new visitors", value: "new" },
						{ label: "Only returning visitors", value: "returning" },
						{ label: "Logged in users", value: "logged_in" },
						{ label: "Guest visitors", value: "guest" },
					],
					initial_value: state.userTargeting,
				},
				{
					type: "select",
					action_id: "desktop_os",
					label: "Desktop Operating System",
					options: [
						{ label: "All Operating Systems", value: "all" },
						{ label: "Windows", value: "windows" },
						{ label: "macOS", value: "macos" },
						{ label: "Linux", value: "linux" },
						{ label: "Chrome OS", value: "chromeos" },
					],
					initial_value: state.desktopOs,
				},
				{
					type: "select",
					action_id: "desktop_browser",
					label: "Desktop Browser",
					options: [
						{ label: "All Browsers", value: "all" },
						{ label: "Chrome", value: "chrome" },
						{ label: "Safari", value: "safari" },
						{ label: "Firefox", value: "firefox" },
						{ label: "Edge", value: "edge" },
						{ label: "Opera", value: "opera" },
					],
					initial_value: state.desktopBrowser,
				},
				{
					type: "select",
					action_id: "mobile_os",
					label: "Mobile Operating System",
					options: [
						{ label: "All Mobile OS", value: "all" },
						{ label: "iOS", value: "ios" },
						{ label: "Android", value: "android" },
					],
					initial_value: state.mobileOs,
				},
				{
					type: "select",
					action_id: "mobile_browser",
					label: "Mobile Browser",
					options: [
						{ label: "All Browsers", value: "all" },
						{ label: "Safari Mobile", value: "safari" },
						{ label: "Chrome Mobile", value: "chrome" },
						{ label: "Samsung Internet", value: "samsung" },
						{ label: "Firefox Mobile", value: "firefox" },
					],
					initial_value: state.mobileBrowser,
				},
				{
					type: "select",
					action_id: "country_targeting",
					label: "Country Targeting",
					options: [
						{ label: "All Countries", value: "all" },
						{ label: "United States", value: "US" },
						{ label: "United Kingdom", value: "GB" },
						{ label: "Canada", value: "CA" },
						{ label: "Australia", value: "AU" },
						{ label: "Germany", value: "DE" },
						{ label: "France", value: "FR" },
						{ label: "India", value: "IN" },
						{ label: "Japan", value: "JP" },
					],
					initial_value: state.countryTargeting,
				},
				{
					type: "toggle",
					action_id: "language_targeting_enabled",
					label: "Language Targeting",
					description: "Restrict announcement bar to specific visitor languages.",
					initial_value: state.languageTargetingEnabled,
				},
				{
					type: "select",
					action_id: "target_language",
					label: "Target Language",
					options: [
						{ label: "English", value: "en" },
						{ label: "Spanish (Español)", value: "es" },
						{ label: "French (Français)", value: "fr" },
						{ label: "German (Deutsch)", value: "de" },
						{ label: "Italian (Italiano)", value: "it" },
						{ label: "Portuguese (Português)", value: "pt" },
						{ label: "Chinese (中文)", value: "zh" },
						{ label: "Japanese (日本語)", value: "ja" },
					],
					initial_value: state.targetLanguage,
				},
				{
					type: "select",
					action_id: "target_pages",
					label: "Page Targeting",
					options: [
						{ label: "Everywhere (All Pages)", value: "all" },
						{ label: "Homepage Only", value: "homepage" },
						{ label: "Custom URL Match", value: "custom" },
					],
					initial_value: state.targetPages,
				},
				{
					type: "text_input",
					action_id: "target_urls",
					label: "URL Pattern",
					placeholder: "/products/*, /sale",
					initial_value: state.targetUrls,
				},
			],
		},
	];
}

function getBlocksForTab(tab: 1 | 2 | 3, state: BarState, previewDevice: "desktop" | "mobile"): Block[] {
	if (tab === 2) return buildCustomizeDesignBlocks(state, previewDevice);
	if (tab === 3) return buildDisplayRulesBlocks(state, previewDevice);
	return buildCustomizeBarBlocks(state, previewDevice);
}

const customizeBarBlocks: Block[] = buildCustomizeBarBlocks(defaultBarState, "desktop");

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
			handler: async (routeCtx, ctx): Promise<BlockResponse> => {
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

				// Load current state from KV or in-memory fallback
				let barState: BarState = { ...inMemoryBarState };
				let activeTab: 1 | 2 | 3 = inMemoryActiveTab;
				let previewDevice: "desktop" | "mobile" = inMemoryPreviewDevice;

				if (ctx?.kv) {
					try {
						const storedState = await ctx.kv.get<BarState>("state:bar_config");
						if (storedState) {
							barState = { ...defaultBarState, ...storedState };
							inMemoryBarState = barState;
						}
						const storedTab = await ctx.kv.get<1 | 2 | 3>("state:active_tab");
						if (storedTab && (storedTab === 1 || storedTab === 2 || storedTab === 3)) {
							activeTab = storedTab;
							inMemoryActiveTab = storedTab;
						}
						const storedDevice = await ctx.kv.get<"desktop" | "mobile">("state:preview_device");
						if (storedDevice && (storedDevice === "desktop" || storedDevice === "mobile")) {
							previewDevice = storedDevice;
							inMemoryPreviewDevice = storedDevice;
						}
					} catch {}
				}

				const updateAndSaveState = async (updates: Partial<BarState>, nextTab?: 1 | 2 | 3) => {
					barState = { ...barState, ...updates };
					inMemoryBarState = barState;
					if (nextTab) {
						activeTab = nextTab;
						inMemoryActiveTab = nextTab;
					}
					if (ctx?.kv) {
						try {
							await ctx.kv.set("state:bar_config", barState);
							if (nextTab) await ctx.kv.set("state:active_tab", nextTab);
						} catch {}
					}
				};

				if (pagePath === "/dashboard") {
					if (actionId === "create-announcement-bar") {
						activeTab = 1;
						inMemoryActiveTab = 1;
						if (ctx?.kv) {
							try { await ctx.kv.set("state:active_tab", 1); } catch {}
						}
						return { blocks: buildCustomizeBarBlocks(barState, previewDevice) };
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
						if (ctx?.kv) {
							try {
								await ctx.kv.set("state:bar_config", barState);
								await ctx.kv.set("state:published_bar", barState);
							} catch {}
						}
						return {
							blocks: dashboardBlocks,
							toast: { message: "Announcement bar published successfully!", type: "success" },
						};
					}

					if (actionId === "tab-customize-bar") {
						activeTab = 1;
						inMemoryActiveTab = 1;
						if (ctx?.kv) {
							try { await ctx.kv.set("state:active_tab", 1); } catch {}
						}
						return { blocks: buildCustomizeBarBlocks(barState, previewDevice) };
					}

					if (actionId === "tab-customize-design") {
						activeTab = 2;
						inMemoryActiveTab = 2;
						if (ctx?.kv) {
							try { await ctx.kv.set("state:active_tab", 2); } catch {}
						}
						return { blocks: buildCustomizeDesignBlocks(barState, previewDevice) };
					}

					if (actionId === "tab-display-rules") {
						activeTab = 3;
						inMemoryActiveTab = 3;
						if (ctx?.kv) {
							try { await ctx.kv.set("state:active_tab", 3); } catch {}
						}
						return { blocks: buildDisplayRulesBlocks(barState, previewDevice) };
					}

					if (actionId === "preview-device-desktop") {
						previewDevice = "desktop";
						inMemoryPreviewDevice = "desktop";
						if (ctx?.kv) {
							try { await ctx.kv.set("state:preview_device", "desktop"); } catch {}
						}
						return { blocks: getBlocksForTab(activeTab, barState, "desktop") };
					}

					if (actionId === "preview-device-mobile") {
						previewDevice = "mobile";
						inMemoryPreviewDevice = "mobile";
						if (ctx?.kv) {
							try { await ctx.kv.set("state:preview_device", "mobile"); } catch {}
						}
						return { blocks: getBlocksForTab(activeTab, barState, "mobile") };
					}

					if (inputType === "form_submit") {
						const formValues =
							isRecord && "values" in input && typeof input.values === "object" && input.values !== null
								? (input.values as Record<string, any>)
								: {};

						if (actionId === "customize-bar-next") {
							await updateAndSaveState(
								{
									enabled: formValues.bar_enabled ?? barState.enabled,
									name: typeof formValues.bar_name === "string" ? formValues.bar_name : barState.name,
									position: typeof formValues.position === "string" ? formValues.position : barState.position,
									showCloseButton: Array.isArray(formValues.show_close_button) ? formValues.show_close_button : barState.showCloseButton,
									textType: typeof formValues.text_type === "string" ? formValues.text_type : barState.textType,
									text: typeof formValues.bar_text === "string" ? formValues.bar_text : barState.text,
									showButton: Array.isArray(formValues.show_button) ? formValues.show_button : barState.showButton,
									buttonText: typeof formValues.button_text === "string" ? formValues.button_text : barState.buttonText,
									attentionEffect: typeof formValues.attention_effect === "string" ? formValues.attention_effect : barState.attentionEffect,
									actionOnClick: typeof formValues.action_on_click === "string" ? formValues.action_on_click : barState.actionOnClick,
									appearanceAfterClick: typeof formValues.bar_appearance_after_click === "string" ? formValues.bar_appearance_after_click : barState.appearanceAfterClick,
									countdownEnabled: formValues.countdown_enabled ?? barState.countdownEnabled,
									leadFormEnabled: formValues.lead_form_enabled ?? barState.leadFormEnabled,
									discountEnabled: formValues.discount_enabled ?? barState.discountEnabled,
								},
								2
							);
							return {
								blocks: buildCustomizeDesignBlocks(barState, previewDevice),
								toast: {
									message: "Step 1 configuration saved! Proceeding to Customize Design.",
									type: "success",
								},
							};
						}

						if (actionId === "customize-design-next") {
							await updateAndSaveState(
								{
									backgroundType: typeof formValues.background_type === "string" ? formValues.background_type : barState.backgroundType,
									backgroundColor: typeof formValues.background_color === "string" ? formValues.background_color : barState.backgroundColor,
									textColor: typeof formValues.text_color === "string" ? formValues.text_color : barState.textColor,
									buttonBackgroundColor: typeof formValues.button_background_color === "string" ? formValues.button_background_color : barState.buttonBackgroundColor,
									buttonTextColor: typeof formValues.button_text_color === "string" ? formValues.button_text_color : barState.buttonTextColor,
									closeButtonColor: typeof formValues.close_button_color === "string" ? formValues.close_button_color : barState.closeButtonColor,
									fontFamily: typeof formValues.font_family === "string" ? formValues.font_family : barState.fontFamily,
									fontSize: typeof formValues.font_size === "string" ? formValues.font_size : barState.fontSize,
									padding: typeof formValues.padding === "string" ? formValues.padding : barState.padding,
									customCss: typeof formValues.custom_css === "string" ? formValues.custom_css : barState.customCss,
								},
								3
							);
							return {
								blocks: buildDisplayRulesBlocks(barState, previewDevice),
								toast: {
									message: "Step 2 configuration saved! Proceeding to Display Rules.",
									type: "success",
								},
							};
						}

						if (actionId === "display-rules-save") {
							const triggerSec =
								typeof formValues.trigger_seconds === "number"
									? formValues.trigger_seconds
									: formValues.trigger_seconds !== undefined && formValues.trigger_seconds !== "" && !isNaN(Number(formValues.trigger_seconds))
									? Number(formValues.trigger_seconds)
									: barState.triggerSeconds;

							const triggerScroll =
								typeof formValues.trigger_scroll_percentage === "number"
									? formValues.trigger_scroll_percentage
									: formValues.trigger_scroll_percentage !== undefined && formValues.trigger_scroll_percentage !== "" && !isNaN(Number(formValues.trigger_scroll_percentage))
									? Number(formValues.trigger_scroll_percentage)
									: barState.triggerScrollPercentage;

							const devicesVal = Array.isArray(formValues.devices)
								? formValues.devices
								: typeof formValues.devices === "string"
								? [formValues.devices]
								: barState.devices;

							const langEnabled =
								typeof formValues.language_targeting_enabled === "boolean"
									? formValues.language_targeting_enabled
									: formValues.language_targeting_enabled !== undefined
									? Boolean(formValues.language_targeting_enabled)
									: barState.languageTargetingEnabled;

							await updateAndSaveState(
								{
									devices: devicesVal,
									entryEffect: typeof formValues.entry_effect === "string" ? formValues.entry_effect : barState.entryEffect,
									triggerType: typeof formValues.trigger_type === "string" ? formValues.trigger_type : barState.triggerType,
									triggerSeconds: triggerSec,
									triggerScrollPercentage: triggerScroll,
									dateSchedulingTimezone: typeof formValues.date_scheduling_timezone === "string" ? formValues.date_scheduling_timezone : barState.dateSchedulingTimezone,
									userTargeting: typeof formValues.user_targeting === "string" ? formValues.user_targeting : barState.userTargeting,
									desktopOs: typeof formValues.desktop_os === "string" ? formValues.desktop_os : barState.desktopOs,
									desktopBrowser: typeof formValues.desktop_browser === "string" ? formValues.desktop_browser : barState.desktopBrowser,
									mobileOs: typeof formValues.mobile_os === "string" ? formValues.mobile_os : barState.mobileOs,
									mobileBrowser: typeof formValues.mobile_browser === "string" ? formValues.mobile_browser : barState.mobileBrowser,
									countryTargeting: typeof formValues.country_targeting === "string" ? formValues.country_targeting : barState.countryTargeting,
									languageTargetingEnabled: langEnabled,
									targetLanguage: typeof formValues.target_language === "string" ? formValues.target_language : barState.targetLanguage,
									targetPages: typeof formValues.target_pages === "string" ? formValues.target_pages : barState.targetPages,
									targetUrls: typeof formValues.target_urls === "string" ? formValues.target_urls : barState.targetUrls,
								},
								3
							);
							if (ctx?.kv) {
								try {
									await ctx.kv.set("state:published_bar", barState);
								} catch {}
							}
							return {
								blocks: buildDisplayRulesBlocks(barState, previewDevice),
								toast: {
									message: "Display Rules saved and announcement bar published successfully!",
									type: "success",
								},
							};
						}
					}

					if (actionId === "back-to-dashboard") {
						return { blocks: dashboardBlocks };
					}

					return { blocks: getBlocksForTab(activeTab, barState, previewDevice) };
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
