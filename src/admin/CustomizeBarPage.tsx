import React, { useState, useEffect, useRef } from "react";
import {
	ArrowLeft,
	ArrowRight,
	CaretDown,
	CaretUp,
	Check,
	CheckCircle,
	Clock,
	ClockCountdown,
	Desktop,
	DeviceMobile,
	EnvelopeSimple,
	Eye,
	Info,
	LinkSimple,
	MegaphoneSimple,
	Palette,
	PaperPlaneTilt,
	PlusCircle,
	SlidersHorizontal,
	Smiley,
	Tag,
	TextB,
	TextItalic,
	TextUnderline,
	Timer,
	Trash,
	UploadSimple,
	WarningCircle,
	X,
} from "@phosphor-icons/react";

// ============================================================================
// Types
// ============================================================================

export interface BarConfig {
	// Step 1: Customize Bar
	enabled: boolean;
	name: string;
	position: "top" | "bottom";
	closeButtonDevices: ("desktop" | "mobile")[];
	textType: "static" | "sliding" | "marquee";
	text: string;
	messages?: string[];
	textFormatting: {
		bold: boolean;
		italic: boolean;
		underline: boolean;
		linkUrl: string;
	};
	textIcon: {
		name: string;
		dataUrl: string;
	} | null;
	iconPosition?: "left" | "right";
	iconStyle?: "auto" | "white" | "badge" | "original";
	buttonDevices: ("desktop" | "mobile")[];
	buttonText: string;
	attentionEffect: "none" | "flash" | "shake" | "swing" | "tada" | "heartbeat" | "wobble" | "pulse" | "bounce";
	actionOnClick: "close" | "open_url" | "thank_you" | "show_coupon" | "copy_code";
	thankYouMessage?: string;
	buttonUrl: string;
	appearanceAfterClick: "dont_show" | "next_session" | "always";
	// Optional Features
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
	leadFormPlaceholder: string;
	leadFormButtonLabel: string;
	leadSendMail?: boolean;
	leadEmailAddress?: string;
	leadSenderName?: string;
	leadEmailSubject?: string;
	discountEnabled: boolean;
	showCouponWhen?: "rightaway" | "claims_it" | "after_click" | string;
	couponCode: string;
	couponBarText?: string;
	copiedTooltipText?: string;
	discountText: string;

	// Step 2: Customize Design
	backgroundColor: string;
	textColor: string;
	buttonBackgroundColor: string;
	buttonTextColor: string;
	fontSize: "sm" | "base" | "lg";
	padding: "compact" | "normal" | "spacious";

	// Step 3: Display Rules
	targetPages: "all" | "homepage" | "custom";
	targetUrls: string;
	targetDevices: "all" | "desktop" | "mobile";
	targetVisitors: "all" | "new" | "returning";
	startDate: string;
	endDate: string;
}

const DEFAULT_CONFIG: BarConfig = {
	enabled: true,
	name: "Smarter Announcement Bar",
	position: "top",
	closeButtonDevices: ["desktop", "mobile"],
	textType: "static",
	text: "Get 30% off your first purchase",
	messages: ["Get 30% off your first purchase", "Test1"],
	textFormatting: {
		bold: false,
		italic: false,
		underline: false,
		linkUrl: "",
	},
	textIcon: null,
	iconPosition: "left",
	iconStyle: "auto",
	buttonDevices: ["desktop", "mobile"],
	buttonText: "Submit",
	attentionEffect: "none",
	actionOnClick: "close",
	thankYouMessage: "Thank you for your response!",
	buttonUrl: "",
	appearanceAfterClick: "dont_show",
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
	leadFormPlaceholder: "Enter your email address",
	leadFormButtonLabel: "Join",
	leadSendMail: true,
	leadEmailAddress: "kokenap418@copytosh.com",
	leadSenderName: "{name}",
	leadEmailSubject: "New lead from my announcement bar from {name} on {date} {hours}",
	discountEnabled: false,
	showCouponWhen: "claims_it",
	couponCode: "COUPON CODE",
	couponBarText: "Click to copy your coupon",
	copiedTooltipText: "copied",
	discountText: "Click to copy your coupon",
	backgroundColor: "#8ce99a",
	textColor: "#000000",
	buttonBackgroundColor: "#000000",
	buttonTextColor: "#ffffff",
	fontSize: "base",
	padding: "normal",
	targetPages: "all",
	targetUrls: "",
	targetDevices: "all",
	targetVisitors: "all",
	startDate: "",
	endDate: "",
};

const STORAGE_KEY_DRAFT = "emdash_smarter_bar_draft";
const STORAGE_KEY_PUBLISHED = "emdash_smarter_bar_published";

/**
 * Official EmDash CMS icon mark (rounded rect with colorful gradient stroke and dash).
 */
export function EmDashIcon({ size = 20, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 75 75"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={style}
		>
			<rect
				x="3"
				y="3"
				width="69"
				height="69"
				rx="10.518"
				stroke="url(#emdash-toast-border)"
				strokeWidth="6"
			/>
			<rect
				x="18"
				y="34"
				width="39.3661"
				height="6.56101"
				fill="url(#emdash-toast-dash)"
			/>
			<defs>
				<linearGradient
					id="emdash-toast-border"
					x1="-42.9996"
					y1="124"
					x2="92.4233"
					y2="-41.7456"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#0F006B" />
					<stop offset="0.0833" stopColor="#281A81" />
					<stop offset="0.1667" stopColor="#5D0C83" />
					<stop offset="0.25" stopColor="#911475" />
					<stop offset="0.3333" stopColor="#CE2F55" />
					<stop offset="0.4167" stopColor="#FF6633" />
					<stop offset="0.5" stopColor="#F6821F" />
					<stop offset="0.5833" stopColor="#FBAD41" />
					<stop offset="0.6667" stopColor="#FFCD89" />
					<stop offset="0.75" stopColor="#FFE9CB" />
					<stop offset="0.8333" stopColor="#FFF7EC" />
					<stop offset="0.9167" stopColor="#FFF8EE" />
					<stop offset="1" stopColor="white" />
				</linearGradient>
				<linearGradient
					id="emdash-toast-dash"
					x1="91.4992"
					y1="27.4982"
					x2="28.1217"
					y2="54.1775"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="white" />
					<stop offset="0.1293" stopColor="#FFF8EE" />
					<stop offset="0.6171" stopColor="#FBAD41" />
					<stop offset="0.848" stopColor="#F6821F" />
					<stop offset="1" stopColor="#FF6633" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function CustomizeBarPage() {
	// Navigation & step state
	const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
	const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
	const [previewDismissed, setPreviewDismissed] = useState(false);
	const [previewThankYouShown, setPreviewThankYouShown] = useState(false);
	const [previewCouponShown, setPreviewCouponShown] = useState(false);
	const [previewCollapsed, setPreviewCollapsed] = useState(false);
	const [copiedFeedback, setCopiedFeedback] = useState(false);
	const [status, setStatus] = useState<"unsaved" | "saved" | "publishing" | "published">("saved");
	const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [iconError, setIconError] = useState<string | null>(null);

	// In-memory editing draft
	const [config, setConfig] = useState<BarConfig>(() => {
		try {
			const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
			if (savedDraft) return JSON.parse(savedDraft);
			const published = localStorage.getItem(STORAGE_KEY_PUBLISHED);
			if (published) return JSON.parse(published);
		} catch {
			// ignore storage errors
		}
		return DEFAULT_CONFIG;
	});

	// Reveal coupon text and code box immediately if showCouponWhen is rightaway, or after CTA button click if after_click
	const isCouponRevealed = Boolean(
		config.discountEnabled &&
		(config.showCouponWhen === "rightaway" || previewCouponShown)
	);

	// Dynamic countdown live calculation
	const [countdownRemaining, setCountdownRemaining] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
	useEffect(() => {
		const calc = () => {
			if (!config.countdownTarget) {
				setCountdownRemaining({ days: "00", hours: "00", minutes: "00", seconds: "00" });
				return;
			}
			const target = new Date(config.countdownTarget.replace(" ", "T"));
			const validTarget = !isNaN(target.getTime()) ? target : new Date(config.countdownTarget);
			const diff = !isNaN(validTarget.getTime()) ? Math.max(0, validTarget.getTime() - Date.now()) : 0;
			const s = Math.floor(diff / 1000);
			const days = Math.floor(s / 86400);
			const hours = Math.floor((s % 86400) / 3600);
			const mins = Math.floor((s % 3600) / 60);
			const secs = s % 60;
			setCountdownRemaining({
				days: String(days).padStart(2, "0"),
				hours: String(hours).padStart(2, "0"),
				minutes: String(mins).padStart(2, "0"),
				seconds: String(secs).padStart(2, "0"),
			});
		};
		calc();
		const interval = setInterval(calc, 1000);
		return () => clearInterval(interval);
	}, [config.countdownTarget]);

	useEffect(() => {
		setPreviewCouponShown(false);
		setPreviewThankYouShown(false);
	}, [config.actionOnClick, config.discountEnabled, config.showCouponWhen]);

	// Remove padding from EmDash admin <main> container to eliminate scroll gap between top header and sticky toolbar
	useEffect(() => {
		const mainEl = document.querySelector("main");
		if (mainEl) {
			const prevPadding = mainEl.style.padding;
			mainEl.style.padding = "0";
			return () => {
				mainEl.style.padding = prevPadding;
			};
		}
	}, []);

	// Synchronize with server published configuration on initial mount
	useEffect(() => {
		fetch("/_emdash/api/plugins/smarter-announcement-bar/config")
			.then((res) => res.json())
			.then((data) => {
				if (data && data.success && data.config) {
					setConfig((prev) => {
						const hasDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
						if (!hasDraft) {
							return { ...DEFAULT_CONFIG, ...data.config };
						}
						return {
							...prev,
							iconPosition: prev.iconPosition || data.config.iconPosition || "left",
							textIcon: prev.textIcon !== undefined ? prev.textIcon : (data.config.textIcon || null),
						};
					});
				}
			})
			.catch(() => {});
	}, []);

	// Mark unsaved on config changes
	const isFirstMount = useRef(true);
	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false;
			return;
		}
		setStatus("unsaved");
		try {
			localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(config));
		} catch {
			// ignore
		}
	}, [config]);

	// Auto-clear toast
	useEffect(() => {
		if (!toast) return;
		const timer = setTimeout(() => setToast(null), 4000);
		return () => clearTimeout(timer);
	}, [toast]);

	// Warn before leaving with unsaved changes
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (status === "unsaved") {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [status]);

	// Field updater helper
	const update = <K extends keyof BarConfig>(key: K, value: BarConfig[K]) => {
		setConfig((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[key];
				return next;
			});
		}
	};

	const isDarkBg = (hexColor: string) => {
		if (!hexColor || typeof hexColor !== "string" || !hexColor.startsWith("#")) return false;
		const hex = hexColor.replace("#", "");
		const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16) || 0;
		const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16) || 0;
		const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16) || 0;
		return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) < 128;
	};

	const renderPreviewIcon = () => {
		if (!config.textIcon || !config.textIcon.dataUrl) return null;
		const iconStyleMode = config.iconStyle || "auto";
		const isDark = isDarkBg(config.backgroundColor || "#000000");
		const shouldInvert = iconStyleMode === "white" || (iconStyleMode === "auto" && isDark);
		const isBadge = iconStyleMode === "badge";

		return (
			<img
				src={config.textIcon.dataUrl}
				alt="Icon"
				className="bar-icon-img"
				style={{
					filter: shouldInvert ? "brightness(0) invert(1)" : undefined,
					background: isBadge ? "#ffffff" : undefined,
					borderRadius: isBadge ? "50%" : undefined,
					padding: isBadge ? "3px" : undefined,
					boxShadow: isBadge ? "0 1px 3px rgba(0,0,0,0.3)" : undefined,
				}}
			/>
		);
	};

	// Rich text editor ref and formatting tracking
	const editorRef = useRef<HTMLDivElement>(null);
	const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false });

	const checkFormatting = () => {
		try {
			setActiveFormats({
				bold: document.queryCommandState("bold"),
				italic: document.queryCommandState("italic"),
				underline: document.queryCommandState("underline"),
			});
		} catch {
			// ignore
		}
	};

	const applyFormat = (command: string, value: string | undefined = undefined) => {
		if (editorRef.current) {
			editorRef.current.focus();
		}
		try {
			(document as any).execCommand("styleWithCSS", false, false);
		} catch {
			// ignore
		}
		document.execCommand(command, false, value);
		checkFormatting();
		if (editorRef.current) {
			update("text", editorRef.current.innerHTML);
		}
	};

	const handleEditorInput = () => {
		if (!editorRef.current) return;
		update("text", editorRef.current.innerHTML);
		checkFormatting();
	};

	// Keep editor innerHTML synchronized with config.text when not actively focused
	useEffect(() => {
		if (editorRef.current && activeStep === 1) {
			if (document.activeElement !== editorRef.current) {
				if (editorRef.current.innerHTML !== config.text) {
					editorRef.current.innerHTML = config.text || "";
				}
			}
		}
	}, [activeStep, config.text]);

	// Rich text editor ref and formatting tracking for Thank You message
	const thankYouEditorRef = useRef<HTMLDivElement>(null);
	const [thankYouFormats, setThankYouFormats] = useState({ bold: false, italic: false, underline: false });

	const checkThankYouFormatting = () => {
		try {
			setThankYouFormats({
				bold: document.queryCommandState("bold"),
				italic: document.queryCommandState("italic"),
				underline: document.queryCommandState("underline"),
			});
		} catch {
			// ignore
		}
	};

	const applyThankYouFormat = (command: string, value: string | undefined = undefined) => {
		if (thankYouEditorRef.current) {
			thankYouEditorRef.current.focus();
		}
		try {
			(document as any).execCommand("styleWithCSS", false, false);
		} catch {
			// ignore
		}
		document.execCommand(command, false, value);
		checkThankYouFormatting();
		if (thankYouEditorRef.current) {
			update("thankYouMessage", thankYouEditorRef.current.innerHTML);
		}
	};

	const handleThankYouEditorInput = () => {
		if (!thankYouEditorRef.current) return;
		update("thankYouMessage", thankYouEditorRef.current.innerHTML);
		checkThankYouFormatting();
	};

	// Keep thank you editor innerHTML synchronized with config.thankYouMessage
	useEffect(() => {
		if (thankYouEditorRef.current && activeStep === 1 && config.actionOnClick === "thank_you") {
			if (document.activeElement !== thankYouEditorRef.current) {
				const currentVal = config.thankYouMessage || "🎉 Thank you for your response!";
				if (thankYouEditorRef.current.innerHTML !== currentVal) {
					thankYouEditorRef.current.innerHTML = currentVal;
				}
			}
		}
	}, [activeStep, config.actionOnClick, config.thankYouMessage]);

	// Rich text editor ref and formatting tracking for Coupon Bar Text in Discount card
	const couponEditorRef = useRef<HTMLDivElement>(null);
	const [couponFormats, setCouponFormats] = useState({ bold: false, italic: false, underline: false });

	const checkCouponFormatting = () => {
		try {
			setCouponFormats({
				bold: document.queryCommandState("bold"),
				italic: document.queryCommandState("italic"),
				underline: document.queryCommandState("underline"),
			});
		} catch {
			// ignore
		}
	};

	const applyCouponFormat = (command: string, value: string | undefined = undefined) => {
		if (couponEditorRef.current) {
			couponEditorRef.current.focus();
		}
		try {
			(document as any).execCommand("styleWithCSS", false, false);
		} catch {
			// ignore
		}
		document.execCommand(command, false, value);
		checkCouponFormatting();
		if (couponEditorRef.current) {
			update("couponBarText", couponEditorRef.current.innerHTML);
		}
	};

	const handleCouponEditorInput = () => {
		if (!couponEditorRef.current) return;
		update("couponBarText", couponEditorRef.current.innerHTML);
		checkCouponFormatting();
	};

	// Keep coupon bar text editor synchronized with config.couponBarText
	useEffect(() => {
		if (couponEditorRef.current && activeStep === 1 && config.discountEnabled) {
			if (document.activeElement !== couponEditorRef.current) {
				const currentVal = config.couponBarText || "Click to copy your coupon";
				if (couponEditorRef.current.innerHTML !== currentVal) {
					couponEditorRef.current.innerHTML = currentVal;
				}
			}
		}
	}, [activeStep, config.discountEnabled, config.couponBarText]);

	// Active slide index for one-by-one sliding
	const [activeSlideIndex, setActiveSlideIndex] = useState(0);

	const currentMessages = isCouponRevealed
		? [config.couponBarText || "Click to copy your coupon"]
		: ((config.messages && config.messages.length > 0)
			? config.messages
			: (config.text ? config.text.split("\n").filter(Boolean) : ["Get 30% off your first purchase"]));

	// Slide one by one in live preview
	useEffect(() => {
		if (config.textType !== "sliding") return;
		const msgs = currentMessages.filter(Boolean);
		if (msgs.length <= 1) {
			setActiveSlideIndex(0);
			return;
		}
		const timer = setInterval(() => {
			setActiveSlideIndex((prev) => (prev + 1) % msgs.length);
		}, 3200);
		return () => clearInterval(timer);
	}, [config.textType, config.messages, config.text]);

	const handleMessageChange = (index: number, val: string) => {
		const updated = [...currentMessages];
		updated[index] = val;
		update("messages", updated as any);
		if (index === 0) update("text", val);
	};

	const handleAddMessage = () => {
		const updated = [...currentMessages, ""];
		update("messages", updated as any);
	};

	const handleDeleteMessage = (index: number) => {
		if (currentMessages.length <= 1) return;
		const updated = currentMessages.filter((_, i) => i !== index);
		update("messages", updated as any);
		if (index === 0 && updated.length > 0) update("text", updated[0]);
	};

	// Multi-select toggle for devices
	const toggleDevice = (
		key: "closeButtonDevices" | "buttonDevices",
		device: "desktop" | "mobile"
	) => {
		const current = config[key];
		const updated = current.includes(device)
			? current.filter((d) => d !== device)
			: [...current, device];
		const isDisablingButton = key === "buttonDevices" && updated.length === 0;
		setConfig((prev) => ({
			...prev,
			[key]: updated,
			leadFormEnabled: isDisablingButton ? false : prev.leadFormEnabled,
		}));
		if (isDisablingButton && config.leadFormEnabled) {
			setToast({
				message: "Button disabled: Contact Lead Form has been disabled as well.",
				type: "info",
			});
		}
	};

	// Validate step
	const validateStep = (step: 1 | 2 | 3): boolean => {
		const errs: Record<string, string> = {};
		if (step === 1) {
			if (!config.name.trim()) errs.name = "Bar Name is required.";
			if (!config.text.trim()) errs.text = "Announcement text is required.";
			if (config.actionOnClick === "open_url" && !config.buttonUrl.trim()) {
				errs.buttonUrl = "Button URL is required when Action is 'Redirect the visitor to another URL'.";
			}
		}
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const goToStep = (step: 1 | 2 | 3) => {
		if (step > activeStep && !validateStep(activeStep)) {
			setToast({ message: "Please fill in all required fields before continuing.", type: "error" });
			return;
		}
		setActiveStep(step);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handlePublish = async () => {
		if (!validateStep(1)) {
			setActiveStep(1);
			setToast({ message: "Validation error: Check Customize Bar fields.", type: "error" });
			return;
		}
		setStatus("publishing");
		try {
			const msgsToSave = (config.messages && config.messages.length > 0)
				? config.messages
				: currentMessages;
			const toPublish = {
				...config,
				messages: msgsToSave,
				text: config.text,
				textFormatting: {
					...config.textFormatting,
					bold: false,
					italic: false,
					underline: false,
				},
			};
			// Persist to server API route so public site can render it
			const res = await fetch("/_emdash/api/plugins/smarter-announcement-bar/publish", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(toPublish),
			});
			const resData = await res.json().catch(() => null);
			if (!res.ok || (resData && resData.success === false)) {
				throw new Error(resData?.error || "Server endpoint returned an error");
			}

			// Persist to local storage
			localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(toPublish));
			localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(toPublish));
			setConfig(toPublish);
			setStatus("published");
			setToast({ message: "Announcement bar published successfully to your website!", type: "success" });
		} catch (err: any) {
			setStatus("unsaved");
			setToast({ message: `Failed to publish bar: ${err?.message || "Please try again."}`, type: "error" });
		}
	};

	// Icon upload handling with format (PNG, SVG, GIF, WEBP) and dimension (<= 100x100 px) validation
	const handleIconUpload = (file: File) => {
		setIconError(null);
		const allowedMimes = ["image/png", "image/svg+xml", "image/gif", "image/webp"];
		const allowedExts = [".png", ".svg", ".gif", ".webp"];
		const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

		if (!allowedMimes.includes(file.type) && !allowedExts.includes(ext)) {
			setIconError("Invalid file format. Only PNG, SVG, GIF, and WEBP formats are allowed.");
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			if (typeof e.target?.result !== "string") {
				setIconError("Failed to read image file. Please try again.");
				return;
			}
			const dataUrl = e.target.result;
			const img = new Image();
			img.onload = () => {
				const width = img.naturalWidth || img.width;
				const height = img.naturalHeight || img.height;
				if (width > 100 || height > 100) {
					setIconError(`Icon dimensions must not exceed 100×100 px (uploaded image is ${width}×${height} px).`);
					return;
				}
				setIconError(null);
				update("textIcon", { name: file.name, dataUrl });
				setToast({ message: `Icon "${file.name}" uploaded successfully.`, type: "success" });
			};
			img.onerror = () => {
				if (file.type === "image/svg+xml" || ext === ".svg") {
					setIconError(null);
					update("textIcon", { name: file.name, dataUrl });
					setToast({ message: `Icon "${file.name}" uploaded successfully.`, type: "success" });
				} else {
					setIconError("Failed to decode image. Please ensure it is a valid PNG, SVG, GIF, or WEBP file.");
				}
			};
			img.src = dataUrl;
		};
		reader.onerror = () => {
			setIconError("Error reading file. Please try again.");
		};
		reader.readAsDataURL(file);
	};

	// ------------------------------------------------------------------------
	// RENDER
	// ------------------------------------------------------------------------

	return (
		<div className="smarter-bar-editor">
			{/* Embedded Scoped Styles for 100% Fidelity */}
			<style>{`
				/* Ensure the host main container has no padding when smarter bar editor is active */
				main:has(.smarter-bar-editor) {
					padding: 0 !important;
				}

				.smarter-bar-editor {
					--primary-blue: #2563eb;
					--primary-blue-hover: #1d4ed8;
					--primary-blue-light: #eff6ff;
					--primary-blue-border: #bfdbfe;
					--bg-canvas: #f8fafc;
					--card-bg: #ffffff;
					--border-card: #e2e8f0;
					--text-main: #0f172a;
					--text-muted: #64748b;
					--text-subtle: #94a3b8;
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
					color: var(--text-main);
					background-color: var(--bg-canvas);
					min-height: 100vh;
					padding-bottom: 80px;
				}

				/* Sticky Header (Toolbar + Fixed Live Preview) */
				.sticky-preview-header {
					position: sticky;
					top: 0;
					z-index: 50;
					background: #f8fafc;
					border-bottom: 1px solid var(--border-card);
					box-shadow: 0 4px 14px -3px rgba(0,0,0,0.07);
				}
				.smarter-toolbar {
					background: #ffffff;
					border-bottom: 1px solid var(--border-card);
					padding: 12px 24px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16px;
				}
				.toolbar-left a {
					color: var(--primary-blue);
					font-size: 14px;
					font-weight: 600;
					text-decoration: none;
					display: flex;
					align-items: center;
					gap: 6px;
				}
				.toolbar-left a:hover {
					text-decoration: underline;
				}

				/* Stepper in Toolbar */
				.stepper-nav {
					display: inline-flex;
					background: #f1f5f9;
					border-radius: 9999px;
					padding: 4px;
					gap: 2px;
				}
				.stepper-step {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					padding: 6px 16px;
					border-radius: 9999px;
					font-size: 13px;
					font-weight: 500;
					color: var(--text-muted);
					background: transparent;
					border: none;
					cursor: pointer;
					transition: all 0.15s ease;
				}
				.stepper-step:hover:not(.active) {
					color: var(--text-main);
					background: rgba(0,0,0,0.04);
				}
				.stepper-step.active {
					background: var(--primary-blue);
					color: #ffffff;
					font-weight: 600;
					box-shadow: 0 2px 4px rgba(37,99,235,0.25);
				}
				.stepper-step.completed:not(.active) {
					color: var(--primary-blue);
				}

				/* Toolbar Right */
				.toolbar-right {
					display: flex;
					align-items: center;
					gap: 12px;
				}
				.device-toggle {
					display: inline-flex;
					background: #f1f5f9;
					border-radius: 9999px;
					padding: 3px;
					gap: 2px;
				}
				.device-btn {
					border: none;
					background: transparent;
					width: 32px;
					height: 32px;
					border-radius: 9999px;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					color: var(--text-muted);
					transition: all 0.15s ease;
				}
				.device-btn.active {
					background: var(--primary-blue);
					color: #ffffff;
					box-shadow: 0 1px 3px rgba(37,99,235,0.3);
				}
				.btn-publish {
					background: var(--primary-blue);
					color: #ffffff;
					border: none;
					border-radius: 8px;
					padding: 8px 18px;
					font-size: 13px;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.15s ease;
					box-shadow: 0 1px 2px rgba(37,99,235,0.2);
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 6px;
				}
				.btn-publish:hover {
					background: var(--primary-blue-hover);
				}

				/* Live Preview Header & Container */
				.preview-section {
					max-width: 1000px;
					margin: 0 auto;
					padding: 10px 24px 12px;
				}
				.preview-label-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 8px;
					font-size: 12px;
					color: var(--text-muted);
				}
				.preview-status-pill {
					display: inline-flex;
					align-items: center;
					gap: 6px;
				}
				.status-dot {
					width: 7px;
					height: 7px;
					border-radius: 50%;
					display: inline-block;
				}
				.status-dot.unsaved { background: #f59e0b; }
				.status-dot.saved { background: #94a3b8; }
				.status-dot.publishing { background: #3b82f6; }
				.status-dot.published { background: #10b981; }

				.preview-viewport-frame {
					background: #ffffff;
					border: 1px solid var(--border-card);
					border-radius: 8px;
					overflow: hidden;
					box-shadow: 0 2px 8px rgba(0,0,0,0.05);
					position: relative;
				}
				.preview-viewport-frame.mobile {
					max-width: 380px;
					margin: 0 auto;
					border: 8px solid #1e293b;
					border-radius: 28px;
					box-shadow: 0 12px 30px rgba(0,0,0,0.15);
				}
				.preview-mock-page {
					padding: 10px 18px;
					background: #f8fafc;
					display: flex;
					flex-direction: column;
					gap: 6px;
					border-bottom: 1px solid var(--border-color);
				}
				.preview-mock-navbar {
					display: flex;
					align-items: center;
					gap: 14px;
					font-size: 11px;
					color: var(--text-muted);
				}
				.preview-mock-logo {
					font-weight: 700;
					color: var(--text-primary);
					font-size: 12px;
				}
				.preview-mock-link {
					cursor: default;
				}
				.preview-mock-content {
					padding: 6px 0 4px;
				}
				.preview-mock-title {
					font-size: 12px;
					font-weight: 700;
					color: var(--text-primary);
					margin-bottom: 2px;
				}
				.preview-mock-desc {
					font-size: 11px;
					color: var(--text-muted);
				}

				/* Rendered Announcement Bar inside Preview */
				.announcement-bar-preview {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 10px 18px;
					position: relative;
					transition: all 0.2s ease;
					min-height: 44px;
					gap: 12px;
				}
				.announcement-bar-content {
					display: flex;
					align-items: center;
					justify-content: center;
					flex: 1;
					gap: 10px;
					text-align: center;
					overflow: hidden;
				}
				.bar-icon-img {
					width: 24px;
					height: 24px;
					max-height: 24px;
					object-fit: contain;
					display: inline-block;
					vertical-align: middle;
					flex-shrink: 0;
					transition: all 0.2s ease;
				}
				.announcement-bar-content.is-static {
					justify-content: center;
					white-space: pre-wrap;
					word-break: break-word;
				}
				.announcement-bar-content b,
				.announcement-bar-content strong,
				.announcement-bar-preview b,
				.announcement-bar-preview strong,
				.bar-static-content b,
				.bar-static-content strong,
				.bar-thank-you-content b,
				.bar-thank-you-content strong {
					font-weight: 800 !important;
				}
				.announcement-bar-content i,
				.announcement-bar-content em,
				.announcement-bar-preview i,
				.announcement-bar-preview em,
				.bar-static-content i,
				.bar-static-content em,
				.bar-thank-you-content i,
				.bar-thank-you-content em {
					font-style: italic !important;
				}
				.announcement-bar-content u,
				.announcement-bar-preview u,
				.bar-static-content u,
				.bar-thank-you-content u {
					text-decoration: underline !important;
				}
				.announcement-bar-content a,
				.announcement-bar-preview a,
				.bar-static-content a,
				.bar-thank-you-content a {
					color: inherit !important;
					text-decoration: underline !important;
				}
				.announcement-bar-content.is-sliding {
					justify-content: center;
					white-space: nowrap;
				}
				.announcement-bar-content.is-marquee {
					justify-content: flex-start;
					white-space: nowrap;
				}
				.sliding-once-track {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 12px;
					white-space: nowrap;
					animation: slideOnceIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
					will-change: transform, opacity;
				}
				@keyframes slideOnceIn {
					0% {
						transform: translateX(100%);
						opacity: 0;
					}
					100% {
						transform: translateX(0);
						opacity: 1;
					}
				}
				.marquee-ticker-track,
				.sliding-ticker-track {
					display: inline-flex;
					align-items: center;
					gap: 12px;
					white-space: nowrap;
					padding-left: 100%;
					animation: tickerScroll 18s linear infinite;
					will-change: transform;
				}
				.marquee-ticker-track:hover,
				.sliding-ticker-track:hover {
					animation-play-state: paused;
				}
				@keyframes tickerScroll {
					0% { transform: translateX(0); }
					100% { transform: translateX(-100%); }
				}

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

				.preview-cta-btn {
					padding: 6px 16px;
					font-size: 13px;
					font-weight: 700;
					border-radius: 6px;
					border: none;
					cursor: pointer;
					white-space: nowrap;
				}
				.preview-close-btn {
					background: transparent;
					border: none;
					font-size: 16px;
					cursor: pointer;
					padding: 2px 6px;
					line-height: 1;
					opacity: 0.7;
				}
				.preview-close-btn:hover { opacity: 1; }

				.preview-reset-btn {
					display: block;
					margin: 8px auto;
					font-size: 11px;
					color: var(--primary-blue);
					background: transparent;
					border: 1px dashed var(--primary-blue-border);
					border-radius: 4px;
					padding: 4px 10px;
					cursor: pointer;
				}

				/* Form Container & Section Cards */
				.editor-body {
					max-width: 1000px;
					margin: 24px auto 0;
					padding: 0 24px;
					display: flex;
					flex-direction: column;
					gap: 20px;
				}
				.editor-card {
					background: var(--card-bg);
					border: 1px solid var(--border-card);
					border-radius: 12px;
					padding: 24px;
					box-shadow: 0 1px 3px rgba(0,0,0,0.02);
				}
				.card-header-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 6px;
				}
				.card-title {
					font-size: 16px;
					font-weight: 700;
					color: var(--text-main);
					margin: 0;
				}
				.card-title.blue-accent {
					color: var(--primary-blue);
					font-size: 18px;
				}
				.card-subtitle {
					font-size: 13px;
					color: var(--text-muted);
					margin: 0 0 18px 0;
					line-height: 1.4;
				}

				/* 2-Column Form Rows */
				.form-row {
					display: flex;
					align-items: flex-start;
					margin-bottom: 20px;
					gap: 24px;
				}
				.form-row:last-child {
					margin-bottom: 0;
				}
				.row-label-col {
					width: 240px;
					flex-shrink: 0;
					font-size: 13px;
					font-weight: 500;
					color: var(--text-main);
					display: flex;
					align-items: center;
					gap: 6px;
					padding-top: 8px;
				}
				.row-control-col {
					flex: 1;
				}
				@media (max-width: 768px) {
					.form-row {
						flex-direction: column;
						gap: 8px;
					}
					.row-label-col {
						width: 100%;
						padding-top: 0;
					}
				}

				.info-tooltip-icon {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					color: #94a3b8;
					cursor: help;
					transition: color 0.15s ease;
					flex-shrink: 0;
				}
				.info-tooltip-icon:hover {
					color: var(--primary-blue);
				}

				/* Rectangular Pill Option-Selection Buttons (Screenshot 1) */
				.option-button-group {
					display: flex;
					gap: 12px;
					flex-wrap: wrap;
				}
				.option-pill-btn {
					min-width: 130px;
					height: 40px;
					padding: 0 16px;
					border-radius: 8px;
					font-size: 13px;
					font-weight: 600;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
					cursor: pointer;
					transition: all 0.15s ease;
					border: 1px solid #93c5fd;
					background: #ffffff;
					color: var(--primary-blue);
				}
				.option-pill-btn:hover {
					border-color: var(--primary-blue);
					background: var(--primary-blue-light);
				}
				.option-pill-btn.selected {
					background: var(--primary-blue);
					color: #ffffff;
					border-color: var(--primary-blue);
					box-shadow: 0 1px 3px rgba(37,99,235,0.25);
				}
				.pill-checkmark-badge {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: #ffffff;
					color: var(--primary-blue);
					font-size: 11px;
					font-weight: 900;
					line-height: 1;
				}

				/* Inputs & Selects */
				.text-field-input {
					width: 100%;
					height: 40px;
					padding: 0 12px;
					border-radius: 6px;
					border: 1px solid var(--border-card);
					background: #ffffff;
					font-size: 13px;
					color: var(--text-main);
					outline: none;
					transition: border 0.15s ease;
					box-sizing: border-box;
				}
				.text-field-input:focus {
					border-color: var(--primary-blue);
					box-shadow: 0 0 0 2px var(--primary-blue-border);
				}
				.text-field-select {
					width: 100%;
					height: 40px;
					padding: 0 12px;
					border-radius: 6px;
					border: 1px solid var(--border-card);
					background: #ffffff;
					font-size: 13px;
					color: var(--text-main);
					outline: none;
					cursor: pointer;
					box-sizing: border-box;
				}
				.text-field-select:focus {
					border-color: var(--primary-blue);
					box-shadow: 0 0 0 2px var(--primary-blue-border);
				}

				/* Rich Text Box */
				.rich-text-wrapper {
					border: 1px solid var(--border-card);
					border-radius: 6px;
					background: #ffffff;
					overflow: hidden;
				}
				.rich-toolbar {
					display: flex;
					align-items: center;
					gap: 4px;
					padding: 6px 10px;
					border-bottom: 1px solid #f1f5f9;
					background: #fafafa;
				}
				.rich-btn {
					width: 28px;
					height: 28px;
					border-radius: 4px;
					border: none;
					background: transparent;
					color: var(--text-muted);
					font-size: 13px;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.15s ease;
				}
				.rich-btn:hover {
					background: #e2e8f0;
					color: var(--text-main);
				}
				.rich-btn.active {
					background: #e0e7ff;
					color: var(--primary-blue);
					font-weight: 700;
				}
				.rich-textarea {
					width: 100%;
					min-height: 100px;
					border: none;
					padding: 12px;
					font-size: 14px;
					line-height: 1.5;
					outline: none;
					box-sizing: border-box;
					font-family: inherit;
					white-space: pre-wrap;
					word-break: break-word;
					overflow-y: auto;
					background: #ffffff;
				}
				.rich-textarea:empty:before {
					content: attr(data-placeholder);
					color: #94a3b8;
					pointer-events: none;
				}
				.rich-textarea b,
				.rich-textarea strong {
					font-weight: 700;
				}
				.rich-textarea i,
				.rich-textarea em {
					font-style: italic;
				}
				.rich-textarea u {
					text-decoration: underline;
				}
				.rich-textarea a {
					color: var(--primary-blue);
					text-decoration: underline;
				}
				.rich-footer {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 4px 10px;
					font-size: 11px;
					color: var(--text-subtle);
					border-top: 1px solid #f8fafc;
					background: #fafafa;
				}

				/* Multiple Messages Editor */
				.multiple-messages-container {
					display: flex;
					flex-direction: column;
					gap: 8px;
					width: 100%;
				}
				.msg-input-row {
					display: flex;
					align-items: center;
					gap: 10px;
				}
				.msg-input-row .text-field-input {
					flex: 1;
				}
				.btn-delete-msg {
					width: 40px;
					height: 40px;
					border-radius: 8px;
					background: #fee2e2;
					border: 1px solid #fecaca;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					flex-shrink: 0;
					transition: all 0.15s ease;
				}
				.btn-delete-msg:hover:not(:disabled) {
					background: #fca5a5;
					border-color: #f87171;
				}
				.btn-delete-msg:disabled {
					opacity: 0.35;
					cursor: not-allowed;
				}
				.btn-add-msg {
					align-self: flex-start;
					margin-top: 6px;
					background: #2563eb;
					color: #ffffff;
					border: none;
					border-radius: 9999px;
					padding: 8px 18px;
					font-size: 13px;
					font-weight: 600;
					display: inline-flex;
					align-items: center;
					gap: 6px;
					cursor: pointer;
					box-shadow: 0 1px 3px rgba(37,99,235,0.25);
					transition: background 0.15s ease;
				}
				.btn-add-msg:hover {
					background: #1d4ed8;
				}

				/* Icon Drag and Drop Box */
				.icon-upload-box {
					background: #f5f7ff;
					border: 1px dashed #c7d2fe;
					border-radius: 8px;
					padding: 24px 16px;
					text-align: center;
					cursor: pointer;
					transition: all 0.15s ease;
				}
				.icon-upload-box:hover {
					border-color: var(--primary-blue);
					background: #eef2ff;
				}
				.upload-btn {
					background: var(--primary-blue);
					color: #ffffff;
					border: none;
					border-radius: 6px;
					padding: 8px 18px;
					font-size: 13px;
					font-weight: 600;
					cursor: pointer;
					margin-top: 8px;
					box-shadow: 0 1px 2px rgba(37,99,235,0.2);
				}

				/* Toggle Switch */
				.switch-root {
					display: inline-flex;
					align-items: center;
					gap: 6px;
					cursor: pointer;
					user-select: none;
				}
				.switch-track {
					width: 44px;
					height: 24px;
					border-radius: 9999px;
					background: #cbd5e1;
					position: relative;
					transition: background-color 0.2s ease;
				}
				.switch-track.on {
					background: var(--primary-blue);
				}
				.switch-thumb {
					width: 20px;
					height: 20px;
					border-radius: 50%;
					background: #ffffff;
					position: absolute;
					top: 2px;
					left: 2px;
					transition: transform 0.2s ease;
					box-shadow: 0 1px 2px rgba(0,0,0,0.2);
				}
				.switch-track.on .switch-thumb {
					transform: translateX(20px);
				}
				.switch-label-text {
					font-size: 12px;
					font-weight: 700;
					color: var(--text-muted);
					min-width: 26px;
				}

				/* Modern Pill Switch with embedded ON/OFF text */
				.switch-track-pill {
					width: 52px;
					height: 26px;
					border-radius: 9999px;
					background: #cbd5e1;
					position: relative;
					transition: background-color 0.2s ease;
					display: flex;
					align-items: center;
					cursor: pointer;
					user-select: none;
				}
				.switch-track-pill.on {
					background: #2563eb;
				}
				.switch-text-inside {
					position: absolute;
					font-size: 10px;
					font-weight: 700;
					color: #ffffff;
					line-height: 1;
				}
				.switch-track-pill.on .switch-text-inside {
					left: 8px;
				}
				.switch-track-pill:not(.on) .switch-text-inside {
					right: 8px;
				}
				.switch-thumb-pill {
					width: 22px;
					height: 22px;
					border-radius: 50%;
					background: #ffffff;
					position: absolute;
					top: 2px;
					left: 2px;
					transition: transform 0.2s ease;
					box-shadow: 0 1px 3px rgba(0,0,0,0.25);
				}
				.switch-track-pill.on .switch-thumb-pill {
					transform: translateX(26px);
				}
				.blue-help-bubble {
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: #3b82f6;
					color: #ffffff;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					font-size: 11px;
					font-weight: 700;
					flex-shrink: 0;
					cursor: help;
				}

				/* Feature Card Expanded Settings */
				.feature-expanded-panel {
					margin-top: 18px;
					padding-top: 18px;
					border-top: 1px solid var(--border-card);
				}

				/* Bottom Navigation Row */
				.bottom-nav-row {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					gap: 12px;
					margin-top: 8px;
				}
				.btn-nav-next {
					background: var(--primary-blue);
					color: #ffffff;
					border: none;
					border-radius: 8px;
					padding: 10px 24px;
					font-size: 14px;
					font-weight: 600;
					cursor: pointer;
					box-shadow: 0 2px 4px rgba(37,99,235,0.2);
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
				}
				.btn-nav-next:hover {
					background: var(--primary-blue-hover);
				}
				.btn-nav-prev {
					background: #ffffff;
					color: var(--text-main);
					border: 1px solid var(--border-card);
					border-radius: 8px;
					padding: 10px 20px;
					font-size: 14px;
					font-weight: 600;
					cursor: pointer;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
				}
				.btn-nav-prev:hover {
					background: #f1f5f9;
				}

				/* Toast */
				.floating-toast {
					position: fixed;
					bottom: 24px;
					right: 24px;
					z-index: 1000;
					padding: 12px 20px;
					border-radius: 8px;
					font-size: 14px;
					font-weight: 600;
					color: #ffffff;
					box-shadow: 0 10px 25px rgba(0,0,0,0.15);
					animation: toastSlideUp 0.2s ease;
					display: inline-flex;
					align-items: center;
					gap: 10px;
				}
				.floating-toast.success { background: #0f172a; border: 1px solid #334155; }
				.floating-toast.error { background: #dc2626; border: 1px solid #ef4444; }
				@keyframes toastSlideUp {
					from { transform: translateY(20px); opacity: 0; }
					to { transform: translateY(0); opacity: 1; }
				}

				/* Countdown Timer Widget */
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
			`}</style>

			<div className="sticky-preview-header">
				{/* ============================================================ */}
				{/* TOP TOOLBAR (Screenshot 3) */}
				{/* ============================================================ */}
				<header className="smarter-toolbar">
					{/* Left: Dashboard link */}
					<div className="toolbar-left">
						<a href="/_emdash/admin/plugins/smarter-announcement-bar/dashboard">
							<ArrowLeft size={16} weight="bold" />
							<span>Dashboard</span>
						</a>
					</div>

					{/* Centre: Connected 3-Step Stepper */}
					<nav className="stepper-nav" aria-label="Editor steps">
						<button
							type="button"
							className={`stepper-step ${activeStep === 1 ? "active" : ""} ${activeStep > 1 ? "completed" : ""}`}
							onClick={() => goToStep(1)}
						>
							<MegaphoneSimple size={16} weight="bold" />
							<span>1. Customize Bar</span>
						</button>

						<button
							type="button"
							className={`stepper-step ${activeStep === 2 ? "active" : ""} ${activeStep > 2 ? "completed" : ""}`}
							onClick={() => goToStep(2)}
						>
							<Palette size={16} weight="bold" />
							<span>2. Customize Design</span>
						</button>

						<button
							type="button"
							className={`stepper-step ${activeStep === 3 ? "active" : ""}`}
							onClick={() => goToStep(3)}
						>
							<SlidersHorizontal size={16} weight="bold" />
							<span>3. Display Rules</span>
						</button>
					</nav>

					{/* Right: Preview Device Toggle & Publish Button */}
					<div className="toolbar-right">
						<div className="device-toggle" role="radiogroup" aria-label="Preview Device">
							<button
								type="button"
								className={`device-btn ${previewDevice === "desktop" ? "active" : ""}`}
								onClick={() => setPreviewDevice("desktop")}
								title="Desktop Preview"
								aria-label="Desktop preview"
							>
								<Desktop size={16} weight={previewDevice === "desktop" ? "bold" : "regular"} />
							</button>
							<button
								type="button"
								className={`device-btn ${previewDevice === "mobile" ? "active" : ""}`}
								onClick={() => setPreviewDevice("mobile")}
								title="Mobile Preview"
								aria-label="Mobile preview"
							>
								<DeviceMobile size={16} weight={previewDevice === "mobile" ? "bold" : "regular"} />
							</button>
						</div>

						<button
							type="button"
							className="btn-publish"
							onClick={handlePublish}
							disabled={status === "publishing"}
						>
							<PaperPlaneTilt size={15} weight="bold" />
							<span>{status === "publishing" ? "Publishing..." : "Publish Bar"}</span>
						</button>
					</div>
				</header>

				{/* ============================================================ */}
				{/* LIVE PREVIEW AREA (Screenshot 1 & Section 6) */}
				{/* ============================================================ */}
				<section className="preview-section" aria-label="Live preview">
					<div className="preview-label-row">
						<div className="preview-status-pill">
							<span className={`status-dot ${status}`} />
							<span>
								Live preview · {status === "published" ? "Published" : status === "unsaved" ? "Draft (Unsaved changes)" : "Draft saved"}
							</span>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
							<span>Simulated device: <strong>{previewDevice === "desktop" ? "Desktop" : "Mobile (375px)"}</strong></span>
							<button
								type="button"
								onClick={() => setPreviewCollapsed(!previewCollapsed)}
								style={{
									background: "#ffffff",
									border: "1px solid var(--border-card)",
									borderRadius: "4px",
									padding: "2px 8px",
									fontSize: "11px",
									fontWeight: 500,
									color: "var(--text-muted)",
									cursor: "pointer",
									display: "inline-flex",
									alignItems: "center",
									gap: "4px",
								}}
								title={previewCollapsed ? "Expand live preview" : "Collapse live preview"}
							>
								{previewCollapsed ? (
									<>
										<span>Show preview</span>
										<CaretDown size={12} weight="bold" />
									</>
								) : (
									<>
										<span>Collapse</span>
										<CaretUp size={12} weight="bold" />
									</>
								)}
							</button>
						</div>
					</div>

					{!previewCollapsed && (
						<div className={`preview-viewport-frame ${previewDevice}`}>
							{config.position === "bottom" && (
								<div className="preview-mock-page">
									<div className="preview-mock-navbar">
										<span className="preview-mock-logo">My Site</span>
										<span className="preview-mock-link">Home</span>
										<span className="preview-mock-link">Posts</span>
										<span className="preview-mock-link">About</span>
									</div>
									<div className="preview-mock-content">
										<div className="preview-mock-title">Recent Posts</div>
										<div className="preview-mock-desc">Welcome to your site content...</div>
									</div>
								</div>
							)}

							{!previewDismissed && config.enabled ? (
								<div
									className={`announcement-bar-preview ${config.position === "bottom" ? "placement-bottom" : "placement-top"}`}
							style={{
								backgroundColor: config.backgroundColor,
								color: config.textColor,
								fontSize: config.fontSize === "sm" ? "12px" : config.fontSize === "lg" ? "16px" : "14px",
								padding: config.padding === "compact" ? "6px 14px" : config.padding === "spacious" ? "14px 24px" : "10px 18px",
							}}
						>
							{/* Content: Icon + Text (Static, Sliding, or Marquee) OR Thank You Message */}
							{previewThankYouShown ? (
								<div className="announcement-bar-content is-static">
									<span
										className="bar-thank-you-content"
										style={{
											whiteSpace: "pre-wrap",
											wordBreak: "break-word",
											display: "inline-block",
										}}
										dangerouslySetInnerHTML={{
											__html: config.thankYouMessage || "🎉 Thank you for your response!",
										}}
									/>
								</div>
							) : isCouponRevealed ? (
								<div className="announcement-bar-content is-static">
									<span
										className="bar-static-content smarter-coupon-bar-text"
										style={{
											whiteSpace: "pre-wrap",
											wordBreak: "break-word",
											display: "inline-block",
										}}
										dangerouslySetInnerHTML={{
											__html: config.couponBarText || "Click to copy your coupon",
										}}
									/>
									{config.countdownEnabled && (
										<span
											style={{
												marginLeft: "12px",
												padding: "2px 8px",
												borderRadius: "4px",
												background: "rgba(0,0,0,0.15)",
												fontWeight: "bold",
												fontSize: "12px",
												display: "inline-flex",
												alignItems: "center",
												gap: "5px",
											}}
										>
											<ClockCountdown size={14} weight="bold" />
											<span>{config.countdownUrgencyText} 02:45:12</span>
										</span>
									)}
									<span
										className="coupon-badge-container"
										onClick={() => {
											if (navigator.clipboard) {
												navigator.clipboard.writeText(config.couponCode || "COUPON CODE");
											}
											setCopiedFeedback(true);
											setTimeout(() => setCopiedFeedback(false), 2200);
										}}
										style={{
											position: "relative",
											marginLeft: "12px",
											display: "inline-flex",
											alignItems: "center",
											justifyContent: "center",
											padding: "2px 3px",
											border: "2px dashed #ffffff",
											borderRadius: "6px",
											cursor: "pointer",
											verticalAlign: "middle",
										}}
										title={copiedFeedback ? (config.copiedTooltipText || "copied") : (config.couponBarText ? config.couponBarText.replace(/<[^>]*>/g, "") : "Click to copy")}
									>
										<span
											style={{
												background: copiedFeedback ? "#ecfdf5" : "#ffffff",
												color: copiedFeedback ? "#065f46" : "#000000",
												padding: "3px 12px",
												borderRadius: "4px",
												fontWeight: "bold",
												fontSize: "13px",
												letterSpacing: "0.5px",
												display: "inline-flex",
												alignItems: "center",
												gap: "5px",
												lineHeight: "1.3",
												fontFamily: "inherit",
												transition: "all 0.2s ease",
											}}
										>
											{copiedFeedback ? (
												<>
													<Check size={13} weight="bold" style={{ color: "#16a34a" }} />
													<span>{config.copiedTooltipText || "copied"}</span>
												</>
											) : (
												config.couponCode || "COUPON CODE"
											)}
										</span>
										{copiedFeedback && (
											<span
												style={{
													position: "absolute",
													bottom: "calc(100% + 8px)",
													left: "50%",
													transform: "translateX(-50%)",
													background: "#0f172a",
													color: "#ffffff",
													padding: "4px 10px",
													borderRadius: "4px",
													fontSize: "11px",
													fontWeight: 600,
													whiteSpace: "nowrap",
													pointerEvents: "none",
													boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
													zIndex: 99999,
													display: "inline-flex",
													alignItems: "center",
													gap: "4px",
												}}
											>
												<Check size={12} weight="bold" style={{ color: "#22c55e" }} />
												<span>{config.copiedTooltipText || "copied"}</span>
												<span
													style={{
														position: "absolute",
														top: "100%",
														left: "50%",
														marginLeft: "-4px",
														borderWidth: "4px",
														borderStyle: "solid",
														borderColor: "#0f172a transparent transparent transparent",
													}}
												/>
											</span>
										)}
									</span>
								</div>
							) : (
								<div className={`announcement-bar-content ${config.textType === "marquee" ? "is-marquee" : config.textType === "sliding" ? "is-sliding" : "is-static"}`}>
								{config.textType === "marquee" ? (
									<div className="marquee-ticker-track">
										{currentMessages.filter(Boolean).map((msg, idx, arr) => (
											<React.Fragment key={idx}>
												<span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
													<span
														style={{
															fontWeight: config.textFormatting.bold ? "bold" : "normal",
															fontStyle: config.textFormatting.italic ? "italic" : "normal",
															textDecoration: config.textFormatting.underline ? "underline" : "none",
															whiteSpace: "pre",
														}}
													>
														{msg}
													</span>
												</span>
												{idx < arr.length - 1 && (
													<span style={{ opacity: 0.45, margin: "0 18px", fontSize: "13px" }}>✦</span>
												)}
											</React.Fragment>
										))}
										{config.countdownEnabled && (
											<span
												style={{
													marginLeft: "12px",
													padding: "2px 8px",
													borderRadius: "4px",
													background: "rgba(0,0,0,0.15)",
													fontWeight: "bold",
													fontSize: "12px",
													display: "inline-flex",
													alignItems: "center",
													gap: "5px",
												}}
											>
												<ClockCountdown size={14} weight="bold" />
												<span>{config.countdownUrgencyText} 02:45:12</span>
											</span>
										)}
									</div>
								) : config.textType === "sliding" ? (
									<div key={`slide-item-${activeSlideIndex}`} className="sliding-once-track">
										<span
											style={{
												fontWeight: config.textFormatting.bold ? "bold" : "normal",
												fontStyle: config.textFormatting.italic ? "italic" : "normal",
												textDecoration: config.textFormatting.underline ? "underline" : "none",
												whiteSpace: "pre-wrap",
												wordBreak: "break-word",
											}}
											dangerouslySetInnerHTML={{
												__html: currentMessages.filter(Boolean)[activeSlideIndex] || config.text
											}}
										/>
									</div>
								) : (
									<>
										{config.iconPosition !== "right" && renderPreviewIcon()}
										<span
											className="bar-static-content"
											style={{
												whiteSpace: "pre-wrap",
												wordBreak: "break-word",
												display: "inline-block",
											}}
											dangerouslySetInnerHTML={{
												__html: config.text || ""
											}}
										/>
										{config.iconPosition === "right" && renderPreviewIcon()}
										{config.leadFormEnabled && (
											<div style={{ display: "inline-flex", gap: "6px", marginLeft: "12px", alignItems: "center" }}>
												<input
													id="preview-lead-name-input"
													type="text"
													placeholder={config.leadNamePlaceholder || "Enter your name"}
													onClick={(e) => e.stopPropagation()}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															const btn = document.getElementById("preview-cta-btn");
															if (btn) btn.click();
														}
													}}
													style={{
														padding: "4px 8px",
														fontSize: "12px",
														borderRadius: "4px",
														border: "1px solid rgba(0,0,0,0.2)",
														background: "rgba(255,255,255,0.95)",
														color: "#111",
														maxWidth: "110px",
													}}
												/>
												<input
													id="preview-lead-email-input"
													type="email"
													required
													placeholder={config.leadEmailPlaceholder || config.leadFormPlaceholder || "Enter your email address"}
													onClick={(e) => e.stopPropagation()}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															const btn = document.getElementById("preview-cta-btn");
															if (btn) btn.click();
														}
													}}
													style={{
														padding: "4px 8px",
														fontSize: "12px",
														borderRadius: "4px",
														border: "1px solid rgba(0,0,0,0.2)",
														background: "rgba(255,255,255,0.95)",
														color: "#111",
														maxWidth: "140px",
													}}
												/>
											</div>
										)}
									</>
								)}
							</div>
							)}

							{/* Right Actions: Countdown Timer + CTA Button + Close Button */}
							<div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
								{config.countdownEnabled && (
									<div className="smarter-countdown-root" style={{ display: "inline-flex", alignItems: "center", gap: "3px", userSelect: "none", color: config.textColor || "#000000" }}>
										<div className="smarter-countdown-unit" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
											<div className="smarter-countdown-digits" style={{ display: "inline-flex", gap: "2px" }}>
												<span className="smarter-countdown-digit-box">{countdownRemaining.days[0] || "0"}</span>
												<span className="smarter-countdown-digit-box">{countdownRemaining.days[1] || "0"}</span>
											</div>
											{!config.countdownHideLabels && (
												<span className="smarter-countdown-unit-label" style={{ fontSize: "10px", fontWeight: 600, marginTop: "2px", lineHeight: 1.1, color: "inherit" }}>
													{config.countdownDaysLabel || "Days"}
												</span>
											)}
										</div>
										<span className="smarter-countdown-colon" style={{ height: "22px", display: "inline-flex", alignItems: "center", fontWeight: 700, padding: "0 2px", color: "inherit" }}>:</span>
										<div className="smarter-countdown-unit" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
											<div className="smarter-countdown-digits" style={{ display: "inline-flex", gap: "2px" }}>
												<span className="smarter-countdown-digit-box">{countdownRemaining.hours[0] || "0"}</span>
												<span className="smarter-countdown-digit-box">{countdownRemaining.hours[1] || "0"}</span>
											</div>
											{!config.countdownHideLabels && (
												<span className="smarter-countdown-unit-label" style={{ fontSize: "10px", fontWeight: 600, marginTop: "2px", lineHeight: 1.1, color: "inherit" }}>
													{config.countdownHoursLabel || "Hours"}
												</span>
											)}
										</div>
										<span className="smarter-countdown-colon" style={{ height: "22px", display: "inline-flex", alignItems: "center", fontWeight: 700, padding: "0 2px", color: "inherit" }}>:</span>
										<div className="smarter-countdown-unit" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
											<div className="smarter-countdown-digits" style={{ display: "inline-flex", gap: "2px" }}>
												<span className="smarter-countdown-digit-box">{countdownRemaining.minutes[0] || "0"}</span>
												<span className="smarter-countdown-digit-box">{countdownRemaining.minutes[1] || "0"}</span>
											</div>
											{!config.countdownHideLabels && (
												<span className="smarter-countdown-unit-label" style={{ fontSize: "10px", fontWeight: 600, marginTop: "2px", lineHeight: 1.1, color: "inherit" }}>
													{config.countdownMinutesLabel || "Minutes"}
												</span>
											)}
										</div>
										<span className="smarter-countdown-colon" style={{ height: "22px", display: "inline-flex", alignItems: "center", fontWeight: 700, padding: "0 2px", color: "inherit" }}>:</span>
										<div className="smarter-countdown-unit" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
											<div className="smarter-countdown-digits" style={{ display: "inline-flex", gap: "2px" }}>
												<span className="smarter-countdown-digit-box">{countdownRemaining.seconds[0] || "0"}</span>
												<span className="smarter-countdown-digit-box">{countdownRemaining.seconds[1] || "0"}</span>
											</div>
											{!config.countdownHideLabels && (
												<span className="smarter-countdown-unit-label" style={{ fontSize: "10px", fontWeight: 600, marginTop: "2px", lineHeight: 1.1, color: "inherit" }}>
													{config.countdownSecondsLabel || "Seconds"}
												</span>
											)}
										</div>
									</div>
								)}
								{/* Show CTA Button if device enabled and not displaying thank you or revealed coupon state */}
								{!previewThankYouShown && !isCouponRevealed && config.buttonDevices.includes(previewDevice) && config.buttonText && (
									<button
										id="preview-cta-btn"
										type="button"
										className={`preview-cta-btn effect-${config.attentionEffect}`}
										style={{
											backgroundColor: config.buttonBackgroundColor,
											color: config.buttonTextColor,
										}}
										onClick={() => {
											if (config.leadFormEnabled) {
												const emailInput = document.getElementById("preview-lead-email-input") as HTMLInputElement | null;
												const nameInput = document.getElementById("preview-lead-name-input") as HTMLInputElement | null;
												if (emailInput && !emailInput.checkValidity()) {
													emailInput.reportValidity();
													return;
												}
												const isClaimsIt = Boolean(config.discountEnabled && config.showCouponWhen !== "rightaway");
												if (isClaimsIt) {
													setPreviewCouponShown(true);
													setToast({
														message: `Coupon revealed: ${config.couponCode || "COUPON CODE"}`,
														type: "success",
													});
													return;
												} else {
													setPreviewDismissed(true);
													setToast({
														message: "Contact lead submitted. Announcement bar closed automatically.",
														type: "info",
													});
													if (nameInput) nameInput.value = "";
													if (emailInput) emailInput.value = "";
													return;
												}
											}
											if (config.discountEnabled && config.showCouponWhen !== "rightaway") {
												setPreviewCouponShown(true);
												setToast({
													message: `Coupon revealed: ${config.couponCode || "COUPON CODE"}`,
													type: "success",
												});
												return;
											}
											if (config.actionOnClick === "close") {
												setPreviewDismissed(true);
											} else if (config.actionOnClick === "open_url") {
												setToast({
													message: `Preview action: Opening ${config.buttonUrl || "URL"} in new tab`,
													type: "info",
												});
												if (config.buttonUrl) {
													let url = config.buttonUrl.trim();
													if (!/^https?:\/\//i.test(url)) url = "https://" + url;
													window.open(url, "_blank", "noopener,noreferrer");
												}
											} else if (config.actionOnClick === "thank_you") {
												setPreviewThankYouShown(true);
												setToast({
													message: "Thank you message displayed",
													type: "success",
												});
											} else if (config.actionOnClick === "show_coupon" || config.actionOnClick === "copy_code") {
												setPreviewCouponShown(true);
												setToast({
													message: `Coupon revealed: ${config.couponCode || "COUPON CODE"}`,
													type: "success",
												});
											}
										}}
									>
										{config.buttonText}
									</button>
								)}


								{/* Show Close Icon if device enabled */}
								{config.closeButtonDevices.includes(previewDevice) && (
									<button
										type="button"
										className="preview-close-btn"
										style={{ color: config.textColor, display: "inline-flex", alignItems: "center" }}
										onClick={() => {
											setPreviewDismissed(true);
											setPreviewThankYouShown(false);
										}}
										title="Close announcement bar"
										aria-label="Close"
									>
										<X size={15} weight="bold" />
									</button>
								)}
							</div>
						</div>
					) : (
						<div style={{ padding: "16px", textAlign: "center", background: "#f8fafc", color: "#64748b", fontSize: "13px" }}>
							{!config.enabled ? "Bar is currently disabled." : "Bar was dismissed in preview."}
							{previewDismissed && (
								<button
									type="button"
									className="preview-reset-btn"
									onClick={() => {
										setPreviewDismissed(false);
										setPreviewThankYouShown(false);
										setPreviewCouponShown(false);
									}}
									style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
								>
									<Eye size={14} weight="bold" />
									<span>Show announcement bar again</span>
								</button>
							)}
						</div>
					)}

					{previewThankYouShown && !previewDismissed && (
						<button
							type="button"
							className="preview-reset-btn"
							onClick={() => setPreviewThankYouShown(false)}
							style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px" }}
						>
							<Eye size={14} weight="bold" />
							<span>Reset thank you state (view standard bar)</span>
						</button>
					)}

					{previewCouponShown && !previewDismissed && (
						<button
							type="button"
							className="preview-reset-btn"
							onClick={() => setPreviewCouponShown(false)}
							style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px" }}
						>
							<Eye size={14} weight="bold" />
							<span>Reset coupon state (view standard bar)</span>
						</button>
					)}

							{config.position === "top" && (
								<div className="preview-mock-page">
									<div className="preview-mock-navbar">
										<span className="preview-mock-logo">My Site</span>
										<span className="preview-mock-link">Home</span>
										<span className="preview-mock-link">Posts</span>
										<span className="preview-mock-link">About</span>
									</div>
									<div className="preview-mock-content">
										<div className="preview-mock-title">Recent Posts</div>
										<div className="preview-mock-desc">Welcome to your site content...</div>
									</div>
								</div>
							)}
						</div>
					)}
			</section>
		</div>

			{/* ============================================================ */}
			{/* MAIN SETTINGS FORM (Step 1, Step 2, Step 3) */}
			{/* ============================================================ */}
			<main className="editor-body">
				{/* ======================================================== */}
				{/* STEP 1: CUSTOMIZE BAR (Screenshot 1) */}
				{/* ======================================================== */}
				{activeStep === 1 && (
					<>
						{/* Card 1: 1. Customize Bar (Title + ON/OFF + Bar Name) */}
						<div className="editor-card">
							<div className="card-header-row">
								<h1 className="card-title blue-accent">1. Customize Bar</h1>
								<label className="switch-root" aria-label="Toggle Bar Active">
									<div className={`switch-track ${config.enabled ? "on" : ""}`}>
										<div className="switch-thumb" />
									</div>
									<span className="switch-label-text">{config.enabled ? "ON" : "OFF"}</span>
									<input
										type="checkbox"
										checked={config.enabled}
										onChange={(e) => update("enabled", e.target.checked)}
										style={{ display: "none" }}
									/>
								</label>
							</div>

							<div className="form-row" style={{ marginTop: "16px" }}>
								<label className="row-label-col" htmlFor="field-bar-name">
									Bar Name
								</label>
								<div className="row-control-col">
									<input
										id="field-bar-name"
										type="text"
										className="text-field-input"
										value={config.name}
										onChange={(e) => update("name", e.target.value)}
										placeholder="e.g. Smarter Announcement Bar"
									/>
									{errors.name && (
										<p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.name}</p>
									)}
								</div>
							</div>
						</div>

						{/* Card 2: Bar Settings (Position & Close Icon) */}
						<div className="editor-card">
							<h2 className="card-title">Bar Settings</h2>
							<p className="card-subtitle">
								The Bar Setting allows you to control the bar's Position and customize the Close Icon visibility for different devices.
							</p>

							{/* Row: Position */}
							<div className="form-row">
								<div className="row-label-col">
									<span>Position</span>
									<span title="Placement of the announcement bar" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
								</div>
								<div className="row-control-col">
									<div className="option-button-group" role="radiogroup" aria-label="Position">
										<button
											type="button"
											className={`option-pill-btn ${config.position === "top" ? "selected" : ""}`}
											onClick={() => update("position", "top")}
											role="radio"
											aria-checked={config.position === "top"}
										>
											<span>Top</span>
											{config.position === "top" && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
										<button
											type="button"
											className={`option-pill-btn ${config.position === "bottom" ? "selected" : ""}`}
											onClick={() => update("position", "bottom")}
											role="radio"
											aria-checked={config.position === "bottom"}
										>
											<span>Bottom</span>
											{config.position === "bottom" && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
									</div>
								</div>
							</div>

							{/* Row: Show Close Button */}
							<div className="form-row">
								<div className="row-label-col">
									<span>Show Close Button</span>
									<span title="Show dismiss 'X' icon on specific devices" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
								</div>
								<div className="row-control-col">
									<div className="option-button-group" role="group" aria-label="Show Close Button">
										<button
											type="button"
											className={`option-pill-btn ${config.closeButtonDevices.includes("desktop") ? "selected" : ""}`}
											onClick={() => toggleDevice("closeButtonDevices", "desktop")}
											aria-pressed={config.closeButtonDevices.includes("desktop")}
										>
											<span>Desktop</span>
											{config.closeButtonDevices.includes("desktop") && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
										<button
											type="button"
											className={`option-pill-btn ${config.closeButtonDevices.includes("mobile") ? "selected" : ""}`}
											onClick={() => toggleDevice("closeButtonDevices", "mobile")}
											aria-pressed={config.closeButtonDevices.includes("mobile")}
										>
											<span>Mobile</span>
											{config.closeButtonDevices.includes("mobile") && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Card 3: Bar Text (Static/Sliding, Rich Text, Text Icon) */}
						<div className="editor-card">
							<h2 className="card-title">Bar Text</h2>
							<p className="card-subtitle">
								The Bar Text setting lets you choose between Static text (fixed in place), Sliding text (slides in one time and stays in place), or Marquee (slides continuously).
							</p>

							{/* Row: Text Type */}
							<div className="form-row">
								<div className="row-label-col">
									<span>Text Type</span>
									<span title="Choose Static (fixed in place), Sliding (slides in one time and stays), or Marquee (slides continuously)" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
								</div>
								<div className="row-control-col">
									<div className="option-button-group" role="radiogroup" aria-label="Text Type">
										<button
											type="button"
											className={`option-pill-btn ${config.textType === "static" ? "selected" : ""}`}
											onClick={() => update("textType", "static")}
											role="radio"
											aria-checked={config.textType === "static"}
										>
											<span>Static</span>
											{config.textType === "static" && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
										<button
											type="button"
											className={`option-pill-btn ${config.textType === "sliding" ? "selected" : ""}`}
											onClick={() => update("textType", "sliding")}
											role="radio"
											aria-checked={config.textType === "sliding"}
										>
											<span>Sliding</span>
											{config.textType === "sliding" && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
										<button
											type="button"
											className={`option-pill-btn ${config.textType === "marquee" ? "selected" : ""}`}
											onClick={() => update("textType", "marquee")}
											role="radio"
											aria-checked={config.textType === "marquee"}
										>
											<span>Marquee</span>
											{config.textType === "marquee" && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
									</div>
								</div>
							</div>

							{/* Row: Text */}
							<div className="form-row">
								<label className="row-label-col" htmlFor={config.textType === "static" ? "bar-rich-text" : "msg-input-0"}>
									Text
								</label>
								<div className="row-control-col">
									{config.textType === "static" ? (
										<div className="rich-text-wrapper">
											<div className="rich-toolbar">
												<button
													type="button"
													className={`rich-btn ${activeFormats.bold ? "active" : ""}`}
													onMouseDown={(e) => {
														e.preventDefault();
														applyFormat("bold");
													}}
													title="Bold"
												>
													<TextB size={14} weight="bold" />
												</button>
												<button
													type="button"
													className={`rich-btn ${activeFormats.italic ? "active" : ""}`}
													onMouseDown={(e) => {
														e.preventDefault();
														applyFormat("italic");
													}}
													title="Italic"
												>
													<TextItalic size={14} weight="bold" />
												</button>
												<button
													type="button"
													className={`rich-btn ${activeFormats.underline ? "active" : ""}`}
													onMouseDown={(e) => {
														e.preventDefault();
														applyFormat("underline");
													}}
													title="Underline"
												>
													<TextUnderline size={14} weight="bold" />
												</button>
												<button
													type="button"
													className="rich-btn"
													onMouseDown={(e) => {
														e.preventDefault();
														const url = prompt("Enter link URL:", "https://example.com");
														if (url !== null) {
															applyFormat("createLink", url);
														}
													}}
													title="Link"
												>
													<LinkSimple size={15} weight="bold" />
												</button>
												<button
													type="button"
													className="rich-btn"
													onMouseDown={(e) => {
														e.preventDefault();
														applyFormat("insertText", "🎉");
													}}
													title="Insert Emoji"
												>
													<Smiley size={15} weight="bold" />
												</button>
											</div>
											<div
												id="bar-rich-text"
												ref={editorRef}
												className="rich-textarea"
												contentEditable
												suppressContentEditableWarning
												onInput={handleEditorInput}
												onBlur={handleEditorInput}
												onKeyUp={checkFormatting}
												onMouseUp={checkFormatting}
												onSelect={checkFormatting}
												data-placeholder="Enter your announcement text here..."
											/>
											<div className="rich-footer">
												<span>p</span>
												<span>Select text to format with Bold, Italic, or Underline</span>
											</div>
										</div>
									) : (
										<div className="multiple-messages-container">
											{currentMessages.map((msg, index) => (
												<div key={index} className="msg-input-row">
													<input
														id={`msg-input-${index}`}
														type="text"
														className="text-field-input"
														value={msg}
														onChange={(e) => handleMessageChange(index, e.target.value)}
														placeholder={index === 0 ? "Get 30% off your first purchase" : `Message ${index + 1}`}
													/>
													<button
														type="button"
														className="btn-delete-msg"
														onClick={() => handleDeleteMessage(index)}
														title="Delete message"
														disabled={currentMessages.length <= 1}
													>
														<Trash size={16} color="#ef4444" weight="bold" />
													</button>
												</div>
											))}
											<button
												type="button"
												className="btn-add-msg"
												onClick={handleAddMessage}
											>
												<PlusCircle size={15} weight="bold" />
												<span>Add Message</span>
											</button>
										</div>
									)}
									{errors.text && (
										<p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.text}</p>
									)}
								</div>
							</div>

							{config.textType === "static" && (
								<>
									{/* Row: Text Icon */}
									<div className="form-row">
										<div className="row-label-col">
											<span>Text Icon</span>
											<span title="Optional icon to display next to your announcement" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
										</div>
										<div className="row-control-col">
											<div
												className="icon-upload-box"
												onDragOver={(e) => e.preventDefault()}
												onDrop={(e) => {
													e.preventDefault();
													const file = e.dataTransfer.files?.[0];
													if (file) handleIconUpload(file);
												}}
												onClick={() => {
													const fileInput = document.getElementById("text-icon-file-input") as HTMLInputElement;
													fileInput?.click();
												}}
											>
												<input
													id="text-icon-file-input"
													type="file"
													accept=".png,.svg,.gif,.webp,image/png,image/svg+xml,image/gif,image/webp"
													style={{ display: "none" }}
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) handleIconUpload(file);
														e.target.value = "";
													}}
												/>
												{config.textIcon && config.textIcon.dataUrl ? (
													<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
														<img
															src={config.textIcon.dataUrl}
															alt="Uploaded icon"
															style={{ width: "36px", height: "36px", objectFit: "contain" }}
														/>
														<div style={{ textAlign: "left" }}>
															<p style={{ margin: 0, fontWeight: 600, fontSize: "13px" }}>{config.textIcon.name}</p>
															<div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
																<button
																	type="button"
																	onClick={(e) => {
																		e.stopPropagation();
																		document.getElementById("text-icon-file-input")?.click();
																	}}
																	style={{ color: "var(--primary-blue)", background: "none", border: "none", fontSize: "12px", cursor: "pointer", padding: 0 }}
																>
																	Replace
																</button>
																<button
																	type="button"
																	onClick={(e) => {
																		e.stopPropagation();
																		setIconError(null);
																		update("textIcon", null);
																	}}
																	style={{ color: "#dc2626", background: "none", border: "none", fontSize: "12px", cursor: "pointer", padding: 0 }}
																>
																	Remove
																</button>
															</div>
														</div>
													</div>
												) : (
													<>
														<UploadSimple size={24} weight="bold" style={{ color: "#94a3b8", marginBottom: "6px" }} />
														<p style={{ margin: "0 0 6px 0", fontSize: "13px", color: "var(--text-muted)" }}>
															Drag and Drop the Icon <br /> or
														</p>
														<button type="button" className="upload-btn">
															Upload Icon
														</button>
													</>
												)}
											</div>
											{iconError && (
												<div
													className="icon-error-msg"
													style={{
														color: "#dc2626",
														fontSize: "12px",
														marginTop: "8px",
														display: "flex",
														alignItems: "center",
														gap: "6px",
														fontWeight: 500,
													}}
												>
													<WarningCircle size={15} weight="bold" />
													<span>{iconError}</span>
												</div>
											)}
											<p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "var(--text-subtle)" }}>
												Allowed formats: PNG, SVG, GIF, WEBP. Max dimensions: 100 × 100 px.
											</p>
										</div>
									</div>

									{/* Row: Icon Position */}
									<div className="form-row">
										<div className="row-label-col">
											<span>Icon Position</span>
											<span title="Choose whether to place the icon on the left or right of your announcement text" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
										</div>
										<div className="row-control-col">
											<div className="option-button-group" role="radiogroup" aria-label="Icon Position">
												<button
													type="button"
													className={`option-pill-btn ${(!config.iconPosition || config.iconPosition === "left") ? "selected" : ""}`}
													onClick={() => update("iconPosition", "left")}
													role="radio"
													aria-checked={!config.iconPosition || config.iconPosition === "left"}
												>
													<span>Left</span>
													{(!config.iconPosition || config.iconPosition === "left") && (
														<span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>
													)}
												</button>
												<button
													type="button"
													className={`option-pill-btn ${config.iconPosition === "right" ? "selected" : ""}`}
													onClick={() => update("iconPosition", "right")}
													role="radio"
													aria-checked={config.iconPosition === "right"}
												>
													<span>Right</span>
													{config.iconPosition === "right" && (
														<span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>
													)}
												</button>
											</div>
											<p className="row-hint-text">Choose whether the icon is placed on the left or right of the text.</p>
										</div>
									</div>

									{/* Row: Icon Style / Contrast */}
									<div className="form-row">
										<div className="row-label-col">
											<span>Icon Style</span>
											<span title="Adjust icon appearance for high visibility on dark or light announcement bars" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
										</div>
										<div className="row-control-col">
											<div className="option-button-group" role="radiogroup" aria-label="Icon Style">
												<button
													type="button"
													className={`option-pill-btn ${(!config.iconStyle || config.iconStyle === "auto") ? "selected" : ""}`}
													onClick={() => update("iconStyle", "auto")}
													role="radio"
													aria-checked={!config.iconStyle || config.iconStyle === "auto"}
												>
													<span>Auto Contrast</span>
													{(!config.iconStyle || config.iconStyle === "auto") && (
														<span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>
													)}
												</button>
												<button
													type="button"
													className={`option-pill-btn ${config.iconStyle === "white" ? "selected" : ""}`}
													onClick={() => update("iconStyle", "white")}
													role="radio"
													aria-checked={config.iconStyle === "white"}
												>
													<span>White / Invert</span>
													{config.iconStyle === "white" && (
														<span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>
													)}
												</button>
												<button
													type="button"
													className={`option-pill-btn ${config.iconStyle === "badge" ? "selected" : ""}`}
													onClick={() => update("iconStyle", "badge")}
													role="radio"
													aria-checked={config.iconStyle === "badge"}
												>
													<span>White Badge</span>
													{config.iconStyle === "badge" && (
														<span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>
													)}
												</button>
												<button
													type="button"
													className={`option-pill-btn ${config.iconStyle === "original" ? "selected" : ""}`}
													onClick={() => update("iconStyle", "original")}
													role="radio"
													aria-checked={config.iconStyle === "original"}
												>
													<span>Original</span>
													{config.iconStyle === "original" && (
														<span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>
													)}
												</button>
											</div>
											<p className="row-hint-text">Auto Contrast or White/Invert makes dark silhouette icons clearly visible on dark announcement bars.</p>
										</div>
									</div>
								</>
							)}
						</div>

						{/* Card 4: Button (Visibility, Text, Attention, Click Action) */}
						<div className="editor-card">
							<div className="card-header-row">
								<h2 className="card-title">Button</h2>
								<label className="switch-root" aria-label="Toggle Button">
									<div className={`switch-track ${config.buttonDevices && config.buttonDevices.length > 0 ? "on" : ""}`}>
										<div className="switch-thumb" />
									</div>
									<span className="switch-label-text">{config.buttonDevices && config.buttonDevices.length > 0 ? "ON" : "OFF"}</span>
									<input
										type="checkbox"
										checked={Boolean(config.buttonDevices && config.buttonDevices.length > 0)}
										onChange={(e) => {
											const checked = e.target.checked;
											if (!checked) {
												setConfig((prev) => ({
													...prev,
													buttonDevices: [],
													leadFormEnabled: false,
												}));
												if (config.leadFormEnabled) {
													setToast({
														message: "Button disabled: Contact Lead Form has been disabled as well.",
														type: "info",
													});
												}
											} else {
												setConfig((prev) => ({
													...prev,
													buttonDevices: ["desktop", "mobile"],
													buttonText: prev.buttonText?.trim() ? prev.buttonText : "Learn More",
												}));
											}
										}}
										style={{ display: "none" }}
									/>
								</label>
							</div>
							<p className="card-subtitle">
								The Button Setting option allows you to customize the button's appearance, behavior, and functionality for an optimized user experience.
							</p>

							{Boolean(config.buttonDevices && config.buttonDevices.length > 0) && (
								<div style={{ marginTop: "20px" }}>
									{config.discountEnabled && config.showCouponWhen === "rightaway" && (
										<div style={{ padding: "8px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", marginBottom: "14px", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
											<Info size={15} style={{ color: "#3b82f6", flexShrink: 0 }} />
											<span>CTA button is currently hidden because Discount is set to <strong>Display rightaway</strong>.</span>
										</div>
									)}
									{config.leadFormEnabled && !(config.discountEnabled && config.showCouponWhen === "rightaway") && (
										<div style={{ padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", marginBottom: "14px", fontSize: "12px", color: "#166534", display: "flex", alignItems: "center", gap: "6px" }}>
											<EnvelopeSimple size={16} style={{ color: "#16a34a", flexShrink: 0 }} />
											<span>Contact Lead Form is enabled. This button acts as the submission button for collecting visitor details.</span>
										</div>
									)}

									{/* Row: Show Button */}
							<div className="form-row">
								<div className="row-label-col">
									<span>Show Button</span>
									<span title="Display call-to-action button on specific devices" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
								</div>
								<div className="row-control-col">
									<div className="option-button-group" role="group" aria-label="Show CTA Button">
										<button
											type="button"
											className={`option-pill-btn ${config.buttonDevices.includes("desktop") ? "selected" : ""}`}
											onClick={() => toggleDevice("buttonDevices", "desktop")}
											aria-pressed={config.buttonDevices.includes("desktop")}
										>
											<span>Desktop</span>
											{config.buttonDevices.includes("desktop") && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
										<button
											type="button"
											className={`option-pill-btn ${config.buttonDevices.includes("mobile") ? "selected" : ""}`}
											onClick={() => toggleDevice("buttonDevices", "mobile")}
											aria-pressed={config.buttonDevices.includes("mobile")}
										>
											<span>Mobile</span>
											{config.buttonDevices.includes("mobile") && <span className="pill-checkmark-badge"><Check size={11} weight="bold" /></span>}
										</button>
									</div>
								</div>
							</div>

							{/* Row: Text */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="cta-btn-text">
									Text
								</label>
								<div className="row-control-col">
									<input
										id="cta-btn-text"
										type="text"
										className="text-field-input"
										value={config.buttonText}
										onChange={(e) => {
											const val = e.target.value;
											if (!val.trim() && config.leadFormEnabled) {
												setConfig((prev) => ({
													...prev,
													buttonText: val,
													leadFormEnabled: false,
												}));
												setToast({
													message: "Button text removed: Contact Lead Form has been disabled as well.",
													type: "info",
												});
											} else {
												update("buttonText", val);
											}
										}}
										placeholder="e.g. Submit, Claim Offer"
									/>
								</div>
							</div>

							{/* Row: Attention Effect */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="attention-effect-select">
									Attention Effect
								</label>
								<div className="row-control-col">
									<select
										id="attention-effect-select"
										className="text-field-select"
										value={config.attentionEffect}
										onChange={(e) => update("attentionEffect", e.target.value as any)}
									>
										<option value="none">None</option>
										<option value="flash">Flash</option>
										<option value="shake">Shake</option>
										<option value="swing">Swing</option>
										<option value="tada">Tada</option>
										<option value="heartbeat">Heartbeat</option>
										<option value="wobble">Wobble</option>
									</select>
								</div>
							</div>

							{/* Row: Action On Click */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="action-on-click-select">
									<span>Action On Click</span>
									<span title="What occurs when visitor clicks the CTA button" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
								</label>
								<div className="row-control-col">
									<select
										id="action-on-click-select"
										className="text-field-select"
										value={config.actionOnClick}
										onChange={(e) => {
											const val = e.target.value as any;
											if (val === "show_coupon") {
												setConfig((prev) => ({
													...prev,
													actionOnClick: val,
													discountEnabled: true,
													showCouponWhen: prev.showCouponWhen || "claims_it",
													couponCode: prev.couponCode && prev.couponCode !== "WELCOME30" ? prev.couponCode : "COUPON CODE",
													couponBarText: prev.couponBarText || "Click to copy your coupon",
													copiedTooltipText: prev.copiedTooltipText || "copied",
												}));
												setPreviewCouponShown(false);
											} else {
												update("actionOnClick", val);
											}
										}}
									>
										<option value="close">Close the bar</option>
										<option value="open_url">Redirect the visitor to another URL</option>
										<option value="thank_you">Show a thank you message</option>
										<option value="show_coupon">Show the coupon</option>
									</select>

									{config.actionOnClick === "open_url" && (
										<div style={{ marginTop: "10px" }}>
											<input
												type="url"
												className="text-field-input"
												value={config.buttonUrl}
												onChange={(e) => update("buttonUrl", e.target.value)}
												placeholder="https://example.com/special-offer"
											/>
											{errors.buttonUrl && (
												<p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{errors.buttonUrl}</p>
											)}
										</div>
									)}

									{config.actionOnClick === "thank_you" && (
										<div style={{ marginTop: "12px" }}>
											<label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
												Thank You Message
											</label>
											<div className="rich-text-wrapper">
												<div className="rich-toolbar">
													<button
														type="button"
														className={`rich-btn ${thankYouFormats.bold ? "active" : ""}`}
														onMouseDown={(e) => {
															e.preventDefault();
															applyThankYouFormat("bold");
														}}
														title="Bold"
													>
														<TextB size={14} weight="bold" />
													</button>
													<button
														type="button"
														className={`rich-btn ${thankYouFormats.italic ? "active" : ""}`}
														onMouseDown={(e) => {
															e.preventDefault();
															applyThankYouFormat("italic");
														}}
														title="Italic"
													>
														<TextItalic size={14} weight="bold" />
													</button>
													<button
														type="button"
														className={`rich-btn ${thankYouFormats.underline ? "active" : ""}`}
														onMouseDown={(e) => {
															e.preventDefault();
															applyThankYouFormat("underline");
														}}
														title="Underline"
													>
														<TextUnderline size={14} weight="bold" />
													</button>
													<button
														type="button"
														className="rich-btn"
														onMouseDown={(e) => {
															e.preventDefault();
															const url = prompt("Enter link URL:", "https://example.com");
															if (url !== null) {
																applyThankYouFormat("createLink", url);
															}
														}}
														title="Link"
													>
														<LinkSimple size={15} weight="bold" />
													</button>
													<button
														type="button"
														className="rich-btn"
														onMouseDown={(e) => {
															e.preventDefault();
															applyThankYouFormat("insertText", "🎉");
														}}
														title="Insert Emoji"
													>
														<Smiley size={15} weight="bold" />
													</button>
												</div>
												<div
													id="thank-you-rich-text"
													ref={thankYouEditorRef}
													className="rich-textarea"
													contentEditable
													suppressContentEditableWarning
													onInput={handleThankYouEditorInput}
													onBlur={handleThankYouEditorInput}
													onKeyUp={checkThankYouFormatting}
													onMouseUp={checkThankYouFormatting}
													onSelect={checkThankYouFormatting}
													data-placeholder="Enter thank you message..."
												/>
												<div className="rich-footer">
													<span>p</span>
													<span>Select text to format with Bold, Italic, or Underline</span>
												</div>
											</div>
											<p className="row-hint-text" style={{ marginTop: "6px" }}>
												This message replaces the bar text when visitor clicks the button.
											</p>
										</div>
									)}


								</div>
							</div>

							{/* Row: Bar Appearance After Button Click */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="appearance-after-click-select">
									<span>Bar Appearance After Button Click</span>
									<span title="Persistent visibility behavior after button click" style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}><Info size={16} style={{ color: "#9ca3af", flexShrink: 0 }} /></span>
								</label>
								<div className="row-control-col">
									<select
										id="appearance-after-click-select"
										className="text-field-select"
										value={config.appearanceAfterClick}
										onChange={(e) => update("appearanceAfterClick", e.target.value as any)}
									>
										<option value="dont_show">Don't show the Bar again for the user</option>
										<option value="next_session">Show the Bar again when the user visits the website next time</option>
										<option value="always">Show the Bar when the user refreshes/goes to another page</option>
									</select>
								</div>
							</div>
								</div>
							)}
						</div>

						{/* Optional Feature Card: Countdown */}
						<div className="editor-card">
							<div className="card-header-row">
								<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
									<Clock size={20} weight="regular" style={{ color: "#374151" }} />
									<h2 className="card-title">Countdown</h2>
								</div>
								<label className="switch-root" aria-label="Toggle Countdown">
									<div className={`switch-track ${config.countdownEnabled ? "on" : ""}`}>
										<div className="switch-thumb" />
									</div>
									<span className="switch-label-text">{config.countdownEnabled ? "ON" : "OFF"}</span>
									<input
										type="checkbox"
										checked={config.countdownEnabled}
										onChange={(e) => {
											const checked = e.target.checked;
											const hadLeadForm = Boolean(config.leadFormEnabled);
											setConfig((prev) => ({
												...prev,
												countdownEnabled: checked,
												leadFormEnabled: checked ? false : prev.leadFormEnabled,
											}));
											if (checked && hadLeadForm) {
												setToast({
													message: "Countdown enabled: Contact Lead Form has been disabled.",
													type: "info",
												});
											}
										}}
										style={{ display: "none" }}
									/>
								</label>
							</div>
							<p className="card-subtitle" style={{ margin: "4px 0 0 28px" }}>
								Add a countdown timer element to your Bar to increase conversion rate, announce flash sales, and more.
							</p>

							{config.countdownEnabled && (
								<div className="feature-expanded-panel" style={{ borderTop: "1px solid #f1f5f9", marginTop: "16px", paddingTop: "16px" }}>
									{/* Row 1: Specific End Date & Time */}
									<div className="form-row">
										<label className="row-label-col" htmlFor="countdown-target" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
											<span className="blue-help-bubble" title="Specify the deadline date and time for the countdown timer">?</span>
											<span>Specific End Date & Time</span>
										</label>
										<div className="row-control-col">
											<div style={{ position: "relative", maxWidth: "480px" }}>
												<Clock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
												<input
													id="countdown-target"
													type="text"
													className="text-field-input"
													style={{ paddingLeft: "36px" }}
													value={config.countdownTarget ?? "2026-10-25 11:16:55"}
													onChange={(e) => update("countdownTarget", e.target.value)}
													placeholder="2026-10-25 11:16:55"
												/>
											</div>
										</div>
									</div>

									{/* Row 2: Timezone */}
									<div className="form-row">
										<label className="row-label-col" htmlFor="countdown-timezone" style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
											Timezone
										</label>
										<div className="row-control-col">
											<select
												id="countdown-timezone"
												className="text-field-select"
												style={{ maxWidth: "480px" }}
												value={config.countdownTimezone || "Eritrea/Asmara"}
												onChange={(e) => update("countdownTimezone", e.target.value)}
											>
												<option value="Eritrea/Asmara">Eritrea/Asmara</option>
												<option value="UTC">UTC</option>
												<option value="America/New_York">America/New_York</option>
												<option value="America/Chicago">America/Chicago</option>
												<option value="America/Denver">America/Denver</option>
												<option value="America/Los_Angeles">America/Los_Angeles</option>
												<option value="Europe/London">Europe/London</option>
												<option value="Europe/Paris">Europe/Paris</option>
												<option value="Europe/Berlin">Europe/Berlin</option>
												<option value="Asia/Dubai">Asia/Dubai</option>
												<option value="Asia/Kolkata">Asia/Kolkata</option>
												<option value="Asia/Singapore">Asia/Singapore</option>
												<option value="Asia/Tokyo">Asia/Tokyo</option>
												<option value="Australia/Sydney">Australia/Sydney</option>
											</select>
										</div>
									</div>

									{/* Row 3: Hide Lable */}
									<div className="form-row">
										<label className="row-label-col" style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
											Hide Lable
										</label>
										<div className="row-control-col">
											<label className="switch-root" aria-label="Toggle Hide Lable">
												<div className={`switch-track ${config.countdownHideLabels ? "on" : ""}`}>
													<div className="switch-thumb" />
												</div>
												<span className="switch-label-text">{config.countdownHideLabels ? "ON" : "OFF"}</span>
												<input
													type="checkbox"
													checked={Boolean(config.countdownHideLabels)}
													onChange={(e) => update("countdownHideLabels", e.target.checked)}
													style={{ display: "none" }}
												/>
											</label>
										</div>
									</div>

									{/* Row 4: Change Lable */}
									{!config.countdownHideLabels && (
										<div className="form-row">
											<label className="row-label-col" style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
												Change Lable
											</label>
											<div className="row-control-col">
												<label className="switch-root" aria-label="Toggle Change Lable">
													<div className={`switch-track ${config.countdownChangeLabels !== false ? "on" : ""}`}>
														<div className="switch-thumb" />
													</div>
													<span className="switch-label-text">{config.countdownChangeLabels !== false ? "ON" : "OFF"}</span>
													<input
														type="checkbox"
														checked={config.countdownChangeLabels !== false}
														onChange={(e) => update("countdownChangeLabels", e.target.checked)}
														style={{ display: "none" }}
													/>
												</label>

												{config.countdownChangeLabels !== false && (
													<div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px", marginTop: "12px", maxWidth: "600px" }}>
														<div>
															<label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Days</label>
															<input
																type="text"
																className="text-field-input"
																value={config.countdownDaysLabel ?? "Days"}
																onChange={(e) => update("countdownDaysLabel", e.target.value)}
																placeholder="Days"
															/>
														</div>
														<div>
															<label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Hours</label>
															<input
																type="text"
																className="text-field-input"
																value={config.countdownHoursLabel ?? "Hours"}
																onChange={(e) => update("countdownHoursLabel", e.target.value)}
																placeholder="Hours"
															/>
														</div>
														<div>
															<label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Minutes</label>
															<input
																type="text"
																className="text-field-input"
																value={config.countdownMinutesLabel ?? "Minutes"}
																onChange={(e) => update("countdownMinutesLabel", e.target.value)}
																placeholder="Minutes"
															/>
														</div>
														<div>
															<label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Seconds</label>
															<input
																type="text"
																className="text-field-input"
																value={config.countdownSecondsLabel ?? "Seconds"}
																onChange={(e) => update("countdownSecondsLabel", e.target.value)}
																placeholder="Seconds"
															/>
														</div>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							)}
						</div>

						{/* Optional Feature Card: Contact Lead Form */}
						<div className="editor-card">
							<div className="card-header-row">
								<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
									<EnvelopeSimple size={20} weight="bold" style={{ color: "#2563eb" }} />
									<h2 className="card-title">Contact Lead Form</h2>
								</div>
								<label className="switch-root" aria-label="Toggle Contact Lead Form">
									<div className={`switch-track ${config.leadFormEnabled ? "on" : ""}`}>
										<div className="switch-thumb" />
									</div>
									<span className="switch-label-text">{config.leadFormEnabled ? "ON" : "OFF"}</span>
									<input
										type="checkbox"
										checked={config.leadFormEnabled}
										onChange={(e) => {
											const checked = e.target.checked;
											const hadCountdown = Boolean(config.countdownEnabled);
											setConfig((prev) => {
												const hasNoDevices = !prev.buttonDevices || prev.buttonDevices.length === 0;
												const hasNoText = !prev.buttonText || !prev.buttonText.trim();
												return {
													...prev,
													leadFormEnabled: checked,
													countdownEnabled: checked ? false : prev.countdownEnabled,
													buttonDevices: (checked && hasNoDevices) ? ["desktop", "mobile"] : prev.buttonDevices,
													buttonText: (checked && hasNoText) ? (prev.leadFormButtonLabel || "Join") : prev.buttonText,
												};
											});
											if (checked) {
												if (hadCountdown) {
													setToast({
														message: "Contact Lead Form enabled: Countdown has been disabled.",
														type: "info",
													});
												} else {
													setToast({
														message: "Button automatically enabled for Contact Lead Form",
														type: "info",
													});
												}
											}
										}}
										style={{ display: "none" }}
									/>
								</label>
							</div>
							<p className="card-subtitle" style={{ margin: "4px 0 0 28px" }}>
								Collect the visitor's details such as Name And email address from the bar. Collected visitor details can be viewed on the <strong>Contact Form Leads</strong> page.
							</p>

							{config.leadFormEnabled && (
								<div className="feature-expanded-panel" style={{ borderTop: "1px solid #f1f5f9", marginTop: "16px", paddingTop: "16px" }}>
									{/* Row 1: Name Placeholder */}
									<div className="form-row">
										<label className="row-label-col" htmlFor="lead-name-placeholder" style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
											Name Placeholder
										</label>
										<div className="row-control-col">
											<input
												id="lead-name-placeholder"
												type="text"
												className="text-field-input"
												style={{ maxWidth: "480px" }}
												value={config.leadNamePlaceholder ?? "Enter your name"}
												onChange={(e) => update("leadNamePlaceholder", e.target.value)}
												placeholder="Enter your name"
											/>
										</div>
									</div>

									{/* Row 2: Email Placeholder */}
									<div className="form-row">
										<label className="row-label-col" htmlFor="lead-email-placeholder" style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
											Email Placeholder
										</label>
										<div className="row-control-col">
											<input
												id="lead-email-placeholder"
												type="text"
												className="text-field-input"
												style={{ maxWidth: "480px" }}
												value={config.leadEmailPlaceholder ?? "Enter your email address"}
												onChange={(e) => {
													const val = e.target.value;
													setConfig((prev) => ({
														...prev,
														leadEmailPlaceholder: val,
														leadFormPlaceholder: val,
													}));
												}}
												placeholder="Enter your email address"
											/>
										</div>
									</div>

									{/* Row 3: Send Leads Mail */}
									<div className="form-row">
										<label className="row-label-col" style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
											Send Leads Mail
										</label>
										<div className="row-control-col">
											<label className="switch-root" aria-label="Toggle Send Leads Mail">
												<div className={`switch-track ${config.leadSendMail !== false ? "on" : ""}`}>
													<div className="switch-thumb" />
												</div>
												<span className="switch-label-text">{config.leadSendMail !== false ? "ON" : "OFF"}</span>
												<input
													type="checkbox"
													checked={config.leadSendMail !== false}
													onChange={(e) => update("leadSendMail", e.target.checked)}
													style={{ display: "none" }}
												/>
											</label>
										</div>
									</div>

									{config.leadSendMail !== false && (
										<>
											{/* Row 4: Email address */}
											<div className="form-row">
												<label className="row-label-col" htmlFor="lead-recipient-email" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
													<span className="blue-help-bubble" title="Email address to receive collected leads">?</span>
													<span>Email address</span>
												</label>
												<div className="row-control-col">
													<input
														id="lead-recipient-email"
														type="email"
														className="text-field-input"
														style={{ maxWidth: "480px" }}
														value={config.leadEmailAddress ?? "kokenap418@copytosh.com"}
														onChange={(e) => update("leadEmailAddress", e.target.value)}
														placeholder="kokenap418@copytosh.com"
													/>
												</div>
											</div>

											{/* Row 5: Sender's name */}
											<div className="form-row">
												<label className="row-label-col" htmlFor="lead-sender-name" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
													<span className="blue-help-bubble" title="Sender name template for notification emails">?</span>
													<span>Sender's name</span>
												</label>
												<div className="row-control-col">
													<input
														id="lead-sender-name"
														type="text"
														className="text-field-input"
														style={{ maxWidth: "480px" }}
														value={config.leadSenderName ?? "{name}"}
														onChange={(e) => update("leadSenderName", e.target.value)}
														placeholder="{name}"
													/>
												</div>
											</div>

											{/* Row 6: Email subject */}
											<div className="form-row">
												<label className="row-label-col" htmlFor="lead-email-subject" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
													<span className="blue-help-bubble" title="Subject line for lead notification email">?</span>
													<span>Email subject</span>
												</label>
												<div className="row-control-col">
													<input
														id="lead-email-subject"
														type="text"
														className="text-field-input"
														style={{ maxWidth: "480px" }}
														value={config.leadEmailSubject ?? "New lead from my announcement bar from {name} on {date} {hours}"}
														onChange={(e) => update("leadEmailSubject", e.target.value)}
														placeholder="New lead from my announcement bar from {name} on {date} {hours}"
													/>
													<div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
														{["{name}", "{email}", "{date}", "{hours}"].map((tag) => (
															<button
																key={tag}
																type="button"
																onClick={() => {
																	setConfig((prev) => ({
																		...prev,
																		leadEmailSubject: (prev.leadEmailSubject ?? "New lead from my announcement bar from {name} on {date} {hours}") + " " + tag,
																	}));
																}}
																style={{
																	display: "inline-flex",
																	alignItems: "center",
																	padding: "3px 12px",
																	borderRadius: "9999px",
																	background: "#3b82f6",
																	color: "#ffffff",
																	fontSize: "12px",
																	fontWeight: 600,
																	border: "none",
																	cursor: "pointer",
																	transition: "all 0.15s ease",
																	lineHeight: 1.4,
																}}
																title={`Add ${tag} to subject`}
															>
																{tag}
															</button>
														))}
													</div>
												</div>
											</div>
										</>
									)}
								</div>
							)}
						</div>

						{/* Optional Feature Card: Discount */}
						<div className="editor-card" id="discount-feature-card">
							<div className="card-header-row">
								<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
									<Tag size={20} weight="regular" style={{ color: "#64748b" }} />
									<h2 className="card-title" style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>Discount</h2>
								</div>
								<label className="switch-root" aria-label="Toggle Discount">
									<div className={`switch-track ${config.discountEnabled ? "on" : ""}`}>
										<div className="switch-thumb" />
									</div>
									<span className="switch-label-text">{config.discountEnabled ? "ON" : "OFF"}</span>
									<input
										id="discount-toggle-checkbox"
										type="checkbox"
										checked={config.discountEnabled}
										onChange={(e) => {
											const checked = e.target.checked;
											setConfig((prev) => {
												const nextShowWhen = prev.showCouponWhen || "claims_it";
												const isClaimsIt = nextShowWhen === "claims_it";
												const hasNoDevices = !prev.buttonDevices || prev.buttonDevices.length === 0;
												const hasNoText = !prev.buttonText || !prev.buttonText.trim();
												return {
													...prev,
													discountEnabled: checked,
													showCouponWhen: nextShowWhen,
													buttonDevices: (checked && isClaimsIt && hasNoDevices) ? ["desktop", "mobile"] : prev.buttonDevices,
													buttonText: (checked && isClaimsIt && hasNoText) ? "Claim Coupon" : prev.buttonText,
													actionOnClick: (checked && isClaimsIt) ? "show_coupon" : prev.actionOnClick,
													couponCode: prev.couponCode && prev.couponCode !== "WELCOME30" ? prev.couponCode : "COUPON CODE",
													couponBarText: prev.couponBarText || "Click to copy your coupon",
													copiedTooltipText: prev.copiedTooltipText || "copied",
												};
											});
										}}
										style={{ display: "none" }}
									/>
								</label>
							</div>
							<p className="card-subtitle" style={{ margin: "4px 0 0 30px", fontSize: "13px", color: "#64748b" }}>
								Add a coupon to your bar. Users can click on the coupon, copy it and use it on your website.
							</p>

							{config.discountEnabled && (
								<div className="feature-expanded-panel" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
									{/* Row 1: Show Coupon When */}
									<div className="form-row">
										<label className="row-label-col" htmlFor="show-coupon-when" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
											<span className="blue-help-bubble">?</span>
											<span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>Show Coupon When</span>
										</label>
										<div className="row-control-col">
											<select
												id="show-coupon-when"
												className="text-field-select"
												style={{ maxWidth: "420px" }}
												value={config.showCouponWhen === "rightaway" ? "rightaway" : "claims_it"}
												onChange={(e) => {
													const val = e.target.value;
													if (val === "claims_it") {
														setConfig((prev) => {
															const hasNoDevices = !prev.buttonDevices || prev.buttonDevices.length === 0;
															const hasNoText = !prev.buttonText || !prev.buttonText.trim();
															return {
																...prev,
																showCouponWhen: "claims_it",
																buttonDevices: hasNoDevices ? ["desktop", "mobile"] : prev.buttonDevices,
																buttonText: hasNoText ? "Claim Coupon" : prev.buttonText,
																actionOnClick: "show_coupon",
															};
														});
														setPreviewCouponShown(false);
														setToast({
															message: "Button automatically enabled for Claim Coupon",
															type: "info",
														});
													} else {
														update("showCouponWhen", val);
													}
												}}
											>
												<option value="rightaway">Display rightaway</option>
												<option value="claims_it">Claims it</option>
											</select>
											{config.showCouponWhen === "rightaway" && (
												<p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#64748b" }}>
													💡 Coupon code and Coupon Bar Text are displayed right away. The button, icon, and main text will not be displayed.
												</p>
											)}
											{config.showCouponWhen === "claims_it" && (
												<p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#64748b" }}>
													💡 The CTA button (or contact form) is enabled. Submitting the button or contact form will display the coupon code with the coupon bar text.
												</p>
											)}
										</div>
									</div>

									{/* Row 2: Coupon Code */}
									<div className="form-row">
										<label className="row-label-col" htmlFor="discount-code" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
											<span className="blue-help-bubble">?</span>
											<span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>Coupon Code</span>
										</label>
										<div className="row-control-col">
											<input
												id="discount-code"
												type="text"
												className="text-field-input"
												style={{ maxWidth: "420px" }}
												value={config.couponCode || "COUPON CODE"}
												onChange={(e) => update("couponCode", e.target.value)}
												placeholder="COUPON CODE"
											/>
										</div>
									</div>

									{/* Row 3: Coupon Bar Text */}
									<div className="form-row">
										<label className="row-label-col" htmlFor="coupon-bar-text" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
											<span className="blue-help-bubble">?</span>
											<span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>Coupon Bar Text</span>
										</label>
										<div className="row-control-col">
											<div className="rich-text-wrapper" style={{ maxWidth: "620px" }}>
												<div className="rich-toolbar">
													<button
														type="button"
														className={`rich-btn ${couponFormats.bold ? "active" : ""}`}
														onMouseDown={(e) => {
															e.preventDefault();
															applyCouponFormat("bold");
														}}
														title="Bold"
													>
														<TextB size={14} weight="bold" />
													</button>
													<button
														type="button"
														className={`rich-btn ${couponFormats.italic ? "active" : ""}`}
														onMouseDown={(e) => {
															e.preventDefault();
															applyCouponFormat("italic");
														}}
														title="Italic"
													>
														<TextItalic size={14} weight="bold" />
													</button>
													<button
														type="button"
														className={`rich-btn ${couponFormats.underline ? "active" : ""}`}
														onMouseDown={(e) => {
															e.preventDefault();
															applyCouponFormat("underline");
														}}
														title="Underline"
													>
														<TextUnderline size={14} weight="bold" />
													</button>
													<button
														type="button"
														className="rich-btn"
														onMouseDown={(e) => {
															e.preventDefault();
															const url = prompt("Enter link URL:", "https://example.com");
															if (url !== null) {
																applyCouponFormat("createLink", url);
															}
														}}
														title="Link"
													>
														<LinkSimple size={15} weight="bold" />
													</button>
													<button
														type="button"
														className="rich-btn"
														onMouseDown={(e) => {
															e.preventDefault();
															applyCouponFormat("insertText", "🏷️");
														}}
														title="Insert Emoji"
													>
														<Smiley size={15} weight="bold" />
													</button>
												</div>
												<div
													id="coupon-bar-rich-text"
													ref={couponEditorRef}
													className="rich-textarea"
													contentEditable
													suppressContentEditableWarning
													onInput={handleCouponEditorInput}
													onBlur={handleCouponEditorInput}
													onKeyUp={checkCouponFormatting}
													onMouseUp={checkCouponFormatting}
													onSelect={checkCouponFormatting}
													data-placeholder="Click to copy your coupon"
													style={{ minHeight: "90px" }}
												/>
												<div className="rich-footer">
													<span>p</span>
												</div>
											</div>
										</div>
									</div>

									{/* Row 4: Copied Tooltip Text */}
									<div className="form-row">
										<label className="row-label-col" htmlFor="copied-tooltip-text" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
											<span className="blue-help-bubble">?</span>
											<span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>Copied Tooltip Text</span>
										</label>
										<div className="row-control-col">
											<input
												id="copied-tooltip-text"
												type="text"
												className="text-field-input"
												style={{ maxWidth: "420px" }}
												value={config.copiedTooltipText || "copied"}
												onChange={(e) => update("copiedTooltipText", e.target.value)}
												placeholder="copied"
											/>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Bottom Navigation */}
						<div className="bottom-nav-row">
							<button
								type="button"
								className="btn-nav-next"
								onClick={() => goToStep(2)}
							>
								<span>Next</span>
								<ArrowRight size={16} weight="bold" />
							</button>
						</div>
					</>
				)}

				{/* ======================================================== */}
				{/* STEP 2: CUSTOMIZE DESIGN */}
				{/* ======================================================== */}
				{activeStep === 2 && (
					<>
						<div className="editor-card">
							<h1 className="card-title blue-accent">2. Customize Design</h1>
							<p className="card-subtitle">
								Style your announcement bar to match your brand colors, typography, and site aesthetic.
							</p>

							{/* Background Color */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="bg-color-picker">
									Bar Background Color
								</label>
								<div className="row-control-col" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
									<input
										id="bg-color-picker"
										type="color"
										value={config.backgroundColor}
										onChange={(e) => update("backgroundColor", e.target.value)}
										style={{ width: "44px", height: "40px", border: "none", cursor: "pointer", borderRadius: "6px" }}
									/>
									<input
										type="text"
										className="text-field-input"
										style={{ width: "120px" }}
										value={config.backgroundColor}
										onChange={(e) => update("backgroundColor", e.target.value)}
									/>
								</div>
							</div>

							{/* Text Color */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="text-color-picker">
									Text Color
								</label>
								<div className="row-control-col" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
									<input
										id="text-color-picker"
										type="color"
										value={config.textColor}
										onChange={(e) => update("textColor", e.target.value)}
										style={{ width: "44px", height: "40px", border: "none", cursor: "pointer", borderRadius: "6px" }}
									/>
									<input
										type="text"
										className="text-field-input"
										style={{ width: "120px" }}
										value={config.textColor}
										onChange={(e) => update("textColor", e.target.value)}
									/>
								</div>
							</div>

							{/* Button Background Color */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="btn-bg-color-picker">
									Button Background Color
								</label>
								<div className="row-control-col" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
									<input
										id="btn-bg-color-picker"
										type="color"
										value={config.buttonBackgroundColor}
										onChange={(e) => update("buttonBackgroundColor", e.target.value)}
										style={{ width: "44px", height: "40px", border: "none", cursor: "pointer", borderRadius: "6px" }}
									/>
									<input
										type="text"
										className="text-field-input"
										style={{ width: "120px" }}
										value={config.buttonBackgroundColor}
										onChange={(e) => update("buttonBackgroundColor", e.target.value)}
									/>
								</div>
							</div>

							{/* Button Text Color */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="btn-text-color-picker">
									Button Text Color
								</label>
								<div className="row-control-col" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
									<input
										id="btn-text-color-picker"
										type="color"
										value={config.buttonTextColor}
										onChange={(e) => update("buttonTextColor", e.target.value)}
										style={{ width: "44px", height: "40px", border: "none", cursor: "pointer", borderRadius: "6px" }}
									/>
									<input
										type="text"
										className="text-field-input"
										style={{ width: "120px" }}
										value={config.buttonTextColor}
										onChange={(e) => update("buttonTextColor", e.target.value)}
									/>
								</div>
							</div>

							{/* Font Size */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="font-size-select">Font Size</label>
								<div className="row-control-col">
									<select
										id="font-size-select"
										className="text-field-select"
										value={config.fontSize}
										onChange={(e) => update("fontSize", e.target.value as any)}
									>
										<option value="sm">Small (12px)</option>
										<option value="base">Standard (14px)</option>
										<option value="lg">Large (16px)</option>
									</select>
								</div>
							</div>

							{/* Bar Padding / Height */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="bar-padding-select">Bar Padding & Height</label>
								<div className="row-control-col">
									<select
										id="bar-padding-select"
										className="text-field-select"
										value={config.padding}
										onChange={(e) => update("padding", e.target.value as any)}
									>
										<option value="compact">Compact (Subtle)</option>
										<option value="normal">Standard</option>
										<option value="spacious">Spacious (Prominent)</option>
									</select>
								</div>
							</div>
						</div>

						{/* Bottom Navigation */}
						<div className="bottom-nav-row">
							<button type="button" className="btn-nav-prev" onClick={() => goToStep(1)}>
								<ArrowLeft size={16} weight="bold" />
								<span>Previous</span>
							</button>
							<button type="button" className="btn-nav-next" onClick={() => goToStep(3)}>
								<span>Next</span>
								<ArrowRight size={16} weight="bold" />
							</button>
						</div>
					</>
				)}

				{/* ======================================================== */}
				{/* STEP 3: DISPLAY RULES */}
				{/* ======================================================== */}
				{activeStep === 3 && (
					<>
						<div className="editor-card">
							<h1 className="card-title blue-accent">3. Display Rules</h1>
							<p className="card-subtitle">
								Control exactly where, when, and to whom this announcement bar appears across your website.
							</p>

							{/* Target Pages */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="target-pages-select">
									Target Pages
								</label>
								<div className="row-control-col">
									<select
										id="target-pages-select"
										className="text-field-select"
										value={config.targetPages}
										onChange={(e) => update("targetPages", e.target.value as any)}
									>
										<option value="all">All Pages</option>
										<option value="homepage">Homepage Only</option>
										<option value="custom">Specific URL Patterns</option>
									</select>

									{config.targetPages === "custom" && (
										<div style={{ marginTop: "10px" }}>
											<input
												type="text"
												className="text-field-input"
												value={config.targetUrls}
												onChange={(e) => update("targetUrls", e.target.value)}
												placeholder="/products/*, /sale"
											/>
											<span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Separate multiple paths with commas. Wildcards (*) supported.</span>
										</div>
									)}
								</div>
							</div>

							{/* Target Devices */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="target-devices-select">Target Devices</label>
								<div className="row-control-col">
									<select
										id="target-devices-select"
										className="text-field-select"
										value={config.targetDevices}
										onChange={(e) => update("targetDevices", e.target.value as any)}
									>
										<option value="all">All Devices (Desktop & Mobile)</option>
										<option value="desktop">Desktop Only</option>
										<option value="mobile">Mobile Only</option>
									</select>
								</div>
							</div>

							{/* Target Visitors */}
							<div className="form-row">
								<label className="row-label-col" htmlFor="target-visitors-select">Visitor Eligibility</label>
								<div className="row-control-col">
									<select
										id="target-visitors-select"
										className="text-field-select"
										value={config.targetVisitors}
										onChange={(e) => update("targetVisitors", e.target.value as any)}
									>
										<option value="all">All Visitors</option>
										<option value="new">First-Time Visitors Only</option>
										<option value="returning">Returning Visitors Only</option>
									</select>
								</div>
							</div>

							{/* Schedule Start / End */}
							<div className="form-row">
								<label className="row-label-col">Schedule Window</label>
								<div className="row-control-col" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
									<div style={{ flex: 1, minWidth: "180px" }}>
										<label htmlFor="schedule-start" style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
											Start Date (Optional)
										</label>
										<input
											id="schedule-start"
											type="date"
											className="text-field-input"
											value={config.startDate}
											onChange={(e) => update("startDate", e.target.value)}
										/>
									</div>
									<div style={{ flex: 1, minWidth: "180px" }}>
										<label htmlFor="schedule-end" style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
											End Date (Optional)
										</label>
										<input
											id="schedule-end"
											type="date"
											className="text-field-input"
											value={config.endDate}
											onChange={(e) => update("endDate", e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Bottom Navigation */}
						<div className="bottom-nav-row">
							<button type="button" className="btn-nav-prev" onClick={() => goToStep(2)}>
								<ArrowLeft size={16} weight="bold" />
								<span>Previous</span>
							</button>
							<button
								type="button"
								className="btn-nav-next"
								onClick={handlePublish}
								disabled={status === "publishing"}
							>
								<PaperPlaneTilt size={15} weight="bold" />
								<span>{status === "publishing" ? "Publishing..." : "Publish Bar"}</span>
							</button>
						</div>
					</>
				)}
			</main>

			{/* Floating Toast Notification */}
			{toast && (
				<div className={`floating-toast ${toast.type}`} role="alert">
					<EmDashIcon size={20} style={{ flexShrink: 0 }} />
					<span>{toast.message}</span>
				</div>
			)}
		</div>
	);
}
export default CustomizeBarPage;
