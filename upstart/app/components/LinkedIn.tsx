import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';

// Define the post interface to match our API response
export interface LinkedInPost {
  id: string;
  author: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  image: string | null;
}

type LinkedInProps = {
  posts?: LinkedInPost[];
  isLoading?: boolean;
  error?: string | null;
  timestamp?: string;
  apiAvailable?: boolean;
}

export default function LinkedIn({ 
  posts = [], 
  isLoading = false, 
  error = null,
  timestamp,
  apiAvailable = false
}: LinkedInProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Don't render during SSR to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  // Format the timestamp if available
  const formattedTime = timestamp ? new Date(timestamp).toLocaleString() : 'Unknown';

  if (error) {
    return <div className={styles.linkedInError}>Error loading LinkedIn updates: {error}</div>;
  }

  return (
    <div className={styles.linkedInContainer}>
      <div className={styles.linkedInHeader}>
        <h2>LinkedIn Updates</h2>
        {timestamp && <div className={styles.lastUpdated}>Last updated: {formattedTime}</div>}
        {apiAvailable && <div className={styles.apiStatus}>API Connected</div>}
      </div>
      
      {isLoading ? (
        <div className={styles.linkedInLoading}>Loading LinkedIn updates...</div>
      ) : (
        <>
          {posts.length > 0 ? (
            <ul className={styles.linkedInList}>
              {posts.map((post, index) => (
                <li key={post.id || index} className={styles.linkedInItem}>
                  <div className={styles.postHeader}>
                    <span className={styles.postAuthor}>{post.author}</span>
                    <span className={styles.postDate}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className={styles.postContent}>{post.content}</p>
                  {post.image && (
                    <div className={styles.postImage}>
                      <Image 
                        src={post.image.startsWith('/') ? post.image : '/linkedin-placeholder.svg'} 
                        alt="Post image" 
                        width={500} 
                        height={300}
                        onError={(e) => {
                          // @ts-ignore - This is fine for our purposes
                          e.target.src = '/linkedin-placeholder.svg';
                        }} 
                      />
                    </div>
                  )}
                  <div className={styles.postStats}>
                    <span className={styles.postLikes}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--blueprint-accent)" />
                      </svg>
                      {post.likes || 0}
                    </span>
                    <span className={styles.postComments}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="var(--blueprint-accent)" />
                      </svg>
                      {post.comments || 0}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noPostsMessage}>
              No posts available. Please check LinkedIn API configuration.
            </div>
          )}
        </>
      )}
    </div>
  );
} 