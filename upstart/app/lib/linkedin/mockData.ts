export interface LinkedInPost {
  id: string;
  author: string;
  date: string;
  content: string;
  link?: string;
}

export const mockLinkedInPosts: LinkedInPost[] = [
  {
    id: "1",
    author: "Jane Doe",
    date: "2023-12-15T10:30:00Z",
    content: "Excited to announce that I've joined UpStart as a Senior Product Manager! Looking forward to building innovative solutions in the fintech space.",
    link: "https://linkedin.com/posts/janedoe-1"
  },
  {
    id: "2",
    author: "John Smith",
    date: "2023-12-10T14:20:00Z",
    content: "Just published my thoughts on the future of AI in financial services. Check out my latest article on the UpStart blog!",
    link: "https://linkedin.com/posts/johnsmith-2"
  },
  {
    id: "3",
    author: "UpStart",
    date: "2023-12-05T09:15:00Z",
    content: "We're thrilled to announce our latest funding round of $50M led by Acme Ventures. This will help us accelerate our mission to make financial services more accessible for everyone.",
    link: "https://linkedin.com/posts/upstart-3"
  },
  {
    id: "4",
    author: "Sarah Johnson",
    date: "2023-11-28T16:45:00Z",
    content: "Had a great time speaking at the FinTech Summit about how UpStart is using machine learning to revolutionize credit scoring. Thanks to everyone who attended!",
    link: "https://linkedin.com/posts/sarahjohnson-4"
  },
  {
    id: "5",
    author: "Michael Chang",
    date: "2023-11-20T11:10:00Z",
    content: "Proud of our engineering team for shipping the new dashboard feature. The feedback from users has been incredible!",
    link: "https://linkedin.com/posts/michaelchang-5"
  }
]; 