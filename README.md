# 3D Print Shop - E-Commerce Platform

A full-stack e-commerce platform for 3D printing services and products. This application allows users to browse and purchase 3D printing products, manage orders, access tutorials, and interact with a community forum.

## 🎯 Project Overview

3D Print Shop is a modern e-commerce solution built for selling 3D printing equipment, materials, and services. The platform provides a seamless shopping experience with comprehensive product catalogs, order management, educational tutorials, and community engagement through forums.

### Key Features

- **Product Catalog**: Browse and search 3D printing products with detailed specifications
- **Shopping Cart**: Add items to cart and manage quantities before checkout
- **Order Management**: Place orders, track order status, and manage order history
- **User Authentication**: Secure user registration, login, and profile management
- **Tutorials & Learning**: Comprehensive guides for 3D printing, CAD design, maintenance, and troubleshooting
- **Tutorial Playlists**: Curated collections of video tutorials and educational content
- **Community Forums**: Discussion boards for users to share knowledge and experiences
- **Admin Dashboard**: Administrative tools for managing products, orders, users, and content
- **Payment Integration**: Stripe integration for secure payment processing

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) - React framework for production
- **Language**: TypeScript - Type-safe JavaScript development
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **Package Manager**: npm
- **Build Tool**: Next.js built-in webpack bundler

### Backend
- **Runtime**: Node.js - JavaScript server runtime
- **Framework**: [Express.js](https://expressjs.com/) - Minimalist web framework
- **Language**: TypeScript - Type-safe backend development
- **Database**: PostgreSQL - Relational database for data persistence
- **Authentication**: JWT (JSON Web Tokens) - Stateless authentication
- **API Security**: Helmet.js - HTTP security headers middleware
- **Rate Limiting**: express-rate-limit - Protection against brute force attacks
- **Validation**: Joi - Schema validation for API inputs

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Testing**: Jest - JavaScript testing framework
- **Environment Management**: dotenv - Environment variable management
- **Package Manager**: npm

## 📁 Project Structure

```
3dprintshop.ca/
├── frontend/                 # Next.js application
│   ├── app/                 # Next.js App Router
│   │   ├── auth/           # Authentication pages (login, register)
│   │   ├── shop/           # Shopping features (products, cart)
│   │   ├── forums/         # Community forums
│   │   └── layout.tsx      # Root layout component
│   ├── components/         # Reusable React components
│   ├── context/            # React context for state management
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and helpers
│   ├── public/             # Static assets
│   ├── styles/             # Global styles and CSS modules
│   ├── types/              # TypeScript type definitions
│   ├── package.json        # Frontend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   ├── next.config.ts      # Next.js configuration
│   └── tailwind.config.js  # Tailwind CSS configuration
│
├── backend/                # Express.js API server
│   ├── src/
│   │   ├── index.ts        # Server entry point
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.ts     # JWT authentication
│   │   │   ├── errorHandler.ts  # Global error handling
│   │   │   └── validation.ts    # Request validation
│   │   ├── models/         # Data access layer
│   │   │   ├── user.ts     # User model
│   │   │   ├── product.ts  # Product model
│   │   │   ├── order.ts    # Order & cart model
│   │   │   └── tutorial.ts # Tutorial model
│   │   ├── routes/         # API route handlers
│   │   │   ├── auth.ts     # Authentication routes
│   │   │   ├── products.ts # Product routes
│   │   │   ├── cart.ts     # Shopping cart routes
│   │   │   ├── orders.ts   # Order routes
│   │   │   ├── tutorials.ts # Tutorial routes
│   │   │   └── forums.ts   # Forum routes
│   │   ├── database/       # Database utilities
│   │   │   ├── db.ts       # PostgreSQL connection pool
│   │   │   ├── migrate.ts  # Database migrations
│   │   │   └── seed.ts     # Database seeding
│   │   ├── services/       # Business logic layer
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Helper functions
│   ├── dist/               # Compiled JavaScript output
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   ├── jest.config.js      # Jest testing configuration
│   └── .env                # Environment variables (not in git)
│
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── package.json            # Root package.json (if using monorepo)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **PostgreSQL** 14 or higher
- **Git** for version control

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/huzeir2k/3dprintshop.ca.git
cd 3dprintshop.ca
```

#### 2. Set up the backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file with database credentials
cp .env.example .env
# Edit .env and add your configuration

# Run database migrations
npm run migrate

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:3000`

#### 3. Set up the frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file if needed
cp .env.example .env.local

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000` (or the next available port)

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=3dprintshop
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=3D Print Shop
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "token": "jwt_token"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user",
    "token": "jwt_token"
  }
}
```

### Products Endpoints

#### Get All Products
```
GET /api/products?page=1&limit=20
```

#### Get Product by ID
```
GET /api/products/:id
```

#### Search Products
```
GET /api/products/search?q=query
```

### Orders Endpoints

#### Get User Orders
```
GET /api/orders
Authorization: Bearer {token}
```

#### Create Order
```
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "shipping_address_id": "uuid",
  "billing_address_id": "uuid",
  "notes": "optional notes"
}
```

### Cart Endpoints

#### Get Cart
```
GET /api/cart
Authorization: Bearer {token}
```

#### Add to Cart
```
POST /api/cart
Authorization: Bearer {token}

{
  "product_id": "uuid",
  "quantity": 1
}
```

### Tutorials Endpoints

#### Get All Tutorials
```
GET /api/tutorials?page=1&limit=20
```

#### Get Tutorials by Category
```
GET /api/tutorials/category/:category
```

For more detailed API documentation, see [API.md](./backend/API.md)

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🏗️ Development

### Backend Development

```bash
cd backend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Run type checker
npm run type-check
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📝 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **products** - 3D printing products and materials
- **product_categories** - Product categorization
- **product_specs** - Product specifications
- **cart_items** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Items in each order
- **tutorials** - Educational tutorial content
- **tutorial_playlists** - Curated tutorial collections
- **playlist_items** - Videos/tutorials in playlists
- **forums** - Community forum discussions

See [schema.sql](./backend/database/schema.sql) for complete database structure.

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password encryption
- **CORS** - Cross-Origin Resource Sharing protection
- **Helmet.js** - HTTP security headers
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Joi schema validation
- **Error Handling** - Centralized error handling middleware
- **Environment Variables** - Sensitive data management

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend

# Deploy to Vercel
npm install -g vercel
vercel
```

### Backend Deployment (Heroku/Railway)

```bash
cd backend

# For Heroku
heroku create your-app-name
git push heroku main

# For Railway
railway init
railway up
```

## 📦 Dependencies

### Key Backend Dependencies
- `express` - Web framework
- `typescript` - Type safety
- `pg` - PostgreSQL driver
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `joi` - Schema validation
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `dotenv` - Environment variables
- `stripe` - Payment processing

### Key Frontend Dependencies
- `next` - React framework
- `typescript` - Type safety
- `react` - UI library
- `tailwindcss` - CSS framework
- `axios` - HTTP client

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@3dprintshop.ca or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Payment processing with Stripe
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] User reviews and ratings
- [ ] Wishlist feature
- [ ] Inventory management
- [ ] Shipping integration
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 👨‍💻 Authors

- **Huzeir Kurpejovic** - Initial development

## 🙏 Acknowledgments

- Next.js team for an amazing framework
- Express.js community
- PostgreSQL documentation
- All contributors and testers

---

**Last Updated**: February 4, 2026

For the latest updates and documentation, visit the [GitHub repository](https://github.com/huzeir2k/3dprintshop.ca)
