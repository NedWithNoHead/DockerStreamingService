# Horn Pub Video Streaming System

## Introduction

Horn Pub is a simple, containerized video streaming system built as a microservices architecture. It allows users to upload, store, and stream video content through a web interface. This project demonstrates the use of multiple services working together to provide a complete video streaming solution.

## Features

- User authentication (login and registration)
- Video upload
- Video streaming
- Video listing
- Database cleanup

## Architecture

The system consists of the following microservices:

1. Authentication Service
2. Upload Service
3. Streaming Service
4. File System Service
5. MySQL Database
6. Web Server (Python HTTP Server)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker
- Docker Compose
- Python 3.x
- Web browser (Chrome, Firefox, or Safari recommended)

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/horn-pub-video-streaming.git
   cd horn-pub-video-streaming
   ```

2. Build and start the Docker containers:
   ```
   docker-compose up --build
   ```

3. Start the Python web server:
   ```
   python server.py
   ```

## Usage

1. Open a web browser and navigate to `http://localhost:8000`
2. You will see the Horn Pub login page. If you're a new user, use the Sign Up form to create an account.
3. After logging in, you'll be redirected to the video streaming page where you can:
   - Upload new videos
   - View the list of available videos
   - Play videos
   - Perform database cleanup

## Service Details

### Authentication Service
- Port: 3000
- Handles user registration and login

### Upload Service
- Port: 3001
- Manages video file uploads

### Streaming Service
- Port: 3002
- Handles video streaming and listing

### File System Service
- Port: 3003
- Manages file system operations and database cleanup

### MySQL Database
- Port: 3306
- Stores user and video metadata

## Database Management

To access the MySQL database:

```
docker exec -it 3495-assignment1-mysql-1 mysql -uroot -prootpassword videodb
```

To manually clean up the database (keep only the 5 most recent videos):

```sql
DELETE FROM videos WHERE id NOT IN (SELECT id FROM (SELECT id FROM videos ORDER BY uploaded_at DESC LIMIT 5) t);
```

## Troubleshooting

1. If you encounter CORS issues, ensure all services are running and the URLs in the HTML files match the service ports.
2. For video playback issues, check the browser console for error messages and ensure the video files are correctly stored in the `videos` directory.
3. If the database cleanup doesn't work, verify that the File System Service has the correct permissions to access the database and video files.

## Future updates - Security 

This project is a demonstration and lacks several security features that would be necessary for a production environment, including:

- Proper session management
- HTTPS implementation
- Input validation and sanitization
- Protection against SQL injection
- Robust error handling

## Contributing

Contributions to improve Horn Pub are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

