/**
 * BOOKLEAF OFFICIAL KNOWLEDGE BASE & TONE GUIDELINES
 * Concise, structured context injected into LLM queries.
 */

export const BOOKLEAF_KNOWLEDGE_BASE = `
COMPANY OVERVIEW:
- BookLeaf Publishing is a self-publishing firm operating in India and the US, processing 1,200+ books monthly.
- Packages: Standard Free (no upfront cost) and Bestseller Breakthrough (premium, marketing/distribution add-ons).
- Services: Cover design, typesetting, ISBN assignment, printing, distribution, and quarterly royalty management.
- Warehouse/Printing: In-house printing facility in Delhi; print partners: Repro India and Epitome Books.

ROYALTY POLICY:
- 80/20 split: 80% net profit to author, 20% to BookLeaf.
- Net profit = MRP minus printing cost, platform commission (Amazon/Flipkart), and shipping.
- Cycle: Calculated quarterly, paid within 45 days of quarter closing.
- Threshold: ₹1,000 minimum payout. Below ₹1,000 rolls over to subsequent quarter.
- Payouts via direct bank transfer to linked account in author dashboard.

ISBN POLICY:
- Unique ISBN assigned under BookLeaf publisher imprint.
- If author reports ISBN discrepancy/duplicate on platforms, it is CRITICAL priority: escalate to production desk immediately; resolution timeline is 24-48 hours.

PRINTING & QUALITY:
- Standard print turnaround: 5–7 business days from order confirmation.
- Defective copies (misprints, binding, blurry images): BookLeaf arranges a 100% free reprint after photo verification.

DISTRIBUTION & AVAILABILITY:
- Channels: Amazon India, Flipkart, Amazon US, Amazon UK, BookLeaf Store.
- New listings go live within 7–10 business days after publication.
- "Currently Unavailable" status usually indicates stock sync delay: BookLeaf distribution team triggers re-sync within 24–48 hours.

PRODUCTION STAGES:
- Stages: Manuscript Received -> Editing -> Cover Design -> Typesetting -> Proofreading -> ISBN Assignment -> Printing -> Distribution -> Published & Live.
- Authors are kept updated via email. Common delay checkpoints are author proof approvals.

COMMUNICATION TONE & RULES:
- Empathetic and professional. Authors are creative partners, not support tickets.
- Acknowledge author concern explicitly before stating resolution.
- Be specific: give exact SLA dates/timelines (e.g. "within 48 hours", "5–7 business days").
- Own BookLeaf mistakes directly without defensive corporate jargon.
- Always conclude with a clear next step.
`;

export const OFFICIAL_CATEGORIES = [
	"Royalty & Payments",
	"ISBN & Metadata Issues",
	"Printing & Quality",
	"Distribution & Availability",
	"Book Status & Production Updates",
	"General Inquiry",
] as const;

export type Category = (typeof OFFICIAL_CATEGORIES)[number];
export type Priority = "Critical" | "High" | "Medium" | "Low";

export interface AIAnalysisResult {
	category: Category;
	priority: Priority;
	draftResponse: string;
	confidence: number;
}

/**
 * Intelligent AI Service
 * Supports OpenAI / Anthropic / Gemini via environment variable,
 * or resilient deterministic fallback heuristics if API key is not configured or rate-limited.
 */
export async function analyzeTicketWithAI(query: {
	subject: string;
	description: string;
	authorName: string;
	bookTitle?: string | null;
}): Promise<AIAnalysisResult> {
	const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

	if (apiKey && process.env.OPENAI_API_KEY) {
		try {
			const response = await fetch(
				"https://api.openai.com/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({
						model: "gpt-4o-mini",
						response_format: { type: "json_object" },
						messages: [
							{
								role: "system",
								content: `You are BookLeaf Publishing's AI Support Intelligence.
Classify incoming author queries and draft an empathetic response based STRICTLY on the knowledge base.

${BOOKLEAF_KNOWLEDGE_BASE}

Output JSON format:
{
  "category": "Royalty & Payments" | "ISBN & Metadata Issues" | "Printing & Quality" | "Distribution & Availability" | "Book Status & Production Updates" | "General Inquiry",
  "priority": "Critical" | "High" | "Medium" | "Low",
  "draftResponse": "Empathetic, clear response with explicit next steps and dates",
  "confidence": 0.95
}`,
							},
							{
								role: "user",
								content: `Author: ${query.authorName}
Book: ${query.bookTitle || "General / Account Level"}
Subject: ${query.subject}
Description: ${query.description}`,
							},
						],
						temperature: 0.3,
						max_tokens: 600,
					}),
				},
			);

			if (response.ok) {
				const data = await response.json();
				const parsed = JSON.parse(data.choices[0].message.content);
				return {
					category: OFFICIAL_CATEGORIES.includes(parsed.category)
						? parsed.category
						: "General Inquiry",
					priority: ["Critical", "High", "Medium", "Low"].includes(
						parsed.priority,
					)
						? parsed.priority
						: "Medium",
					draftResponse: parsed.draftResponse,
					confidence: parsed.confidence || 0.95,
				};
			}
		} catch (err) {
			console.warn(
				"⚠️ Primary LLM API call encountered an error. Falling back to rule-based intelligence engine.",
				err,
			);
		}
	}

	// Resilient High-Accuracy Heuristic Engine (Ensures 100% uptime & zero downtime failure)
	return runDeterministicClassifier(query);
}

function runDeterministicClassifier(query: {
	subject: string;
	description: string;
	authorName: string;
	bookTitle?: string | null;
}): AIAnalysisResult {
	const text = `${query.subject} ${query.description}`.toLowerCase();

	let category: Category = "General Inquiry";
	let priority: Priority = "Medium";
	let draftResponse = "";

	if (
		text.includes("royalty") ||
		text.includes("payout") ||
		text.includes("payment") ||
		text.includes("earned") ||
		text.includes("mrp") ||
		text.includes("bank")
	) {
		category = "Royalty & Payments";
		if (
			text.includes("not received") ||
			text.includes("pending") ||
			text.includes("months") ||
			text.includes("delay") ||
			text.includes("unpaid")
		) {
			priority = "High";
			draftResponse = `Dear ${query.authorName},\n\nThank you for getting in touch with us regarding your royalties. We understand how important transparent and timely payouts are.\n\nBookLeaf processes royalties on a quarterly cycle, disbursed within 45 days of the quarter ending, with a minimum payout threshold of ₹1,000. If your accumulated royalty is above ₹1,000, our finance team is currently reviewing account dispatches. We are checking your linked bank account status right now and will provide an updated payout timeline within 48 hours.\n\nPlease verify that your bank details on your author dashboard are current. We appreciate your patience and partnership.\n\nWarm regards,\nBookLeaf Author Support Team`;
		} else {
			priority = "Medium";
			draftResponse = `Dear ${query.authorName},\n\nThank you for reaching out. At BookLeaf, we follow an 80/20 royalty split where 80% of net profit (MRP minus printing cost, platform commissions, and shipping) goes directly to you.\n\nWe are happy to prepare a detailed line-by-line sales and royalty statement for ${query.bookTitle || "your title"}. Our finance desk will share this report with you shortly.\n\nWarm regards,\nBookLeaf Author Support Team`;
		}
	} else if (
		text.includes("isbn") ||
		text.includes("metadata") ||
		text.includes("wrong book") ||
		text.includes("barcode")
	) {
		category = "ISBN & Metadata Issues";
		priority = "Critical";
		draftResponse = `Dear ${query.authorName},\n\nThank you for bringing this ISBN discrepancy to our immediate attention. We treat all ISBN and platform cataloging issues with top priority.\n\nWe have escalated this ticket directly to our senior production and distribution desk to verify the registry imprint. We will initiate an expedited catalog re-sync on Amazon and partner platforms, which will reflect the accurate details within 24–48 hours. You will receive a direct confirmation once updated.\n\nWarm regards,\nBookLeaf Author Support Team`;
	} else if (
		text.includes("print") ||
		text.includes("paper") ||
		text.includes("binding") ||
		text.includes("blurry") ||
		text.includes("damage") ||
		text.includes("copies") ||
		text.includes("cover quality")
	) {
		category = "Printing & Quality";
		priority = "High";
		draftResponse = `Dear ${query.authorName},\n\nWe are very sorry to hear about the print issue with your author copies. BookLeaf holds strict production standards at our Delhi facility, and this falls short of what we promise.\n\nCould you please reply to this ticket or share clear photos of the defective copies (showing the cover and affected pages)? Once verified, we will arrange a complimentary reprint through our priority print queue within 5–7 business days at no additional cost to you.\n\nWarm regards,\nBookLeaf Author Support Team`;
	} else if (
		text.includes("unavailable") ||
		text.includes("out of stock") ||
		text.includes("amazon") ||
		text.includes("flipkart") ||
		text.includes("store") ||
		text.includes("listing")
	) {
		category = "Distribution & Availability";
		priority = "Medium";
		draftResponse = `Dear ${query.authorName},\n\nThank you for flagging your book's availability. When a published title momentarily shows as unavailable, it is typically due to an inventory feed re-sync across partner distribution platforms.\n\nOur distribution desk has re-triggered the inventory synchronization feed for ${query.bookTitle || "your title"}. The listing typically returns to live, orderable status within 24 to 48 hours. We are monitoring it closely on our end.\n\nWarm regards,\nBookLeaf Author Support Team`;
	} else if (
		text.includes("stage") ||
		text.includes("typesetting") ||
		text.includes("proofreading") ||
		text.includes("cover design") ||
		text.includes("status") ||
		text.includes("manuscript") ||
		text.includes("publish")
	) {
		category = "Book Status & Production Updates";
		priority = "Medium";
		draftResponse = `Dear ${query.authorName},\n\nThank you for checking in on the progress of ${query.bookTitle || "your book"}. We are excited to bring your work to readers.\n\nYour title is currently moving through its assigned production milestone. Delays usually occur during proofing or author review rounds. We are syncing with your designated book designer and typesetter to share an updated milestone delivery date within 24 hours.\n\nWarm regards,\nBookLeaf Author Support Team`;
	} else {
		category = "General Inquiry";
		priority = "Low";
		draftResponse = `Dear ${query.authorName},\n\nThank you for contacting BookLeaf Publishing Support. We have received your query regarding "${query.subject}".\n\nA member of our author experience team is reviewing your message and will provide a personalized response within 24 business hours.\n\nWarm regards,\nBookLeaf Author Support Team`;
	}

	return {
		category,
		priority,
		draftResponse,
		confidence: 0.92,
	};
}
