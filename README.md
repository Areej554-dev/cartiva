# 🛒 Cartiva – E-Commerce Web Application

Cartiva is a full-stack e-commerce web application built with Next.js and MongoDB. It provides users with a platform to browse products, search and filter the catalog, and enjoy an online shopping experience.

## 🌐 Live Demo

🚀 **[Visit Cartiva](https://cartiva-iota.vercel.app/)**

## ✨ Features

- 🛍️ Browse and explore products
- 🔍 Search products by name or category
- 🗂️ Filter products by category
- ↕️ Sort products by price and name
- 👤 User authentication
- 🛒 Shopping cart functionality
- 📱 Responsive user interface
- ☁️ MongoDB Atlas cloud database integration
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
| MongoDB Atlas | Cloud database hosting |
| Vercel | Deployment and hosting |
| Git & GitHub | Version control |

## 🗄️ Database

Cartiva uses MongoDB to store application data.

- **Local Development:** Local MongoDB
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

### 4. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🚀 Deployment on Vercel

Cartiva is deployed using [Vercel](https://vercel.com/).

### Deployment Process

1. Push the project code to GitHub.
2. Import the GitHub repository into Vercel.
3. Configure the required environment variables.
4. Connect MongoDB Atlas as the production database.
5. Deploy the application.

### Production Environment Variables

Configure these under **Vercel → Project Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Authentication secret |
| `NEXTAUTH_URL` | Production website URL |

**Security:** Never commit `.env.local` or expose database credentials in your public GitHub repository.

## 📁 Project Structure

```text
cartiva/
├── app/
│   ├── products/
│   └── ...
├── lib/
│   └── mongodb.js
├── models/
│   └── Product.js
├── public/
├── package.json
└── README.md
```

*Simplified overview of the project structure.*

## 👩‍💻 Developer

**Areej**

- GitHub: [@Areej554-dev](https://github.com/Areej554-dev)
- Live Project: [Cartiva](https://cartiva-iota.vercel.app/)

---

⭐ If you find this project interesting, consider giving the repository a star!
