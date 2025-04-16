import { NextResponse } from 'next/server';

// Mock data as fallback only if API fails completely
const mockLinkedInPosts = [
  {
    id: "fallback-1",
    author: "Upstart Engineering",
    date: new Date().toISOString(),
    content: "API connection issue. This is fallback content.",
    likes: 0,
    comments: 0,
    image: null
  }
];

// Add cache headers to ensure consistent rendering
export const revalidate = 3600; // Revalidate every hour (in seconds)

interface LinkedInPost {
  id: string;
  author: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  image: string | null;
}

export async function GET() {
  try {
    // Get LinkedIn API credentials from environment variables
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const apiUrl = process.env.LINKEDIN_API_URL;
    const organizationId = process.env.LINKEDIN_ORGANIZATION_ID;
    const apiVersion = process.env.LINKEDIN_API_VERSION || '202401';
    const timeout = parseInt(process.env.LINKEDIN_API_REQUEST_TIMEOUT || '5000', 10);
    
    // Check if environment variables are set
    if (!accessToken || !apiUrl || !organizationId) {
      console.error('LinkedIn API credentials missing');
      return NextResponse.json(
        { 
          error: 'LinkedIn API credentials missing',
          posts: [], 
          source: 'error',
          timestamp: new Date().toISOString()
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
          }
        }
      );
    }
    
    // Make a request to LinkedIn API to fetch organization posts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(
        `${apiUrl}/rest/posts?q=authors&authors=List(urn%3Ali%3Aorganization%3A${organizationId})&count=10&start=0`, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': apiVersion,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          next: { revalidate: 3600 }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`LinkedIn API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if the API response has the expected format
      if (!data.elements || !Array.isArray(data.elements)) {
        console.error('LinkedIn API returned unexpected data format:', JSON.stringify(data).substring(0, 200));
        throw new Error('LinkedIn API returned data in an unexpected format');
      }
      
      // Handle empty response
      if (data.elements.length === 0) {
        return NextResponse.json(
          {
            posts: [],
            source: 'api',
            timestamp: new Date().toISOString(),
            config: {
              apiUrl: apiUrl.substring(0, 10) + '...',
              organizationId,
              hasValidCredentials: true,
              message: 'No posts found for this organization'
            }
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
          }
        );
      }
      
      // Transform LinkedIn API response to our post format
      const posts: LinkedInPost[] = data.elements.map((post: any) => {
        // Extract post content - LinkedIn API has different content types
        let content = '';
        if (post.specificContent?.com.linkedin.ugc.ShareContent?.shareCommentary?.text) {
          content = post.specificContent.com.linkedin.ugc.ShareContent.shareCommentary.text;
        }
        
        // Extract post image if available
        let image = null;
        if (post.specificContent?.com.linkedin.ugc.ShareContent?.media?.[0]?.url) {
          image = post.specificContent.com.linkedin.ugc.ShareContent.media[0].url;
        }
        
        // Extract social activity counts
        const likes = post.socialDetail?.totalSocialActivityCounts?.numLikes || 0;
        const comments = post.socialDetail?.totalSocialActivityCounts?.numComments || 0;
        
        return {
          id: post.id,
          author: "Upstart Engineering", // Organization name
          date: post.created.time || new Date().toISOString(),
          content,
          likes,
          comments,
          image
        };
      });
      
      return NextResponse.json(
        {
          posts,
          source: 'api',
          timestamp: new Date().toISOString(),
          config: {
            apiUrl: apiUrl.substring(0, 10) + '...',  // Truncate for security
            organizationId,
            hasValidCredentials: true
          }
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          }
        }
      );
    } catch (apiError) {
      clearTimeout(timeoutId);
      console.error('LinkedIn API request failed:', apiError);
      throw apiError; // Rethrow for outer try/catch
    }
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch LinkedIn data', 
        posts: mockLinkedInPosts, 
        source: 'error-fallback',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
        }
      }
    );
  }
} 