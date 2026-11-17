# 🛒 Cartiva – E-Commerce Web Application

Cartiva is a full-stack e-commerce web application built with Next.js and MongoDB. It provides a platform for browsing products, managing shopping carts, and handling user authentication.

🚀 **Live Demo:** [Visit Cartiva](https://YOUR-VERCEL-URL.vercel.app)

## ✨ Features

- 🛍️ Browse and explore products
- 🔍 Search products by name or category
- 🗂️ Filter products by category
- ↕️ Sort products by price and name
- 👤 User authentication
- 🛒 Shopping cart functionality
- 📦 Product management
- 📱 Responsive user interface
- ☁️ Cloud database integration with MongoDB Atlas
- 🚀 Live deployment using Vercel

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React.js | User interface |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JavaScript | Application logic |
| CSS | Styling |
| Vercel | Deployment and hosting |
| MongoDB Atlas | Cloud database hosting |
| Git & GitHub | Version control |

## 🗄️ Database

Cartiva uses MongoDB for storing product and application data.

- **Local Development:** Local MongoDB database
- **Production:** MongoDB Atlas
- **Database Name:** `cartiva`
- **Products Collection:** `products`

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Areej554-dev/cartiva.git
```

### 2. Navigate to the project directory

```bash
cd cartiva
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/cartiva
```

Make sure your local MongoDB server is running.

Add any other environment variables required by your authentication configuration.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🚀 Deployment on Vercel

Cartiva is deployed using [Vercel](https://vercel.com/).

### Deployment Steps

1. Push the project code to GitHub.
2. Import the GitHub repository into Vercel.
3. Configure the required environment variables in Vercel Project Settings.
4. Connect MongoDB Atlas as the production database.
5. Deploy the application.

### Production Environment Variables

Configure these in **Vercel → Project Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Authentication secret |
| `NEXTAUTH_URL` | Production website URL |

Never commit `.env.local` or expose database credentials in your repository.

## 📁 Project Structure

```text
cartiva/
├── app/
│   ├── products/
│   ├── ...
├── lib/
│   └── mongodb.js
├── models/
│   └── Product.js
├── public/
├── .env.local
├── package.json
└── README.md
```

*The structure above highlights the main project areas; additional folders and routes may exist.*

## 🔐 Security

- Environment variables are used for database configuration.
- Database credentials should remain private.
- Production database connections use MongoDB Atlas.
- `.env.local` should not be committed to GitHub.

## 👩‍💻 Developer

**Areej**

GitHub: [@Areej554-dev](https://github.com/Areej554-dev)

---

⭐ If you find this project interesting, consider giving the repository a star!
