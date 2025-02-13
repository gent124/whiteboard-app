# Real-Time Collaborative Whiteboard

A modern, real-time collaborative whiteboard application built with NestJS and Socket.IO. This application allows multiple users to draw, collaborate, and share ideas in real-time.

## 🌟 Features

- **Real-time Drawing**: Instantly see other users' drawings as they create them
- **Multi-user Collaboration**: Multiple users can work on the same board simultaneously
- **Drawing Tools**:
  - Free-hand drawing
  - Color picker
  - Adjustable line width
  - Clear canvas functionality
- **Touch Support**: Works on mobile and tablet devices
- **User Authentication**: Secure JWT-based authentication
- **Board Management**:
  - Create new boards
  - Share boards with collaborators
  - Export boards as PDF or PNG
- **Modern UI**: Clean and responsive interface

## 🚀 Technology Stack

- **Backend**:
  - NestJS - Progressive Node.js framework
  - Socket.IO - Real-time bidirectional event-based communication
  - Prisma - Next-generation ORM
  - PostgreSQL - Robust relational database
  - JWT - Secure authentication
  - Swagger/OpenAPI - API documentation

- **Frontend**:
  - HTML5 Canvas - Drawing functionality
  - Socket.IO Client - Real-time communication
  - Modern JavaScript - Clean and efficient code

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd whiteboard-app
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the application:
```bash
yarn start
```

## 🔑 Authentication

The application uses JWT-based authentication. To use the whiteboard:

1. Register a new user account
2. Log in to receive a JWT token
3. Use the token for WebSocket authentication

## 💡 API Documentation

API documentation is available through Swagger UI at:
```
http://localhost:3000/api
```

## 🎨 Whiteboard Features

### Drawing Tools
- **Color Selection**: Choose any color for drawing
- **Line Width**: Adjust stroke width from 1-20 pixels
- **Clear Canvas**: Reset the board with one click

### Real-time Collaboration
- Join boards using unique board IDs
- See other users' drawings in real-time
- Collaborative features like:
  - Drawing synchronization
  - Board state persistence
  - Multi-user support

### Export Options
- Export boards as PDF documents
- Save boards as PNG images
- Preserve all drawings and elements

## 🔒 Security

- JWT-based authentication
- Protected WebSocket connections
- Board access control
- Input validation and sanitization

## 📱 Mobile Support

The whiteboard is fully responsive and supports:
- Touch events for drawing
- Mobile-friendly interface
- Gesture recognition
- Cross-device compatibility

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Socket.IO for real-time capabilities
- Prisma team for the excellent ORM
- All contributors and users of this application
