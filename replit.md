# Overview

This is a full-stack grocery e-commerce application called "Modern Pride Super Mart" built with React, Express.js, and PostgreSQL. The application provides a complete online shopping experience with user authentication, product browsing, shopping cart functionality, order management, and an AI-powered customer support chatbot. It includes both customer-facing features and administrative tools for managing products, categories, and orders.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React with TypeScript and follows a modern component-based architecture:
- **UI Framework**: React with TypeScript for type safety and better development experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Component Library**: Radix UI primitives with shadcn/ui components for consistent, accessible UI
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a page-based structure with reusable components, hooks for business logic, and utility functions for common operations.

## Backend Architecture  
The server-side application uses Express.js with a layered architecture:
- **Web Framework**: Express.js with TypeScript for API endpoints and middleware
- **Database Layer**: Drizzle ORM for type-safe database operations and schema management
- **Storage Pattern**: Repository pattern implemented through a storage interface for data access abstraction
- **Session Management**: Express sessions with PostgreSQL storage for user authentication state
- **Error Handling**: Centralized error handling middleware for consistent API responses

## Authentication & Authorization
Authentication is handled through Replit's OAuth integration:
- **Authentication Provider**: Replit OpenID Connect (OIDC) for user authentication
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Authorization**: Role-based access control with admin user privileges
- **Security**: Secure session cookies with HTTP-only flags and CSRF protection

## Data Storage
The application uses PostgreSQL as the primary database:
- **Database**: PostgreSQL with connection pooling via Neon serverless
- **ORM**: Drizzle ORM for schema definition, migrations, and type-safe queries
- **Schema Design**: Relational schema with users, categories, products, orders, cart items, and sessions tables
- **Migrations**: Database migrations managed through Drizzle Kit

## External Dependencies

- **Database**: Neon PostgreSQL serverless database for scalable data storage
- **Authentication**: Replit OAuth service for user authentication and authorization
- **AI Integration**: OpenAI GPT-4o API for intelligent customer support chatbot functionality
- **UI Components**: Radix UI primitives and Lucide React icons for accessible, modern interface components
- **Development Tools**: Vite for build tooling, ESBuild for server bundling, and various development utilities for enhanced developer experience

The application is structured as a monorepo with shared TypeScript types and schemas between client and server, ensuring type consistency across the full stack.