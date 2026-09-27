# Shree Balaji Electronics & Electricals — E-commerce Platform & Installable PWA

A full-featured, production-quality electronics and electrical retail store website and installable Progressive Web App (PWA) with an embedded **Owner Management Portal**, 245+ verified realistic products, Durga Puja festival campaign marketing, dual fulfillment (Home Delivery & Buy from Store Pickup), WhatsApp one-tap enquiry, and live order tracking.

---

## 🌟 Key Features

- **Installable PWA**: Standalone mobile app experience on Android, iOS, and desktop browsers with service worker caching, custom install banner, and offline fallback page.
- **245+ Product Catalogue**: Realistic specifications, pricing, MRP, and manufacturer warranties spanning 9 departments:
  - Smartphones & Mobiles (Samsung, Apple, OnePlus, Xiaomi, Redmi, Realme, Vivo, Oppo, Motorola, Nothing)
  - Televisions (4K UHD, QLED, OLED, Google TV)
  - Refrigerators (Single Door, Frost Free Double Door, Side-by-Side)
  - Inverter Air Conditioners (1T, 1.5T, 2T Split & Window ACs)
  - Washing Machines (Front Load AI DD, Top Load, Semi-Automatic)
  - Audio & Wearables (TWS Earbuds, Over-Ear ANC Headphones, Soundbars)
  - Laptops & Tablets (MacBooks, Gaming Laptops, Ultrabooks, iPads)
  - Kitchen & Home Appliances (Mixer Grinders, Microwaves, Air Fryers, RO Purifiers, Geysers)
  - Electricals & Smart Home (Smart Plugs, Surge Protectors, LED Battens, Modular Switches)
- **Durga Puja Mega Electronics Sale**: Festive campaign banner with countdown timer, promotional badges, and configurable discount percentage.
- **Dual Fulfillment Options**:
  - 🏠 **Home Delivery**: Doorstep delivery with address details and delivery instructions.
  - 🏪 **Buy From Store / Store Pickup**: Online reservation with zero advance payment and showroom pickup instructions.
- **Local Store Connectivity**: One-tap Call Store and WhatsApp Product Enquiry with pre-filled product details.
- **Customer Order Tracking**: Real-time visual milestone stepper (`/order-tracking/[orderId]`).
- **Owner Management Portal** (`/owner-login` & `/owner-dashboard`):
  - Protected with PIN / master password (`balaji2026` or `1234`).
  - Analytics overview (Products, Orders, Sales Volume, Out of Stock count).
  - Product CRUD with **category-adaptive dynamic specifications**.
  - Stock status toggle (In Stock, Limited Stock, Out of Stock).
  - Customer Order Management with **"Call Customer"** and **"WhatsApp Customer"** one-tap actions.
  - Durga Puja Campaign manager (Banner, discount %, dates, active toggle).
  - Store Profile, Contact numbers, Physical Address, and Google Maps URL editor.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🔒 Owner / Admin Access

- **URL**: [http://localhost:3000/owner-login](http://localhost:3000/owner-login)
- **Default PIN / Password**: `balaji2026` or `1234`
