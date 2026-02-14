# Vocabo - Vocabulary Learning App

A Next.js application for vocabulary learning, equipped with Vercel Speed Insights for performance monitoring.

## Features

- Built with Next.js 14 (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- **Vercel Speed Insights** integrated for performance tracking

## Speed Insights Integration

This project includes Vercel Speed Insights to track and monitor performance metrics. The integration follows the official Vercel documentation:

- The `SpeedInsights` component is added to the root layout (`app/layout.tsx`)
- Performance data will be automatically collected once deployed to Vercel
- Data can be viewed in the Vercel dashboard under the Speed Insights tab

### How Speed Insights Works

After deploying to Vercel:
1. Speed Insights routes will be available at `/_vercel/speed-insights/*`
2. The tracking script will automatically collect performance metrics
3. View your data in the Vercel dashboard > Speed Insights tab

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

To create a production build:

```bash
npm run build
```

## Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Once deployed, enable Speed Insights in your Vercel project dashboard to start tracking performance metrics.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Speed Insights Package](https://vercel.com/docs/speed-insights/package)