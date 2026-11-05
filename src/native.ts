import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configFile = resolve(__dirname, "..", "published-bar.json");
const barsConfigFile = resolve(__dirname, "..", "published-bars.json");

export interface BarConfig {
	id?: string;
	views?: number;
	clicks?: number;
	leads?: number;
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
	closeButtonColor?: string;
	backgroundType?: "color" | "gradient" | "image";
	backgroundGradient?: string;
	gradientColorA?: string;
	gradientColorB?: string;
	gradientColorC?: string;
	gradientMiddleEnabled?: boolean;
	gradientAngle?: number;
	gradientStartColor?: string;
	gradientEndColor?: string;
	gradientDirection?: string;
	backgroundImage?: string;
	backgroundRepeat?: "repeat" | "no-repeat" | "repeat-x" | "repeat-y" | string;
	backgroundSize?: number | string;
	fontFamily?: string;
	fontSizePx?: number;
	mobileFontSizePx?: number;
	textAlign?: "left" | "center" | "right";
	buttonPositionRelative?: boolean;
	buttonPosition?: "left" | "center" | "right";
	buttonFontSizePx?: number;
	buttonPaddingTopBottom?: number;
	buttonPaddingLeftRight?: number;
	buttonBorderRadius?: number;
	buttonBorderStyle?: "none" | "solid" | "dashed" | "dotted" | "double";
	buttonBorderColor?: string;
	buttonBorderWidth?: number;
	buttonMobileFontSizePx?: number;
	customCss?: string;
	backgroundColor: string;
	textColor: string;
	buttonBackgroundColor: string;
	buttonTextColor: string;
	fontSize: "sm" | "md" | "lg";
	padding: "compact" | "normal" | "spacious";

	// Step 3: Display Rules
	devices?: ("desktop" | "mobile")[];
	entryEffect?: "none" | "slide" | "fade";
	triggerType?: "seconds" | "scroll";
	triggerSeconds?: number;
	triggerScrollPercentage?: number;
	dateSchedulingTimezone?: string;
	dateRanges?: Array<{ id: string; start: string; end: string }>;
	pageRules?: Array<{ id: string; mode: "show" | "hide"; rule: string; value?: string }>;
	userTargeting?: string;
	desktopOs?: string;
	desktopBrowser?: string;
	mobileOs?: string;
	mobileBrowser?: string;
	countryTargeting?: string;
	languageTargetingEnabled?: boolean;
	languageTargeting?: string[];
	targetPages?: string;
	targetUrls?: string;
	targetDevices?: string;
	targetVisitors?: string;
	startDate?: string;
	endDate?: string;
}

export function getFutureDefaultTarget(daysAhead: number = 7): string {
	const d = new Date(Date.now() + daysAhead * 86400000);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const DEFAULT_CONFIG: BarConfig = {
	id: "bar_1",
	views: 0,
	clicks: 0,
	leads: 0,
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
	countdownTarget: getFutureDefaultTarget(7),
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
	closeButtonColor: "#000000",
	backgroundType: "color",
	backgroundGradient: "linear-gradient(45deg, #fbc6a4 0%, #d94680 50%, #3b1c66 100%)",
	gradientColorA: "#fbc6a4",
	gradientColorB: "#d94680",
	gradientColorC: "#3b1c66",
	gradientMiddleEnabled: true,
	gradientAngle: 45,
	gradientStartColor: "#fbc6a4",
	gradientEndColor: "#3b1c66",
	gradientDirection: "45deg",
	backgroundImage: "",
	backgroundRepeat: "repeat",
	backgroundSize: 50,
	fontFamily: "Arial",
	fontSizePx: 16,
	mobileFontSizePx: 12,
	textAlign: "center",
	buttonPositionRelative: false,
	buttonPosition: "center",
	buttonFontSizePx: 16,
	buttonPaddingTopBottom: 5,
	buttonPaddingLeftRight: 12,
	buttonBorderRadius: 1,
	buttonBorderStyle: "none",
	buttonBorderColor: "#000000",
	buttonBorderWidth: 1,
	buttonMobileFontSizePx: 12,
	customCss: ".smarter-annoucement-bar-front-container.smarter-annoucement-bar-form-wrapper.smarter-annoucement-bar-modal-content",
	backgroundColor: "#84cc16",
	textColor: "#000000",
	buttonBackgroundColor: "#000000",
	buttonTextColor: "#ffffff",
	fontSize: "md",
	padding: "normal",

	// Step 3: Display Rules
	devices: ["desktop", "mobile"],
	entryEffect: "none",
	triggerType: "seconds",
	triggerSeconds: 0,
	triggerScrollPercentage: 50,
	dateSchedulingTimezone: "Central African Republic/Bangui",
	dateRanges: [
		{ id: "range_1", start: "", end: "" },
		{ id: "range_2", start: "", end: "" },
		{ id: "range_3", start: "", end: "" },
	],
	pageRules: [
		{ id: "rule_1", mode: "show", rule: "select_rule", value: "" },
	],
	userTargeting: "all",
	desktopOs: "",
	desktopBrowser: "",
	mobileOs: "",
	mobileBrowser: "",
	countryTargeting: "",
	languageTargetingEnabled: false,
	languageTargeting: [],
	targetPages: "all",
	targetUrls: "",
	targetDevices: "all",
	targetVisitors: "all",
	startDate: "",
	endDate: "",
};

export function getPublishedBars(): BarConfig[] {
	try {
		if (existsSync(barsConfigFile)) {
			const data = readFileSync(barsConfigFile, "utf-8");
			const parsed = JSON.parse(data);
			if (Array.isArray(parsed) && parsed.length > 0) {
				return parsed.map((b) => ({ ...DEFAULT_CONFIG, ...b }));
			}
		}
	} catch {
		// ignore
	}
	try {
		if (existsSync(configFile)) {
			const data = readFileSync(configFile, "utf-8");
			const single = { ...DEFAULT_CONFIG, ...JSON.parse(data) };
			if (!single.id) single.id = "bar_1";
			if (single.views === undefined) single.views = 0;
			if (single.clicks === undefined) single.clicks = 0;
			if (single.leads === undefined) single.leads = 0;
			return [single];
		}
	} catch {
		// ignore
	}
	return [{ ...DEFAULT_CONFIG, id: "bar_1", views: 0, clicks: 0, leads: 0 }];
}

export function savePublishedBars(bars: BarConfig[]): void {
	try {
		const sanitized = bars.map((b) => ({ ...DEFAULT_CONFIG, ...b }));
		writeFileSync(barsConfigFile, JSON.stringify(sanitized, null, 2), "utf-8");
		const anyEnabled = sanitized.find((b) => b && b.enabled);
		const activeBar = anyEnabled
			? anyEnabled
			: { ...(sanitized[0] || DEFAULT_CONFIG), enabled: false };
		writeFileSync(configFile, JSON.stringify(activeBar, null, 2), "utf-8");
	} catch (err) {
		console.error("Failed to write published-bars.json:", err);
	}
}

export function getPublishedConfig(): BarConfig {
	const bars = getPublishedBars();
	const active = bars.find((b) => b && b.enabled);
	if (!active) {
		const fallback = bars[0] || DEFAULT_CONFIG;
		return { ...fallback, enabled: false };
	}
	return active;
}

export function savePublishedConfig(config: BarConfig): void {
	try {
		const target: BarConfig = (config as any)?.bar && typeof (config as any).bar === "object"
			? (config as any).bar
			: config;
		const bars = getPublishedBars();
		const idx = bars.findIndex((b) => (b.id && target.id && b.id === target.id) || b.name === target.name);
		if (idx >= 0) {
			bars[idx] = { ...DEFAULT_CONFIG, ...bars[idx], ...target };
		} else if (target.id) {
			bars.push({ ...DEFAULT_CONFIG, ...target });
		} else {
			if (bars.length > 0) {
				bars[0] = { ...DEFAULT_CONFIG, ...bars[0], ...target };
			} else {
				bars.push({ ...DEFAULT_CONFIG, ...target, id: "bar_1" });
			}
		}
		if (target.enabled) {
			bars.forEach((b) => {
				if (b.id !== target.id && b.position === target.position) {
					b.enabled = false;
				}
			});
		}
		writeFileSync(barsConfigFile, JSON.stringify(bars, null, 2), "utf-8");
		// Keep published-bar.json synced
		const anyEnabled = bars.find((b) => b && b.enabled);
		const activeBar = target.enabled
			? target
			: (anyEnabled || (bars[0] ? { ...bars[0], enabled: false } : { ...DEFAULT_CONFIG, enabled: false }));
		writeFileSync(configFile, JSON.stringify(activeBar, null, 2), "utf-8");
	} catch (err) {
		console.error("Failed to write published-bar.json:", err);
	}
}

export function renderPublicBar(config: BarConfig): string {
	if (!config || !config.enabled) return "";

	const barIdClean = (config.id || "bar_" + (config.name || "default")).replace(/[^a-zA-Z0-9_-]/g, "_");
	const barDomId = `smarter-bar-${barIdClean}`;
	const countdownDomId = `smarter-countdown-${barIdClean}`;
	const leadFormDomId = `smarter-lead-form-${barIdClean}`;

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
	const isMultiRowMobile = Boolean(isLeadFormActive || isCountdownActive);

	const targetDateVal = (!anyConfig.countdownTarget || anyConfig.countdownTarget === "2026-10-25 11:16:55")
		? getFutureDefaultTarget(7)
		: anyConfig.countdownTarget;

	const countdownHtml = isCountdownActive
		? `<div id="${countdownDomId}" class="smarter-countdown-root" data-target="${targetDateVal}" data-tz="${anyConfig.countdownTimezone || "Eritrea/Asmara"}">
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
	const couponBadgeHtml = `<span class="smarter-coupon-badge" style="position: relative; margin-left: 12px; display: inline-flex; align-items: center; justify-content: center; padding: 2px 3px; border: 2px dashed #ffffff; border-radius: 6px; cursor: pointer; vertical-align: middle; user-select: none;" onclick="copySmarterCoupon(this, '${couponCode}', '${copiedTip}', '${config.id || barIdClean}')" title="${couponTextTitle}"><span class="smarter-coupon-code-pill" style="background: #ffffff; color: #000000; padding: 3px 12px; border-radius: 4px; font-weight: bold; font-size: 13px; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 5px; line-height: 1.3; transition: all 0.2s ease;"><span class="smarter-coupon-text-inner">${couponCode}</span></span><span class="smarter-copied-tooltip" style="display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #0f172a; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 99999;"><svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" style="display: inline-block; vertical-align: -1px; margin-right: 4px; color: #22c55e;"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>${copiedTip}<span style="position: absolute; top: 100%; left: 50%; margin-left: -4px; border-width: 4px; border-style: solid; border-color: #0f172a transparent transparent transparent;"></span></span></span>`;
	const showDiscountRightaway = Boolean(
		config.discountEnabled &&
		config.showCouponWhen === "rightaway"
	);
	const discountHtml = showDiscountRightaway ? couponBadgeHtml : "";

	const buttonDeviceClass = (!hasButtonDesktop && hasButtonMobile) ? "hide-on-desktop" : (hasButtonDesktop && !hasButtonMobile) ? "hide-on-mobile" : (!hasButtonDesktop && !hasButtonMobile) ? "hide-always" : "";

	const isButtonInline = Boolean(config.buttonPositionRelative);
	const buttonPos = config.buttonPosition || "center";
	const btnMargin = isButtonInline
		? (buttonPos === "left" ? "margin-right: 12px;" : buttonPos === "right" ? "margin-left: auto;" : "margin-left: 12px;")
		: "";
	const btnBorder = (config.buttonBorderStyle && config.buttonBorderStyle !== "none")
		? `${config.buttonBorderWidth || 1}px ${config.buttonBorderStyle} ${config.buttonBorderColor || "#000000"}`
		: "none";
	const buttonHtml = (!showDiscountRightaway && isButtonActive)
		? `<button type="button" class="smarter-cta-btn ${effectClass} ${buttonDeviceClass}" style="background-color: ${
				config.buttonBackgroundColor || "#000000"
		  } !important; color: ${
				config.buttonTextColor || "#ffffff"
		  } !important; border: ${btnBorder}; border-radius: ${config.buttonBorderRadius ?? 1}px; padding: ${config.buttonPaddingTopBottom ?? 5}px ${config.buttonPaddingLeftRight ?? 12}px; font-weight: 600; font-size: ${config.buttonFontSizePx ?? 16}px; cursor: pointer; ${btnMargin}" onclick="handleSmarterBarCta_${barIdClean}()">${
				config.buttonText
		  }</button>`
		: "";

	const leadFormHtml = (!showDiscountRightaway && isLeadFormActive)
		? `<form id="${leadFormDomId}" class="smarter-lead-form" style="display: inline-flex; gap: 6px; align-items: center; margin: 0 6px;" onsubmit="event.preventDefault(); handleSmarterLeadSubmit_${barIdClean}(this);">
				<input type="text" id="smarter-lead-name-${barIdClean}" name="name" placeholder="${anyConfig.leadNamePlaceholder || "Enter your name"}" style="padding: 5px 10px; border: 1px solid rgba(0,0,0,0.2); border-radius: 4px; font-size: 13px; background: rgba(255,255,255,0.95); color: #111; max-width: 120px;" />
				<input type="email" id="smarter-lead-email-${barIdClean}" name="email" placeholder="${anyConfig.leadEmailPlaceholder || anyConfig.leadFormPlaceholder || "Enter your email address"}" required style="padding: 5px 10px; border: 1px solid rgba(0,0,0,0.2); border-radius: 4px; font-size: 13px; background: rgba(255,255,255,0.95); color: #111; max-width: 160px;" />
				${buttonHtml}
		   </form>`
		: "";

	const hasCloseDesktop = config.closeButtonDevices ? config.closeButtonDevices.includes("desktop") : true;
	const hasCloseMobile = config.closeButtonDevices ? config.closeButtonDevices.includes("mobile") : true;
	const closeDeviceClass = (!hasCloseDesktop && hasCloseMobile) ? "hide-on-desktop" : (hasCloseDesktop && !hasCloseMobile) ? "hide-on-mobile" : (!hasCloseDesktop && !hasCloseMobile) ? "hide-always" : "";

	const closeHtml = `
		<button type="button" class="smarter-close-btn ${closeDeviceClass}" style="background: none; border: none; color: ${config.closeButtonColor || config.textColor || "inherit"}; cursor: pointer; padding: 4px 8px; line-height: 1; display: inline-flex; align-items: center; justify-content: center;" onclick="dismissSmarterBar_${barIdClean}()" aria-label="Close announcement bar">
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

	const barBg = config.backgroundType === "gradient"
		? (config.backgroundGradient || (config.gradientColorA ? `linear-gradient(${config.gradientAngle ?? 45}deg, ${config.gradientColorA} 0%, ${config.gradientMiddleEnabled ? `${config.gradientColorB || "#d94680"} 50%, ` : ""}${config.gradientColorC || "#3b1c66"} 100%)` : `linear-gradient(${config.gradientDirection || "90deg"}, ${config.gradientStartColor || config.backgroundColor || "#84cc16"} 0%, ${config.gradientEndColor || "#38bdf8"} 100%)`))
		: (config.backgroundType === "image" && config.backgroundImage)
		? `url('${config.backgroundImage.replace(/'/g, "\\'")}') ${config.backgroundRepeat || "repeat"}`
		: (config.backgroundColor || "#84cc16");

	const barBgSize = (config.backgroundType === "image" && config.backgroundImage)
		? (config.backgroundSize ? `${config.backgroundSize}px` : "50px")
		: "";
	const barBgRepeat = (config.backgroundType === "image" && config.backgroundImage)
		? (config.backgroundRepeat || "repeat")
		: "";

	const barInlineStyles = [
		`background: ${barBg} !important`,
		barBgSize ? `background-size: ${barBgSize} !important` : "",
		barBgRepeat ? `background-repeat: ${barBgRepeat} !important` : "",
		`color: ${config.textColor || "#000000"} !important`,
		`font-size: ${config.fontSizePx ? `${config.fontSizePx}px` : fontSize} !important`,
		`padding: ${pad} !important`,
		`font-family: ${config.fontFamily ? `${config.fontFamily}, sans-serif` : "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"}`,
	].filter(Boolean).join("; ");

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
		.smarter-content-container {
			display: flex;
			align-items: center;
			justify-content: ${config.textAlign === "left" ? "flex-start" : config.textAlign === "right" ? "flex-end" : "center"};
			text-align: ${config.textAlign || "center"};
			flex: 1;
			overflow: hidden;
		}
		${(config.customCss && config.customCss.includes("{")) ? config.customCss : ""}
		#${barDomId}.smarter-announcement-bar-root {
			width: 100%;
			background: ${barBg} !important;
			${barBgSize ? `background-size: ${barBgSize} !important;` : ""}
			${barBgRepeat ? `background-repeat: ${barBgRepeat} !important;` : ""}
			color: ${config.textColor || "#000000"} !important;
			font-size: ${config.fontSizePx ? `${config.fontSizePx}px` : fontSize};
			padding: ${pad};
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			position: relative;
			font-family: ${config.fontFamily ? `${config.fontFamily}, sans-serif` : "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"};
		}
		#${barDomId}.smarter-announcement-bar-root.is-bottom {
			box-shadow: 0 -2px 10px rgba(0,0,0,0.08);
		}
		#${barDomId}.smarter-announcement-bar-root.is-top {
			box-shadow: 0 2px 8px rgba(0,0,0,0.06);
		}
		#${barDomId} .smarter-cta-btn {
			background-color: ${config.buttonBackgroundColor || "#000000"} !important;
			color: ${config.buttonTextColor || "#ffffff"} !important;
			border: ${btnBorder};
			border-radius: ${config.buttonBorderRadius ?? 1}px;
			padding: ${config.buttonPaddingTopBottom ?? 5}px ${config.buttonPaddingLeftRight ?? 12}px;
			font-weight: 600;
			font-size: ${config.buttonFontSizePx ?? 16}px;
			cursor: pointer;
		}
		.hide-always { display: none !important; }
		@media (min-width: 641px) {
			.hide-on-desktop { display: none !important; }
		}
		@media (max-width: 640px) {
			.hide-on-mobile { display: none !important; }
			#${barDomId}.smarter-announcement-bar-root {
				flex-direction: ${isMultiRowMobile ? "column !important" : "row !important"};
				align-items: center !important;
				justify-content: ${isMultiRowMobile ? "center !important" : "space-between !important"};
				gap: ${isMultiRowMobile ? "8px !important" : "8px !important"};
				padding: ${isMultiRowMobile ? "10px 32px 10px 14px !important" : (config.padding === "compact" ? "4px 8px !important" : config.padding === "spacious" ? "10px 16px !important" : "6px 12px !important")};
				font-size: ${config.mobileFontSizePx ? `${config.mobileFontSizePx}px` : "12px"};
				position: relative !important;
			}
			#${barDomId} .smarter-content-container {
				display: flex !important;
				flex-direction: ${isMultiRowMobile ? "column !important" : "row !important"};
				align-items: center !important;
				justify-content: center !important;
				text-align: center !important;
				width: ${isMultiRowMobile ? "100% !important" : "auto"};
				flex: 1;
				min-width: 0;
				gap: 6px !important;
			}
			#${barDomId} .smarter-static-text {
				white-space: normal !important;
				word-break: break-word !important;
				text-align: center !important;
				line-height: 1.35 !important;
			}
			#${barDomId} .smarter-text-group {
				display: inline-flex !important;
				flex-direction: row !important;
				align-items: center !important;
				justify-content: center !important;
				gap: 8px !important;
				max-width: 100% !important;
			}
			#${barDomId} .smarter-text-group img {
				width: 20px !important;
				height: 20px !important;
				max-height: 20px !important;
				flex-shrink: 0 !important;
				display: inline-block !important;
				vertical-align: middle !important;
			}
			#${barDomId} .smarter-bar-actions {
				display: flex !important;
				align-items: center !important;
				justify-content: center !important;
				gap: 10px !important;
				${isMultiRowMobile ? "width: 100% !important; flex-wrap: wrap !important;" : ""}
			}
			#${barDomId} .smarter-lead-form {
				width: 100% !important;
				display: flex !important;
				align-items: center !important;
				justify-content: center !important;
				gap: 6px !important;
				margin: 0 !important;
			}
			#${barDomId} .smarter-lead-form input {
				flex: 1 !important;
				min-width: 0 !important;
				max-width: none !important;
				padding: 5px 8px !important;
				font-size: 12px !important;
				height: 30px !important;
				border-radius: 4px !important;
				border: 1px solid rgba(0,0,0,0.2) !important;
				background: rgba(255,255,255,0.95) !important;
				color: #111 !important;
				box-sizing: border-box !important;
			}
			#${barDomId} .smarter-lead-form input[type="email"] {
				flex: 1.4 !important;
			}
			#${barDomId} .smarter-cta-btn {
				font-size: ${config.buttonMobileFontSizePx ? `${config.buttonMobileFontSizePx}px` : "12px"} !important;
				padding: 5px 12px !important;
				height: 30px !important;
				line-height: 1 !important;
				box-sizing: border-box !important;
				white-space: nowrap !important;
				flex-shrink: 0 !important;
				margin: 0 !important;
			}
			#${barDomId} .smarter-close-btn {
				${isMultiRowMobile ? "position: absolute !important; top: 8px !important; right: 8px !important;" : ""}
				padding: 4px !important;
				flex-shrink: 0 !important;
			}
			#${barDomId} .smarter-countdown-digit-box {
				font-size: 11px !important;
				padding: 1px 3px !important;
				min-width: 14px !important;
				width: 14px !important;
				height: 20px !important;
			}
			#${barDomId} .smarter-countdown-colon {
				height: 20px !important;
				font-size: 11px !important;
			}
			#${barDomId} .smarter-countdown-unit-label {
				font-size: 9px !important;
			}
		}

		/* Step 3: Entry animations & device rules */
		@keyframes smarterSlideInTop {
			0% {
				transform: translateY(-100%);
				opacity: 0;
			}
			100% {
				transform: translateY(0);
				opacity: 1;
			}
		}
		@keyframes smarterSlideInBottom {
			0% {
				transform: translateY(100%);
				opacity: 0;
			}
			100% {
				transform: translateY(0);
				opacity: 1;
			}
		}
		@keyframes smarterFadeIn {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}

		/* Initial states when entry effect is active (keeps bar hidden/tucked offscreen until animation triggers) */
		#${barDomId}.entry-effect-slide.is-top:not(.entry-animated) {
			transform: translateY(-100%);
			opacity: 0;
		}
		#${barDomId}.entry-effect-slide.is-bottom:not(.entry-animated) {
			transform: translateY(100%);
			opacity: 0;
		}
		#${barDomId}.entry-effect-fade:not(.entry-animated) {
			opacity: 0;
		}

		/* Active animation states triggered by revealBar() */
		#${barDomId}.entry-animated.entry-effect-slide.is-top {
			animation: smarterSlideInTop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
		}
		#${barDomId}.entry-animated.entry-effect-slide.is-bottom {
			animation: smarterSlideInBottom 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
		}
		#${barDomId}.entry-animated.entry-effect-fade {
			animation: smarterFadeIn 0.8s ease-out forwards !important;
		}

		${(config.devices && !config.devices.includes("desktop")) ? `@media (min-width: 768px) { #${barDomId} { display: none !important; } }` : ""}
		${(config.devices && !config.devices.includes("mobile")) ? `@media (max-width: 767px) { #${barDomId} { display: none !important; } }` : ""}
		${(config.triggerType === "scroll" || (config.triggerType === "seconds" && (config.triggerSeconds || 0) > 0)) ? `#${barDomId} { display: none !important; }` : ""}
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
	<div id="${barDomId}" class="smarter-announcement-bar-root ${config.position === "bottom" ? "is-bottom" : "is-top"} entry-effect-${config.entryEffect || "none"} smarter-annoucement-bar-front-container" style="${barInlineStyles.replace(/"/g, "&quot;")}" data-bar-id="${barIdClean}">
		${
			showDiscountRightaway
				? `<div class="smarter-content-container is-static">
						${isButtonInline && buttonPos === "left" ? buttonHtml : ""}
						<span class="smarter-static-text" style="white-space: pre-wrap; word-break: break-word; display: inline-block;">${anyConfig.couponBarText || "Click to copy your coupon"}</span>
						${discountHtml}
						${isButtonInline && buttonPos !== "left" ? buttonHtml : ""}
				   </div>`
				: isMarquee
				? `<div class="smarter-content-container is-marquee">
						<div class="smarter-ticker-track">
							${isButtonInline && buttonPos === "left" ? buttonHtml : ""}
							${marqueeItemsHtml}
							${discountHtml}
							${isButtonInline && buttonPos !== "left" ? buttonHtml : ""}
						</div>
				   </div>`
				: isSliding
				? `<div class="smarter-content-container is-sliding">
						<div class="smarter-slider-wrapper">
							${slidingItemsHtml}
						</div>
						${isButtonInline ? buttonHtml : ""}
				   </div>`
				: `<div class="smarter-content-container is-static">
						${isButtonInline && buttonPos === "left" ? buttonHtml : ""}
						<span class="smarter-text-group" style="display: inline-flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px; vertical-align: middle; max-width: 100%;">
							${isIconRight ? "" : iconHtml}
							<span class="smarter-static-text" style="white-space: pre-wrap; word-break: break-word; display: inline-block;">${formatText(config.text || messages[0])}</span>
							${isIconRight ? iconHtml : ""}
						</span>
						${discountHtml}
						${leadFormHtml}
						${isButtonInline && buttonPos !== "left" ? buttonHtml : ""}
				   </div>`
		}
		<div class="smarter-bar-actions" style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
			${countdownHtml}
			${isLeadFormActive ? "" : (isButtonInline ? "" : buttonHtml)}
			${closeHtml}
		</div>
	</div>
	<script>
		(function initCountdown_${barIdClean}() {
			var root = document.getElementById('${countdownDomId}');
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
		(function initDisplayRules_${barIdClean}() {
			var barEl = document.getElementById('${barDomId}');
			if (!barEl) return;

			// 1. Check dismissal
			var appearance = "${appearanceAfterClick}";
			var isDismissed = false;
			if (appearance === "dont_show") {
				isDismissed = localStorage.getItem('smarter_bar_dismissed_${barIdClean}') === 'true';
			} else if (appearance === "next_session") {
				isDismissed = sessionStorage.getItem('smarter_bar_dismissed_${barIdClean}') === 'true';
			}
			if (isDismissed) {
				barEl.style.display = 'none';
				return;
			}

			// 2. Check Device Targeting
			var devList = ${JSON.stringify(config.devices || ["desktop", "mobile"])};
			var isMob = window.innerWidth < 768;
			if (devList.length === 0) {
				barEl.style.display = 'none';
				return;
			}
			if (isMob && !devList.includes("mobile")) {
				barEl.style.display = 'none';
				return;
			}
			if (!isMob && !devList.includes("desktop")) {
				barEl.style.display = 'none';
				return;
			}

			// 3. Check User Targeting
			var userTarget = "${config.userTargeting || "all"}";
			var hasVisited = localStorage.getItem('smarter_bar_has_visited') === 'true';
			if (userTarget === "new" && hasVisited) {
				barEl.style.display = 'none';
				return;
			}
			if (userTarget === "returning" && !hasVisited) {
				barEl.style.display = 'none';
				return;
			}
			localStorage.setItem('smarter_bar_has_visited', 'true');

			// 4. Check Date Ranges
			var dateRanges = ${JSON.stringify(config.dateRanges || [])};
			var activeRanges = dateRanges.filter(function(r) { return r && (Boolean(r.start && r.start.trim()) || Boolean(r.end && r.end.trim())); });
			if (activeRanges.length > 0) {
				var now = Date.now();
				var inRange = activeRanges.some(function(r) {
					var s = (r.start && r.start.trim()) ? new Date(r.start.trim().replace(' ', 'T')).getTime() : 0;
					var endStr = r.end ? r.end.trim() : "";
					if (endStr && endStr.length === 10) endStr += " 23:59:59";
					else if (endStr && endStr.endsWith(" 00:00:00")) endStr = endStr.replace(" 00:00:00", " 23:59:59");
					var e = endStr ? new Date(endStr.replace(' ', 'T')).getTime() : Infinity;
					return (isNaN(s) || now >= s) && (isNaN(e) || now <= e);
				});
				if (!inRange) {
					barEl.style.display = 'none';
					return;
				}
			}

			// 5. Check Page Targeting
			var pageRules = ${JSON.stringify(config.pageRules || [])};
			var curPath = window.location.pathname || "/";
			var validRules = pageRules.filter(function(r) { return r && r.rule && r.rule !== "select_rule"; });
			if (validRules.length > 0) {
				function matchRule(r) {
					if (r.rule === "all") return true;
					if (r.rule === "homepage") return curPath === "/" || curPath === "";
					var val = (r.value || "").trim().toLowerCase();
					var path = curPath.toLowerCase();
					if (r.rule === "contains") return path.includes(val);
					if (r.rule === "starts_with") return path.startsWith(val);
					if (r.rule === "ends_with") return path.endsWith(val);
					if (r.rule === "exact") return path === val;
					return false;
				}

				// If any hide rule matches, don't show
				var hideMatched = validRules.some(function(r) { return r.mode === "hide" && matchRule(r); });
				if (hideMatched) {
					barEl.style.display = 'none';
					return;
				}

				// If show rules are present, at least one must match
				var showRules = validRules.filter(function(r) { return r.mode === "show"; });
				if (showRules.length > 0) {
					var showMatched = showRules.some(function(r) { return matchRule(r); });
					if (!showMatched) {
						barEl.style.display = 'none';
						return;
					}
				}
			}

			// 6. Check Desktop OS / Browser / Mobile OS / Browser targeting
			var ua = navigator.userAgent.toLowerCase();
			var dOs = "${config.desktopOs || ""}";
			var dBr = "${config.desktopBrowser || ""}";
			var mOs = "${config.mobileOs || ""}";
			var mBr = "${config.mobileBrowser || ""}";

			if (!isMob) {
				if (dOs && dOs !== "all") {
					if (dOs === "windows" && !ua.includes("windows")) { barEl.style.display = 'none'; return; }
					if (dOs === "macos" && (!ua.includes("macintosh") || ua.includes("iphone") || ua.includes("ipad"))) { barEl.style.display = 'none'; return; }
					if (dOs === "linux" && !ua.includes("linux")) { barEl.style.display = 'none'; return; }
					if (dOs === "chromeos" && !ua.includes("cros")) { barEl.style.display = 'none'; return; }
				}
				if (dBr && dBr !== "all") {
					if (dBr === "chrome" && (!ua.includes("chrome") || ua.includes("edg") || ua.includes("opr"))) { barEl.style.display = 'none'; return; }
					if (dBr === "safari" && (!ua.includes("safari") || ua.includes("chrome") || ua.includes("crios"))) { barEl.style.display = 'none'; return; }
					if (dBr === "firefox" && !ua.includes("firefox")) { barEl.style.display = 'none'; return; }
					if (dBr === "edge" && !ua.includes("edg")) { barEl.style.display = 'none'; return; }
					if (dBr === "opera" && (!ua.includes("opr") && !ua.includes("opera"))) { barEl.style.display = 'none'; return; }
				}
			} else {
				if (mOs && mOs !== "all") {
					if (mOs === "ios" && !/iphone|ipad|ipod/.test(ua)) { barEl.style.display = 'none'; return; }
					if (mOs === "android" && !ua.includes("android")) { barEl.style.display = 'none'; return; }
				}
				if (mBr && mBr !== "all") {
					if (mBr === "safari" && (!ua.includes("safari") || ua.includes("crios") || ua.includes("chrome"))) { barEl.style.display = 'none'; return; }
					if (mBr === "chrome" && (!ua.includes("chrome") && !ua.includes("crios"))) { barEl.style.display = 'none'; return; }
					if (mBr === "samsung" && !ua.includes("samsungbrowser")) { barEl.style.display = 'none'; return; }
					if (mBr === "firefox" && !ua.includes("firefox") && !ua.includes("fxios")) { barEl.style.display = 'none'; return; }
				}
			}

			// 7. Check Language Targeting
			var langEnabled = ${Boolean(config.languageTargetingEnabled)};
			var targetLangs = ${JSON.stringify(config.languageTargeting || [])};
			if (langEnabled && targetLangs.length > 0) {
				var userLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
				var langMatched = targetLangs.some(function(l) { return userLang.startsWith(l.toLowerCase()); });
				if (!langMatched) {
					barEl.style.display = 'none';
					return;
				}
			}

			// 8. Trigger & Entry Effect Handling
			var trigType = "${config.triggerType || "seconds"}";
			var trigSec = ${Number(config.triggerSeconds || 0)};
			var trigScroll = ${Number(config.triggerScrollPercentage || 50)};
			var entryEff = "${config.entryEffect || "none"}";

			function revealBar() {
				barEl.style.setProperty('display', 'flex', 'important');
				if (entryEff !== "none") {
					barEl.classList.add('entry-animated');
				}
				if (typeof window.recalcSmarterBottomPadding === 'function') {
					window.recalcSmarterBottomPadding();
				}
				// Track view impression for this bar
				var barId = "${config.id || barIdClean}";
				var vKey = "smarter_viewed_" + barId;
				if (!sessionStorage.getItem(vKey)) {
					sessionStorage.setItem(vKey, "1");
					try {
						fetch("/_emdash/api/plugins/smarter-announcement-bar/track", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ barId: barId, event: "view" }),
							keepalive: true
						});
					} catch(e) {}
				}
			}

			if (trigType === "seconds" && trigSec > 0) {
				barEl.style.display = 'none';
				setTimeout(revealBar, trigSec * 1000);
			} else if (trigType === "scroll") {
				barEl.style.display = 'none';
				var scrolled = false;
				function onScrollTrigger() {
					if (scrolled) return;
					var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					var docHeight = document.documentElement.scrollHeight - window.innerHeight;
					var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 100;
					if (pct >= trigScroll) {
						scrolled = true;
						window.removeEventListener('scroll', onScrollTrigger);
						revealBar();
					}
				}
				window.addEventListener('scroll', onScrollTrigger, { passive: true });
				onScrollTrigger();
			} else {
				// Immediate trigger (0s delay)
				// Small timeout ensures initial DOM paint completes so slide/fade entry animation visibly plays
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', function() {
						setTimeout(revealBar, 60);
					});
				} else {
					setTimeout(revealBar, 60);
				}
			}

			// Adjust bottom padding if needed
			if (typeof window.recalcSmarterBottomPadding === 'function') {
				window.recalcSmarterBottomPadding();
			} else {
				window.recalcSmarterBottomPadding = function() {
					var container = document.getElementById('smarter-bottom-bars-container');
					if (!container) return;
					var h = 0;
					for (var i = 0; i < container.children.length; i++) {
						var c = container.children[i];
						if (c.style.display !== 'none' && window.getComputedStyle(c).display !== 'none') {
							h += c.offsetHeight;
						}
					}
					document.body.style.paddingBottom = h + 'px';
				};
				setTimeout(window.recalcSmarterBottomPadding, 50);
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
		function dismissSmarterBar_${barIdClean}() {
			var bar = document.getElementById('${barDomId}');
			if (bar) bar.style.setProperty('display', 'none', 'important');
			var appearance = "${appearanceAfterClick}";
			if (appearance === "dont_show") {
				localStorage.setItem('smarter_bar_dismissed_${barIdClean}', 'true');
			} else if (appearance === "next_session") {
				sessionStorage.setItem('smarter_bar_dismissed_${barIdClean}', 'true');
			}
			if (typeof window.recalcSmarterBottomPadding === 'function') {
				window.recalcSmarterBottomPadding();
			}
		}
		if (typeof window.copySmarterCoupon !== 'function') {
			window.copySmarterCoupon = function(badgeEl, code, copiedText, barId) {
				if (navigator.clipboard) {
					navigator.clipboard.writeText(code);
				}
				if (barId) {
					try {
						fetch("/_emdash/api/plugins/smarter-announcement-bar/track", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ barId: barId, event: "click" }),
							keepalive: true
						});
					} catch(e) {}
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
			};
		}
		function handleSmarterLeadSubmit_${barIdClean}(form) {
			var isClaimsIt = ${Boolean(config.discountEnabled && config.showCouponWhen !== "rightaway")};
			var nameVal = (form && form.elements && form.elements.name) ? form.elements.name.value : '';
			var emailVal = (form && form.elements && form.elements.email) ? form.elements.email.value : '';
			if (isClaimsIt) {
				var bar = document.getElementById('${barDomId}');
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
						fetch("/_emdash/api/plugins/smarter-announcement-bar/track", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								barId: "${config.id || barIdClean}",
								event: "lead",
								lead: { name: nameVal, email: emailVal }
							}),
							keepalive: true
						});
					} catch(e) {}
					try {
						var leads = JSON.parse(localStorage.getItem('smarter_bar_subscribers') || '[]');
						leads.push({ barId: "${config.id || barIdClean}", name: nameVal, email: emailVal, date: new Date().toISOString() });
						localStorage.setItem('smarter_bar_subscribers', JSON.stringify(leads));
						localStorage.setItem('smarter_bar_subscriber', emailVal);
					} catch(e) {}
				}
			} else {
				if (emailVal) {
					try {
						fetch("/_emdash/api/plugins/smarter-announcement-bar/track", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								barId: "${config.id || barIdClean}",
								event: "lead",
								lead: { name: nameVal, email: emailVal }
							}),
							keepalive: true
						});
					} catch(e) {}
					try {
						var leads = JSON.parse(localStorage.getItem('smarter_bar_subscribers') || '[]');
						leads.push({ barId: "${config.id || barIdClean}", name: nameVal, email: emailVal, date: new Date().toISOString() });
						localStorage.setItem('smarter_bar_subscribers', JSON.stringify(leads));
					} catch(e) {}
				}
				if (form && typeof form.reset === 'function') form.reset();
				dismissSmarterBar_${barIdClean}();
			}
		}
		function handleSmarterBarCta_${barIdClean}() {
			try {
				fetch("/_emdash/api/plugins/smarter-announcement-bar/track", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ barId: "${config.id || barIdClean}", event: "click" }),
					keepalive: true
				});
			} catch(e) {}
			var isLeadForm = ${Boolean(isLeadFormActive)};
			if (isLeadForm) {
				var leadForm = document.getElementById('${leadFormDomId}');
				if (leadForm) {
					var emailInput = leadForm.querySelector('input[type="email"]') || leadForm.querySelector('input');
					if (emailInput && !emailInput.checkValidity()) {
						emailInput.reportValidity();
						return;
					}
					handleSmarterLeadSubmit_${barIdClean}(leadForm);
					return;
				}
			}
			var isClaimsIt = ${Boolean(config.discountEnabled && config.showCouponWhen !== "rightaway")};
			var action = "${actionOnClick}";
			if (isClaimsIt || action === "show_coupon" || action === "copy_code") {
				var bar = document.getElementById('${barDomId}');
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
				dismissSmarterBar_${barIdClean}();
			} else if (action === "open_url") {
				var url = "${buttonUrl}";
				if (url) {
					if (!/^https?:\\/\\//i.test(url)) url = "https://" + url;
					window.open(url, "_blank", "noopener,noreferrer");
				}
			} else if (action === "thank_you") {
				var bar = document.getElementById('${barDomId}');
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
					const bars = getPublishedBars();
					const activeBars = bars.filter((b) => b && b.enabled);
					if (activeBars.length === 0) return null;

					const topBars = activeBars.filter((b) => b.position !== "bottom");
					const bottomBars = activeBars.filter((b) => b.position === "bottom");

					const fragments: Array<{
						kind: "html";
						placement: "body:start" | "body:end";
						html: string;
					}> = [];

					if (topBars.length > 0) {
						const topHtml = `
							<div id="smarter-top-bars-container" style="position: relative; width: 100%; z-index: 99999; display: flex; flex-direction: column; overflow: hidden;">
								${topBars.map((b) => renderPublicBar(b)).join("\n")}
							</div>
						`;
						fragments.push({
							kind: "html" as const,
							placement: "body:start" as const,
							html: topHtml,
						});
					}

					if (bottomBars.length > 0) {
						const bottomHtml = `
							<div id="smarter-bottom-bars-container" style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 -2px 10px rgba(0,0,0,0.12);">
								${bottomBars.map((b) => renderPublicBar(b)).join("\n")}
							</div>
						`;
						fragments.push({
							kind: "html" as const,
							placement: "body:end" as const,
							html: bottomHtml,
						});
					}

					return fragments;
				},
			},
		},
		routes: {
			publish: {
				public: true,
				methods: ["POST"],
				request: { body: "json" },
				handler: async (routeCtx: any) => {
					let input = routeCtx.input;
					if (!input && routeCtx.request && typeof routeCtx.request.json === "function") {
						try { input = await routeCtx.request.json(); } catch {}
					}
					if (input && typeof input === "object") {
						if (input.event && input.barId) {
							const { barId, event, lead } = input;
							const bars = getPublishedBars();
							const bar = bars.find(
								(b) => b.id === barId || b.id === `bar_${barId}` || (b.id && barId && b.id.includes(barId))
							);
							if (bar) {
								if (event === "view") bar.views = (bar.views || 0) + 1;
								else if (event === "click") bar.clicks = (bar.clicks || 0) + 1;
								else if (event === "lead") {
									bar.leads = (bar.leads || 0) + 1;
									if (lead && lead.email) {
										try {
											const subscribersFile = resolve(__dirname, "..", "subscribers.json");
											let subscribers: any[] = [];
											if (existsSync(subscribersFile)) {
												subscribers = JSON.parse(readFileSync(subscribersFile, "utf-8"));
											}
											subscribers.push({
												barId: bar.id,
												barName: bar.name,
												name: lead.name || "",
												email: lead.email,
												date: new Date().toISOString(),
											});
											writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2), "utf-8");
										} catch (e) {}
									}
								}
								savePublishedBars(bars);
								return { success: true, views: bar.views || 0, clicks: bar.clicks || 0, leads: bar.leads || 0 };
							}
							return { success: false, error: "Bar not found" };
						}
						if (Array.isArray(input.bars)) {
							savePublishedBars(input.bars);
							if (input.bar) {
								savePublishedConfig(input.bar);
							}
							return { success: true, message: "Announcement bars published successfully" };
						}
						if (Array.isArray(input)) {
							savePublishedBars(input);
							return { success: true, message: "Announcement bars published successfully" };
						}
						const target = (input.bar && typeof input.bar === "object") ? input.bar : input;
						savePublishedConfig(target as BarConfig);
						return { success: true, message: "Announcement bar published successfully" };
					}
					return { success: false, error: "Invalid configuration" };
				},
			},
			bars: {
				public: true,
				methods: ["GET", "POST"],
				request: { body: "json" },
				handler: async (routeCtx: any) => {
					let input = routeCtx.input;
					if (!input && routeCtx.request && typeof routeCtx.request.json === "function") {
						try { input = await routeCtx.request.json(); } catch {}
					}
					if (routeCtx.method === "POST" && input) {
						if (Array.isArray(input)) {
							savePublishedBars(input);
							return { success: true, bars: getPublishedBars() };
						} else if (Array.isArray(input.bars)) {
							savePublishedBars(input.bars);
							if (input.bar) {
								savePublishedConfig(input.bar);
							}
							return { success: true, bars: getPublishedBars() };
						} else if (input.bar && typeof input.bar === "object") {
							savePublishedConfig(input.bar);
							return { success: true, bars: getPublishedBars() };
						} else if (typeof input === "object") {
							savePublishedConfig(input as BarConfig);
							return { success: true, bars: getPublishedBars() };
						}
					}
					return { success: true, bars: getPublishedBars() };
				},
			},
			track: {
				public: true,
				methods: ["POST"],
				request: { body: "json" },
				handler: async (routeCtx: any) => {
					const input = routeCtx.input;
					if (!input || typeof input !== "object") {
						return { success: false, error: "Invalid payload" };
					}
					const { barId, event, lead } = input;
					const bars = getPublishedBars();
					const bar = bars.find(
						(b) => b.id === barId || b.id === `bar_${barId}` || (b.id && barId && b.id.includes(barId))
					);
					if (bar) {
						if (event === "view") {
							bar.views = (bar.views || 0) + 1;
						} else if (event === "click") {
							bar.clicks = (bar.clicks || 0) + 1;
						} else if (event === "lead") {
							bar.leads = (bar.leads || 0) + 1;
							if (lead && lead.email) {
								try {
									const subscribersFile = resolve(__dirname, "..", "subscribers.json");
									let subscribers: any[] = [];
									if (existsSync(subscribersFile)) {
										subscribers = JSON.parse(readFileSync(subscribersFile, "utf-8"));
									}
									subscribers.push({
										barId: bar.id,
										barName: bar.name,
										name: lead.name || "",
										email: lead.email,
										date: new Date().toISOString(),
									});
									writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2), "utf-8");
								} catch (e) {
									console.error("Failed to save subscriber:", e);
								}
							}
						}
						savePublishedBars(bars);
						return {
							success: true,
							views: bar.views || 0,
							clicks: bar.clicks || 0,
							leads: bar.leads || 0,
						};
					}
					return { success: false, error: "Bar not found" };
				},
			},
			config: {
				public: true,
				methods: ["GET"],
				handler: async () => {
					return { success: true, config: getPublishedConfig(), bars: getPublishedBars() };
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
