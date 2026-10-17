import { afterEach, describe, expect, it } from "vitest";

import { createPluginTestHost, type PluginTestHost } from "@emdash-cms/plugin-test";

let host: PluginTestHost | undefined;

afterEach(async () => {
	await host?.dispose();
	host = undefined;
});

describe("hello route", () => {
	it("returns a greeting through the sandbox host", async () => {
		host = await createPluginTestHost();
		const result = await host.invokeRoute("hello");
		expect(result).toEqual({ greeting: "hello", pluginId: "smarter-announcement-bar" });
	});
});

describe("admin pages", () => {
	it("declares screenshot-aligned navigation and renders the dashboard", async () => {
		host = await createPluginTestHost();
		expect((host.manifest.admin.pages ?? []).map(({ path, label }) => ({ path, label }))).toEqual([
			{ path: "/dashboard", label: "Dashboard" },
			{ path: "/pricing", label: "Plans" },
			{ path: "/bar-analytics", label: "Analytics" },
			{ path: "/contact-form-leads", label: "Contact" },
			{ path: "/faqs", label: "FAQs" },
		]);

		const result = await host.invokeRoute("admin", { type: "page_load", page: "/dashboard" });
		expect(result).toMatchObject({
			blocks: [
				{ type: "header", text: "Smarter Announcement Bar" },
				{
					type: "banner",
					title: "No active announcement bars",
				},
				{
					type: "actions",
					elements: [
						{ type: "button", action_id: "create-announcement-bar", label: "Create Announcement Bar" },
					],
				},
				{
					type: "fields",
					fields: [
						{ label: "⚡ Flash Sales & Urgency" },
						{ label: "🎁 Coupon & Discount Codes" },
						{ label: "💌 Email Lead Capture" },
						{ label: "🎯 Smart Targeting" },
					],
				},
				{ type: "divider" },
				{
					type: "banner",
					variant: "alert",
				},
				{
					type: "actions",
					elements: [
						{ type: "button", action_id: "show-coupon-code", label: "Copy Coupon Code" },
					],
				},
				{
					type: "context",
					text: "💡 Tip: Sticky announcement bars increase click-through rates by up to 28%.",
				},
			],
		});
	});

	it("responds honestly to dashboard preview actions", async () => {
		host = await createPluginTestHost();
		const createResult = await host.invokeRoute("admin", {
			type: "block_action",
			page: "/dashboard",
			action_id: "create-announcement-bar",
		});
		const couponResult = await host.invokeRoute("admin", {
			type: "block_action",
			page: "/dashboard",
			action_id: "show-coupon-code",
		});
		const signupResult = await host.invokeRoute("admin", {
			type: "form_submit",
			page: "/dashboard",
			action_id: "claim-discount",
			values: { email: "visitor@example.com" },
		});

		const exploreResult = await host.invokeRoute("admin", {
			type: "block_action",
			page: "/dashboard",
			action_id: "explore-templates",
		});

		expect(createResult).toMatchObject({ toast: { message: "The announcement bar builder is coming soon.", type: "info" } });
		expect(couponResult).toMatchObject({ toast: { message: "Preview coupon code: WELCOME20", type: "info" } });
		expect(signupResult).toMatchObject({ toast: { message: "Email sign-up is a preview and is not connected yet.", type: "info" } });
		expect(exploreResult).toMatchObject({ toast: { message: "Templates preview: Explore flash sales, urgency countdowns, and email captures below.", type: "info" } });
	});

	it("keeps the other plugin pages clearly marked as in development", async () => {
		host = await createPluginTestHost();
		const result = await host.invokeRoute("admin", { type: "page_load", page: "/pricing" });
		expect(result).toEqual({
			blocks: [
				{ type: "header", text: "Smarter Announcement Bar" },
				{ type: "section", text: "Plans is coming soon." },
				{ type: "section", text: "This feature is being developed by Dishant Patel." },
				{
					type: "fields",
					fields: [
						{ label: "Status", value: "In development" },
						{ label: "Area", value: "Plans" },
					],
				},
			],
		});
	});
});
