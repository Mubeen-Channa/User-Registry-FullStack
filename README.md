# 🔐 UserRegistry - Full-Stack Authentication System

A modern, secure user authentication and management platform built with the MERN stack, featuring aws cloud deployment.

![User Registry Full Stack App](/UserRegistryFullStack.png)

<br>

## ✨ Features

- 🔒 **Secure Authentication** - JWT-based login/register with password strength validation
- 👥 **User Management** - Real-time user dashboard with search and filtering
- 📸 **Profile Images** - Cloudinary integration with automatic compression
- 🌓 **Dark Mode** - Persistent theme preference across sessions
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔍 **Advanced Filters** - Search by name, email, department, and gender
- ⚡ **Fast & Scalable** - Deployed on AWS EC2 and Vercel

<br>

## 🚀 Live Demo

- **URL:** [https://user-registry-fullstack.vercel.app/](https://user-registry-fullstack.vercel.app/)

<br>

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer** - Animation
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage

### DevOps
- **AWS EC2** - Backend hosting
- **Vercel** - Frontend hosting
- **PM2** - Process management
- **Nginx** - Reverse proxy

<br>

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mubeen-Channa/user-registry-fullstack.git
cd user-registry-fullstack
```

2. **Setup Backend**
```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Start server:
```bash
npm run dev
```

3. **Setup Frontend**
```bash
cd client
npm install
```

Create `.env.development`:
```env
VITE_API_URL=http://localhost:8080
```

Start frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

<br>

## 🔑 API Endpoints

### Authentication
```http
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
```

### Users
```http
GET    /api/users/all         # Get all users
PUT    /api/users/profile-image  # Update profile image
```
<br>

## 🎨 Key Features Implementation

### Image Upload with Compression
```javascript
// Frontend compresses to 400x400, 70% quality
// Backend stores to Cloudinary CDN
// Result: 95% smaller database size
```

### JWT Authentication
```javascript
// Token includes: userId, email, role
// 7-day expiration
// Stored in localStorage
```

### Protected Routes
```javascript
// Checks authentication before allowing access
// Role-based access control (Male/Female)
```
<br>

## 🚀 Deployment

### Backend (AWS EC2)
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ip

# Clone & setup
git clone <repo>
cd server
npm install
pm2 start src/index.js
```

### Frontend (Vercel)
```bash
# Connect GitHub repo to Vercel
# Set environment variables
# Deploy automatically on push
```
<br>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br>

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

<br>

## 👨‍💻 Author

- GitHub: [@Mubeen-Channa](https://github.com/Mubeen-Channa)
- Portfolio: [mubeenfolio.site](https://mubeenfolio.site)

<br>

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for image CDN
- Vercel for frontend deployment
- AWS for backend infrastructure

---

⭐ **Star this repo if you found it helpful!**