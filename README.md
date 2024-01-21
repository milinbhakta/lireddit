# lireddit

lireddit is a full-stack Reddit clone built with a variety of modern web technologies. It allows users to register, login, create posts, edit posts, delete posts, and vote on posts.

## Technologies used

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for building JavaScript applications.
- **GraphQL**: A query language for APIs and a runtime for executing those queries.
- **URQL/Apollo**: Libraries for interacting with a GraphQL API.
- **Node.js**: A JavaScript runtime for executing JavaScript code server-side.
- **PostgreSQL**: An open-source relational database.
- **MikroORM/TypeORM**: Object-relational mappers (ORM) for TypeScript.
- **Redis**: An open-source, in-memory data structure store used as a database, cache, and message broker.
- **TypeGraphQL**: A library for creating GraphQL APIs in TypeScript.
- **Material UI**: A popular React UI framework.

## Features

- **Register**: Users can create a new account.
- **Login**: Users can log in to their account.
- **Logout**: Users can log out of their account.
- **Create Post**: Users can create a new post.
- **Edit Post**: Users can edit their own posts.
- **Delete Post**: Users can delete their own posts.
- **Upvote Post**: Users can upvote other users' posts.
- **Downvote Post**: Users can downvote other users' posts.

## Frontend Routes

The application includes the following frontend routes:

- **News**: Displays the latest news from the Reuters RSS feed. Accessible at `/news`.
- **Stocks**: Shows current stock market information for NVDA. Accessible at `/stocks`.
- **Draw**: A drawing tool that uses ml5.js for AI-assisted drawing. Accessible at `/draw`.
- **Game**: A fun game for users to play. Accessible at `/game`.

## How to run

1. Clone the repo: `git clone https://github.com/milinbhakta/lireddit.git`
2. Navigate into the project directory: `cd lireddit`
3. Install the dependencies: `yarn install`
4. Start the development server: `yarn dev`
5. Open your web browser and visit `http://localhost:3000`

Please note that you will need to have Node.js, Yarn, and Docker installed on your machine before you can run this project locally.