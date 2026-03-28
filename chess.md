Build a modern responsive web app for selling shared chess premium subscriptions.

Tech requirements:
- Frontend: React (clean UI, mobile-first)
- Backend: Node.js + Express API
- Database: MongoDB

Main Features:

1. Landing Page:
- Clean hero section with headline: “Get Premium Chess Access at Low Cost” 40% discount 
- Pricing section (Yearly)
- Payment instructions (Bkash & Nagad numbers displayed clearly)
- CTA button: “Buy Now”

2. Purchase Form:
Create a form with the following fields:
- Full Name
- City
- Phone Number
- Plan ( Yearly)
- Payment Method (Bkash / Nagad)
- Transaction ID

On submit:
- Send data to backend API
- Save into MongoDB
- Set default status = "pending"

3. Admin Dashboard (protected route):
- Simple login (hardcoded admin for now)
- Show all buyers in table format:
  - Name
  - City
  - Plan
  - Payment Method
  - Transaction ID
  - Status
  - Date

- Add buttons:
  - Approve
  - Reject
  - Delete

4. Public Purchase List (Trust Section):
- Show only approved users
- Display:
  - Name (masked like "Rahim S.")
  - City
  - Time (e.g. "2 hours ago")

- Design as:
  - Live feed OR table

5. Extra UI Features:
- Show “Recent Purchases” section on homepage
- Add small notification popup:
  “Someone from Dhaka just purchased”

6. Backend API routes:
- POST /buy → save purchase
- GET /buyers → get all buyers (admin)
- PATCH /buyers/:id → update status
- DELETE /buyers/:id → delete buyer
- GET /approved-buyers → public list

7. Database Schema:
{
  name: String,
  city: String,
  phone: String,
  plan: String,
  paymentMethod: String,
  transactionId: String,
  status: "pending" | "approved" | "rejected",
  createdAt: Date
}

8. UI Style:
- Clean, modern, minimal
- Soft shadows, rounded cards
- Mobile responsive
- Use Tailwind CSS

9. Deployment ready:
- Frontend: Vercel
- Backend: Render
- MongoDB Atlas connection

Important:
- Only approved buyers should appear in public purchase list
- Do not show full personal data (mask name)
- Keep everything simple and beginner-friendly 