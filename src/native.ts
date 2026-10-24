import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configFile = resolve(__dirname, "..", "published-bar.json");

export interface BarConfig {
	enabled: boolean;
	name: string;
	position: "top" | "bottom";
	closeButtonDevices: ("desktop" | "mobile")[];
	textType: "static" | "sliding" | "marquee";
	text: string;
	messages?: string[];
	textIcon?: { name: string; dataUrl: string };
	iconPosition?: "left" | "right";
	iconStyle?: "auto" | "white" | "badge" | "original";
	textFormatting: {
		bold: boolean;
		italic: boolean;
		underline: boolean;
		linkUrl?: string;
	};
	buttonDevices: ("desktop" | "mobile")[];
	buttonText: string;
	attentionEffect: "none" | "flash" | "shake" | "swing" | "tada" | "heartbeat" | "wobble" | "pulse" | "bounce";
	actionOnClick: "close" | "open_url" | "thank_you" | "show_coupon" | "copy_code";
	thankYouMessage?: string;
	barAppearanceAfterClick: "dont_show" | "next_session" | "always";
	countdownEnabled: boolean;
	countdownUrgencyText: string;
	countdownTarget: string;
	leadFormEnabled: boolean;
	leadFormButtonLabel: string;
	discountEnabled: boolean;
	discountCode: string;
	backgroundColor: string;
	textColor: string;
	buttonBackgroundColor: string;
	buttonTextColor: string;
	fontSize: "sm" | "md" | "lg";
	padding: "compact" | "normal" | "spacious";
}

const DEFAULT_CONFIG: BarConfig = {
	enabled: true,
	name: "Smarter Announcement Bar",
	position: "top",
	closeButtonDevices: ["desktop", "mobile"],
	textType: "static",
	text: "Get 30% off your first purchase",
	textFormatting: { bold: false, italic: false, underline: false },
	buttonDevices: ["desktop", "mobile"],
	buttonText: "Submit",
	attentionEffect: "none",
	actionOnClick: "close",
	barAppearanceAfterClick: "dont_show",
	countdownEnabled: false,
	countdownUrgencyText: "Ends in:",
	countdownTarget: new Date(Date.now() + 86400000).toISOString(),
	leadFormEnabled: false,
	leadFormButtonLabel: "Join",
	discountEnabled: false,
	discountCode: "SAVE30",
	backgroundColor: "#84cc16",
	textColor: "#000000",
	buttonBackgroundColor: "#000000",
	buttonTextColor: "#ffffff",
	fontSize: "md",
	padding: "normal",
};

export function getPublishedConfig(): BarConfig {
	try {
		if (existsSync(configFile)) {
			const data = readFileSync(configFile, "utf-8");
			return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
		}
	} catch {
		// fallback to default
	}
	return DEFAULT_CONFIG;
}

export function savePublishedConfig(config: BarConfig): void {
	try {
		writeFileSync(configFile, JSON.stringify(config, null, 2), "utf-8");
	} catch (err) {
		console.error("Failed to write published-bar.json:", err);
	}
}

export function renderPublicBar(config: BarConfig): string {
	if (!config || !config.enabled) return "";

	const anyConfig = config as any;
	const couponCode = anyConfig.couponCode || config.discountCode || "WELCOME30";
	const buttonUrl = anyConfig.buttonUrl || "";
	const actionOnClick = config.actionOnClick || "close";
	const thankYouMessage = anyConfig.thankYouMessage || "Thank you for your response!";
	const appearanceAfterClick = anyConfig.appearanceAfterClick || config.barAppearanceAfterClick || "dont_show";
	const isMarquee = config.textType === "marquee";
	const isSliding = config.textType === "sliding";

	const effectClass = config.attentionEffect && config.attentionEffect !== "none" ? `effect-${config.attentionEffect}` : "";
	const pad =
		config.padding === "compact"
			? "6px 14px"
			: config.padding === "spacious"
			? "14px 24px"
			: "10px 18px";
	const fontSize =
		config.fontSize === "sm" ? "12px" : config.fontSize === "lg" ? "16px" : "14px";
	const textStyle = `font-weight: ${config.textFormatting?.bold ? "bold" : "normal"}; font-style: ${
		config.textFormatting?.italic ? "italic" : "normal"
	}; text-decoration: ${config.textFormatting?.underline ? "underline" : "none"}; white-space: ${
		isMarquee ? "pre" : "pre-wrap"
	}; word-break: break-word;`;

	const countdownHtml = config.countdownEnabled
		? `<span style="margin-left: 8px; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.15); font-weight: bold; font-size: 12px; display: inline-flex; align-items: center; gap: 5px;"><svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path></svg> ${
				config.countdownUrgencyText || "Ends in:"
		  } 02:45:12</span>`
		: "";

	const discountHtml = config.discountEnabled
		? `<span style="margin-left: 8px; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.25); border: 1px dashed currentColor; font-weight: bold; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;" onclick="navigator.clipboard.writeText('${couponCode}'); alert('Copied coupon: ${couponCode}');"><svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68A16,16,0,0,0,243.31,136ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z"></path></svg> ${couponCode}</span>`
		: "";

	const leadFormHtml = anyConfig.leadFormEnabled
		? `<form style="display: flex; gap: 6px; align-items: center; margin: 0 4px;" onsubmit="event.preventDefault(); alert('Subscribed: ' + this.elements.email.value); this.reset();">
				<input type="email" name="email" placeholder="${anyConfig.leadFormPlaceholder || "Enter your email"}" required style="padding: 5px 10px; border: 1px solid rgba(0,0,0,0.2); border-radius: 4px; font-size: 13px; background: rgba(255,255,255,0.95); color: #111;" />
				<button type="submit" style="background-color: ${config.buttonBackgroundColor || "#000000"}; color: ${config.buttonTextColor || "#ffffff"}; border: none; border-radius: 4px; padding: 5px 12px; font-weight: 600; font-size: 13px; cursor: pointer;">${anyConfig.leadFormButtonLabel || "Join"}</button>
		   </form>`
		: "";

	const hasButtonDesktop = config.buttonDevices ? config.buttonDevices.includes("desktop") : true;
	const hasButtonMobile = config.buttonDevices ? config.buttonDevices.includes("mobile") : true;
	const buttonDeviceClass = (!hasButtonDesktop && hasButtonMobile) ? "hide-on-desktop" : (hasButtonDesktop && !hasButtonMobile) ? "hide-on-mobile" : (!hasButtonDesktop && !hasButtonMobile) ? "hide-always" : "";

	const buttonHtml = config.buttonText
		? `<button type="button" class="smarter-cta-btn ${effectClass} ${buttonDeviceClass}" style="background-color: ${
				config.buttonBackgroundColor || "#000000"
		  }; color: ${
				config.buttonTextColor || "#ffffff"
		  }; border: none; border-radius: 6px; padding: 6px 14px; font-weight: 600; font-size: 13px; cursor: pointer;" onclick="handleSmarterBarCta()">${
				config.buttonText
		  }</button>`
		: "";

	const hasCloseDesktop = config.closeButtonDevices ? config.closeButtonDevices.includes("desktop") : true;
	const hasCloseMobile = config.closeButtonDevices ? config.closeButtonDevices.includes("mobile") : true;
	const closeDeviceClass = (!hasCloseDesktop && hasCloseMobile) ? "hide-on-desktop" : (hasCloseDesktop && !hasCloseMobile) ? "hide-on-mobile" : (!hasCloseDesktop && !hasCloseMobile) ? "hide-always" : "";

	const closeHtml = `
		<button type="button" class="smarter-close-btn ${closeDeviceClass}" style="background: none; border: none; color: inherit; cursor: pointer; padding: 4px 8px; line-height: 1; display: inline-flex; align-items: center; justify-content: center;" onclick="dismissSmarterBar()" aria-label="Close announcement bar">
			<svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" style="display: block;"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
		</button>
	`;

	const isDarkBg = (hexColor: string) => {
		if (!hexColor || typeof hexColor !== "string" || !hexColor.startsWith("#")) return false;
		const hex = hexColor.replace("#", "");
		const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16) || 0;
		const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16) || 0;
		const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16) || 0;
		return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) < 128;
	};

	const iconStyleMode = config.iconStyle || "auto";
	const isDark = isDarkBg(config.backgroundColor || "#000000");
	const shouldInvert = iconStyleMode === "white" || (iconStyleMode === "auto" && isDark);
	const isBadge = iconStyleMode === "badge";

	const iconImgStyle = [
		"height: 24px",
		"width: 24px",
		"object-fit: contain",
		"vertical-align: middle",
		"display: inline-block",
		"flex-shrink: 0",
		shouldInvert ? "filter: brightness(0) invert(1);" : "",
		isBadge ? "background: #ffffff; border-radius: 50%; padding: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.3);" : "",
	].filter(Boolean).join("; ");

	const iconHtml = (config.textIcon && config.textIcon.dataUrl)
		? `<img src="${config.textIcon.dataUrl}" style="${iconImgStyle}" alt="icon" />`
		: "";
	const isIconRight = config.iconPosition === "right";

	const rawMessages: string[] = (config.messages && config.messages.length > 0)
		? config.messages
		: (config.text ? config.text.split("\n") : []);
	const messages = rawMessages.map((m) => (m || "").trim()).filter(Boolean);
	if (messages.length === 0) {
		messages.push(config.text || "Get 30% off your first purchase");
	}

	const formatText = (content: string) => {
		return config.textFormatting?.linkUrl
			? `<a href="${config.textFormatting.linkUrl}" style="color: inherit; text-decoration: ${config.textFormatting?.underline ? "underline" : "none"};">${content}</a>`
			: content;
	};

	const marqueeItemsHtml = messages
		.map(
			(msg) => `
			<span class="smarter-marquee-item" style="display: inline-flex; align-items: center; gap: 8px;">
				<span style="${textStyle}">${formatText(msg)}</span>
			</span>
		`
		)
		.join(`<span class="smarter-marquee-sep" style="opacity: 0.45; margin: 0 20px; font-size: 13px;">✦</span>`);

	const slidingItemsHtml = messages
		.map(
			(msg, idx) => `
			<div class="smarter-slide-item ${idx === 0 ? "active" : ""}" data-slide-index="${idx}">
				<span style="${textStyle}">${formatText(msg)}</span>
				${countdownHtml}
				${discountHtml}
			</div>
		`
		)
		.join("");

	return `
	<style>
		/* Attention animations */
		.effect-flash { animation: barFlash 2s infinite; }
		.effect-shake { animation: barShake 1.8s infinite ease-in-out; }
		.effect-swing { transform-origin: top center; animation: barSwing 2s infinite ease-in-out; }
		.effect-tada { animation: barTada 1.8s infinite ease-in-out; }
		.effect-heartbeat { animation: barHeartbeat 1.6s infinite ease-in-out; }
		.effect-wobble { animation: barWobble 2s infinite ease-in-out; }
		.effect-pulse { animation: barPulse 1.5s infinite; }
		.effect-bounce { animation: barBounce 1.2s infinite; }

		@keyframes barFlash {
			0%, 50%, 100% { opacity: 1; }
			25%, 75% { opacity: 0.2; }
		}
		@keyframes barShake {
			0%, 100% { transform: translateX(0); }
			10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
			20%, 40%, 60%, 80% { transform: translateX(4px); }
		}
		@keyframes barSwing {
			20% { transform: rotate(15deg); }
			40% { transform: rotate(-10deg); }
			60% { transform: rotate(5deg); }
			80% { transform: rotate(-5deg); }
			100% { transform: rotate(0deg); }
		}
		@keyframes barTada {
			0% { transform: scale(1); }
			10%, 20% { transform: scale(0.9) rotate(-3deg); }
			30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
			40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
			100% { transform: scale(1); }
		}
		@keyframes barHeartbeat {
			0% { transform: scale(1); }
			14% { transform: scale(1.15); }
			28% { transform: scale(1); }
			42% { transform: scale(1.15); }
			70% { transform: scale(1); }
		}
		@keyframes barWobble {
			0% { transform: translateX(0%); }
			15% { transform: translateX(-12%) rotate(-5deg); }
			30% { transform: translateX(10%) rotate(3deg); }
			45% { transform: translateX(-6%) rotate(-3deg); }
			60% { transform: translateX(4%) rotate(2deg); }
			75% { transform: translateX(-1%) rotate(-1deg); }
			100% { transform: translateX(0%); }
		}
		@keyframes barPulse {
			0%, 100% { transform: scale(1); }
			50% { transform: scale(1.05); }
		}
		@keyframes barBounce {
			0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
			40% { transform: translateY(-4px); }
			60% { transform: translateY(-2px); }
		}
		@keyframes tickerScroll {
			0% { transform: translateX(0); }
			100% { transform: translateX(-100%); }
		}
		.smarter-ticker-track {
			display: inline-flex;
			align-items: center;
			gap: 12px;
			white-space: nowrap;
			padding-left: 100%;
			animation: tickerScroll 18s linear infinite;
			will-change: transform;
		}
		.smarter-ticker-track:hover {
			animation-play-state: paused;
		}
		.smarter-slider-wrapper {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			min-height: 24px;
			overflow: hidden;
		}
		.smarter-slide-item {
			display: none;
			align-items: center;
			justify-content: center;
			gap: 8px;
			white-space: nowrap;
			opacity: 0;
			transform: translateX(40px);
			transition: opacity 0.4s ease, transform 0.4s ease;
		}
		.smarter-slide-item.active {
			display: inline-flex;
			opacity: 1;
			transform: translateX(0);
			animation: slideOneByOne 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}
		@keyframes slideOneByOne {
			0% {
				opacity: 0;
				transform: translateX(50px);
			}
			100% {
				opacity: 1;
				transform: translateX(0);
			}
		}
		.smarter-content-container {
			display: flex;
			align-items: center;
			flex: 1;
			min-width: 0;
			overflow: hidden;
		}
		.smarter-content-container.is-static {
			justify-content: center;
			flex-wrap: wrap;
			gap: 8px;
			white-space: pre-wrap;
			word-break: break-word;
		}
		.smarter-content-container b,
		.smarter-content-container strong,
		.smarter-static-text b,
		.smarter-static-text strong {
			font-weight: 800 !important;
		}
		.smarter-content-container i,
		.smarter-content-container em,
		.smarter-static-text i,
		.smarter-static-text em {
			font-style: italic !important;
		}
		.smarter-content-container u,
		.smarter-static-text u {
			text-decoration: underline !important;
		}
		.smarter-content-container a,
		.smarter-static-text a {
			color: inherit !important;
			text-decoration: underline !important;
		}
		.smarter-content-container.is-sliding {
			justify-content: center;
			white-space: nowrap;
		}
		.smarter-content-container.is-marquee {
			justify-content: flex-start;
			white-space: nowrap;
		}
		#smarter-announcement-bar-root {
			width: 100%;
			background-color: ${config.backgroundColor || "#84cc16"};
			color: ${config.textColor || "#000000"};
			font-size: ${fontSize};
			padding: ${pad};
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		}
		#smarter-announcement-bar-root.is-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 99999;
			box-shadow: 0 -2px 10px rgba(0,0,0,0.12);
		}
		#smarter-announcement-bar-root.is-top {
			position: relative;
			top: 0;
			left: 0;
			z-index: 9999;
			box-shadow: 0 2px 8px rgba(0,0,0,0.06);
		}
		.hide-always { display: none !important; }
		@media (min-width: 641px) {
			.hide-on-desktop { display: none !important; }
		}
		@media (max-width: 640px) {
			.hide-on-mobile { display: none !important; }
			#smarter-announcement-bar-root {
				flex-direction: column;
				text-align: center;
				gap: 8px;
			}
		}
	</style>
	<div id="smarter-announcement-bar-root" class="${config.position === "bottom" ? "is-bottom" : "is-top"}">
		${
			isMarquee
				? `<div class="smarter-content-container is-marquee">
						<div class="smarter-ticker-track">
							${marqueeItemsHtml}
							${countdownHtml}
							${discountHtml}
						</div>
				   </div>`
				: isSliding
				? `<div class="smarter-content-container is-sliding">
						<div class="smarter-slider-wrapper">
							${slidingItemsHtml}
						</div>
				   </div>`
				: `<div class="smarter-content-container is-static">
						${isIconRight ? "" : iconHtml}
						<span class="smarter-static-text" style="white-space: pre-wrap; word-break: break-word; display: inline-block;">${formatText(config.text || messages[0])}</span>
						${isIconRight ? iconHtml : ""}
						${countdownHtml}
						${discountHtml}
						${leadFormHtml}
				   </div>`
		}
		<div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
			${buttonHtml}
			${closeHtml}
		</div>
	</div>
	<script>
		(function() {
			var barEl = document.getElementById('smarter-announcement-bar-root');
			if (!barEl) return;
			var isBottom = barEl.classList.contains('is-bottom');
			var appearance = "${appearanceAfterClick}";
			var isDismissed = false;
			if (appearance === "dont_show") {
				isDismissed = localStorage.getItem('smarter_bar_dismissed') === 'true';
			} else if (appearance === "next_session") {
				isDismissed = sessionStorage.getItem('smarter_bar_dismissed') === 'true';
			}
			if (isDismissed) {
				barEl.style.display = 'none';
			} else if (isBottom) {
				document.body.style.paddingBottom = barEl.offsetHeight + 'px';
			}

			// One-by-one sliding carousel
			var slides = barEl.querySelectorAll('.smarter-slide-item');
			if (slides && slides.length > 1) {
				var currentIndex = 0;
				setInterval(function() {
					slides[currentIndex].classList.remove('active');
					currentIndex = (currentIndex + 1) % slides.length;
					slides[currentIndex].classList.add('active');
				}, 3500);
			}
		})();
		function dismissSmarterBar() {
			var bar = document.getElementById('smarter-announcement-bar-root');
			if (bar) bar.style.display = 'none';
			document.body.style.paddingBottom = '0px';
			var appearance = "${appearanceAfterClick}";
			if (appearance === "dont_show") {
				localStorage.setItem('smarter_bar_dismissed', 'true');
			} else if (appearance === "next_session") {
				sessionStorage.setItem('smarter_bar_dismissed', 'true');
			}
		}
		function handleSmarterBarCta() {
			var action = "${actionOnClick}";
			if (action === "close") {
				dismissSmarterBar();
			} else if (action === "open_url") {
				var url = "${buttonUrl}";
				if (url) {
					if (!/^https?:\\/\\//i.test(url)) url = "https://" + url;
					window.open(url, "_blank", "noopener,noreferrer");
				}
			} else if (action === "thank_you") {
				var bar = document.getElementById('smarter-announcement-bar-root');
				if (bar) {
					var content = bar.querySelector('.smarter-content-container');
					if (content) {
						content.className = 'smarter-content-container is-static';
						content.innerHTML = '<span class="smarter-thank-you-msg" style="white-space: pre-wrap; word-break: break-word; font-size: inherit;">' + ${JSON.stringify(thankYouMessage)} + '</span>';
					}
					var btn = bar.querySelector('.smarter-cta-btn');
					if (btn) btn.style.display = 'none';
				}
			} else if (action === "show_coupon" || action === "copy_code") {
				if (navigator.clipboard) {
					navigator.clipboard.writeText("${couponCode}");
				}
				alert("Coupon code: ${couponCode} (copied to clipboard!)");
			}
		}
	</script>
	`;
}

export function createPlugin(options = {}) {
	return {
		id: "smarter-announcement-bar",
		version: "0.1.0",
		capabilities: ["hooks.page-fragments:register"],
		allowedHosts: [],
		storage: {},
		hooks: {
			"page:fragments": {
				pluginId: "smarter-announcement-bar",
				priority: 0,
				timeout: 5000,
				dependencies: [],
				errorPolicy: "continue" as const,
				exclusive: false,
				handler: async () => {
					const config = getPublishedConfig();
					if (!config || !config.enabled) return null;
					return {
						kind: "html" as const,
						placement: (config.position === "bottom" ? "body:end" : "body:start") as "body:start" | "body:end",
						html: renderPublicBar(config),
					};
				},
			},
		},
		routes: {
			publish: {
				public: true,
				methods: ["POST"],
				request: { body: "json" },
				handler: async (routeCtx: any) => {
					const input = routeCtx.input;
					if (input && typeof input === "object") {
						savePublishedConfig(input as BarConfig);
						return { success: true, message: "Announcement bar published successfully" };
					}
					return { success: false, error: "Invalid configuration" };
				},
			},
			config: {
				public: true,
				methods: ["GET"],
				handler: async () => {
					return { success: true, config: getPublishedConfig() };
				},
			},
		},
		admin: {
			pages: [
				{ path: "/dashboard", label: "Dashboard", group: "Smarter Announcement Bar" },
				{ path: "/customize-bar", label: "Customize Bar", group: "Smarter Announcement Bar" },
				{ path: "/pricing", label: "Plans", group: "Smarter Announcement Bar" },
				{ path: "/bar-analytics", label: "Analytics", group: "Smarter Announcement Bar" },
				{ path: "/contact-form-leads", label: "Contact", group: "Smarter Announcement Bar" },
				{ path: "/faqs", label: "FAQs", group: "Smarter Announcement Bar" },
			],
		},
	};
}

const descriptor = Object.freeze({
	id: "smarter-announcement-bar",
	version: "0.1.0",
	format: "native",
	entrypoint: "smarter-announcement-bar",
	adminEntry: "smarter-announcement-bar/admin",
	capabilities: ["hooks.page-fragments:register"],
	allowedHosts: [],
	storage: {},
	hooks: [],
	routes: [],
	adminPages: [
		{ path: "/dashboard", label: "Dashboard", group: "Smarter Announcement Bar" },
		{ path: "/customize-bar", label: "Customize Bar", group: "Smarter Announcement Bar" },
		{ path: "/pricing", label: "Plans", group: "Smarter Announcement Bar" },
		{ path: "/bar-analytics", label: "Analytics", group: "Smarter Announcement Bar" },
		{ path: "/contact-form-leads", label: "Contact", group: "Smarter Announcement Bar" },
		{ path: "/faqs", label: "FAQs", group: "Smarter Announcement Bar" },
	],
});

export default descriptor;
