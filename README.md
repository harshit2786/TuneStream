### Installation

To get started with the project, clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/harshit2786/tunestream.git
cd project-directory
npm install
```

## Environment Variables

Create a .env.local file in the root directory of your project and add the following:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_YOUTUBE_API_KEY=your-youtube-api-key
NEXT_WEBSOCKET_ENDPOINT=your-websocket-endpoint
NEXT_PUBLIC_WS=your-websocket-url
DATABASE_URL=your-database-url
```

## Getting Started

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## Run using Docker

To run the application using Docker, follow these steps:

1. Build the Docker image:

```bash
docker build -t tunestream .
```
2. Run the Docker container:

```bash
docker run -p 3000:3000 --env-file .env tunestream
```

### Usage

TuneStream offers the following features:

* Real-Time Music Queuing: Developed using Next.js for a responsive frontend and PostgreSQL with Prisma ORM for robust data management.
* Secure User Authentication: Integrated NextAuth.js for secure user authentication, allowing users to create music spaces, add songs, and vote on tracks.
* State Management: Utilized Recoil for efficient state management across the application.
* Real-Time Updates: Implemented a FastAPI WebSocket server for real-time updates on upvotes, downvotes, and new song additions, enhancing user interaction during events.

## Key Features

* Create Music Spaces: Users can create and manage their own music spaces for parties and events.
* Add Songs: Participants can add songs to the queue, ensuring a dynamic and enjoyable playlist.
* Vote on Tracks: Users can upvote or downvote tracks, allowing the community to decide the playlist's flow.
* Real-Time Interaction: Changes to the queue and voting results are updated in real-time, providing a seamless user experience.