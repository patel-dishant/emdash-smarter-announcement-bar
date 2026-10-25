import React, { useState, useEffect } from "react";
import {
	Plus,
	ArrowSquareOut,
	NotePencil,
	Copy,
	PencilLine,
	Trash,
	MegaphoneSimple,
	Eye,
	EnvelopeSimple,
	ChartLine,
	Check,
	X,
	Lightning,
	Tag,
	SlidersHorizontal,
	ArrowRight,
	Sparkle,
} from "@phosphor-icons/react";
import type { BarConfig } from "./CustomizeBarPage";

const STORAGE_KEY_BARS = "emdash_smarter_bars";
const STORAGE_KEY_PUBLISHED = "emdash_smarter_bar_published";

export function DashboardPage() {
	const [bars, setBars] = useState<BarConfig[]>([]);
	const [loading, setLoading] = useState(true);
	const [renamingBar, setRenamingBar] = useState<BarConfig | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const [deletingBar, setDeletingBar] = useState<BarConfig | null>(null);
	const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

	// Remove padding from EmDash admin <main> container to fit full screen seamlessly
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

	// Auto-dismiss toast
	useEffect(() => {
		if (!toast) return;
		const timer = setTimeout(() => setToast(null), 3000);
		return () => clearTimeout(timer);
	}, [toast]);

	// Load announcement bars on mount
	useEffect(() => {
		const loadData = async () => {
			let loadedBars: BarConfig[] = [];
			try {
				const saved = localStorage.getItem(STORAGE_KEY_BARS);
				if (saved) {
					const parsed = JSON.parse(saved);
					if (Array.isArray(parsed) && parsed.length > 0) {
						loadedBars = parsed;
					}
				}
			} catch {
				// ignore
			}

			// Check server API to get latest synced counts (views, clicks, leads)
			try {
				const res = await fetch("/_emdash/api/plugins/smarter-announcement-bar/config");
				const json = await res.json();
				const serverBars = json?.data?.bars || json?.bars;
				if (Array.isArray(serverBars) && serverBars.length > 0) {
					loadedBars = serverBars;
				}
			} catch {
				// ignore
			}

			// Fallback to published bar if single config exists
			if (loadedBars.length === 0) {
				try {
					const publishedStr = localStorage.getItem(STORAGE_KEY_PUBLISHED);
					if (publishedStr) {
						const single = JSON.parse(publishedStr);
						if (single && single.name) {
							loadedBars = [
								{
									...single,
									id: single.id || "bar_1",
									name: single.name || "Smarter Announcement Bar",
									enabled: single.enabled ?? true,
									views: single.views ?? 0,
									clicks: single.clicks ?? 0,
									leads: single.leads ?? 0,
								},
							];
						}
					}
				} catch {
					// ignore
				}
			}

			setBars(loadedBars);
			try {
				localStorage.setItem(STORAGE_KEY_BARS, JSON.stringify(loadedBars));
			} catch {}
			setLoading(false);
		};

		loadData();
	}, []);

	// Save bars helper (updates state, localStorage, and server API)
	const saveBars = async (newBars: BarConfig[]) => {
		setBars(newBars);
		const anyEnabled = newBars.find((b) => b.enabled);
		const toPublish = anyEnabled
			? { ...anyEnabled }
			: { ...(newBars[0] || {}), enabled: false };

		try {
			localStorage.setItem(STORAGE_KEY_BARS, JSON.stringify(newBars));
			localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(toPublish));
		} catch {
			// ignore
		}

		// Immediately publish active state to public site endpoint
		try {
			await fetch("/_emdash/api/plugins/smarter-announcement-bar/publish", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ bar: toPublish, bars: newBars }),
			});
		} catch {
			// ignore
		}

		try {
			await fetch("/_emdash/api/plugins/smarter-announcement-bar/bars", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ bars: newBars }),
			});
		} catch {
			// ignore
		}
	};

	// Toggle status
	const handleToggleStatus = (id?: string) => {
		if (!id) return;
		const target = bars.find((b) => b.id === id);
		if (!target) return;
		const nextState = !target.enabled;
		const updated = bars.map((b) => (b.id === id ? { ...b, enabled: nextState } : b));
		saveBars(updated);
		setToast({
			message: `"${target.name}" is now ${nextState ? "active (ON)" : "disabled (OFF)"}.`,
			type: nextState ? "success" : "info",
		});
	};

	// Duplicate bar
	const handleDuplicate = (bar: BarConfig) => {
		const newId = `bar_${Date.now()}`;
		const duplicated: BarConfig = {
			...bar,
			id: newId,
			name: `${bar.name} (Copy)`,
			enabled: false,
			views: 0,
			clicks: 0,
			leads: 0,
		};
		const updated = [...bars, duplicated];
		saveBars(updated);
		setToast({
			message: `Announcement bar "${bar.name}" duplicated successfully!`,
			type: "success",
		});
	};

	// Start Rename
	const handleStartRename = (bar: BarConfig) => {
		setRenamingBar(bar);
		setRenameValue(bar.name);
	};

	// Save Rename
	const handleSaveRename = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!renamingBar || !renameValue.trim()) return;
		const trimmed = renameValue.trim();
		const updated = bars.map((b) => (b.id === renamingBar.id ? { ...b, name: trimmed } : b));
		saveBars(updated);
		setToast({
			message: `Renamed bar to "${trimmed}".`,
			type: "success",
		});
		setRenamingBar(null);
	};

	// Confirm Delete
	const handleConfirmDelete = () => {
		if (!deletingBar) return;
		const deletedName = deletingBar.name;
		const updated = bars.filter((b) => b.id !== deletingBar.id);
		saveBars(updated);
		setToast({
			message: `Announcement bar "${deletedName}" was deleted.`,
			type: "info",
		});
		setDeletingBar(null);
	};

	const totalActive = bars.filter((b) => b.enabled).length;
	const totalViews = bars.reduce((sum, b) => sum + (b.views || 0), 0);
	const totalClicks = bars.reduce((sum, b) => sum + (b.clicks || 0), 0);
	const totalLeads = bars.reduce((sum, b) => sum + (b.leads || 0), 0);

	let localSubscribersCount = 0;
	try {
		const subs = JSON.parse(localStorage.getItem("smarter_bar_subscribers") || "[]");
		if (Array.isArray(subs)) localSubscribersCount = subs.length;
	} catch {}
	const finalLeads = Math.max(totalLeads, localSubscribersCount);

	const ctr = totalViews > 0
		? ((totalClicks / totalViews) * 100).toFixed(1) + "%"
		: "0.0%";

	// Loading Skeleton
	if (loading) {
		return (
			<div style={{ width: "100%", padding: "32px 40px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
				<div style={{ color: "#64748b", fontSize: "14px" }}>Loading Smarter Announcement Bar...</div>
			</div>
		);
	}

	// =========================================================================
	// LANDING PAGE (Displayed when there is NO DATA)
	// =========================================================================
	if (bars.length === 0) {
		return (
			<div style={{ width: "100%", padding: "32px 40px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
				{/* Top Header */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", gap: "24px" }}>
					<div style={{ flex: 1, minWidth: 0 }}>
						<h1 style={{ fontSize: "26px", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>
							Smarter Announcement Bar
						</h1>
						<p style={{ margin: 0, color: "#64748b", fontSize: "14px", lineHeight: 1.5 }}>
							Create customized notification bars to engage and convert your visitors. Highlight promotions, run flash sales with countdown timers, or collect newsletter subscribers.
						</p>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
						<a
							href="/"
							target="_blank"
							rel="noopener noreferrer"
							style={{
								backgroundColor: "#ffffff",
								color: "#334155",
								border: "1px solid #cbd5e1",
								padding: "9px 18px",
								borderRadius: "8px",
								fontWeight: "600",
								textDecoration: "none",
								fontSize: "14px",
								display: "inline-flex",
								alignItems: "center",
								gap: "6px",
								whiteSpace: "nowrap",
								flexShrink: 0,
								boxSizing: "border-box",
								transition: "all 0.15s ease",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
							onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
						>
							<span>Visit Store</span>
							<ArrowSquareOut size={16} weight="bold" />
						</a>
						<a
							href="/_emdash/admin/plugins/smarter-announcement-bar/customize-bar?id=new"
							style={{
								backgroundColor: "#2563eb",
								color: "#ffffff",
								padding: "9px 20px",
								borderRadius: "8px",
								fontWeight: "bold",
								textDecoration: "none",
								fontSize: "14px",
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								whiteSpace: "nowrap",
								flexShrink: 0,
								boxSizing: "border-box",
								boxShadow: "0 1px 3px rgba(37,99,235,0.25)",
								transition: "background-color 0.15s ease",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
							onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
						>
							<Plus size={16} weight="bold" />
							<span>Create Announcement Bar</span>
						</a>
					</div>
				</div>

				{/* Hero Introduction Banner Card */}
				<div
					style={{
						background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
						borderRadius: "14px",
						border: "1px solid #dbeafe",
						padding: "32px",
						marginBottom: "28px",
						boxShadow: "0 2px 8px rgba(37,99,235,0.05)",
					}}
				>
					<div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#dbeafe", color: "#1e40af", padding: "4px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px", marginBottom: "14px" }}>
						<Sparkle size={14} weight="fill" />
						<span>NO ACTIVE ANNOUNCEMENT BARS</span>
					</div>
					<h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 10px 0" }}>
						Engage store visitors and boost conversions on your website
					</h2>
					<p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 22px 0", maxWidth: "800px" }}>
						Announcement bars are the most effective way to alert shoppers to flash sales, share discount codes, collect subscriber emails, and drive immediate action without interrupting their browsing experience.
					</p>
					<div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
						<a
							href="/_emdash/admin/plugins/smarter-announcement-bar/customize-bar?id=new"
							style={{
								backgroundColor: "#2563eb",
								color: "#ffffff",
								padding: "12px 24px",
								borderRadius: "8px",
								fontWeight: "bold",
								textDecoration: "none",
								fontSize: "14px",
								display: "inline-flex",
								alignItems: "center",
								gap: "8px",
								boxShadow: "0 2px 4px rgba(37,99,235,0.25)",
							}}
						>
							<Plus size={16} weight="bold" />
							<span>Create Your First Bar</span>
						</a>
					</div>
				</div>

				{/* Interactive Live Sample Bar Showcase */}
				<div
					style={{
						background: "#ffffff",
						borderRadius: "14px",
						border: "1px solid #e2e8f0",
						overflow: "hidden",
						marginBottom: "28px",
						boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
					}}
				>
					{/* Browser mockup bar */}
					<div
						style={{
							background: "#f8fafc",
							padding: "10px 16px",
							display: "flex",
							alignItems: "center",
							gap: "12px",
							borderBottom: "1px solid #e2e8f0",
						}}
					>
						<div style={{ display: "flex", gap: "6px" }}>
							<div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
							<div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
							<div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
						</div>
						<div
							style={{
								background: "#ffffff",
								border: "1px solid #e2e8f0",
								borderRadius: "6px",
								padding: "3px 16px",
								fontSize: "12px",
								color: "#64748b",
								width: "220px",
								textAlign: "center",
							}}
						>
							yourstore.com
						</div>
					</div>

					{/* Live Announcement Bar Sample */}
					<div
						style={{
							backgroundColor: "#0f172a",
							color: "#ffffff",
							padding: "12px 24px",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexWrap: "wrap",
							gap: "12px",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
							<span style={{ fontSize: "16px" }}>🎉</span>
							<span style={{ fontSize: "14px", fontWeight: "600" }}>
								FLASH SALE: Flat 20% Off All Orders with code <strong>WELCOME20</strong>
							</span>
						</div>

						<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
							<div
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "6px",
									background: "rgba(255,255,255,0.12)",
									padding: "4px 12px",
									borderRadius: "6px",
									fontSize: "12px",
									fontWeight: "bold",
									letterSpacing: "0.5px",
								}}
							>
								<span>02d</span> : <span>14h</span> : <span>36m</span> : <span>18s</span>
							</div>
							<span
								style={{
									backgroundColor: "#2563eb",
									color: "#ffffff",
									padding: "5px 14px",
									borderRadius: "6px",
									fontSize: "12px",
									fontWeight: "bold",
									cursor: "pointer",
								}}
							>
								Copy Coupon Code
							</span>
						</div>
					</div>

					{/* Footer caption */}
					<div style={{ padding: "12px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", fontSize: "13px", color: "#64748b" }}>
						💡 <strong>Pro Tip:</strong> Sticky announcement bars increase click-through rates by up to 28% and convert 3x more mobile shoppers.
					</div>
				</div>

				{/* 4 Feature Highlights Grid */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
						gap: "20px",
						marginBottom: "28px",
					}}
				>
					<div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
						<div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
							<Lightning size={22} weight="bold" />
						</div>
						<h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>
							Flash Sales & Urgency
						</h3>
						<p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
							Drive instant purchases with automated countdown timers and flash sale badges that build customer urgency.
						</p>
					</div>

					<div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
						<div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
							<Tag size={22} weight="bold" />
						</div>
						<h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>
							Coupon & Discount Codes
						</h3>
						<p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
							Share promo codes with seamless one-click copy and custom coupon badges to reduce cart abandonment.
						</p>
					</div>

					<div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
						<div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#dbeafe", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
							<EnvelopeSimple size={22} weight="bold" />
						</div>
						<h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>
							Email Lead Capture
						</h3>
						<p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
							Turn first-time visitors into long-term subscribers with smooth email opt-in forms embedded right in the bar.
						</p>
					</div>

					<div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
						<div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
							<SlidersHorizontal size={22} weight="bold" />
						</div>
						<h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>
							Smart Targeting
						</h3>
						<p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
							Control where and when your bars appear with device targeting, schedule date rules, and page-specific filters.
						</p>
					</div>
				</div>

				{/* 3 Easy Steps Card */}
				<div
					style={{
						background: "#ffffff",
						borderRadius: "14px",
						border: "1px solid #e2e8f0",
						padding: "28px",
						textAlign: "center",
					}}
				>
					<h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: "0 0 20px 0" }}>
						Launch Your First Announcement Bar in 3 Easy Steps
					</h3>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
							gap: "24px",
							textAlign: "left",
							marginBottom: "28px",
						}}
					>
						<div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
							<span style={{ fontSize: "12px", fontWeight: "bold", color: "#2563eb", background: "#dbeafe", padding: "2px 8px", borderRadius: "4px" }}>
								STEP 1
							</span>
							<h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: "10px 0 4px 0" }}>
								Customize Bar Content
							</h4>
							<p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
								Set ticker messages, countdown targets, discount coupon codes, or lead forms.
							</p>
						</div>

						<div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
							<span style={{ fontSize: "12px", fontWeight: "bold", color: "#2563eb", background: "#dbeafe", padding: "2px 8px", borderRadius: "4px" }}>
								STEP 2
							</span>
							<h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: "10px 0 4px 0" }}>
								Customize Design
							</h4>
							<p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
								Pick background colors, button attention animations, padding, and font sizes.
							</p>
						</div>

						<div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
							<span style={{ fontSize: "12px", fontWeight: "bold", color: "#2563eb", background: "#dbeafe", padding: "2px 8px", borderRadius: "4px" }}>
								STEP 3
							</span>
							<h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: "10px 0 4px 0" }}>
								Set Rules & Publish
							</h4>
							<p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
								Configure desktop or mobile targeting, start and end dates, and launch with one click.
							</p>
						</div>
					</div>

					<a
						href="/_emdash/admin/plugins/smarter-announcement-bar/customize-bar?id=new"
						style={{
							backgroundColor: "#2563eb",
							color: "#ffffff",
							padding: "12px 28px",
							borderRadius: "8px",
							fontWeight: "bold",
							textDecoration: "none",
							fontSize: "14px",
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							boxShadow: "0 2px 4px rgba(37,99,235,0.25)",
						}}
					>
						<span>Get Started Now</span>
						<ArrowRight size={16} weight="bold" />
					</a>
				</div>
			</div>
		);
	}

	// =========================================================================
	// ACTIVE DASHBOARD (Displayed when there is DATA)
	// =========================================================================
	return (
		<div style={{ width: "100%", padding: "28px 36px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
			{/* Top Header */}
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "24px" }}>
				<div style={{ flex: 1, minWidth: 0 }}>
					<h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>
						Smarter Announcement Bar
					</h1>
					<p style={{ margin: 0, color: "#64748b", fontSize: "14px", lineHeight: 1.5 }}>
						Engage visitors, run sales promotions, and capture leads with customizable announcement bars.
					</p>
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
					<a
						href="/"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							backgroundColor: "#ffffff",
							color: "#334155",
							border: "1px solid #cbd5e1",
							padding: "9px 18px",
							borderRadius: "8px",
							fontWeight: "600",
							textDecoration: "none",
							fontSize: "14px",
							display: "inline-flex",
							alignItems: "center",
							gap: "6px",
							whiteSpace: "nowrap",
							flexShrink: 0,
							boxSizing: "border-box",
							transition: "all 0.15s ease",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
						onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
					>
						<span>Visit Store</span>
						<ArrowSquareOut size={16} weight="bold" />
					</a>
					<a
						href="/_emdash/admin/plugins/smarter-announcement-bar/customize-bar?id=new"
						style={{
							backgroundColor: "#2563eb",
							color: "#ffffff",
							padding: "9px 20px",
							borderRadius: "8px",
							fontWeight: "bold",
							textDecoration: "none",
							fontSize: "14px",
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							whiteSpace: "nowrap",
							flexShrink: 0,
							boxSizing: "border-box",
							boxShadow: "0 1px 3px rgba(37,99,235,0.25)",
							transition: "background-color 0.15s ease",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
						onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
					>
						<Plus size={16} weight="bold" />
						<span>Create Announcement Bar</span>
					</a>
				</div>
			</div>

			{/* Full Width Stats Bar */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
					gap: "16px",
					marginBottom: "28px",
					width: "100%",
				}}
			>
				<div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>ACTIVE BARS</span>
						<MegaphoneSimple size={16} color="#64748b" weight="bold" />
					</div>
					<p style={{ fontSize: "24px", fontWeight: "bold", margin: "6px 0 0 0", color: "#0f172a" }}>
						{totalActive}
					</p>
				</div>
				<div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>TOTAL VIEWS</span>
						<Eye size={16} color="#64748b" weight="bold" />
					</div>
					<p style={{ fontSize: "24px", fontWeight: "bold", margin: "6px 0 0 0", color: "#0f172a" }}>
						{totalViews.toLocaleString()}
					</p>
				</div>
				<div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>CLICK-THROUGH RATE</span>
						<ChartLine size={16} color="#64748b" weight="bold" />
					</div>
					<p style={{ fontSize: "24px", fontWeight: "bold", margin: "6px 0 0 0", color: "#0f172a" }}>
						{ctr}
					</p>
				</div>
				<div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>LEADS COLLECTED</span>
						<EnvelopeSimple size={16} color="#64748b" weight="bold" />
					</div>
					<p style={{ fontSize: "24px", fontWeight: "bold", margin: "6px 0 0 0", color: "#0f172a" }}>
						{finalLeads.toLocaleString()}
					</p>
				</div>
			</div>

			{/* Announcement Bars Listing Section */}
			<div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "#1e293b" }}>
					Announcement Bars
				</h2>
				<a
					href="/"
					target="_blank"
					rel="noopener noreferrer"
					style={{
						backgroundColor: "#2563eb",
						color: "#ffffff",
						padding: "8px 16px",
						borderRadius: "8px",
						fontWeight: "600",
						textDecoration: "none",
						fontSize: "14px",
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
						boxShadow: "0 1px 2px rgba(37,99,235,0.2)",
						transition: "background-color 0.15s ease",
					}}
					onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
					onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
				>
					<span>Visit Store</span>
					<ArrowSquareOut size={16} weight="bold" />
				</a>
			</div>

			{/* Full Width Table Card */}
			<div
				style={{
					background: "#ffffff",
					borderRadius: "12px",
					border: "1px solid #e2e8f0",
					boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
					overflow: "hidden",
					width: "100%",
				}}
			>
				{/* Table Header matching screenshot light-blue banner */}
				<div
					style={{
						background: "#e0effe",
						padding: "14px 24px",
						display: "grid",
						gridTemplateColumns: "110px 1fr 140px 180px",
						alignItems: "center",
						borderBottom: "1px solid #bfdbfe",
					}}
				>
					<span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>Status</span>
					<span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>Bars</span>
					<span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>Total Views</span>
					<span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>Action</span>
				</div>

				{/* Table Rows */}
				{bars.map((bar, index) => {
					const isLast = index === bars.length - 1;
					return (
						<div
							key={bar.id || `bar-${index}`}
							style={{
								padding: "16px 24px",
								display: "grid",
								gridTemplateColumns: "110px 1fr 140px 180px",
								alignItems: "center",
								borderBottom: isLast ? "none" : "1px solid #f1f5f9",
								backgroundColor: "#ffffff",
								transition: "background-color 0.15s ease",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
							onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
						>
							{/* 1. Status Toggle */}
							<div>
								<button
									type="button"
									onClick={() => handleToggleStatus(bar.id)}
									style={{
										border: "none",
										cursor: "pointer",
										padding: "2px 4px",
										width: "56px",
										height: "26px",
										borderRadius: "9999px",
										backgroundColor: bar.enabled ? "#2563eb" : "#cbd5e1",
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										transition: "background-color 0.2s ease",
										outline: "none",
										boxSizing: "border-box",
									}}
									aria-label={bar.enabled ? "Disable announcement bar" : "Enable announcement bar"}
								>
									{bar.enabled ? (
										<>
											<span
												style={{
													color: "#ffffff",
													fontSize: "11px",
													fontWeight: "bold",
													marginLeft: "6px",
													lineHeight: 1,
													userSelect: "none",
												}}
											>
												ON
											</span>
											<div
												style={{
													width: "20px",
													height: "20px",
													borderRadius: "50%",
													background: "#ffffff",
													boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
												}}
											/>
										</>
									) : (
										<>
											<div
												style={{
													width: "20px",
													height: "20px",
													borderRadius: "50%",
													background: "#ffffff",
													boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
												}}
											/>
											<span
												style={{
													color: "#ffffff",
													fontSize: "11px",
													fontWeight: "bold",
													marginRight: "6px",
													lineHeight: 1,
													userSelect: "none",
												}}
											>
												OFF
											</span>
										</>
									)}
								</button>
							</div>

							{/* 2. Bars Link */}
							<div>
								<a
									href={`/_emdash/admin/plugins/smarter-announcement-bar/customize-bar?id=${bar.id || "bar_1"}`}
									style={{
										color: "#2563eb",
										fontWeight: "600",
										fontSize: "14px",
										textDecoration: "none",
										wordBreak: "break-word",
									}}
									onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
									onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
								>
									{bar.name}
								</a>
							</div>

							{/* 3. Total Views */}
							<div>
								<span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
									{bar.views !== undefined ? bar.views.toLocaleString() : "0"}
								</span>
							</div>

							{/* 4. Action Buttons */}
							<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
								{/* Edit Button (Green) */}
								<a
									href={`/_emdash/admin/plugins/smarter-announcement-bar/customize-bar?id=${bar.id || "bar_1"}`}
									title="Edit Bar"
									style={{
										width: "34px",
										height: "34px",
										borderRadius: "50%",
										backgroundColor: "#dcfce7",
										color: "#16a34a",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										textDecoration: "none",
										transition: "all 0.15s ease",
									}}
									onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bbf7d0")}
									onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dcfce7")}
								>
									<NotePencil size={18} weight="bold" />
								</a>

								{/* Duplicate Button (Orange) */}
								<button
									type="button"
									title="Duplicate Bar"
									onClick={() => handleDuplicate(bar)}
									style={{
										width: "34px",
										height: "34px",
										borderRadius: "50%",
										border: "none",
										backgroundColor: "#ffedd5",
										color: "#ea580c",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
										transition: "all 0.15s ease",
									}}
									onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fed7aa")}
									onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffedd5")}
								>
									<Copy size={18} weight="bold" />
								</button>

								{/* Rename Bar Button (Blue) */}
								<button
									type="button"
									title="Rename Bar"
									onClick={() => handleStartRename(bar)}
									style={{
										width: "34px",
										height: "34px",
										borderRadius: "50%",
										border: "none",
										backgroundColor: "#eff6ff",
										color: "#2563eb",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
										transition: "all 0.15s ease",
									}}
									onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dbeafe")}
									onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
								>
									<PencilLine size={18} weight="bold" />
								</button>

								{/* Delete Button (Red) */}
								<button
									type="button"
									title="Delete Bar"
									onClick={() => setDeletingBar(bar)}
									style={{
										width: "34px",
										height: "34px",
										borderRadius: "50%",
										border: "none",
										backgroundColor: "#fee2e2",
										color: "#dc2626",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
										transition: "all 0.15s ease",
									}}
									onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fecaca")}
									onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fee2e2")}
								>
									<Trash size={18} weight="bold" />
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{/* Rename Modal */}
			{renamingBar && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(15, 23, 42, 0.45)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 99999,
						backdropFilter: "blur(2px)",
					}}
					onClick={() => setRenamingBar(null)}
				>
					<div
						style={{
							background: "#ffffff",
							borderRadius: "12px",
							padding: "24px",
							width: "100%",
							maxWidth: "440px",
							boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
							<h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
								Rename Announcement Bar
							</h3>
							<button
								type="button"
								onClick={() => setRenamingBar(null)}
								style={{
									border: "none",
									background: "none",
									cursor: "pointer",
									color: "#64748b",
									padding: "4px",
									display: "flex",
								}}
							>
								<X size={18} weight="bold" />
							</button>
						</div>

						<form onSubmit={handleSaveRename}>
							<label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
								Bar Title / Name
							</label>
							<input
								type="text"
								value={renameValue}
								onChange={(e) => setRenameValue(e.target.value)}
								autoFocus
								placeholder="Enter bar title..."
								style={{
									width: "100%",
									padding: "9px 12px",
									fontSize: "14px",
									border: "1px solid #cbd5e1",
									borderRadius: "6px",
									outline: "none",
									boxSizing: "border-box",
									marginBottom: "20px",
								}}
								onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
								onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
							/>

							<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
								<button
									type="button"
									onClick={() => setRenamingBar(null)}
									style={{
										padding: "8px 16px",
										fontSize: "13px",
										fontWeight: "600",
										color: "#475569",
										background: "#f1f5f9",
										border: "none",
										borderRadius: "6px",
										cursor: "pointer",
									}}
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={!renameValue.trim()}
									style={{
										padding: "8px 18px",
										fontSize: "13px",
										fontWeight: "600",
										color: "#ffffff",
										background: renameValue.trim() ? "#2563eb" : "#94a3b8",
										border: "none",
										borderRadius: "6px",
										cursor: renameValue.trim() ? "pointer" : "not-allowed",
									}}
								>
									Save Changes
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deletingBar && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(15, 23, 42, 0.45)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 99999,
						backdropFilter: "blur(2px)",
					}}
					onClick={() => setDeletingBar(null)}
				>
					<div
						style={{
							background: "#ffffff",
							borderRadius: "12px",
							padding: "24px",
							width: "100%",
							maxWidth: "420px",
							boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
							<div
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									background: "#fee2e2",
									color: "#dc2626",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexShrink: 0,
								}}
							>
								<Trash size={22} weight="bold" />
							</div>
							<div>
								<h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
									Delete Announcement Bar?
								</h3>
								<p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>
									This action cannot be undone.
								</p>
							</div>
						</div>

						<p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#334155", lineHeight: 1.5 }}>
							Are you sure you want to delete <strong>"{deletingBar.name}"</strong>?
						</p>

						<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
							<button
								type="button"
								onClick={() => setDeletingBar(null)}
								style={{
									padding: "8px 16px",
									fontSize: "13px",
									fontWeight: "600",
									color: "#475569",
									background: "#f1f5f9",
									border: "none",
									borderRadius: "6px",
									cursor: "pointer",
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleConfirmDelete}
								style={{
									padding: "8px 18px",
									fontSize: "13px",
									fontWeight: "600",
									color: "#ffffff",
									background: "#dc2626",
									border: "none",
									borderRadius: "6px",
									cursor: "pointer",
								}}
							>
								Delete Bar
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Toast Notification */}
			{toast && (
				<div
					style={{
						position: "fixed",
						bottom: "24px",
						right: "24px",
						backgroundColor: toast.type === "error" ? "#ef4444" : toast.type === "success" ? "#10b981" : "#1e293b",
						color: "#ffffff",
						padding: "10px 18px",
						borderRadius: "8px",
						fontSize: "13px",
						fontWeight: "600",
						boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
						display: "flex",
						alignItems: "center",
						gap: "8px",
						zIndex: 999999,
						animation: "fadeIn 0.2s ease-out",
					}}
				>
					{toast.type === "success" && <Check size={16} weight="bold" />}
					<span>{toast.message}</span>
				</div>
			)}
		</div>
	);
}

export default DashboardPage;
