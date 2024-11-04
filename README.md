# PodcastGen

PodcastGen is a web application that allows users to generate podcasts using AI-powered voices and content. The application leverages technologies like React, Firebase, and OpenAI to provide a seamless experience for creating and managing podcasts.

## Features

- **AI-Powered Voices**: Choose from a variety of high-quality AI voices to bring your content to life.
- **Dynamic Conversations**: Create engaging podcasts with multiple AI hosts.
- **User Authentication**: Secure user authentication using Firebase.
- **API Key Management**: Manage your OpenAI and Perplexity API keys directly from your profile.

## Prerequisites

- Node.js and npm installed on your machine.
- Firebase account for authentication and Firestore database.
- OpenAI and Perplexity API keys for generating content.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/podcastgen.git
   cd podcastgen
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add your API keys and Firebase configuration. Refer to the `.env` file format below:

   ```plaintext
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   VITE_PERPLEXITY_API_KEY=your_perplexity_api_key

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000` to view the application.

### Building for Production

To build the application for production, run:

npm run build


The production-ready files will be in the `dist` directory.

## Project Structure

- **src**: Contains the source code for the application.
  - **components**: Reusable React components.
  - **context**: Context providers for managing global state.
  - **pages**: Different pages of the application.
  - **utils**: Utility functions and helpers.

- **public**: Static files and assets.

- **dist**: Build output directory (ignored in version control).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [OpenAI](https://openai.com/)
- [NextUI](https://nextui.org/)

