"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";

// Preloader component
function Preloader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Trigger onComplete after animation finishes
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);  // Loading bar animation is 2s + 500ms buffer
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className={styles.preloaderContainer}>
      <img 
        src="/preloader.svg" 
        alt="Loading Upstart Engineering"
        className={styles.preloaderSvg}
      />
    </div>
  );
}

// Update component to track lastUpdated time from API
function ClientOnlyTime({ timestamp }: { timestamp?: string }) {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    // Set initial time from API response timestamp if available
    if (timestamp) {
      try {
        const date = new Date(timestamp);
        setTime(date.toLocaleTimeString());
      } catch (error) {
        console.error('Invalid timestamp format:', error);
        setTime(new Date().toLocaleTimeString());
      }
    } else {
      // Fallback to current time if no timestamp provided
      setTime(new Date().toLocaleTimeString());
    }
    
    // Optional: add a timer to keep the time updated with relative time
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [timestamp]);
  
  return <span>{time}</span>;
}

// LinkedIn API integration helper function
const fetchLinkedInData = async () => {
  try {
    // Fetch from our internal API endpoint that handles LinkedIn API communication
    const response = await fetch('/api/linkedin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch LinkedIn data');
    }
    
    const data = await response.json();
    console.log('LinkedIn data source:', data.source);
    
    // Check if we got data from the API
    if (data.source === 'api') {
      console.log('LinkedIn API connected successfully!');
    }
    
    return data.posts;
  } catch (error) {
    console.error("Error fetching LinkedIn data:", error);
    return mockLinkedInPosts; // Fallback to mock data
  }
};

// Mock LinkedIn data as fallback
const mockLinkedInPosts = [
  {
    id: 1,
    author: "Upstart Engineering",
    date: "2 days ago",
    content: "Excited to announce that we've secured our 72nd patent this year! Our team continues to push the boundaries of biomedical engineering. #MedicalInnovation #Patents",
    likes: 84,
    comments: 12,
    image: "/linkedin-post-1.svg"
  },
  {
    id: 2,
    author: "Upstart Engineering",
    date: "1 week ago",
    content: "Our team presented at the International Biomedical Engineering Conference today. Great discussions on the future of insulin delivery systems and continuous glucose monitoring. #BiomedicalEngineering #Healthcare",
    likes: 56,
    comments: 8,
    image: null
  },
  {
    id: 3,
    author: "Upstart Engineering",
    date: "2 weeks ago",
    content: "We're hiring! Upstart is looking for talented biomedical engineers to join our patent development team. Visit our careers page to learn more. #Hiring #BiomedicalJobs #MedTech",
    likes: 112,
    comments: 23,
    image: "/linkedin-post-3.svg"
  }
];

export default function Home() {
  const [posts, setPosts] = useState(mockLinkedInPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [apiSource, setApiSource] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  
  // Scroll functionality
  const mainContentRef = useRef<HTMLElement>(null);
  
  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Set mounted state and handle preloader
  useEffect(() => {
    setIsMounted(true);
    
    // Initialize preloader timeout
    const preloaderTimer = setTimeout(() => {
      setPreloaderComplete(true);
    }, 2500); // Loading bar animation is 2s + 500ms buffer
    
    return () => {
      setIsMounted(false);
      clearTimeout(preloaderTimer);
    };
  }, []);
  
  // LinkedIn API integration
  useEffect(() => {
    const loadLinkedInData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch LinkedIn data from our API endpoint
        const response = await fetch('/api/linkedin');
        const data = await response.json();
        
        // Update state based on API response
        setPosts(data.posts);
        setApiSource(data.source);
        setApiAvailable(data.source === 'api' && data.config?.hasValidCredentials);
        setLastUpdated(data.timestamp || null);
        setError(null);
      } catch (err) {
        console.error("Error loading LinkedIn data:", err);
        setError("Failed to load LinkedIn updates");
        setApiAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only load data on client-side
    if (isMounted) {
      loadLinkedInData();
      
      // Set up periodic refresh
      const refreshInterval = setInterval(
        loadLinkedInData, 
        parseInt(process.env.NEXT_PUBLIC_LINKEDIN_REFRESH_INTERVAL || '3600000', 10)
      );
      
      return () => clearInterval(refreshInterval);
    }
  }, [isMounted]);

  // Add custom fonts
  useEffect(() => {
    // Add Exo 2 font for modern engineering look
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className={styles.page}>
      {isMounted && (
        <div className={`${styles.preloaderContainer} ${preloaderComplete ? styles.preloaderHidden : ''}`}>
          <img 
            src="/preloader.svg" 
            alt="Loading Upstart Engineering"
            className={styles.preloaderSvg}
          />
        </div>
      )}
      
      <header className={styles.header}>
        <div className={styles.logoContainer}>
        <Image
            src="/logo.svg"
            alt="Upstart Logo"
            width={200}
            height={60}
          priority
        />
        </div>
        <nav className={styles.nav}>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#patents">Patents</a>
          <a href="#linkedin">Updates</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <video
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/blueprint-video.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <object
              data="/blueprint-animation.svg"
              type="image/svg+xml"
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            ></object>
          </video>
          <div className={styles.heroOverlay}></div>
          <div className={styles.blueprintOverlay}></div>
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Upstart Engineering</h1>
          <p className={styles.heroSubtitle}>
            Pioneering Biomedical Device Patents with Precision Engineering Excellence
          </p>
          
          <div className={styles.heroBlueprint}>
            <div className={styles.heroBlueprintContent}>
              <div className={styles.heroBlueprintImage}>
            <Image
                  src="/blueprint-diagram.svg"
                  alt="Medical Device Blueprint"
                  width={400}
                  height={400}
                  priority
                />
                <span className={styles.heroAnnotation + ' ' + styles.annotation1}>
                  Precision Engineering
                </span>
                <span className={styles.heroAnnotation + ' ' + styles.annotation2}>
                  Patent Protected
                </span>
              </div>
              
              <div className={styles.heroDetails}>
                <h2>Creating the Future of Medical Devices</h2>
                <p>
                  Our team combines specialized engineering knowledge with patent expertise to 
                  develop and protect cutting-edge biomedical innovations. We transform concepts 
                  into patented technologies that advance healthcare delivery and improve patient outcomes.
                </p>
                
                <div className={styles.heroMetrics}>
                  <div className={styles.heroMetricItem} style={{"--i": 0} as React.CSSProperties}>
                    <span className={styles.heroMetricNumber}>72</span>
                    <span className={styles.heroMetricLabel}>Patents Secured</span>
                  </div>
                  <div className={styles.heroMetricItem} style={{"--i": 1} as React.CSSProperties}>
                    <span className={styles.heroMetricNumber}>14</span>
                    <span className={styles.heroMetricLabel}>Industries</span>
                  </div>
                  <div className={styles.heroMetricItem} style={{"--i": 2} as React.CSSProperties}>
                    <span className={styles.heroMetricNumber}>8</span>
                    <span className={styles.heroMetricLabel}>Expert Engineers</span>
                  </div>
                </div>
                
                <a href="#contact" className={styles.heroButton}>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.scrollIndicator} onClick={scrollToContent}>
          <Image src="/down-arrow.svg" alt="Scroll down" width={30} height={30} />
          <span className={styles.scrollText}>Scroll to explore</span>
        </div>
      </section>

      <main ref={mainContentRef}>
        <section className={`blueprint-container ${styles.sectionContainer}`}>
          <span className="section-reference top-left">SEC-001</span>
          <span className="section-reference top-right">REF: MED-237</span>
          <h2 className="blueprint-title">Innovative Medical Device Patents</h2>
          <p className={styles.intro}>
            Specializing in patent creation and protection for cutting-edge biomedical engineering devices.
            Our team of engineers and patent attorneys secured <span className="blueprint-callout" data-note="72 patents in 2023">72 patents</span> in the past year.
          </p>

          <div className={styles.blueprintStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>72</span>
              <span className={styles.statLabel}>Patents Secured</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>14</span>
              <span className={styles.statLabel}>Industries</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>95%</span>
              <span className={styles.statLabel}>Success Rate</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>8</span>
              <span className={styles.statLabel}>Expert Engineers</span>
            </div>
          </div>

          <div className={styles.featuredDevice}>
            <div className="blueprint-device">
              <div className="blueprint-stamp">
                UPSTART ENGINEERING
              </div>
              <h3 className="blueprint-subtitle">Smart Insulin Delivery System</h3>
              
              <div className={styles.deviceBlueprint}>
                <Image
                  src="/medical-device.svg"
                  alt="Medical Device Blueprint"
                  width={240}
                  height={400}
                  className={styles.deviceImage}
                />
              </div>

              <div className="blueprint-notes">
                The Smart Insulin Delivery System (SIDS) provides continuous glucose monitoring and automated insulin delivery. 
                Patented technology allows for precise dosing based on real-time body metrics and machine learning algorithms.
              </div>

              <div className={styles.deviceSpecs}>
                <h4>Device Specifications:</h4>
                <ul>
                  <li>Bluetooth Low Energy 5.2 connectivity with 10m range</li>
                  <li>Li-Ion 1200mAh battery with 7-day life (168 hours)</li>
                  <li>Waterproof (IP67 rated) medical-grade ABS housing</li>
                  <li>Continuous glucose monitoring with ±0.1 mmol/L accuracy</li>
                  <li>Smart insulin delivery algorithm with 0.5-50 U/hr range</li>
                  <li>Mobile app integration with alert system</li>
                  <li>Weight: 78g / Dimensions: 180mm × 300mm × 15mm</li>
                  <li>OLED 1.44" display (128×128 resolution)</li>
                </ul>
              </div>
              
              <div className="approval-stamp"></div>
            </div>
          </div>
        </section>

        <section id="about" className={`blueprint-container ${styles.sectionContainer}`}>
          <span className="section-reference top-left">SEC-002</span>
          <h2 className="blueprint-subtitle">About Upstart</h2>
          <p>
            At Upstart, we combine engineering expertise with patent law knowledge to create
            comprehensive intellectual property solutions for biomedical innovators.
            Our team has successfully secured 72 patents for medical devices ranging from
            diagnostic equipment to implantable technologies.
          </p>
          
          <div className={styles.timelineContainer}>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2018</div>
                <div className={styles.timelineContent}>
                  <h3>Company Founded</h3>
                  <p>Upstart Engineering established in Boston</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2020</div>
                <div className={styles.timelineContent}>
                  <h3>First Major Patent</h3>
                  <p>Secured patent for glucose monitoring system</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2022</div>
                <div className={styles.timelineContent}>
                  <h3>Team Expansion</h3>
                  <p>Grew to 8 specialized engineers</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2023</div>
                <div className={styles.timelineContent}>
                  <h3>Record Year</h3>
                  <p>Secured 72 patents across multiple industries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className={`blueprint-container ${styles.sectionContainer}`}>
          <span className="section-reference top-left">SEC-003</span>
          <h2 className="blueprint-subtitle">Our Services</h2>
          <div className={styles.services}>
            <div className={styles.service}>
              <h3>Patent Research</h3>
              <p>Comprehensive analysis of existing patents in your field to identify opportunities and avoid infringement.</p>
            </div>
            <div className={styles.service}>
              <h3>Engineering Documentation</h3>
              <p>Detailed technical drawings, specifications, and prototypes that meet patent office requirements.</p>
            </div>
            <div className={styles.service}>
              <h3>Patent Filing</h3>
              <p>Complete preparation and submission of patent applications with expert legal guidance.</p>
            </div>
            <div className={styles.service}>
              <h3>IP Defense</h3>
              <p>Strategies and documentation to protect your intellectual property from infringement.</p>
            </div>
          </div>
        </section>

        <section id="patents" className={`blueprint-container ${styles.sectionContainer}`}>
          <span className="section-reference top-left">SEC-004</span>
          <h2 className="blueprint-subtitle">Our Patent Portfolio</h2>
          <div className={styles.patentCategories}>
            <div className={styles.patentCategory}>
              <h3>Medical Devices</h3>
              <ul>
                <li>Insulin Delivery Systems</li>
                <li>Patient Monitoring Equipment</li>
                <li>Implantable Technology</li>
                <li>Diagnostic Tools</li>
              </ul>
              <span className={styles.patentCount}>32 Patents</span>
            </div>
            <div className={styles.patentCategory}>
              <h3>Biotechnology</h3>
              <ul>
                <li>Drug Delivery Systems</li>
                <li>Genetic Testing Devices</li>
                <li>Tissue Engineering</li>
                <li>Biomanufacturing</li>
              </ul>
              <span className={styles.patentCount}>18 Patents</span>
            </div>
            <div className={styles.patentCategory}>
              <h3>Healthcare IT</h3>
              <ul>
                <li>Medical Data Security</li>
                <li>Remote Monitoring Systems</li>
                <li>AI Diagnostics</li>
                <li>Electronic Health Records</li>
              </ul>
              <span className={styles.patentCount}>22 Patents</span>
            </div>
          </div>
        </section>

        {/* LinkedIn Updates Section */}
        <section id="linkedin" className={`blueprint-container ${styles.sectionContainer}`}>
          <span className="section-reference top-left">SEC-005</span>
          <h2 className="blueprint-subtitle">LinkedIn Updates</h2>
          <div className={styles.linkedinHeader}>
            <div className={styles.linkedinCompanyInfo}>
              <Image 
                src="/linkedin-icon.svg" 
                alt="LinkedIn" 
                width={24} 
                height={24} 
                className={styles.linkedinIcon}
              />
              <h3>Upstart Engineering</h3>
              <span className={styles.linkedinFollowers}>
                <a 
                  href="https://www.linkedin.com/company/upstart-engineering" 
            target="_blank"
            rel="noopener noreferrer"
                >
                  View on LinkedIn
                </a>
              </span>
            </div>
            {isMounted && (
              <div className={styles.linkedinStatusIndicator}>
                {isLoading && <span className={styles.loadingIndicator}>Loading updates...</span>}
                {apiAvailable && <span className={styles.apiStatus}>API Connected</span>}
                {error && <span className={styles.errorIndicator}>{error}</span>}
              </div>
            )}
            <a href="https://www.linkedin.com/company/upstart-engineering" target="_blank" rel="noopener noreferrer" className={styles.linkedinFollowBtn}>
              Follow
          </a>
        </div>
          
          <div className={styles.linkedinFeed}>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div key={post.id || index} className={styles.linkedinPost}>
                  <div className={styles.postHeader}>
                    <div className={styles.postAuthor}>
                      <div className={styles.authorAvatar}>
                        <Image src="/logo.svg" alt="Upstart" width={40} height={40} />
                      </div>
                      <div className={styles.authorInfo}>
                        <h4>{post.author}</h4>
                        <span className={styles.postDate}>
                          {post.date ? new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.postContent}>
                    <p>{post.content}</p>
                    {post.image && (
                      <div className={styles.postImage}>
                        <Image 
                          src={post.image.startsWith('/') ? post.image : '/linkedin-placeholder.svg'} 
                          alt="Post image" 
                          width={500} 
                          height={300}
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = '/linkedin-placeholder.svg';
                          }} 
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.postStats}>
                    <div className={styles.postReactions}>
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
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noPostsMessage}>
                {isLoading ? 
                  "Loading posts..." : 
                  "No posts available. Please check LinkedIn API configuration."}
              </div>
            )}
          </div>
          
          {isMounted && (
            <div className={styles.linkedInApiNote}>
              <div className={styles.blueprintNote}>
                <p>
                  <strong>LinkedIn API Integration:</strong> {apiAvailable 
                    ? "LinkedIn API is connected and data is refreshing automatically."
                    : "LinkedIn API connection failed. Check your API configuration."
                  }
                </p>
                <div className={styles.apiStatusDetails}>
                  <div className={styles.apiStatusItem}>
                    <span className={styles.apiLabel}>API Status:</span>
                    <span className={`${styles.apiValue} ${apiAvailable ? styles.apiActive : styles.apiInactive}`}>
                      {apiAvailable ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div className={styles.apiStatusItem}>
                    <span className={styles.apiLabel}>Data Source:</span>
                    <span className={styles.apiValue}>{apiSource || 'Unknown'}</span>
                  </div>
                  <div className={styles.apiStatusItem}>
                    <span className={styles.apiLabel}>Last Updated:</span>
                    <span className={styles.apiValue}><ClientOnlyTime timestamp={lastUpdated || undefined} /></span>
                  </div>
                  <div className={styles.apiStatusItem}>
                    <span className={styles.apiLabel}>Refresh Interval:</span>
                    <span className={styles.apiValue}>
                      {isMounted ? `${(parseInt(process.env.NEXT_PUBLIC_LINKEDIN_REFRESH_INTERVAL || '3600000', 10) / 60000)} minutes` : '60 minutes'}
                    </span>
                  </div>
                </div>
                <p className={styles.apiConfigNote}>
                  API Endpoint: <code>/api/linkedin</code>
                </p>
              </div>
            </div>
          )}
        </section>

        <section id="contact" className={`blueprint-container ${styles.sectionContainer}`}>
          <span className="section-reference top-left">SEC-006</span>
          <h2 className="blueprint-subtitle">Contact Us</h2>
          <div className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Your Email" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="Tell us about your project"></textarea>
            </div>
            <button className={styles.submitButton}>Submit</button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
          <Image
              src="/logo.svg"
              alt="Upstart Logo"
              width={150}
              height={45}
            />
          </div>
          <div className={styles.footerLinks}>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#patents">Patents</a>
            <a href="#linkedin">Updates</a>
            <a href="#contact">Contact</a>
          </div>
          <div className={styles.footerAddress}>
            <p>123 Innovation Way</p>
            <p>Medical District</p>
            <p>Boston, MA 02115</p>
            <p>contact@upstart.com</p>
          </div>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Upstart Engineering. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
