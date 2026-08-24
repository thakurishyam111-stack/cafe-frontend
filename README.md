# ☕ Cafe Management System

A modern Cafe Management System built with the MERN Stack to manage menu items, customer orders, billing, tables, and admin operations efficiently.

---

## 🚀 Features

### 👨‍💼 Admin Panel

* Admin Login Authentication
* Dashboard Overview
* Manage Menu Items

  * Add Menu Item
  * Update Menu Item
  * Delete Menu Item
  * View Menu Item
* Manage Categories
* Manage Tables
* View Customer Orders
* Order Status Management
* Billing Management
* Sales Reports

### 🍽️ Customer Features

* Browse Menu
* Search Food Items
* View Food Details
* Add Items to Cart
* Place Order
* View Order Summary
* Generate Bill
* Online Payment Support (Optional)

### 🧾 Billing System

* Auto Bill Number Generation
* Customer Name Validation
* Phone Number Validation
* Table Number Validation
* Order Amount Calculation
* Tax Calculation
* Grand Total Calculation
* Print Bill

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React.js
* Tailwind CSS
* Axios
* React Icons

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

---

# 📁 Project Structure

```bash
cafe-management-system/
│
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── menu/
│   │   ├── orders/
│   │   ├── billing/
│   │   └── reports/
│   │
│   ├── customer/
│   │   ├── menu/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── order/
│   │
│   ├── login/
│   ├── register/
│   └── page.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Sidebar.jsx
│   ├── MenuCard.jsx
│   ├── Cart.jsx
│   ├── BillCard.jsx
│   ├── OrderTable.jsx
│   └── Loader.jsx
│
├── models/
│   ├── User.js
│   ├── Menu.js
│   ├── Order.js
│   ├── Bill.js
│   └── Table.js
│
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   ├── billRoutes.js
│   └── tableRoutes.js
│
├── controllers/
│   ├── authController.js
│   ├── menuController.js
│   ├── orderController.js
│   ├── billController.js
│   └── tableController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── public/
│   ├── images/
│   └── logo.png
│
├── utils/
│   └── generateBillNo.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/thakurishyam111-stack/RR-cafe.com.git
```

## Move Project Folder

```bash
cd RR-cafe.com
```

## Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=8080
```

---

# ▶️ Run Project

## Development

```bash
npm run dev
```

or

```bash
pnpm dev
```

## Production

```bash
npm run build
npm start
```

---

# 📊 Database Collections

### Users

```json
{
  "_id": "",
  "name": "",
  "email": "",
  "password": "",
  "role": "admin"
}
```

### Menu

```json
{
  "_id": "",
  "name": "",
  "price": 0,
  "category": "",
  "image": ""
}
```

### Orders

```json
{
  "_id": "",
  "customerName": "",
  "phone": "",
  "tableNo": "",
  "items": [],
  "totalAmount": 0,
  "status": "Pending"
}
```

### Bills

```json
{
  "_id": "",
  "billNo": "",
  "orderId": "",
  "totalAmount": 0,
  "paymentStatus": "Paid"
}
```

---

# 🔒 Security Features

* JWT Authentication
* Protected Routes
* Password Hashing
* Input Validation
* Error Handling

---

# 📈 Future Enhancements

* QR Menu Ordering
* eSewa Payment Integration
* Khalti Payment Integration
* Receipt PDF Download
* Real-time Order Tracking
* Kitchen Dashboard
* Inventory Management

---

# 👨‍💻 Author

**Shyam Shah Thakuri**

BCA Student | MERN Stack Developer | Nepal 🇳🇵

---

# ⭐ Support

If you like this project, please give it a ⭐ on GitHub.
