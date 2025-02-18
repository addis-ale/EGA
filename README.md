
# EG-Store - Game Rental & Youth Development

Welcome to the official repository for **EG-Store**, a platform that not only offers game rentals but also serves as an NGO dedicated to youth development through gaming experiences. This project is built with **Next.js**, **shadcn/ui**, and **Tailwind CSS** to deliver a modern, responsive, and engaging user experience.

## Table of Contents

- [About EG-Store](#about-eg-store)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Folder Structure](#folder-structure)


---

## About EG-Store

**EG-Store** is more than just a game rental service—it’s a movement. As a store, it allows users to rent and enjoy a vast collection of games. As an NGO, it leverages gaming as a tool to develop skills, foster teamwork, and create opportunities for young people in the gaming industry.

---

## Features

- **Game Rentals**: Browse and rent a variety of games at affordable prices.
- **Youth Development Programs**: Participate in workshops, boot camps, and mentorship programs designed to nurture talent through gaming.
- **Event Hosting**: Engage in tournaments and community-driven gaming events.
- **User Profiles**: Customize your profile, track your rentals, and showcase achievements.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Modern UI**: Built with **shadcn/ui** and **Tailwind CSS** for a sleek and intuitive interface.

---

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **TypeScript**: For type-safe and scalable code.

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Zemenaytech/eg-store.git
   cd eg-store
   ```
2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory.

### Running the Project

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Open your browser and navigate to:
   ```bash
   http://localhost:3000
   ```

## Folder Structure
```bash
eg-store/
├── public/            # Static assets (images, fonts, etc.)
├── src/
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions and libraries
│   ├── pages/         # Next.js pages and API routes
│   ├── styles/        # Custom styles and Tailwind configuration
│   ├── types/         # TypeScript types and interfaces
│   └── utils/         # Helper functions and constants
├── .env.local         # Environment variables
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies and scripts
```

