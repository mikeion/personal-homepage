# Research Publications Management System

A comprehensive system for managing and showcasing research publications, built with Next.js, Prisma, and Railway.

## Features

- **Public Research Page**: Showcase publications with filtering by year, type, research area, and keywords
- **Admin Portal**: Secure admin interface for managing publications
- **Database Integration**: Prisma ORM with PostgreSQL on Railway
- **AI Integration**: OpenAI integration for generating publication descriptions and keywords

## Tech Stack

- **Frontend**: Next.js 14 with React 18, TypeScript, and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL on Railway with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **AI**: OpenAI API integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (Railway recommended)
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/research-publications.git
   cd research-publications
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting Up Admin User

For the initial setup, you can use the demo credentials:
- Email: admin@example.com
- Password: password

In a production environment, you should update these credentials in the database.

## Deployment

### Railway Deployment

1. Create a new project on [Railway](https://railway.app/)
2. Add a PostgreSQL database
3. Connect your GitHub repository
4. Set the required environment variables
5. Deploy the application

## Project Structure

```
/
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router
│   │   ├── admin/       # Admin portal pages
│   │   ├── api/         # API routes
│   │   ├── research/    # Public research page
│   ├── lib/             # Utility functions and shared code
│   │   ├── auth.ts      # NextAuth configuration
│   │   ├── prisma.ts    # Prisma client
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Railway](https://railway.app/)
- [NextAuth.js](https://next-auth.js.org/)
- [OpenAI](https://openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)
