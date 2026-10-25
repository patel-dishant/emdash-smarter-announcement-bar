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
	countdownTarget: string;
	countdownUrgencyText?: string;
	countdownTimezone?: string;
	countdownHideLabels?: boolean;
	countdownChangeLabels?: boolean;
	countdownDaysLabel?: string;
	countdownHoursLabel?: string;
	countdownMinutesLabel?: string;
	countdownSecondsLabel?: string;
	leadFormEnabled: boolean;
	leadNamePlaceholder?: string;
	leadEmailPlaceholder?: string;
	leadFormButtonLabel: string;
	leadSendMail?: boolean;
	leadEmailAddress?: string;
	leadSenderName?: string;
	leadEmailSubject?: string;
	discountEnabled: boolean;
	discountCode: string;
	showCouponWhen?: "rightaway" | "claims_it" | "after_click" | string;
	couponBarText?: string;
	couponCode?: string;
	copiedTooltipText?: string;
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
	countdownTarget: "2026-10-25 11:16:55",
	countdownUrgencyText: "",
	countdownTimezone: "Eritrea/Asmara",
	countdownHideLabels: false,
	countdownChangeLabels: true,
	countdownDaysLabel: "Days",
	countdownHoursLabel: "Hours",
	countdownMinutesLabel: "Minutes",
	countdownSecondsLabel: "Seconds",
	leadFormEnabled: false,
	leadNamePlaceholder: "Enter your name",
	leadEmailPlaceholder: "Enter your email address",
	leadFormButtonLabel: "Join",
	leadSendMail: true,
	leadEmailAddress: "kokenap418@copytosh.com",
	leadSenderName: "{name}",
	leadEmailSubject: "New lead from my announcement bar from {name} on {date} {hours}",
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

	const hasButtonDesktop = config.buttonDevices ? config.buttonDevices.includes("desktop") : true;
	const hasButtonMobile = config.buttonDevices ? config.buttonDevices.includes("mobile") : true;
	const isButtonActive = Boolean((hasButtonDesktop || hasButtonMobile) && config.buttonText);
	const isLeadFormActive = Boolean(anyConfig.leadFormEnabled && isButtonActive);
	const isCountdownActive = Boolean(config.countdownEnabled && !isLeadFormActive);

	const countdownHtml = isCountdownActive
		? `<div id="smarter-countdown-root" class="smarter-countdown-root" data-target="${anyConfig.countdownTarget || "2026-10-25 11:16:55"}" data-tz="${anyConfig.countdownTimezone || "Eritrea/Asmara"}">
				<div class="smarter-countdown-unit">
					<div class="smarter-countdown-digits">
						<span class="smarter-countdown-digit-box" data-unit="d0">0</span>
						<span class="smarter-countdown-digit-box" data-unit="d1">0</span>
					</div>
					${!anyConfig.countdownHideLabels ? `<span class="smarter-countdown-unit-label">${anyConfig.countdownDaysLabel || "Days"}</span>` : ""}
				</div>
				<span class="smarter-countdown-colon">:</span>
				<div class="smarter-countdown-unit">
					<div class="smarter-countdown-digits">
						<span class="smarter-countdown-digit-box" data-unit="h0">0</span>
						<span class="smarter-countdown-digit-box" data-unit="h1">0</span>
					</div>
					${!anyConfig.countdownHideLabels ? `<span class="smarter-countdown-unit-label">${anyConfig.countdownHoursLabel || "Hours"}</span>` : ""}
				</div>
				<span class="smarter-countdown-colon">:</span>
				<div class="smarter-countdown-unit">
					<div class="smarter-countdown-digits">
						<span class="smarter-countdown-digit-box" data-unit="m0">0</span>
						<span class="smarter-countdown-digit-box" data-unit="m1">0</span>
					</div>
					${!anyConfig.countdownHideLabels ? `<span class="smarter-countdown-unit-label">${anyConfig.countdownMinutesLabel || "Minutes"}</span>` : ""}
				</div>
				<span class="smarter-countdown-colon">:</span>
				<div class="smarter-countdown-unit">
					<div class="smarter-countdown-digits">
						<span class="smarter-countdown-digit-box" data-unit="s0">0</span>
						<span class="smarter-countdown-digit-box" data-unit="s1">0</span>
					</div>
					${!anyConfig.countdownHideLabels ? `<span class="smarter-countdown-unit-label">${anyConfig.countdownSecondsLabel || "Seconds"}</span>` : ""}
				</div>
		   </div>`
		: "";

	const couponTextTitle = anyConfig.couponBarText ? anyConfig.couponBarText.replace(/<[^>]*>/g, "") : "Click to copy your coupon";
	const copiedTip = (anyConfig.copiedTooltipText || "copied").replace(/"/g, "&quot;");
	const couponBadgeHtml = `<span class="smarter-coupon-badge" style="position: relative; margin-left: 12px; display: inline-flex; align-items: center; justify-content: center; padding: 2px 3px; border: 2px dashed #ffffff; border-radius: 6px; cursor: pointer; vertical-align: middle; user-select: none;" onclick="copySmarterCoupon(this, '${couponCode}', '${copiedTip}')" title="${couponTextTitle}"><span class="smarter-coupon-code-pill" style="background: #ffffff; color: #000000; padding: 3px 12px; border-radius: 4px; font-weight: bold; font-size: 13px; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 5px; line-height: 1.3; transition: all 0.2s ease;"><span class="smarter-coupon-text-inner">${couponCode}</span></span><span class="smarter-copied-tooltip" style="display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #0f172a; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 99999;"><svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" style="display: inline-block; vertical-align: -1px; margin-right: 4px; color: #22c55e;"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>${copiedTip}<span style="position: absolute; top: 100%; left: 50%; margin-left: -4px; border-width: 4px; border-style: solid; border-color: #0f172a transparent transparent transparent;"></span></span></span>`;
	const showDiscountRightaway = Boolean(
		config.discountEnabled &&
		config.showCouponWhen === "rightaway"
	);
	const discountHtml = showDiscountRightaway ? couponBadgeHtml : "";

	const leadFormHtml = (!showDiscountRightaway && isLeadFormActive)
		? `<form id="smarter-lead-form" class="smarter-lead-form" style="display: flex; gap: 6px; align-items: center; margin: 0 4px;" onsubmit="event.preventDefault(); handleSmarterLeadSubmit(this);">
				<input type="text" id="smarter-lead-name" name="name" placeholder="${anyConfig.leadNamePlaceholder || "Enter your name"}" style="padding: 5px 10px; border: 1px solid rgba(0,0,0,0.2); border-radius: 4px; font-size: 13px; background: rgba(255,255,255,0.95); color: #111; max-width: 120px;" />
				<input type="email" id="smarter-lead-email" name="email" placeholder="${anyConfig.leadEmailPlaceholder || anyConfig.leadFormPlaceholder || "Enter your email address"}" required style="padding: 5px 10px; border: 1px solid rgba(0,0,0,0.2); border-radius: 4px; font-size: 13px; background: rgba(255,255,255,0.95); color: #111; max-width: 160px;" />
		   </form>`
		: "";

	const buttonDeviceClass = (!hasButtonDesktop && hasButtonMobile) ? "hide-on-desktop" : (hasButtonDesktop && !hasButtonMobile) ? "hide-on-mobile" : (!hasButtonDesktop && !hasButtonMobile) ? "hide-always" : "";

	const buttonHtml = (!showDiscountRightaway && isButtonActive)
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

	const iconHtml = (!showDiscountRightaway && config.textIcon && config.textIcon.dataUrl)
		? `<img src="${config.textIcon.dataUrl}" style="${iconImgStyle}" alt="icon" />`
		: "";
	const isIconRight = config.iconPosition === "right";

	const rawMessages: string[] = showDiscountRightaway
		? [anyConfig.couponBarText || "Click to copy your coupon"]
		: ((config.messages && config.messages.length > 0)
			? config.messages
			: (config.text ? config.text.split("\n") : []));
	const messages = rawMessages.map((m) => (m || "").trim()).filter(Boolean);
	if (messages.length === 0) {
		messages.push(showDiscountRightaway ? (anyConfig.couponBarText || "Click to copy your coupon") : (config.text || "Get 30% off your first purchase"));
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
			overflow: visible;
		}
		.smarter-copied-tooltip {
			animation: smarterTooltipIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}
		@keyframes smarterTooltipIn {
			from { opacity: 0; transform: translate(-50%, 4px); }
			to { opacity: 1; transform: translate(-50%, 0); }
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
		.smarter-countdown-root {
			display: inline-flex;
			align-items: center;
			gap: 3px;
			user-select: none;
		}
		.smarter-countdown-unit {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.smarter-countdown-digits {
			display: inline-flex;
			align-items: center;
			gap: 2px;
		}
		.smarter-countdown-digit-box {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 17px;
			height: 22px;
			background: #ffffff;
			color: #000000;
			border: 1px solid rgba(0, 0, 0, 0.25);
			border-radius: 3px;
			font-size: 13px;
			font-weight: 700;
			line-height: 1;
			box-shadow: 0 1px 2px rgba(0,0,0,0.06);
		}
		.smarter-countdown-colon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			height: 22px;
			font-size: 13px;
			font-weight: 700;
			color: inherit;
			padding: 0 2px;
			line-height: 1;
		}
		.smarter-countdown-unit-label {
			font-size: 10px;
			font-weight: 600;
			color: inherit;
			margin-top: 2px;
			text-align: center;
			line-height: 1.1;
			letter-spacing: -0.2px;
		}
	</style>
	<div id="smarter-announcement-bar-root" class="${config.position === "bottom" ? "is-bottom" : "is-top"}">
		${
			showDiscountRightaway
				? `<div class="smarter-content-container is-static">
						<span class="smarter-static-text" style="white-space: pre-wrap; word-break: break-word; display: inline-block;">${anyConfig.couponBarText || "Click to copy your coupon"}</span>
						${discountHtml}
				   </div>`
				: isMarquee
				? `<div class="smarter-content-container is-marquee">
						<div class="smarter-ticker-track">
							${marqueeItemsHtml}
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
						${discountHtml}
						${leadFormHtml}
				   </div>`
		}
		<div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
			${countdownHtml}
			${buttonHtml}
			${closeHtml}
		</div>
	</div>
	<script>
		(function initCountdown() {
			var root = document.getElementById('smarter-countdown-root');
			if (!root) return;
			var targetRaw = root.getAttribute('data-target') || '';
			function tick() {
				if (!targetRaw) return;
				var target = new Date(targetRaw.replace(' ', 'T'));
				if (isNaN(target.getTime())) target = new Date(targetRaw);
				var diff = 0;
				if (!isNaN(target.getTime())) {
					diff = Math.max(0, target.getTime() - Date.now());
				}
				var s = Math.floor(diff / 1000);
				var days = Math.floor(s / 86400);
				var hours = Math.floor((s % 86400) / 3600);
				var mins = Math.floor((s % 3600) / 60);
				var secs = s % 60;

				var dStr = String(days).padStart(2, '0');
				var hStr = String(hours).padStart(2, '0');
				var mStr = String(mins).padStart(2, '0');
				var sStr = String(secs).padStart(2, '0');

				var d0 = root.querySelector('[data-unit="d0"]');
				var d1 = root.querySelector('[data-unit="d1"]');
				var h0 = root.querySelector('[data-unit="h0"]');
				var h1 = root.querySelector('[data-unit="h1"]');
				var m0 = root.querySelector('[data-unit="m0"]');
				var m1 = root.querySelector('[data-unit="m1"]');
				var s0 = root.querySelector('[data-unit="s0"]');
				var s1 = root.querySelector('[data-unit="s1"]');

				if (d0) d0.textContent = dStr[0] || '0';
				if (d1) d1.textContent = dStr[1] || '0';
				if (h0) h0.textContent = hStr[0] || '0';
				if (h1) h1.textContent = hStr[1] || '0';
				if (m0) m0.textContent = mStr[0] || '0';
				if (m1) m1.textContent = mStr[1] || '0';
				if (s0) s0.textContent = sStr[0] || '0';
				if (s1) s1.textContent = sStr[1] || '0';
			}
			tick();
			setInterval(tick, 1000);
		})();
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
			if (bar) bar.style.setProperty('display', 'none', 'important');
			document.body.style.paddingBottom = '0px';
			var appearance = "${appearanceAfterClick}";
			if (appearance === "dont_show") {
				localStorage.setItem('smarter_bar_dismissed', 'true');
			} else if (appearance === "next_session") {
				sessionStorage.setItem('smarter_bar_dismissed', 'true');
			}
		}
		function copySmarterCoupon(badgeEl, code, copiedText) {
			if (navigator.clipboard) {
				navigator.clipboard.writeText(code);
			}
			if (!badgeEl) return;
			var pillEl = badgeEl.querySelector('.smarter-coupon-code-pill');
			var innerEl = badgeEl.querySelector('.smarter-coupon-text-inner');
			var tooltipEl = badgeEl.querySelector('.smarter-copied-tooltip');
			var checkSvg = '<svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" style="display: inline-block; vertical-align: -1px; margin-right: 4px; color: #16a34a;"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>';
			
			if (pillEl) {
				pillEl.style.background = '#ecfdf5';
				pillEl.style.color = '#065f46';
			}
			if (innerEl) {
				innerEl.innerHTML = checkSvg + (copiedText || "copied");
			}
			if (tooltipEl) {
				tooltipEl.style.display = 'inline-flex';
				tooltipEl.style.alignItems = 'center';
			}
			
			if (badgeEl._resetTimer) clearTimeout(badgeEl._resetTimer);
			badgeEl._resetTimer = setTimeout(function() {
				if (pillEl) {
					pillEl.style.background = '#ffffff';
					pillEl.style.color = '#000000';
				}
				if (innerEl) {
					innerEl.textContent = code;
				}
				if (tooltipEl) {
					tooltipEl.style.display = 'none';
				}
			}, 2200);
		}
		function handleSmarterLeadSubmit(form) {
			var isClaimsIt = ${Boolean(config.discountEnabled && config.showCouponWhen !== "rightaway")};
			var nameVal = (form && form.elements && form.elements.name) ? form.elements.name.value : '';
			var emailVal = (form && form.elements && form.elements.email) ? form.elements.email.value : '';
			if (isClaimsIt) {
				var bar = document.getElementById('smarter-announcement-bar-root');
				if (bar) {
					var content = bar.querySelector('.smarter-content-container');
					if (content) {
						content.className = 'smarter-content-container is-static';
						content.innerHTML = '<span class="smarter-coupon-bar-text" style="white-space: pre-wrap; word-break: break-word; font-size: inherit;">' + ${JSON.stringify(anyConfig.couponBarText || "Click to copy your coupon")} + '</span> ' + ${JSON.stringify(couponBadgeHtml)};
					}
					var btn = bar.querySelector('.smarter-cta-btn');
					if (btn) btn.style.display = 'none';
				}
				if (navigator.clipboard) {
					navigator.clipboard.writeText("${couponCode}");
				}
				if (emailVal) {
					try {
						var leads = JSON.parse(localStorage.getItem('smarter_bar_subscribers') || '[]');
						leads.push({ name: nameVal, email: emailVal, date: new Date().toISOString() });
						localStorage.setItem('smarter_bar_subscribers', JSON.stringify(leads));
						localStorage.setItem('smarter_bar_subscriber', emailVal);
					} catch(e) {}
				}
			} else {
				if (emailVal) {
					try {
						var leads = JSON.parse(localStorage.getItem('smarter_bar_subscribers') || '[]');
						leads.push({ name: nameVal, email: emailVal, date: new Date().toISOString() });
						localStorage.setItem('smarter_bar_subscribers', JSON.stringify(leads));
					} catch(e) {}
				}
				if (form && typeof form.reset === 'function') form.reset();
				dismissSmarterBar();
			}
		}
		function handleSmarterBarCta() {
			var isLeadForm = ${Boolean(isLeadFormActive)};
			if (isLeadForm) {
				var leadForm = document.getElementById('smarter-lead-form');
				if (leadForm) {
					var emailInput = leadForm.querySelector('input[type="email"]') || leadForm.querySelector('input');
					if (emailInput && !emailInput.checkValidity()) {
						emailInput.reportValidity();
						return;
					}
					handleSmarterLeadSubmit(leadForm);
					return;
				}
			}
			var isClaimsIt = ${Boolean(config.discountEnabled && config.showCouponWhen !== "rightaway")};
			var action = "${actionOnClick}";
			if (isClaimsIt || action === "show_coupon" || action === "copy_code") {
				var bar = document.getElementById('smarter-announcement-bar-root');
				if (bar) {
					var content = bar.querySelector('.smarter-content-container');
					if (content) {
						content.className = 'smarter-content-container is-static';
						content.innerHTML = '<span class="smarter-coupon-bar-text" style="white-space: pre-wrap; word-break: break-word; font-size: inherit;">' + ${JSON.stringify(anyConfig.couponBarText || "Click to copy your coupon")} + '</span> ' + ${JSON.stringify(couponBadgeHtml)};
					}
					var btn = bar.querySelector('.smarter-cta-btn');
					if (btn) btn.style.display = 'none';
				}
				if (navigator.clipboard) {
					navigator.clipboard.writeText("${couponCode}");
				}
				return;
			}
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
