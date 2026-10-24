import React, { useState, useEffect } from "react";
import { Plus, ArrowRight, MegaphoneSimple, Eye, EnvelopeSimple, ChartLine } from "@phosphor-icons/react";
import type { BarConfig } from "./CustomizeBarPage";

export function DashboardPage() {
	const [publishedBar, setPublishedBar] = useState<BarConfig | null>(null);

	useEffect(() => {
		try {
			const saved = localStorage.getItem("emdash_smarter_bar_published");
			if (saved) setPublishedBar(JSON.parse(saved));
		} catch {
			// ignore
		}
	}, []);

	return (
		<div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
				<div>
					<h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>
						Smarter Announcement Bar
					</h1>
					<p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
						Engage visitors, run sales promotions, and capture leads with customizable announcement bars.
					</p>
				</div>
				<a
					href="/_emdash/admin/plugins/smarter-announcement-bar/customize-bar"
					style={{
						backgroundColor: "#2563eb",
						color: "#ffffff",
						padding: "10px 20px",
						borderRadius: "8px",
						fontWeight: "bold",
						textDecoration: "none",
						fontSize: "14px",
						display: "inline-flex",
						alignItems: "center",
						gap: "8px",
						boxShadow: "0 1px 3px rgba(37,99,235,0.25)",
					}}
				>
					<Plus size={16} weight="bold" />
					<span>Create Announcement Bar</span>
				</a>
			</div>

			{/* Stats Bar */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "16px",
					marginBottom: "24px",
				}}
			>
				<div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>ACTIVE BARS</span>
						<MegaphoneSimple size={16} color="#64748b" weight="bold" />
					</div>
					<p style={{ fontSize: "24px", fontWeight: "bold", margin: "6px 0 0 0", color: "#0f172a" }}>
						{publishedBar && publishedBar.enabled ? "1" : "0"}
					</p>
				</div>
				<div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>IMPRESSIONS TODAY</span>
						<Eye size={16} color="#64748b" weight="bold" />
					</div>
					<p style={{ fontSize: "24px", fontWeight: "bold", margin: "6px 0 0 0", color: "#0f172a" }}>1,280</p>
				</div>
				<div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>CLICK-THROUGH RATE</span>
						<ChartLine size={16} color="#64748b" weight="bold" />
					</div>
					<p style={{ fontSize: "24px", fontWeight: "bold", margin: "6px 0 0 0", color: "#0f172a" }}>4.8%</p>
				</div>
				<div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>LEADS COLLECTED</span>
						<EnvelopeSimple size={16} color="#64748b" weight="bold" />
					</div>
					<p style={{ fontSize: "24px", fontWeight: "bold", margin: "6px 0 0 0", color: "#0f172a" }}>42</p>
				</div>
			</div>

			{/* Announcement Bar Status Card */}
			<div
				style={{
					background: "#ffffff",
					borderRadius: "12px",
					border: "1px solid #e2e8f0",
					padding: "24px",
					boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
				}}
			>
				<h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 16px 0", color: "#0f172a" }}>
					Current Announcement Bar
				</h2>

				{publishedBar ? (
					<div
						style={{
							border: "1px solid #e2e8f0",
							borderRadius: "8px",
							padding: "16px",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							background: "#f8fafc",
						}}
					>
						<div>
							<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
								<span style={{ fontWeight: "bold", fontSize: "15px", color: "#0f172a" }}>
									{publishedBar.name}
								</span>
								<span
									style={{
										fontSize: "11px",
										fontWeight: "bold",
										padding: "2px 8px",
										borderRadius: "9999px",
										background: publishedBar.enabled ? "#dcfce7" : "#f1f5f9",
										color: publishedBar.enabled ? "#166534" : "#64748b",
									}}
								>
									{publishedBar.enabled ? "LIVE ON SITE" : "DISABLED"}
								</span>
							</div>
							<p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
								"{publishedBar.text}" · Position: {publishedBar.position}
							</p>
						</div>

						<a
							href="/_emdash/admin/plugins/smarter-announcement-bar/customize-bar"
							style={{
								padding: "8px 16px",
								fontSize: "13px",
								fontWeight: "600",
								color: "#2563eb",
								background: "#ffffff",
								border: "1px solid #bfdbfe",
								borderRadius: "6px",
								textDecoration: "none",
								display: "inline-flex",
								alignItems: "center",
								gap: "6px",
							}}
						>
							<span>Edit in Builder</span>
							<ArrowRight size={14} weight="bold" />
						</a>
					</div>
				) : (
					<div style={{ textAlign: "center", padding: "32px 16px", color: "#64748b" }}>
						<p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
							No active announcement bars configured yet.
						</p>
						<a
							href="/_emdash/admin/plugins/smarter-announcement-bar/customize-bar"
							style={{
								color: "#2563eb",
								fontWeight: "bold",
								textDecoration: "underline",
								fontSize: "14px",
								display: "inline-flex",
								alignItems: "center",
								gap: "6px",
							}}
						>
							<span>Launch the 3-step Bar Editor to get started</span>
							<ArrowRight size={14} weight="bold" />
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
export default DashboardPage;
