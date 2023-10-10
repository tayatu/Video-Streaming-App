# Video Streaming App - README

Welcome to the Video Streaming App project! This application is a full-stack video streaming platform built using Node.js, Mongoose, and React. It allows users to upload, view, edit, and delete videos, as well as subscribe to other users and receive video recommendations based on their viewing history. Below, you'll find information on how to set up and use the application.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Technical Stack](#technical-stack)
3. [Features](#features)
4. [Folder Structure](#folder-structure)
5. [Authentication](#authentication)
6. [MVC Architecture](#mvc-architecture)
7. [Video Upload and Conversion](#video-upload-and-conversion)
8. [User Subscriptions](#user-subscriptions)
9. [Recommendation System](#recommendation-system)
10. [Searching for Videos](#searching-for-videos)


Apologies for the oversight. You are correct; the "video-streaming-app" project indeed has two folders, "server" and "client." I'll update the "Getting Started" section to reflect this accurately:

## Getting Started

To run the Video Streaming App locally, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies for the server (Node.js):
   ```
   cd video-streaming-app/server
   npm install
   ```

3. Set up your MongoDB database and configure the connection in the `server/config/db.js` file.

4. Start the server:
   ```
   npm start
   ```

5. Install dependencies for the client (React):
   ```
   cd ../client
   npm install
   ```

6. Start the React client:
   ```
   npm start
   ```

Your Video Streaming App should now be running locally. You can access it by opening a web browser and navigating to `http://localhost:3000`.

## Technical Stack

The Video Streaming App is built using the following technologies and tools:

- Node.js: Used for server-side scripting and handling backend logic.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB, used for database management.
- React: A JavaScript library for building user interfaces.
- Redux: A state management library for managing application state efficiently.

## Features

The Video Streaming App offers the following features:

1. **Authentication**: Users can register, log in, and log out. Authentication ensures that only authorized users can access certain features.

2. **MVC Architecture**: The application follows the Model-View-Controller (MVC) architectural pattern. Here's a breakdown of the components:

    - **Model**: Represents the data and business logic of the application. It includes database models for videos, users, and subscriptions.

    - **View**: Handles the presentation and user interface. React components are responsible for rendering the user interface.

    - **Controller**: Manages the flow of data between the Model and the View. It handles user requests, routes them to the appropriate functions, and updates the Model and View accordingly.

3. **Video Upload and Conversion**: Users can upload videos and thumbnails to the platform. The application automatically converts these videos into different resolutions, allowing users to customize their viewing experience.

4. **User Subscriptions**: Users can subscribe to other users on the platform. Subscribed users will see the uploaded videos from the users they follow in their feed.

5. **Recommendation System**: The platform recommends videos to users based on their viewing history and preferences. This enhances user engagement and provides personalized content.

6. **Video Search**: Users can search for videos based on their titles.

7. **Like Videos**: Users can like videos they enjoy, providing feedback and engagement.

8. **Trending Videos**: Users can see trending videos, helping them discover popular and relevant content.

9. **Thumbnail Compression**: Thumbnails uploaded to the platform are automatically compressed to optimize storage and loading times.

10. **Fixed Pagination**: The number of videos shown on a page is fixed and implements pagination to efficiently manage and display large amounts of content.

video-streaming-app/
|-- client/                # React frontend
|   |-- src/
|   |   |-- components/    # React components
|   |   |-- pages/         # Application pages
|   |   |-- redux/         # Redux store setup and actions
|   |   |-- ...
|-- server/                # Node.js backend
|   |-- controllers/       # Controllers for handling requests
|   |-- models/            # Database models
|   |-- routes/            # API routes
|   |-- public/               # Public assets
|   |-- ...
|-- README.md              # Project documentation

---
