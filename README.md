# 💧 EnerzyFlow - Premium Sustainable Water Bottles

<div align="center">

![EnerzyFlow](public/images/enerzyflow.png)

**Premium sustainable water bottles with bold design. Eco-friendly, reusable bottles built to reduce plastic waste.**

[Website](https://www.enerzyflow.com/) • [Features](#features) • [Getting Started](#getting-started) • [Backend Repository](#backend-repository)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Backend Repository](#backend-repository)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Dashboard Roles](#dashboard-roles)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 About

EnerzyFlow is a comprehensive e-commerce platform specializing in premium sustainable water bottles. The platform offers a modern, responsive web application with features for customers, partners, franchise management, and multi-role administrative dashboards.

### Key Highlights

- 🌍 **Eco-Friendly Focus**: Sustainable water bottle solutions to reduce plastic waste
- 🎨 **Modern UI/UX**: Smooth animations and interactive design with GSAP and Framer Motion
- 📱 **Fully Responsive**: Optimized for all devices and screen sizes
- 🔐 **Secure Authentication**: OTP-based authentication system
- 📊 **Multi-Role Dashboards**: Separate dashboards for Super Admin, Plant Admin, and Print Admin
- 🤝 **Franchise & Partnership**: Dedicated sections for franchise opportunities and partnerships
- 📦 **Order Management**: Complete order tracking and invoice generation system

---

## ✨ Features

### Customer Features

- 🏠 Interactive home page with product showcase
- 🛍️ Product catalog with detailed specifications
- 💼 Partnership and franchise application forms
- 💰 Investment opportunities section
- 📄 License information and documentation
- 🎥 Video presentations and brand storytelling
- 📝 Get pricing and quotation system

### Admin Features

- 👤 **Super Admin Dashboard**: Complete system oversight and management
- 🏭 **Plant Dashboard**: Manufacturing and inventory management
- 🖨️ **Print Dashboard**: Custom print order management
- 📊 Order tracking and status updates
- 💬 Order comments and communication
- 🧾 Invoice generation and management
- 👥 Profile management

### Technical Features

- ⚡ Next.js 15 with App Router
- 🎭 Server and Client Components optimization
- 🔄 Smooth page transitions with custom templates
- 🎨 Advanced animations with GSAP and Framer Motion
- 🖼️ Cloudinary integration for optimized image delivery
- 🎯 Custom cursor effects
- 🌊 Smooth scrolling with Lenis
- 🎨 Tailwind CSS for styling
- 📱 Responsive design with mobile-first approach

---

## 🛠️ Tech Stack

### Frontend Framework

- **Next.js 15.3.8** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### Styling & Animation

- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **GSAP 3.14.2** - Professional-grade animation
- **Framer Motion 12.23.18** - React animation library
- **@studio-freight/lenis 1.0.42** - Smooth scrolling

### UI Components & Icons

- **Lucide React 0.544.0** - Icon library
- **React Icons 5.5.0** - Additional icon sets

### State Management & Routing

- **React Router DOM 7.10.1** - Client-side routing
- **React Context API** - State management

### API & Data Fetching

- **Axios 1.12.2** - HTTP client

### Media Management

- **Next Cloudinary 6.16.0** - Cloudinary integration

### Notifications

- **React Hot Toast 2.6.0** - Toast notifications

### Development Tools

- **ESLint 9** - Code linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.23** - CSS vendor prefixes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** / **yarn** / **pnpm** / **bun**
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shaukatalidev/enerzyflow_new.git
   cd enerzyflow_new
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Then configure your environment variables (see [Environment Variables](#environment-variables))

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
enerzyflow_new/
├── public/                    # Static assets
│   ├── images/               # Image assets
│   │   ├── bottles/         # Product bottle images
│   │   ├── brands/          # Brand logos and social media icons
│   │   ├── hero/            # Hero section images and videos
│   │   └── logo_bottles/    # Product bottles with logos
│   └── favicon.ico
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (main)/          # Main public routes
│   │   │   ├── about/       # About page
│   │   │   ├── franchise/   # Franchise pages
│   │   │   ├── get-price/   # Pricing page
│   │   │   ├── invest/      # Investment page
│   │   │   ├── licenses/    # Licenses page
│   │   │   ├── login/       # Login page
│   │   │   ├── partner/     # Partnership page
│   │   │   ├── products/    # Products page
│   │   │   ├── solutions/   # Solutions page
│   │   │   └── video/       # Video page
│   │   ├── dashboard/       # Dashboard routes
│   │   │   ├── order/       # Order management
│   │   │   ├── printdetail/ # Print details
│   │   │   ├── printstatus/ # Print status
│   │   │   └── profile/     # User profile
│   │   ├── context/         # React Context providers
│   │   ├── lib/             # Utility libraries
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript type definitions
│   ├── components/          # React components
│   └── data/                # Static data files
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🔗 Backend Repository

This is the **frontend application** for EnerzyFlow. The backend API is maintained in a separate repository:

**Backend Repository**: https://github.com/shaukatalidev/enerzyflow_backend

### API Integration

The frontend connects to the backend through the axios instance configured in `src/app/lib/axios.ts`. Make sure your backend is running and the API base URL is correctly set in your environment variables.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Add other environment variables as needed
```

> **Note**: Never commit `.env.local` to version control. Add it to `.gitignore`.

---

## 📜 Available Scripts

| Script          | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `npm run dev`   | Start development server on [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Build production-ready application                                         |
| `npm run start` | Start production server                                                    |
| `npm run lint`  | Run ESLint to check code quality                                           |

---

## 👥 Dashboard Roles

The application supports three different admin roles with separate dashboards:

### 1. **Super Admin** 🔴

- Full system access and control
- User management
- Complete order oversight
- System configuration

### 2. **Plant Admin** 🟢

- Manufacturing oversight
- Inventory management
- Production order tracking
- Plant-specific operations

### 3. **Print Admin** 🔵

- Custom print order management
- Design approval workflow
- Print job tracking
- Print-specific operations

Each role has a dedicated dashboard with role-specific features and permissions managed through the backend authentication system.

---

## 🤝 Contributing

We welcome contributions to EnerzyFlow! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

## 📞 Contact & Support

For any queries or support, please reach out:

- **Website**: [www.enerzyflow.com](https://www.enerzyflow.com/)
- **GitHub**: [@shaukatalidev](https://github.com/shaukatalidev)

---

<div align="center">

**Made with 💚 for a sustainable future**

_EnerzyFlow - Reducing plastic waste, one bottle at a time_

</div>
