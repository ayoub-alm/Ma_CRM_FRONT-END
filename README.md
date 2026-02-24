# SalesScout — Front-End

> **Application de gestion des prospects et CRM / WMS**

SalesScout Front-End is a modern **Angular 18** single-page application that provides a complete CRM and Warehouse Management (WMS) interface. It features role-based navigation, real-time data management, document generation, and activity tracking.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Angular 18.2 (standalone components) |
| **Language** | TypeScript |
| **UI Library** | Angular Material |
| **CSS** | Bootstrap 5 + Bootstrap Icons + custom CSS |
| **Data Grid** | PrimeNG |
| **State** | RxJS BehaviorSubjects |
| **i18n** | @ngx-translate |
| **HTTP** | Angular HttpClient with proxy configuration |
| **Build** | Angular CLI |

---

## 📁 Project Structure

```
src/app/
├── admin/                     # Admin module (lazy-loaded)
│   ├── dashboard/             # Admin dashboard
│   ├── prospect/              # Prospect management (list, show, create)
│   ├── interlocutor/          # Contact person management
│   └── interaction/           # Interaction tracking
├── super-admin/               # Super-admin module (lazy-loaded)
│   ├── companies/             # Company management
│   └── users/                 # User management
├── crm/                       # CRM module
│   └── wms/                   # Warehouse Management System
│       ├── wms-dashboard/     # WMS dashboard & KPIs
│       ├── wms-need/          # Storage needs (list + show)
│       ├── wms-offer/         # Storage offers (list + show)
│       ├── wms-contract/      # Storage contracts (list + show)
│       ├── wms-invoice/       # Invoices (list + show)
│       ├── wms-delivry-note/  # Delivery notes (list + show/edit)
│       ├── wms-asset/         # Credit notes (list + show)
│       ├── wms-payment/       # Payments (list + show)
│       └── pricing/           # Pricing configuration
├── front-end/                 # Public-facing pages
├── login/                     # Login page
├── utils/                     # Shared components
│   ├── general-infos/         # Entity header (created by, date, actions)
│   ├── comment/               # Comment drawer component
│   ├── tracking-log/          # Tracking log bottom sheet
│   ├── upload-file/           # File upload component
│   └── ...                    # Other shared utilities
├── guards/                    # Route guards (auth)
├── directives/                # Custom directives (permissions)
├── models/                    # TypeScript interfaces & models
├── services/                  # API services
├── mappers/                   # DTO mappers
└── dtos/                      # Data Transfer Objects
```

---

## ✨ Key Features

### 🔐 Authentication
- JWT-based login with role detection
- Route guards for protected areas
- Permission-based UI (directives hide unauthorized elements)

### 👥 Prospect Management (Admin)
- Prospect CRUD with search & filtering
- Interlocutor (contact) management per prospect
- Interaction logging (calls, meetings, emails)

### 🏢 Company & User Management (Super-Admin)
- Company CRUD with departments, certifications, bank accounts
- User management with role assignment

### 🗄 WMS — Warehouse Management
Full warehouse lifecycle management:

| Module | Description |
|--------|-------------|
| **Storage Needs** | Client submits storage requirements |
| **Storage Offers** | Generate pricing proposals |
| **Contracts** | Create & manage contracts with annexes |
| **Invoices** | Invoice generation, validation (finance + sales) |
| **Delivery Notes** | Track goods in/out |
| **Credit Notes** | Handle returns & credit adjustments |
| **Payments** | Record & validate payments |

### 💬 Comments
- Side drawer with per-entity comment threads
- Available on all WMS detail pages + interlocutor pages

### 📝 Tracking Logs
- Bottom sheet showing entity modification history
- Tracks: who changed what, when, and which fields
- Available on all WMS detail pages + admin pages

### 📃 Document Generation
- Download contracts, invoices, delivery notes, and credit notes as DOCX/PDF
- One-click generation from detail pages

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- **npm 9+** (or yarn)
- **Angular CLI 18**

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ma_CRM_FRONT-END
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the API proxy**

   The file `proxy.conf.json` is already configured to proxy API requests to the backend. Update the target URL if your backend runs on a different port:
   ```json
   {
     "/api": {
       "target": "http://localhost:8080",
       "secure": false
     }
   }
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```

   Navigate to `http://localhost:4200/`. The application auto-reloads on source changes.

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `ng serve` | Start dev server on `http://localhost:4200` |
| `ng build` | Build for production (output in `dist/sales-scout`) |
| `ng test` | Run unit tests via Karma |
| `ng generate component <name>` | Generate a new component |
| `ng e2e` | Run end-to-end tests |

---

## 🎨 Styling

The project uses a combination of:
- **Angular Material** — `azure-blue` prebuilt theme for UI components
- **Bootstrap 5** — Grid system, utilities, and responsive layout
- **Bootstrap Icons** — Icon library
- **PrimeNG** — Data table components
- **Custom CSS** — Per-component styles

---

## 🌐 Internationalization

The project uses `@ngx-translate` for multi-language support. Translation files are managed via the `TranslatePipe` in templates.

---

## 📄 License

Proprietary — SalesScout © 2024–2026
