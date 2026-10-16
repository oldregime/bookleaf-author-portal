import assert from "assert";
import { analyzeTicketWithAI } from "./services/ai.js";
import { db, initDatabase } from "./db/schema.js";

async function runTests() {
	console.log("🧪 Starting BookLeaf Technical Test Suite...");

	// Test 1: SQLite schema validation
	initDatabase();
	const authorCount = db
		.prepare("SELECT COUNT(*) as c FROM authors")
		.get() as any;
	assert.ok(authorCount.c >= 10, "Must have at least 10 seeded authors");
	console.log("  ✔ Database schema & seed count verification passed");

	// Test 2: AI Auto-Classification & Draft Generation (Royalty Inquiry)
	const royaltyTest = await analyzeTicketWithAI({
		subject: "I have not received my royalty for 4 months",
		description: "When will my pending earnings be transferred?",
		authorName: "Priya Sharma",
		bookTitle: "Whispers of the Ganges",
	});
	assert.strictEqual(royaltyTest.category, "Royalty & Payments");
	assert.strictEqual(royaltyTest.priority, "High");
	assert.ok(
		royaltyTest.draftResponse.includes("80/20") ||
			royaltyTest.draftResponse.includes("quarterly"),
	);
	console.log(
		"  ✔ AI Auto-Classification for Royalty passed with Knowledge-Base grounding",
	);

	// Test 3: AI Auto-Classification for ISBN Discrepancy (Must be Critical)
	const isbnTest = await analyzeTicketWithAI({
		subject: "Amazon showing wrong duplicate ISBN",
		description: "My printed edition has a different barcode than Amazon",
		authorName: "Rohit Kapoor",
		bookTitle: "Echoes of the Valley",
	});
	assert.strictEqual(isbnTest.category, "ISBN & Metadata Issues");
	assert.strictEqual(isbnTest.priority, "Critical");
	assert.ok(
		isbnTest.draftResponse.includes("24–48 hours") ||
			isbnTest.draftResponse.includes("escalated"),
	);
	console.log("  ✔ AI Auto-Classification for ISBN Critical Priority passed");

	// Test 4: AI Auto-Classification for Defective Print
	const printTest = await analyzeTicketWithAI({
		subject: "Defective print and blurry images",
		description:
			"The physical books have misaligned text and bad paper quality",
		authorName: "Arjun Das",
		bookTitle: "The Silent Melody",
	});
	assert.strictEqual(printTest.category, "Printing & Quality");
	assert.ok(
		printTest.draftResponse.includes("reprint") ||
			printTest.draftResponse.includes("photos"),
	);
	console.log(
		"  ✔ AI Auto-Classification for Print Quality passed with free reprint SLA",
	);

	console.log(
		"✨ All 4 automated test suites passed successfully with zero failures.",
	);
}

runTests().catch((err) => {
	console.error("❌ Test failed:", err);
	process.exit(1);
});
