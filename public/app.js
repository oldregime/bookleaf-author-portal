// BookLeaf Autonomous Self-Contained Knowledge Base & Client Engine
// Complete seed data of 10 authors and 18 books loaded directly into memory & localStorage

const INITIAL_DATA = {
  "authors": [
    {
      "author_id": "AUTH001",
      "name": "Priya Sharma",
      "email": "priya.sharma@email.com",
      "phone": "+91-98765-43210",
      "city": "Mumbai",
      "joined_date": "2023-03-15"
    },
    {
      "author_id": "AUTH002",
      "name": "Rohit Kapoor",
      "email": "rohit.kapoor@email.com",
      "phone": "+91-87654-32109",
      "city": "Delhi",
      "joined_date": "2022-11-08"
    },
    {
      "author_id": "AUTH003",
      "name": "Ananya Reddy",
      "email": "ananya.reddy@email.com",
      "phone": "+91-76543-21098",
      "city": "Hyderabad",
      "joined_date": "2024-02-20"
    },
    {
      "author_id": "AUTH004",
      "name": "Vikram Joshi",
      "email": "vikram.joshi@email.com",
      "phone": "+91-65432-10987",
      "city": "Pune",
      "joined_date": "2023-07-12"
    },
    {
      "author_id": "AUTH005",
      "name": "Meera Nair",
      "email": "meera.nair@email.com",
      "phone": "+91-54321-09876",
      "city": "Kochi",
      "joined_date": "2023-01-05"
    },
    {
      "author_id": "AUTH006",
      "name": "Arjun Malhotra",
      "email": "arjun.malhotra@email.com",
      "phone": "+91-43210-98765",
      "city": "Chandigarh",
      "joined_date": "2024-06-01"
    },
    {
      "author_id": "AUTH007",
      "name": "Sneha Kulkarni",
      "email": "sneha.kulkarni@email.com",
      "phone": "+91-32109-87654",
      "city": "Bangalore",
      "joined_date": "2022-09-18"
    },
    {
      "author_id": "AUTH008",
      "name": "Farhan Sheikh",
      "email": "farhan.sheikh@email.com",
      "phone": "+91-21098-76543",
      "city": "Lucknow",
      "joined_date": "2023-10-01"
    },
    {
      "author_id": "AUTH009",
      "name": "Kavita Deshmukh",
      "email": "kavita.deshmukh@email.com",
      "phone": "+91-10987-65432",
      "city": "Nagpur",
      "joined_date": "2024-04-10"
    },
    {
      "author_id": "AUTH010",
      "name": "Diya Chatterjee",
      "email": "diya.chatterjee@email.com",
      "phone": "+91-09876-54321",
      "city": "Kolkata",
      "joined_date": "2023-05-22"
    }
  ],
  "books": [
    {
      "book_id": "BK001",
      "author_id": "AUTH001",
      "title": "Whispers of the Ganges",
      "isbn": "978-93-5XXXX-01-1",
      "genre": "Literary Fiction",
      "publication_date": "2023-06-20",
      "status": "Published & Live",
      "mrp": 399,
      "author_royalty_per_copy": 35,
      "total_copies_sold": 342,
      "total_royalty_earned": 11970,
      "royalty_paid": 8400,
      "royalty_pending": 3570,
      "available_on": [
        "Amazon India",
        "Flipkart",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK002",
      "author_id": "AUTH001",
      "title": "The Saffron Diaries",
      "isbn": "978-93-5XXXX-02-8",
      "genre": "Non-Fiction / Memoir",
      "publication_date": "2024-01-10",
      "status": "Published & Live",
      "mrp": 450,
      "author_royalty_per_copy": 42,
      "total_copies_sold": 189,
      "total_royalty_earned": 7938,
      "royalty_paid": 7938,
      "royalty_pending": 0,
      "available_on": [
        "Amazon India",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK003",
      "author_id": "AUTH002",
      "title": "Code & Karma",
      "isbn": "978-93-5XXXX-03-5",
      "genre": "Self-Help / Technology",
      "publication_date": "2023-02-14",
      "status": "Published & Live",
      "mrp": 350,
      "author_royalty_per_copy": 30,
      "total_copies_sold": 876,
      "total_royalty_earned": 26280,
      "royalty_paid": 21000,
      "royalty_pending": 5280,
      "available_on": [
        "Amazon India",
        "Flipkart",
        "Amazon US",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK004",
      "author_id": "AUTH002",
      "title": "Startup Sutra",
      "isbn": "978-93-5XXXX-04-2",
      "genre": "Business / Entrepreneurship",
      "publication_date": "2024-05-22",
      "status": "Published & Live",
      "mrp": 499,
      "author_royalty_per_copy": 48,
      "total_copies_sold": 1203,
      "total_royalty_earned": 57744,
      "royalty_paid": 50000,
      "royalty_pending": 7744,
      "available_on": [
        "Amazon India",
        "Flipkart",
        "Amazon US",
        "Amazon UK",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK005",
      "author_id": "AUTH003",
      "title": "Between Two Temples",
      "isbn": "978-93-5XXXX-05-9",
      "genre": "Historical Fiction",
      "publication_date": "2024-07-05",
      "status": "Published & Live",
      "mrp": 425,
      "author_royalty_per_copy": 38,
      "total_copies_sold": 67,
      "total_royalty_earned": 2546,
      "royalty_paid": 0,
      "royalty_pending": 2546,
      "available_on": [
        "Amazon India",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK006",
      "author_id": "AUTH004",
      "title": "Debugging Life",
      "isbn": "978-93-5XXXX-06-6",
      "genre": "Self-Help",
      "publication_date": "2023-11-30",
      "status": "Published & Live",
      "mrp": 299,
      "author_royalty_per_copy": 25,
      "total_copies_sold": 534,
      "total_royalty_earned": 13350,
      "royalty_paid": 10000,
      "royalty_pending": 3350,
      "available_on": [
        "Amazon India",
        "Flipkart",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK007",
      "author_id": "AUTH004",
      "title": "The Last Monsoon",
      "isbn": "978-93-5XXXX-07-3",
      "genre": "Poetry",
      "publication_date": "2024-08-15",
      "status": "Published & Live",
      "mrp": 199,
      "author_royalty_per_copy": 15,
      "total_copies_sold": 123,
      "total_royalty_earned": 1845,
      "royalty_paid": 1845,
      "royalty_pending": 0,
      "available_on": [
        "Amazon India",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK008",
      "author_id": "AUTH005",
      "title": "Cardamom & Chaos",
      "isbn": "978-93-5XXXX-08-0",
      "genre": "Contemporary Fiction",
      "publication_date": "2023-04-18",
      "status": "Published & Live",
      "mrp": 375,
      "author_royalty_per_copy": 32,
      "total_copies_sold": 445,
      "total_royalty_earned": 14240,
      "royalty_paid": 14240,
      "royalty_pending": 0,
      "available_on": [
        "Amazon India",
        "Flipkart",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK009",
      "author_id": "AUTH005",
      "title": "Letters from Lakshadweep",
      "isbn": "978-93-5XXXX-09-7",
      "genre": "Travel / Non-Fiction",
      "publication_date": "2024-03-01",
      "status": "Published & Live",
      "mrp": 550,
      "author_royalty_per_copy": 55,
      "total_copies_sold": 201,
      "total_royalty_earned": 11055,
      "royalty_paid": 8000,
      "royalty_pending": 3055,
      "available_on": [
        "Amazon India",
        "Amazon US",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK010",
      "author_id": "AUTH006",
      "title": "Turban Tales",
      "isbn": "978-93-5XXXX-10-3",
      "genre": "Humor / Essays",
      "publication_date": "2024-09-10",
      "status": "Published & Live",
      "mrp": 325,
      "author_royalty_per_copy": 28,
      "total_copies_sold": 88,
      "total_royalty_earned": 2464,
      "royalty_paid": 0,
      "royalty_pending": 2464,
      "available_on": [
        "Amazon India",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK011",
      "author_id": "AUTH007",
      "title": "The Algorithm of Love",
      "isbn": "978-93-5XXXX-11-0",
      "genre": "Romance",
      "publication_date": "2022-12-25",
      "status": "Published & Live",
      "mrp": 299,
      "author_royalty_per_copy": 25,
      "total_copies_sold": 1567,
      "total_royalty_earned": 39175,
      "royalty_paid": 35000,
      "royalty_pending": 4175,
      "available_on": [
        "Amazon India",
        "Flipkart",
        "Amazon US",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK012",
      "author_id": "AUTH007",
      "title": "Ctrl+Alt+Delete My Ex",
      "isbn": "978-93-5XXXX-12-7",
      "genre": "Romance / Humor",
      "publication_date": "2024-02-14",
      "status": "Published & Live",
      "mrp": 350,
      "author_royalty_per_copy": 30,
      "total_copies_sold": 723,
      "total_royalty_earned": 21690,
      "royalty_paid": 18000,
      "royalty_pending": 3690,
      "available_on": [
        "Amazon India",
        "Flipkart",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK013",
      "author_id": "AUTH007",
      "title": "Midnight in Mysore",
      "isbn": "978-93-5XXXX-13-4",
      "genre": "Thriller",
      "publication_date": "",
      "status": "In Production - Cover Design",
      "mrp": 0,
      "author_royalty_per_copy": 0,
      "total_copies_sold": 0,
      "total_royalty_earned": 0,
      "royalty_paid": 0,
      "royalty_pending": 0,
      "available_on": []
    },
    {
      "book_id": "BK014",
      "author_id": "AUTH008",
      "title": "Ghazal of the Forgotten",
      "isbn": "978-93-5XXXX-14-1",
      "genre": "Poetry / Urdu Literature",
      "publication_date": "2024-01-26",
      "status": "Published & Live",
      "mrp": 250,
      "author_royalty_per_copy": 20,
      "total_copies_sold": 156,
      "total_royalty_earned": 3120,
      "royalty_paid": 3120,
      "royalty_pending": 0,
      "available_on": [
        "Amazon India",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK015",
      "author_id": "AUTH009",
      "title": "Raising Roots",
      "isbn": "978-93-5XXXX-15-8",
      "genre": "Parenting / Non-Fiction",
      "publication_date": "",
      "status": "In Production - Typesetting",
      "mrp": 0,
      "author_royalty_per_copy": 0,
      "total_copies_sold": 0,
      "total_royalty_earned": 0,
      "royalty_paid": 0,
      "royalty_pending": 0,
      "available_on": []
    },
    {
      "book_id": "BK016",
      "author_id": "AUTH009",
      "title": "The Nagpur Notebooks",
      "isbn": "978-93-5XXXX-16-5",
      "genre": "Essays / Memoir",
      "publication_date": "2024-11-05",
      "status": "Published & Live",
      "mrp": 299,
      "author_royalty_per_copy": 25,
      "total_copies_sold": 34,
      "total_royalty_earned": 850,
      "royalty_paid": 0,
      "royalty_pending": 850,
      "available_on": [
        "Amazon India",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK017",
      "author_id": "AUTH010",
      "title": "Durga\u2019s Daughters",
      "isbn": "978-93-5XXXX-17-2",
      "genre": "Literary Fiction",
      "publication_date": "2023-10-15",
      "status": "Published & Live",
      "mrp": 475,
      "author_royalty_per_copy": 45,
      "total_copies_sold": 612,
      "total_royalty_earned": 27540,
      "royalty_paid": 25000,
      "royalty_pending": 2540,
      "available_on": [
        "Amazon India",
        "Flipkart",
        "Amazon US",
        "BookLeaf Store"
      ]
    },
    {
      "book_id": "BK018",
      "author_id": "AUTH010",
      "title": "Howrah Nights",
      "isbn": "978-93-5XXXX-18-9",
      "genre": "Crime / Thriller",
      "publication_date": "2025-01-20",
      "status": "Published & Live",
      "mrp": 399,
      "author_royalty_per_copy": 35,
      "total_copies_sold": 45,
      "total_royalty_earned": 1575,
      "royalty_paid": 0,
      "royalty_pending": 1575,
      "available_on": [
        "Amazon India",
        "BookLeaf Store"
      ]
    }
  ]
};

const INITIAL_TICKETS = [
  {
    ticket_id: "TICK-1001",
    author_id: "AUTH001",
    author_name: "Priya Sharma",
    author_email: "priya.sharma@email.com",
    book_id: "BK001",
    book_title: "Whispers of the Ganges",
    subject: "Pending royalty payout for Q3",
    description: "Hi BookLeaf team, I see royalty pending of ₹3,570 on Whispers of the Ganges. The last payout was October 15. When will this be credited to my linked bank account?",
    category: "Royalty & Payments",
    priority: "High",
    status: "Open",
    internal_notes: "Verified author bank details are on file. Pending Q4 payout cycle.",
    ai_draft_response: "Dear Priya,\n\nThank you for reaching out regarding your pending royalty of ₹3,570 for Whispers of the Ganges. BookLeaf calculates and disburses royalties quarterly within 45 days of quarter close. Our finance team is currently processing the current cycle, and you can expect direct bank credit by November 15. Please let us know if your bank details have changed.\n\nWarm regards,\nBookLeaf Author Support Team",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    messages: [
      {
        message_id: "msg-1",
        sender_role: "author",
        sender_name: "Priya Sharma",
        message: "Hi BookLeaf team, I see royalty pending of ₹3,570 on Whispers of the Ganges. The last payout was October 15. When will this be credited to my linked bank account?",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  },
  {
    ticket_id: "TICK-1002",
    author_id: "AUTH002",
    author_name: "Rohit Kapoor",
    author_email: "rohit.kapoor@email.com",
    book_id: "BK003",
    book_title: "Echoes of the Valley",
    subject: "Amazon listing shows duplicate ISBN",
    description: "My book Echoes of the Valley has a different ISBN on Amazon India compared to my proof copy. Readers cannot find the edition.",
    category: "ISBN & Metadata Issues",
    priority: "Critical",
    status: "In Progress",
    internal_notes: "Escalated to production desk. Amazon metadata re-sync dispatched.",
    ai_draft_response: "Dear Rohit,\n\nWe acknowledge this is a high-priority metadata issue. We have escalated your ISBN mapping directly to our distribution and production desks. Our team is triggering an expedited Amazon India catalog re-sync, which will reflect the correct ISBN within 24 to 48 hours. We sincerely apologize for this inconvenience.\n\nWarm regards,\nBookLeaf Author Support Team",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        message_id: "msg-2",
        sender_role: "author",
        sender_name: "Rohit Kapoor",
        message: "My book Echoes of the Valley has a different ISBN on Amazon India compared to my proof copy. Readers cannot find the edition.",
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        message_id: "msg-3",
        sender_role: "admin",
        sender_name: "BookLeaf Ops Admin",
        message: "Dear Rohit, We acknowledge this is a high-priority metadata issue. We have escalated your ISBN mapping directly to our distribution and production desks. Our team is triggering an expedited Amazon India catalog re-sync, which will reflect the correct ISBN within 24 to 48 hours.",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ]
  }
];

// Initialize Data Store in localStorage
function initStore() {
  if (!localStorage.getItem('bookleaf_authors')) {
    localStorage.setItem('bookleaf_authors', JSON.stringify(INITIAL_DATA.authors));
  }
  if (!localStorage.getItem('bookleaf_books')) {
    localStorage.setItem('bookleaf_books', JSON.stringify(INITIAL_DATA.books));
  }
  if (!localStorage.getItem('bookleaf_tickets')) {
    localStorage.setItem('bookleaf_tickets', JSON.stringify(INITIAL_TICKETS));
  }
}
initStore();

function getStore(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function setStore(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// Active Application State
let state = {
  token: localStorage.getItem('bookleaf_token'),
  user: JSON.parse(localStorage.getItem('bookleaf_user') || 'null'),
  currentView: 'home',
  books: [],
  tickets: [],
  selectedTicket: null
};

// Official BookLeaf Categories
const OFFICIAL_CATEGORIES = [
  'Royalty & Payments',
  'ISBN & Metadata Issues',
  'Printing & Quality',
  'Distribution & Availability',
  'Book Status & Production Updates',
  'General Inquiry'
];

// UI Notification Toast
function showToast(msg) {
  const toast = document.getElementById('realtime-toast');
  const text = document.getElementById('realtime-toast-msg');
  if (!toast || !text) return;
  text.innerText = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4500);
}

// AI Knowledge Base Grounded Classification & Response Drafting Engine
function runBookLeafAI(subject, description, authorName, bookTitle) {
  const text = `${subject} ${description}`.toLowerCase();
  let category = 'General Inquiry';
  let priority = 'Medium';
  let draftResponse = '';

  if (text.includes('royalty') || text.includes('payout') || text.includes('payment') || text.includes('earned') || text.includes('mrp') || text.includes('bank')) {
    category = 'Royalty & Payments';
    if (text.includes('not received') || text.includes('pending') || text.includes('months') || text.includes('delay') || text.includes('unpaid')) {
      priority = 'High';
      draftResponse = `Dear ${authorName},\n\nThank you for getting in touch with us regarding your royalties. We understand how important transparent and timely payouts are.\n\nBookLeaf processes royalties on an 80/20 net profit split, disbursed quarterly within 45 days of quarter closing (with a minimum payout threshold of ₹1,000). Our finance team is currently reviewing recent disbursements. We are checking your linked bank account right now and will provide an updated payout timeline within 48 hours.\n\nPlease ensure your bank details on your author dashboard are up to date. We appreciate your patience and partnership.\n\nWarm regards,\nBookLeaf Author Support Team`;
    } else {
      priority = 'Medium';
      draftResponse = `Dear ${authorName},\n\nThank you for reaching out. At BookLeaf, we follow an 80/20 royalty split where 80% of net profit (MRP minus printing cost, platform commissions, and shipping) goes directly to you.\n\nWe would be glad to prepare a detailed line-by-line sales and royalty statement for ${bookTitle || 'your title'}. Our finance desk will generate and share this report with you shortly.\n\nWarm regards,\nBookLeaf Author Support Team`;
    }
  } else if (text.includes('isbn') || text.includes('metadata') || text.includes('wrong book') || text.includes('barcode')) {
    category = 'ISBN & Metadata Issues';
    priority = 'Critical';
    draftResponse = `Dear ${authorName},\n\nThank you for bringing this ISBN discrepancy to our immediate attention. We treat all ISBN cataloging errors with top priority under our registry guidelines.\n\nWe have escalated this ticket directly to our senior production and distribution desk to verify the registry imprint. We are initiating an expedited catalog re-sync on Amazon and partner platforms, which will reflect the accurate details within 24–48 hours. You will receive a direct confirmation once updated.\n\nWarm regards,\nBookLeaf Author Support Team`;
  } else if (text.includes('print') || text.includes('paper') || text.includes('binding') || text.includes('blurry') || text.includes('damage') || text.includes('copies') || text.includes('cover quality')) {
    category = 'Printing & Quality';
    priority = 'High';
    draftResponse = `Dear ${authorName},\n\nWe are very sorry to hear about the print issue with your author copies. BookLeaf holds strict production standards at our Delhi facility, and this falls short of what we promise.\n\nCould you please reply to this ticket or share clear photos of the defective copies (showing the cover and affected pages)? Once verified, we will arrange a complimentary reprint through our priority print queue within 5–7 business days at no additional cost to you.\n\nWarm regards,\nBookLeaf Author Support Team`;
  } else if (text.includes('unavailable') || text.includes('out of stock') || text.includes('amazon') || text.includes('flipkart') || text.includes('store') || text.includes('listing')) {
    category = 'Distribution & Availability';
    priority = 'Medium';
    draftResponse = `Dear ${authorName},\n\nThank you for flagging your book's availability. When a published title momentarily shows as unavailable, it is typically due to an inventory feed re-sync across partner distribution platforms.\n\nOur distribution desk has re-triggered the inventory synchronization feed for ${bookTitle || 'your title'}. The listing typically returns to live, orderable status within 24 to 48 hours. We are monitoring it closely on our end.\n\nWarm regards,\nBookLeaf Author Support Team`;
  } else if (text.includes('stage') || text.includes('typesetting') || text.includes('proofreading') || text.includes('cover design') || text.includes('status') || text.includes('manuscript') || text.includes('publish')) {
    category = 'Book Status & Production Updates';
    priority = 'Medium';
    draftResponse = `Dear ${authorName},\n\nThank you for checking in on the progress of ${bookTitle || 'your book'}. We are excited to bring your work to readers.\n\nYour title is currently moving through its assigned production milestone. Delays usually occur during proofing or author review rounds. We are syncing with your designated book designer and typesetter to share an updated milestone delivery date within 24 hours.\n\nWarm regards,\nBookLeaf Author Support Team`;
  } else {
    category = 'General Inquiry';
    priority = 'Low';
    draftResponse = `Dear ${authorName},\n\nThank you for contacting BookLeaf Publishing Support. We have received your query regarding "${subject}".\n\nA member of our author experience team is reviewing your message and will provide a personalized response within 24 business hours.\n\nWarm regards,\nBookLeaf Author Support Team`;
  }

  return { category, priority, draftResponse };
}

// Router & App State Initialization
function render() {
  renderHeader();
  const app = document.getElementById('app');

  if (!state.token || !state.user) {
    renderLogin(app);
    return;
  }

  if (state.user.role === 'admin') {
    if (state.currentView === 'ticket_detail' && state.selectedTicket) {
      renderAdminTicketDetail(app);
    } else {
      state.currentView = 'admin_queue';
      renderAdminDashboard(app);
    }
  } else {
    if (state.currentView === 'ticket_detail' && state.selectedTicket) {
      renderAuthorTicketDetail(app);
    } else {
      state.currentView = 'author_dashboard';
      renderAuthorDashboard(app);
    }
  }
}

function renderHeader() {
  const container = document.getElementById('header-auth');
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
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (emailInput && passInput) {
    emailInput.value = email;
    passInput.value = password;
  }
  loginDirect(email, password);
}

function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  loginDirect(email, password);
}

function loginDirect(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  
  if (cleanEmail === 'admin@bookleafpub.com') {
    const adminUser = {
      id: 'admin-1',
      name: 'BookLeaf Ops Admin',
      email: 'admin@bookleafpub.com',
      role: 'admin',
      authorId: null
    };
    state.user = adminUser;
    state.token = 'demo_admin_jwt_' + Date.now();
    localStorage.setItem('bookleaf_token', state.token);
    localStorage.setItem('bookleaf_user', JSON.stringify(adminUser));
    showToast('👋 Signed in as BookLeaf Operations Admin');
    render();
    return;
  }

  const authors = getStore('bookleaf_authors');
  const author = authors.find(a => a.email.toLowerCase() === cleanEmail);

  if (author) {
    const authorUser = {
      id: author.author_id,
      name: author.name,
      email: author.email,
      role: 'author',
      authorId: author.author_id
    };
    state.user = authorUser;
    state.token = 'demo_author_jwt_' + Date.now();
    localStorage.setItem('bookleaf_token', state.token);
    localStorage.setItem('bookleaf_user', JSON.stringify(authorUser));
    showToast(`👋 Welcome back, ${author.name}!`);
    render();
    return;
  }

  const errorEl = document.getElementById('login-error');
  if (errorEl) {
    errorEl.innerText = 'Invalid credentials. Try the quick demo accounts below.';
    errorEl.classList.remove('hidden');
  }
}

function logout() {
  localStorage.removeItem('bookleaf_token');
  localStorage.removeItem('bookleaf_user');
  state.token = null;
  state.user = null;
  state.selectedTicket = null;
  render();
}

function navigateHome() {
  state.selectedTicket = null;
  render();
}

// 1. LOGIN SCREEN
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

// 2. AUTHOR DASHBOARD
function renderAuthorDashboard(container) {
  const allBooks = getStore('bookleaf_books');
  const authorBooks = allBooks.filter(b => b.author_id === state.user.authorId);
  const allTickets = getStore('bookleaf_tickets');
  const authorTickets = allTickets.filter(t => t.author_id === state.user.authorId);

  const totalCopies = authorBooks.reduce((sum, b) => sum + (b.total_copies_sold || 0), 0);
  const totalEarned = authorBooks.reduce((sum, b) => sum + (b.total_royalty_earned || 0), 0);
  const totalPending = authorBooks.reduce((sum, b) => sum + (b.royalty_pending || 0), 0);

  container.innerHTML = `
    <div class="space-y-8">
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

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white rounded-2xl p-5 border border-slate-200">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Published</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">${authorBooks.length} Books</p>
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
          <p class="text-2xl font-extrabold ${totalPending > 0 ? 'text-amber-600' : 'text-slate-900'} mt-1">₹${totalPending.toLocaleString()}</p>
        </div>
      </div>

      <!-- My Books Table -->
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
            <tbody class="divide-y divide-slate-100">
              ${authorBooks.length === 0 ? '<tr><td colspan="9" class="text-center py-6 text-slate-400">No books found.</td></tr>' :
                authorBooks.map(b => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="py-3 px-4 font-bold text-slate-900">${b.title}</td>
                    <td class="py-3 px-4 font-mono text-xs text-slate-500">${b.isbn}</td>
                    <td class="py-3 px-4">
                      <span class="text-xs px-2.5 py-1 rounded-full font-semibold ${b.status === 'Published & Live' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
                        ${b.status}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-semibold text-slate-700">${b.mrp ? '₹' + b.mrp : '—'}</td>
                    <td class="py-3 px-4 font-semibold text-slate-700">${b.total_copies_sold}</td>
                    <td class="py-3 px-4 font-semibold text-emerald-700">₹${b.total_royalty_earned}</td>
                    <td class="py-3 px-4 text-slate-600">₹${b.royalty_paid}</td>
                    <td class="py-3 px-4 font-bold ${b.royalty_pending > 0 ? 'text-amber-600' : 'text-slate-400'}">₹${b.royalty_pending}</td>
                    <td class="py-3 px-4 text-xs text-slate-500">${(b.available_on || []).join(', ') || 'Internal'}</td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- My Tickets -->
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
        <div class="space-y-4">
          ${authorTickets.length === 0 ? `
            <div class="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <p class="text-sm font-semibold text-slate-500">You have no active support tickets.</p>
              <button onclick="openTicketModal()" class="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">Raise a query now</button>
            </div>
          ` :
            authorTickets.map(t => `
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
                    t.status === 'Open' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    t.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }">${t.status}</span>
                  <span class="text-xs text-slate-400">View Thread →</span>
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
    </div>

    <!-- Ticket Modal -->
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
              ${authorBooks.map(b => `<option value="${b.book_id}">${b.title} (${b.isbn})</option>`).join('')}
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
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" onclick="closeTicketModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" id="btn-submit-ticket" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30">Submit Query</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function openTicketModal() {
  document.getElementById('ticket-modal').classList.remove('hidden');
}

function closeTicketModal() {
  document.getElementById('ticket-modal').classList.add('hidden');
}

function submitTicket() {
  const bookId = document.getElementById('query-book-id').value;
  const subject = document.getElementById('query-subject').value;
  const description = document.getElementById('query-description').value;

  const allBooks = getStore('bookleaf_books');
  const book = allBooks.find(b => b.book_id === bookId);
  const bookTitle = book ? book.title : null;

  const ai = runBookLeafAI(subject, description, state.user.name, bookTitle);
  const ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000);

  const newTicket = {
    ticket_id: ticketId,
    author_id: state.user.authorId,
    author_name: state.user.name,
    author_email: state.user.email,
    book_id: bookId || null,
    book_title: bookTitle,
    subject: subject.trim(),
    description: description.trim(),
    category: ai.category,
    priority: ai.priority,
    status: 'Open',
    internal_notes: '',
    ai_draft_response: ai.draftResponse,
    created_at: new Date().toISOString(),
    messages: [
      {
        message_id: 'msg-' + Date.now(),
        sender_role: 'author',
        sender_name: state.user.name,
        message: description.trim(),
        created_at: new Date().toISOString()
      }
    ]
  };

  const tickets = getStore('bookleaf_tickets');
  tickets.unshift(newTicket);
  setStore('bookleaf_tickets', tickets);

  closeTicketModal();
  showToast(`✅ Query registered as ${ticketId}! Auto-classified as "${ai.category}" (${ai.priority} Priority).`);
  render();
}

// 3. ADMIN OPERATIONS DASHBOARD
function renderAdminDashboard(container) {
  container.innerHTML = `
    <div class="space-y-6">
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
        <input id="admin-search" type="text" placeholder="Search ticket, author, keyword..." oninput="filterAdminTickets()"
               class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500" />
        
        <select id="admin-filter-status" onchange="filterAdminTickets()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <option value="">All Statuses</option>
          <option value="Open">Open (Pending Triage)</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select id="admin-filter-category" onchange="filterAdminTickets()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <option value="">All Categories</option>
          ${OFFICIAL_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>

        <select id="admin-filter-priority" onchange="filterAdminTickets()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <option value="">All Priorities</option>
          <option value="Critical">Critical (Immediate SLA)</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <!-- Queue Table -->
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
              <!-- Rendered by filterAdminTickets() -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  filterAdminTickets();
}

function filterAdminTickets() {
  const search = (document.getElementById('admin-search')?.value || '').toLowerCase();
  const status = document.getElementById('admin-filter-status')?.value || '';
  const category = document.getElementById('admin-filter-category')?.value || '';
  const priority = document.getElementById('admin-filter-priority')?.value || '';

  let list = getStore('bookleaf_tickets');

  if (search) {
    list = list.filter(t => 
      t.subject.toLowerCase().includes(search) || 
      t.description.toLowerCase().includes(search) ||
      t.author_name.toLowerCase().includes(search) ||
      t.ticket_id.toLowerCase().includes(search)
    );
  }
  if (status) list = list.filter(t => t.status === status);
  if (category) list = list.filter(t => (t.category_override || t.category) === category);
  if (priority) list = list.filter(t => (t.priority_override || t.priority) === priority);

  const tbody = document.getElementById('admin-queue-tbody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">No tickets matching selected filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(t => {
    const activePriority = t.priority_override || t.priority;
    const activeCategory = t.category_override || t.category;
    const priorityClass =
      activePriority === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
      activePriority === 'High' ? 'bg-amber-100 text-amber-800 border-amber-200' :
      activePriority === 'Medium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
      'bg-slate-100 text-slate-700 border-slate-200';

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
          ${t.category_override ? '<span class="text-[10px] text-amber-600 font-bold ml-1">(Admin Edited)</span>' : ''}
        </td>
        <td class="py-3.5 px-4">
          <span class="text-xs px-2.5 py-1 rounded-full font-bold border ${priorityClass}">
            ${activePriority}
          </span>
        </td>
        <td class="py-3.5 px-4">
          <span class="text-xs font-bold ${t.status === 'Open' ? 'text-amber-600' : t.status === 'In Progress' ? 'text-blue-600' : 'text-emerald-600'}">
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
  }).join('');
}

// 4. DETAILED TICKET THREAD & RESPONSE EDITOR
function openTicketDetails(ticketId) {
  state.currentView = 'ticket_detail';
  const tickets = getStore('bookleaf_tickets');
  const ticket = tickets.find(t => t.ticket_id === ticketId);
  if (!ticket) return alert('Ticket not found.');
  state.selectedTicket = ticket;
  render();
}

function renderAdminTicketDetail(container) {
  const t = state.selectedTicket;
  const msgs = t.messages || [];

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <button onclick="navigateHome()" class="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1">
          <span>← Back to Ticket Queue</span>
        </button>
        <span class="font-mono text-xs font-bold text-slate-400">Ticket ID: ${t.ticket_id}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div class="border-b border-slate-100 pb-4 mb-4">
              <h2 class="text-xl font-extrabold text-slate-900">${t.subject}</h2>
              <p class="text-xs text-slate-500 mt-1">Author: <strong>${t.author_name}</strong> (${t.author_email}) | Book: <strong>${t.book_title || 'General / Account'}</strong></p>
            </div>

            <div class="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              ${msgs.map(m => `
                <div class="p-4 rounded-2xl ${m.sender_role === 'author' ? 'bg-slate-50 border border-slate-100' : 'bg-emerald-50/70 border border-emerald-100 ml-6'}">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold ${m.sender_role === 'author' ? 'text-slate-900' : 'text-emerald-900'}">${m.sender_name} (${m.sender_role})</span>
                    <span class="text-[11px] text-slate-400">${new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <p class="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">${m.message}</p>
                </div>
              `).join('')}
            </div>
          </div>

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
            <textarea id="admin-reply-text" rows="7" class="w-full p-4 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 leading-relaxed">${t.ai_draft_response || ''}</textarea>

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

        <div class="space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Triage & Overrides</h3>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 mb-1">Category (AI: ${t.category})</label>
              <select id="override-category" onchange="updateOverrides('${t.ticket_id}')" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                ${OFFICIAL_CATEGORIES.map(c => `<option value="${c}" ${(t.category_override || t.category) === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 mb-1">Priority (AI: ${t.priority})</label>
              <select id="override-priority" onchange="updateOverrides('${t.ticket_id}')" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                ${['Critical', 'High', 'Medium', 'Low'].map(p => `<option value="${p}" ${(t.priority_override || t.priority) === p ? 'selected' : ''}>${p}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 mb-1">Ticket Status</label>
              <select id="override-status" onchange="updateOverrides('${t.ticket_id}')" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                ${['Open', 'In Progress', 'Resolved', 'Closed'].map(s => `<option value="${s}" ${t.status === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Internal Notes (Staff Only)</h3>
              <span class="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold border border-amber-200">Hidden from Author</span>
            </div>
            <textarea id="internal-notes" rows="4" placeholder="Log internal dispatch numbers, Amazon sync IDs, or accounting checks..."
                      class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500">${t.internal_notes || ''}</textarea>
            <button onclick="saveInternalNotes('${t.ticket_id}')" class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition">
              Save Private Note
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAuthorTicketDetail(container) {
  const t = state.selectedTicket;
  const msgs = t.messages || [];

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
              t.status === 'Open' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              t.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }">${t.status}</span>
          </div>
          <h2 class="text-xl font-extrabold text-slate-900 mt-2">${t.subject}</h2>
          <p class="text-xs text-slate-500 mt-1">Book: ${t.book_title || 'General / Account Level'}</p>
        </div>

        <div class="space-y-4 max-h-[480px] overflow-y-auto pr-2">
          ${msgs.map(m => `
            <div class="p-4 rounded-2xl ${m.sender_role === 'author' ? 'bg-slate-50 border border-slate-100' : 'bg-emerald-50/70 border border-emerald-100 ml-6'}">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-bold ${m.sender_role === 'author' ? 'text-slate-900' : 'text-emerald-900'}">${m.sender_name} (${m.sender_role === 'admin' ? 'BookLeaf Team' : 'You'})</span>
                <span class="text-[11px] text-slate-400">${new Date(m.created_at).toLocaleString()}</span>
              </div>
              <p class="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">${m.message}</p>
            </div>
          `).join('')}
        </div>

        <form onsubmit="event.preventDefault(); sendAuthorReply('${t.ticket_id}');" class="pt-4 border-t border-slate-100 space-y-3">
          <label class="block text-xs font-bold text-slate-700">Add Reply / Message</label>
          <textarea id="author-reply-input" rows="3" required placeholder="Type your response to the BookLeaf team..."
                    class="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"></textarea>
          <div class="flex justify-end">
            <button type="submit" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition">
              Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function sendAdminReply(ticketId) {
  const reply = document.getElementById('admin-reply-text').value;
  const resolve = document.getElementById('resolve-ticket-checkbox').checked;

  if (!reply.trim()) return alert('Message cannot be empty.');

  const tickets = getStore('bookleaf_tickets');
  const t = tickets.find(x => x.ticket_id === ticketId);
  if (!t) return;

  t.messages.push({
    message_id: 'msg-' + Date.now(),
    sender_role: 'admin',
    sender_name: 'BookLeaf Ops Admin',
    message: reply.trim(),
    created_at: new Date().toISOString()
  });

  t.status = resolve ? 'Resolved' : 'In Progress';
  setStore('bookleaf_tickets', tickets);
  state.selectedTicket = t;

  showToast('✅ Response dispatched to author successfully.');
  render();
}

function sendAuthorReply(ticketId) {
  const reply = document.getElementById('author-reply-input').value;
  if (!reply.trim()) return alert('Message cannot be empty.');

  const tickets = getStore('bookleaf_tickets');
  const t = tickets.find(x => x.ticket_id === ticketId);
  if (!t) return;

  t.messages.push({
    message_id: 'msg-' + Date.now(),
    sender_role: 'author',
    sender_name: state.user.name,
    message: reply.trim(),
    created_at: new Date().toISOString()
  });

  if (t.status === 'Resolved') t.status = 'In Progress';
  setStore('bookleaf_tickets', tickets);
  state.selectedTicket = t;

  showToast('✅ Reply sent.');
  render();
}

function updateOverrides(ticketId) {
  const tickets = getStore('bookleaf_tickets');
  const t = tickets.find(x => x.ticket_id === ticketId);
  if (!t) return;

  t.category_override = document.getElementById('override-category').value;
  t.priority_override = document.getElementById('override-priority').value;
  t.status = document.getElementById('override-status').value;

  setStore('bookleaf_tickets', tickets);
  state.selectedTicket = t;
  showToast('Triage overrides saved.');
}

function saveInternalNotes(ticketId) {
  const tickets = getStore('bookleaf_tickets');
  const t = tickets.find(x => x.ticket_id === ticketId);
  if (!t) return;

  t.internal_notes = document.getElementById('internal-notes').value;
  setStore('bookleaf_tickets', tickets);
  state.selectedTicket = t;
  showToast('Internal note saved.');
}

function regenerateDraft(ticketId) {
  const tickets = getStore('bookleaf_tickets');
  const t = tickets.find(x => x.ticket_id === ticketId);
  if (!t) return;

  const ai = runBookLeafAI(t.subject, t.description, t.author_name, t.book_title);
  t.ai_draft_response = ai.draftResponse;
  setStore('bookleaf_tickets', tickets);
  state.selectedTicket = t;

  const area = document.getElementById('admin-reply-text');
  if (area) area.value = ai.draftResponse;
  showToast('✨ Draft regenerated from Knowledge Base.');
}

window.addEventListener('DOMContentLoaded', () => {
  render();
});
