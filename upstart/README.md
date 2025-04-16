# Upstart Engineering - Biomedical Engineering Patent Solutions

A professional website for Upstart Engineering, a biomedical engineering firm specializing in patent creation and protection. The design features a blueprint-style layout with an offwhite background and blue grid lines, showcasing medical device patents. The company has secured 72 patents in the last year.

## Features

- Blueprint-themed design with detailed grid pattern background
- Animated elements with subtle transitions and effects
- Comprehensive medical device technical drawings with precise specifications
- Section references and technical annotations mimicking engineering blueprints
- Responsive layout for all screen sizes
- Interactive service and patent portfolio sections
- Company timeline with key milestones
- LinkedIn integration for company updates and posts (API-ready)
- Contact form for inquiries
- Custom SVG graphics for logo and detailed medical device illustrations

## Getting Started

First, create an `.env.local` file with the LinkedIn API credentials:

```
# LinkedIn API Credentials
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/api/auth/callback/linkedin
LINKEDIN_ACCESS_TOKEN=your_access_token

# LinkedIn API Endpoints
LINKEDIN_API_URL=https://api.linkedin.com/v2
LINKEDIN_ORGANIZATION_ID=your_organization_id

# API Request Settings
LINKEDIN_API_VERSION=202401
LINKEDIN_API_REQUEST_TIMEOUT=5000

# Refresh Settings (in milliseconds)
LINKEDIN_DATA_REFRESH_INTERVAL=3600000
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Technology Stack

- Next.js 15.3
- React 19
- TypeScript
- CSS Modules
- SVG Animations
- LinkedIn API integration (prepared for implementation)

## Design Elements

The website features:

- Offwhite background with faint blue grid lines mimicking engineering blueprints
- Multiple grid layers with different scales and opacities
- Detailed technical drawings of medical devices with specifications
- Measurement indicators, annotations, and reference numbers
- "Patent Pending" stamps and approval markings
- Engineering notes and component specifications
- Blueprint-style typography and colors
- Subtle animations and hover effects
- Company milestone timeline
- Patent portfolio breakdown
- Social media integration with LinkedIn posts

## Project Structure

- `/app` - Main application code
  - `/app/page.tsx` - Homepage component with client-side interactions
  - `/app/api/linkedin/route.ts` - LinkedIn API endpoint
- `/app/page.module.css` - Styles for the homepage
- `/app/globals.css` - Global styles including blueprint grid pattern
- `/public` - Static assets including SVG graphics
- `.env.local` - Environment variables for LinkedIn API integration

## Custom Graphics

- `logo.svg` - Company logo with blueprint-style design and patent count badge
- `medical-device.svg` - Detailed technical drawing of a biomedical device prototype with specifications, annotations, and measurements
- `linkedin-icon.svg` - LinkedIn icon in blueprint style
- `linkedin-post-1.svg` - SVG image for LinkedIn post featuring patent design
- `linkedin-post-3.svg` - SVG image for LinkedIn hiring post

## LinkedIn Integration

The website includes a LinkedIn integration section that connects to the LinkedIn API:

- Uses Next.js API routes to handle API requests securely
- Displays real-time data from LinkedIn when properly configured
- Falls back to mock data if API credentials are not available
- Shows API connection status and data source information
- Refreshes data automatically at configurable intervals

To enable the LinkedIn API integration:
1. Create an application on the [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Get your OAuth 2.0 credentials and access token
3. Add them to your `.env.local` file
4. Restart the application

## Animation Features

- Fading elements on page load
- Pulsing blueprint elements
- Interactive hover effects on services and device specifications
- Subtle grid line opacity animations
- Timeline component with staggered animation
- Social media post hover effects
- API status indicators with loading animations

## License

This project is licensed under the MIT License.

## About the Company

Upstart Engineering specializes in creating patent documentation for biomedical engineering devices. They combine engineering expertise with patent law knowledge to secure intellectual property for medical innovators. The company has successfully secured 72 patents in the last year across multiple industries including medical devices, biotechnology, and healthcare IT.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
