// BookLeaf Author Support Portal - Client Application
let state = {
	token: localStorage.getItem("bookleaf_token"),
	user: JSON.parse(localStorage.getItem("bookleaf_user") || "null"),
	currentView: "home",
	books: [],
	tickets: [],
	selectedTicket: null,
	eventSource: null,
};

// Utilities
function showToast(msg) {
	const toast = document.getElementById("realtime-toast");
	const text = document.getElementById("realtime-toast-msg");
	text.innerText = msg;
	toast.classList.remove("hidden");
	setTimeout(() => toast.classList.add("hidden"), 5000);
}

function authHeaders() {
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${state.token}`,
	};
}

// Real-Time SSE Listener
function initRealtime() {
	if (!state.token) return;
	if (state.eventSource) state.eventSource.close();

	state.eventSource = new EventSource(
		`/api/events?token=${encodeURIComponent(state.token)}`,
	);

	state.eventSource.onmessage = (event) => {
		try {
			const payload = JSON.parse(event.data);
			if (payload.type === "TICKET_CREATED") {
				showToast(`🔔 New Ticket Raised: "${payload.data.subject}"`);
				if (
					state.user.role === "admin" &&
					state.currentView === "admin_queue"
				) {
					loadAdminTickets();
				}
			} else if (payload.type === "NEW_MESSAGE") {
				showToast(
					`💬 New response on Ticket ${payload.ticketId} by ${payload.data.senderName}`,
				);
				if (
					state.selectedTicket &&
					state.selectedTicket.ticket.ticket_id === payload.ticketId
				) {
					openTicketDetails(payload.ticketId);
				} else if (state.currentView === "author_dashboard") {
					loadAuthorTickets();
				} else if (state.currentView === "admin_queue") {
					loadAdminTickets();
				}
			} else if (payload.type === "TICKET_UPDATED") {
				showToast(`📝 Ticket ${payload.ticketId} status updated.`);
				if (
					state.selectedTicket &&
					state.selectedTicket.ticket.ticket_id === payload.ticketId
				) {
					openTicketDetails(payload.ticketId);
				}
			}
		} catch (e) {
			// heartbeats or non-json
		}
	};
}

// Router & App State Initialization
function render() {
	renderHeader();
	const app = document.getElementById("app");

	if (!state.token || !state.user) {
		renderLogin(app);
		return;
	}

	if (state.user.role === "admin") {
		if (state.currentView === "ticket_detail" && state.selectedTicket) {
			renderAdminTicketDetail(app);
		} else {
			state.currentView = "admin_queue";
			renderAdminDashboard(app);
		}
	} else {
		if (state.currentView === "ticket_detail" && state.selectedTicket) {
			renderAuthorTicketDetail(app);
		} else {
			state.currentView = "author_dashboard";
			renderAuthorDashboard(app);
		}
	}
}

function renderHeader() {
	const container = document.getElementById("header-auth");
	if (!state.token || !state.user) {
		container.innerHTML = `
      <div class="flex items-center space-x-2">
        <button onclick="quickFillLogin('admin@bookleafpub.com', 'Admin@BookLeaf2026')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium transition">Demo Admin</button>
        <button onclick="quickFillLogin('priya.sharma@email.com', 'Password@123')" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-lg font-medium border border-emerald-200 transition">Demo Author (Priya)</button>
      </div>
    `;
		return;
	}

	container.innerHTML = `
    <div class="flex items-center space-x-4">
      <div class="text-right">
        <div class="text-sm font-bold text-slate-800">${state.user.name}</div>
        <div class="text-xs text-slate-500 uppercase tracking-wider font-semibold">${state.user.role}</div>
      </div>
      <button onclick="logout()" class="text-xs bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-3 py-1.5 rounded-lg font-semibold border border-slate-200 transition">
        Logout
      </button>
    </div>
  `;
}

function quickFillLogin(email, password) {
	document.getElementById("login-email").value = email;
	document.getElementById("login-password").value = password;
	login();
}

// Authentication Handlers
async function login() {
	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const errorEl = document.getElementById("login-error");

	try {
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();
		if (!res.ok) {
			errorEl.innerText = data.error || "Authentication failed";
			errorEl.classList.remove("hidden");
			return;
		}

		state.token = data.token;
		state.user = data.user;
		localStorage.setItem("bookleaf_token", data.token);
		localStorage.setItem("bookleaf_user", JSON.stringify(data.user));

		initRealtime();
		render();
	} catch (err) {
		errorEl.innerText = "Unable to connect to service.";
		errorEl.classList.remove("hidden");
	}
}

function logout() {
	if (state.eventSource) state.eventSource.close();
	localStorage.removeItem("bookleaf_token");
	localStorage.removeItem("bookleaf_user");
	state.token = null;
	state.user = null;
	state.selectedTicket = null;
	render();
}

function navigateHome() {
	state.selectedTicket = null;
	render();
}

// ==========================================
// 1. LOGIN SCREEN
// ==========================================
function renderLogin(container) {
	container.innerHTML = `
    <div class="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
      <div class="text-center mb-8">
        <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-emerald-500/30 mb-4">
          B
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome to BookLeaf</h2>
        <p class="text-sm text-slate-500 mt-1">Sign in to Author Portal or Ops Command Center</p>
      </div>

      <div id="login-error" class="hidden mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold"></div>

      <form onsubmit="event.preventDefault(); login();" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
          <input id="login-email" type="email" required placeholder="author@email.com or admin@bookleafpub.com"
                 class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
          <input id="login-password" type="password" required placeholder="••••••••"
                 class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition" />
        </div>
        <button type="submit" class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition transform active:scale-95">
          Sign In
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-slate-100">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">Quick Demo Accounts</p>
        <div class="grid grid-cols-2 gap-3">
          <button onclick="quickFillLogin('admin@bookleafpub.com', 'Admin@BookLeaf2026')" class="p-3 text-left rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition">
            <span class="block text-xs font-extrabold text-slate-900">Admin Portal</span>
            <span class="block text-[10px] text-slate-500">Full operations queue</span>
          </button>
          <button onclick="quickFillLogin('priya.sharma@email.com', 'Password@123')" class="p-3 text-left rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition">
            <span class="block text-xs font-extrabold text-slate-900">Author: Priya</span>
            <span class="block text-[10px] text-slate-500">2 Books & pending royalty</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 2. AUTHOR DASHBOARD (MY BOOKS + MY TICKETS)
// ==========================================
async function renderAuthorDashboard(container) {
	container.innerHTML = `
    <div class="space-y-8">
      <!-- Author Profile Banner -->
      <div class="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-emerald-300">Author Support Portal</span>
          <h1 class="text-3xl font-extrabold mt-1">Hello, ${state.user.name}</h1>
          <p class="text-emerald-100/80 text-sm mt-1">Manage your published titles, live distribution, royalties, and communication tickets.</p>
        </div>
        <button onclick="openTicketModal()" class="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm shadow-md hover:bg-emerald-50 transition transform active:scale-95 flex items-center space-x-2">
          <span>+ Raise Support Query</span>
        </button>
      </div>

      <!-- Quick Metrics Cards -->
      <div id="author-stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Rendered dynamically -->
      </div>

      <!-- Section: My Books -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">My Published Catalog</h2>
            <p class="text-xs text-slate-500">Direct sales, pricing, and royalty tracking across all titles</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-y border-slate-100">
              <tr>
                <th class="py-3 px-4">Book Title</th>
                <th class="py-3 px-4">ISBN</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">MRP</th>
                <th class="py-3 px-4">Copies Sold</th>
                <th class="py-3 px-4">Royalty Earned</th>
                <th class="py-3 px-4">Royalty Paid</th>
                <th class="py-3 px-4">Pending</th>
                <th class="py-3 px-4">Platforms</th>
              </tr>
            </thead>
            <tbody id="books-table-body" class="divide-y divide-slate-100">
              <tr><td colspan="9" class="text-center py-6 text-slate-400">Loading catalog...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section: My Tickets -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">My Support Inquiries</h2>
            <p class="text-xs text-slate-500">Live communication threads with BookLeaf Publishing Operations</p>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            ⚡ Real-Time Connected
          </span>
        </div>
        <div id="author-tickets-container" class="space-y-4">
          <p class="text-center py-6 text-slate-400">Loading support inquiries...</p>
        </div>
      </div>
    </div>

    <!-- Raise Ticket Modal -->
    <div id="ticket-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-200">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-extrabold text-slate-900">Submit a Support Query</h3>
          <button onclick="closeTicketModal()" class="text-slate-400 hover:text-slate-600 font-black text-xl">✕</button>
        </div>
        <form onsubmit="event.preventDefault(); submitTicket();" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Book</label>
            <select id="query-book-id" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500">
              <option value="">General / Account Level</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
            <input id="query-subject" type="text" required placeholder="Brief summary of your query"
                   class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Detailed Description</label>
            <textarea id="query-description" rows="4" required placeholder="Explain your question in detail (e.g. royalty delay, defective copies, ISBN issue)..."
                      class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Attachment (Optional)</label>
            <input id="query-attachment" type="file" class="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" onclick="closeTicketModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" id="btn-submit-ticket" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30">Submit Query</button>
          </div>
        </form>
      </div>
    </div>
  `;

	await loadAuthorBooks();
	await loadAuthorTickets();
}

async function loadAuthorBooks() {
	try {
		const res = await fetch("/api/author/books", { headers: authHeaders() });
		const data = await res.json();
		state.books = data.books || [];

		// Populate Modal Dropdown
		const select = document.getElementById("query-book-id");
		if (select) {
			select.innerHTML =
				'<option value="">General / Account Level</option>' +
				state.books
					.map(
						(b) =>
							`<option value="${b.book_id}">${b.title} (${b.isbn || "In Production"})</option>`,
					)
					.join("");
		}

		// Populate Stats Cards
		const totalCopies = state.books.reduce(
			(sum, b) => sum + (b.total_copies_sold || 0),
			0,
		);
		const totalEarned = state.books.reduce(
			(sum, b) => sum + (b.total_royalty_earned || 0),
			0,
		);
		const totalPaid = state.books.reduce(
			(sum, b) => sum + (b.royalty_paid || 0),
			0,
		);
		const totalPending = state.books.reduce(
			(sum, b) => sum + (b.royalty_pending || 0),
			0,
		);

		const statsEl = document.getElementById("author-stats");
		if (statsEl) {
			statsEl.innerHTML = `
        <div class="bg-white rounded-2xl p-5 border border-slate-200">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Published</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">${state.books.length} Books</p>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Copies Sold</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">${totalCopies.toLocaleString()} Units</p>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Royalty Earned</p>
          <p class="text-2xl font-extrabold text-emerald-600 mt-1">₹${totalEarned.toLocaleString()}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Royalty Pending Payout</p>
          <p class="text-2xl font-extrabold ${totalPending > 0 ? "text-amber-600" : "text-slate-900"} mt-1">₹${totalPending.toLocaleString()}</p>
        </div>
      `;
		}

		// Populate Table
		const tbody = document.getElementById("books-table-body");
		if (tbody) {
			if (state.books.length === 0) {
				tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-slate-400">No books found for this author.</td></tr>`;
			} else {
				tbody.innerHTML = state.books
					.map(
						(b) => `
          <tr class="hover:bg-slate-50 transition">
            <td class="py-3 px-4 font-bold text-slate-900">${b.title}</td>
            <td class="py-3 px-4 font-mono text-xs text-slate-500">${b.isbn || '<span class="text-amber-600 font-semibold">Pending</span>'}</td>
            <td class="py-3 px-4">
              <span class="text-xs px-2.5 py-1 rounded-full font-semibold ${b.status === "Published & Live" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}">
                ${b.status}
              </span>
            </td>
            <td class="py-3 px-4 font-semibold text-slate-700">${b.mrp ? "₹" + b.mrp : "—"}</td>
            <td class="py-3 px-4 font-semibold text-slate-700">${b.total_copies_sold}</td>
            <td class="py-3 px-4 font-semibold text-emerald-700">₹${b.total_royalty_earned}</td>
            <td class="py-3 px-4 text-slate-600">₹${b.royalty_paid}</td>
            <td class="py-3 px-4 font-bold ${b.royalty_pending > 0 ? "text-amber-600" : "text-slate-400"}">₹${b.royalty_pending}</td>
            <td class="py-3 px-4 text-xs text-slate-500">${(b.available_on || []).join(", ") || "Internal"}</td>
          </tr>
        `,
					)
					.join("");
			}
		}
	} catch (err) {
		console.error(err);
	}
}

async function loadAuthorTickets() {
	try {
		const res = await fetch("/api/author/tickets", { headers: authHeaders() });
		const data = await res.json();
		state.tickets = data.tickets || [];

		const container = document.getElementById("author-tickets-container");
		if (!container) return;

		if (state.tickets.length === 0) {
			container.innerHTML = `
        <div class="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
          <p class="text-sm font-semibold text-slate-500">You have no active support tickets.</p>
          <button onclick="openTicketModal()" class="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">Raise a query now</button>
        </div>
      `;
			return;
		}

		container.innerHTML = state.tickets
			.map(
				(t) => `
      <div onclick="openTicketDetails('${t.ticket_id}')" class="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-mono text-xs font-bold text-slate-400">${t.ticket_id}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">${t.category}</span>
            <span class="text-xs font-semibold text-slate-400">• ${new Date(t.created_at).toLocaleDateString()}</span>
          </div>
          <h4 class="text-base font-extrabold text-slate-900 mt-1">${t.subject}</h4>
          <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">${t.description}</p>
        </div>
        <div class="flex items-center space-x-3">
          <span class="text-xs px-3 py-1 rounded-full font-bold ${
						t.status === "Open"
							? "bg-amber-50 text-amber-700 border border-amber-200"
							: t.status === "In Progress"
								? "bg-blue-50 text-blue-700 border border-blue-200"
								: "bg-emerald-50 text-emerald-700 border border-emerald-200"
					}">${t.status}</span>
          <span class="text-xs text-slate-400">View Thread →</span>
        </div>
      </div>
    `,
			)
			.join("");
	} catch (err) {
		console.error(err);
	}
}

function openTicketModal() {
	document.getElementById("ticket-modal").classList.remove("hidden");
}

function closeTicketModal() {
	document.getElementById("ticket-modal").classList.add("hidden");
}

async function submitTicket() {
	const bookId = document.getElementById("query-book-id").value;
	const subject = document.getElementById("query-subject").value;
	const description = document.getElementById("query-description").value;
	const attachmentInput = document.getElementById("query-attachment");
	const attachmentName = attachmentInput.files[0]
		? attachmentInput.files[0].name
		: null;
	const btn = document.getElementById("btn-submit-ticket");

	btn.innerText = "Submitting & Classifying with AI...";
	btn.disabled = true;

	try {
		const res = await fetch("/api/author/tickets", {
			method: "POST",
			headers: authHeaders(),
			body: JSON.stringify({ bookId, subject, description, attachmentName }),
		});
		const data = await res.json();
		if (res.ok) {
			closeTicketModal();
			showToast(
				`✅ Query registered as ${data.ticketId}! Auto-classified as ${data.category}.`,
			);
			loadAuthorTickets();
		} else {
			alert(data.error || "Failed to submit ticket");
		}
	} catch (e) {
		alert("Network error submitting ticket.");
	} finally {
		btn.innerText = "Submit Query";
		btn.disabled = false;
	}
}

// ==========================================
// 3. ADMIN DASHBOARD (TICKET QUEUE & OPS)
// ==========================================
async function renderAdminDashboard(container) {
	container.innerHTML = `
    <div class="space-y-6">
      <!-- Admin Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Support Operations Queue</h1>
          <p class="text-xs text-slate-500">Live triage, AI auto-classification, SLA tracking, and response drafting</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Real-Time Engine Active
          </span>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input id="admin-search" type="text" placeholder="Search ticket, author, keyword..." oninput="loadAdminTickets()"
               class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500" />
        
        <select id="admin-filter-status" onchange="loadAdminTickets()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <option value="">All Statuses</option>
          <option value="Open">Open (Pending Triage)</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select id="admin-filter-category" onchange="loadAdminTickets()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <option value="">All Categories</option>
          <option value="Royalty & Payments">Royalty & Payments</option>
          <option value="ISBN & Metadata Issues">ISBN & Metadata Issues</option>
          <option value="Printing & Quality">Printing & Quality</option>
          <option value="Distribution & Availability">Distribution & Availability</option>
          <option value="Book Status & Production Updates">Book Status & Production Updates</option>
          <option value="General Inquiry">General Inquiry</option>
        </select>

        <select id="admin-filter-priority" onchange="loadAdminTickets()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <option value="">All Priorities</option>
          <option value="Critical">Critical (Immediate SLA)</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <!-- Ticket Queue Table / List -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th class="py-3 px-4">Ticket</th>
                <th class="py-3 px-4">Author</th>
                <th class="py-3 px-4">AI Category</th>
                <th class="py-3 px-4">Priority</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Created</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody id="admin-queue-tbody" class="divide-y divide-slate-100">
              <tr><td colspan="7" class="text-center py-8 text-slate-400">Loading incoming queue...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

	await loadAdminTickets();
}

async function loadAdminTickets() {
	const search = document.getElementById("admin-search")?.value || "";
	const status = document.getElementById("admin-filter-status")?.value || "";
	const category =
		document.getElementById("admin-filter-category")?.value || "";
	const priority =
		document.getElementById("admin-filter-priority")?.value || "";

	const params = new URLSearchParams();
	if (search) params.append("search", search);
	if (status) params.append("status", status);
	if (category) params.append("category", category);
	if (priority) params.append("priority", priority);

	try {
		const res = await fetch(`/api/admin/tickets?${params.toString()}`, {
			headers: authHeaders(),
		});
		const data = await res.json();
		const tbody = document.getElementById("admin-queue-tbody");
		if (!tbody) return;

		if (!data.tickets || data.tickets.length === 0) {
			tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">No tickets matching selected filters.</td></tr>`;
			return;
		}

		tbody.innerHTML = data.tickets
			.map((t) => {
				const activePriority = t.priority_override || t.priority;
				const activeCategory = t.category_override || t.category;
				const priorityClass =
					activePriority === "Critical"
						? "bg-red-100 text-red-800 border-red-200"
						: activePriority === "High"
							? "bg-amber-100 text-amber-800 border-amber-200"
							: activePriority === "Medium"
								? "bg-blue-100 text-blue-800 border-blue-200"
								: "bg-slate-100 text-slate-700 border-slate-200";

				return `
        <tr class="hover:bg-slate-50 transition cursor-pointer" onclick="openTicketDetails('${t.ticket_id}')">
          <td class="py-3.5 px-4">
            <span class="font-mono text-xs font-bold text-slate-900">${t.ticket_id}</span>
            <div class="text-xs font-semibold text-slate-800 line-clamp-1">${t.subject}</div>
          </td>
          <td class="py-3.5 px-4">
            <div class="font-bold text-slate-900 text-xs">${t.author_name}</div>
            <div class="text-[11px] text-slate-400">${t.author_email}</div>
          </td>
          <td class="py-3.5 px-4">
            <span class="text-xs font-medium text-slate-700">${activeCategory}</span>
            ${t.category_override ? '<span class="text-[10px] text-amber-600 font-bold ml-1">(Admin Edited)</span>' : ""}
          </td>
          <td class="py-3.5 px-4">
            <span class="text-xs px-2.5 py-1 rounded-full font-bold border ${priorityClass}">
              ${activePriority}
            </span>
          </td>
          <td class="py-3.5 px-4">
            <span class="text-xs font-bold ${t.status === "Open" ? "text-amber-600" : t.status === "In Progress" ? "text-blue-600" : "text-emerald-600"}">
              ${t.status}
            </span>
          </td>
          <td class="py-3.5 px-4 text-xs text-slate-400">
            ${new Date(t.created_at).toLocaleDateString()}
          </td>
          <td class="py-3.5 px-4 text-right">
            <button class="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm">
              Triage & Draft →
            </button>
          </td>
        </tr>
      `;
			})
			.join("");
	} catch (err) {
		console.error(err);
	}
}

// ==========================================
// 4. DETAILED TICKET THREAD & RESPONSE EDITOR
// ==========================================
async function openTicketDetails(ticketId) {
	state.currentView = "ticket_detail";
	const role = state.user.role;
	const url =
		role === "admin"
			? `/api/admin/tickets/${ticketId}`
			: `/api/author/tickets/${ticketId}`;

	try {
		const res = await fetch(url, { headers: authHeaders() });
		const data = await res.json();
		state.selectedTicket = data;
		render();
	} catch (e) {
		alert("Failed to load ticket detail.");
	}
}

function renderAdminTicketDetail(container) {
	const t = state.selectedTicket.ticket;
	const msgs = state.selectedTicket.messages || [];
	const categories = state.selectedTicket.availableCategories || [];

	container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <button onclick="navigateHome()" class="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1">
          <span>← Back to Ticket Queue</span>
        </button>
        <span class="font-mono text-xs font-bold text-slate-400">Ticket ID: ${t.ticket_id}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left 2 Cols: Query & Messages Thread -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div class="border-b border-slate-100 pb-4 mb-4">
              <h2 class="text-xl font-extrabold text-slate-900">${t.subject}</h2>
              <p class="text-xs text-slate-500 mt-1">Author: <strong>${t.author_name}</strong> (${t.author_email}) | Book: <strong>${t.book_title || "General / Account"}</strong></p>
            </div>

            <!-- Thread Messages -->
            <div class="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              ${msgs
								.map(
									(m) => `
                <div class="p-4 rounded-2xl ${m.sender_role === "author" ? "bg-slate-50 border border-slate-100" : "bg-emerald-50/70 border border-emerald-100 ml-6"}">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold ${m.sender_role === "author" ? "text-slate-900" : "text-emerald-900"}">${m.sender_name} (${m.sender_role})</span>
                    <span class="text-[11px] text-slate-400">${new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <p class="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">${m.message}</p>
                </div>
              `,
								)
								.join("")}
            </div>
          </div>

          <!-- AI Grounded Response Drafting Section -->
          <div class="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm relative overflow-hidden">
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider">AI-Drafted Response (BookLeaf Knowledge Base Grounded)</h3>
              </div>
              <button onclick="regenerateDraft('${t.ticket_id}')" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 transition">
                ⚡ Regenerate Draft
              </button>
            </div>
            <p class="text-[11px] text-slate-500 mb-2">Review or edit the draft below before dispatching directly to the author.</p>
            <textarea id="admin-reply-text" rows="7" class="w-full p-4 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 leading-relaxed">${t.ai_draft_response || ""}</textarea>

            <div class="flex items-center justify-between mt-4">
              <label class="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <input id="resolve-ticket-checkbox" type="checkbox" class="rounded text-emerald-600 focus:ring-emerald-500" />
                <span>Mark Ticket as Resolved</span>
              </label>
              <button onclick="sendAdminReply('${t.ticket_id}')" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition transform active:scale-95">
                Send Response to Author →
              </button>
            </div>
          </div>
        </div>

        <!-- Right Col: Overrides, Knowledge Base Context & Internal Notes -->
        <div class="space-y-6">
          <!-- Triage & Admin Overrides -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Triage & Overrides</h3>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 mb-1">Category (AI: ${t.category})</label>
              <select id="override-category" onchange="updateOverrides('${t.ticket_id}')" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                ${categories.map((c) => `<option value="${c}" ${(t.category_override || t.category) === c ? "selected" : ""}>${c}</option>`).join("")}
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 mb-1">Priority (AI: ${t.priority})</label>
              <select id="override-priority" onchange="updateOverrides('${t.ticket_id}')" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                ${["Critical", "High", "Medium", "Low"].map((p) => `<option value="${p}" ${(t.priority_override || t.priority) === p ? "selected" : ""}>${p}</option>`).join("")}
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 mb-1">Ticket Status</label>
              <select id="override-status" onchange="updateOverrides('${t.ticket_id}')" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                ${["Open", "In Progress", "Resolved", "Closed"].map((s) => `<option value="${s}" ${t.status === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </div>
          </div>

          <!-- Private Internal Notes (Hidden from Author) -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Internal Notes (Staff Only)</h3>
              <span class="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold border border-amber-200">Hidden from Author</span>
            </div>
            <textarea id="internal-notes" rows="4" placeholder="Log internal dispatch numbers, Amazon sync IDs, or accounting checks..."
                      class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500">${t.internal_notes || ""}</textarea>
            <button onclick="saveInternalNotes('${t.ticket_id}')" class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition">
              Save Private Note
            </button>
          </div>

          <!-- Author Context Card -->
          <div class="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-2 text-xs">
            <h4 class="font-extrabold text-slate-900">Author Snapshot</h4>
            <p class="text-slate-600">Total Royalty Earned: <strong>₹${t.total_royalty_earned || 0}</strong></p>
            <p class="text-slate-600">Pending Royalty: <strong>₹${t.royalty_pending || 0}</strong></p>
            <p class="text-slate-600">Phone: <strong>${t.author_phone || "N/A"}</strong></p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAuthorTicketDetail(container) {
	const t = state.selectedTicket.ticket;
	const msgs = state.selectedTicket.messages || [];

	container.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <button onclick="navigateHome()" class="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1">
          <span>← Back to My Support Inquiries</span>
        </button>
        <span class="font-mono text-xs font-bold text-slate-400">ID: ${t.ticket_id}</span>
      </div>

      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <div class="flex items-center space-x-2">
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">${t.category}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${
							t.status === "Open"
								? "bg-amber-50 text-amber-700 border border-amber-200"
								: t.status === "In Progress"
									? "bg-blue-50 text-blue-700 border border-blue-200"
									: "bg-emerald-50 text-emerald-700 border border-emerald-200"
						}">${t.status}</span>
          </div>
          <h2 class="text-xl font-extrabold text-slate-900 mt-2">${t.subject}</h2>
          <p class="text-xs text-slate-500 mt-1">Book: ${t.book_title || "General / Account Level"}</p>
        </div>

        <!-- Thread Messages -->
        <div class="space-y-4 max-h-[480px] overflow-y-auto pr-2">
          ${msgs
						.map(
							(m) => `
            <div class="p-4 rounded-2xl ${m.sender_role === "author" ? "bg-slate-50 border border-slate-100" : "bg-emerald-50/70 border border-emerald-100 ml-6"}">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-bold ${m.sender_role === "author" ? "text-slate-900" : "text-emerald-900"}">${m.sender_name} (${m.sender_role === "admin" ? "BookLeaf Team" : "You"})</span>
                <span class="text-[11px] text-slate-400">${new Date(m.created_at).toLocaleString()}</span>
              </div>
              <p class="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">${m.message}</p>
            </div>
          `,
						)
						.join("")}
        </div>

        <!-- Reply Form for Author -->
        <form onsubmit="event.preventDefault(); sendAuthorReply('${t.ticket_id}');" class="pt-4 border-t border-slate-100 space-y-3">
          <label class="block text-xs font-bold text-slate-700">Add Reply / Message</label>
          <textarea id="author-reply-input" rows="3" required placeholder="Type your response to the BookLeaf team..."
                    class="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"></textarea>
          <div class="flex justify-end">
            <button type="submit" id="btn-author-reply" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition">
              Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ==========================================
// 5. ACTION HANDLERS
// ==========================================
async function sendAdminReply(ticketId) {
	const message = document.getElementById("admin-reply-text").value;
	const resolveTicket = document.getElementById(
		"resolve-ticket-checkbox",
	).checked;

	if (!message.trim()) return alert("Message cannot be empty.");

	try {
		const res = await fetch(`/api/admin/tickets/${ticketId}/reply`, {
			method: "POST",
			headers: authHeaders(),
			body: JSON.stringify({ message, resolveTicket }),
		});
		if (res.ok) {
			showToast("✅ Response dispatched to author successfully.");
			openTicketDetails(ticketId);
		} else {
			alert("Failed to send reply");
		}
	} catch (e) {
		alert("Network error.");
	}
}

async function sendAuthorReply(ticketId) {
	const message = document.getElementById("author-reply-input").value;
	if (!message.trim()) return alert("Message cannot be empty.");

	try {
		const res = await fetch(`/api/author/tickets/${ticketId}/reply`, {
			method: "POST",
			headers: authHeaders(),
			body: JSON.stringify({ message }),
		});
		if (res.ok) {
			showToast("✅ Reply sent.");
			openTicketDetails(ticketId);
		} else {
			alert("Failed to send reply");
		}
	} catch (e) {
		alert("Network error.");
	}
}

async function updateOverrides(ticketId) {
	const category_override = document.getElementById("override-category").value;
	const priority_override = document.getElementById("override-priority").value;
	const status = document.getElementById("override-status").value;

	try {
		const res = await fetch(`/api/admin/tickets/${ticketId}`, {
			method: "PATCH",
			headers: authHeaders(),
			body: JSON.stringify({ category_override, priority_override, status }),
		});
		if (res.ok) {
			showToast("Triage overrides saved.");
		}
	} catch (e) {
		alert("Failed to save overrides");
	}
}

async function saveInternalNotes(ticketId) {
	const internal_notes = document.getElementById("internal-notes").value;
	try {
		const res = await fetch(`/api/admin/tickets/${ticketId}`, {
			method: "PATCH",
			headers: authHeaders(),
			body: JSON.stringify({ internal_notes }),
		});
		if (res.ok) {
			showToast("Internal note saved.");
		}
	} catch (e) {
		alert("Failed to save internal note");
	}
}

async function regenerateDraft(ticketId) {
	const textarea = document.getElementById("admin-reply-text");
	textarea.value = "Regenerating AI Draft from Knowledge Base...";
	try {
		const res = await fetch(`/api/admin/tickets/${ticketId}/regenerate-draft`, {
			method: "POST",
			headers: authHeaders(),
		});
		const data = await res.json();
		if (res.ok) {
			textarea.value = data.draftResponse;
			showToast("✨ Draft regenerated successfully.");
		} else {
			alert("Failed to regenerate draft");
		}
	} catch (e) {
		alert("Error regenerating draft");
	}
}

// Initial Boot
window.addEventListener("DOMContentLoaded", () => {
	initRealtime();
	render();
});
