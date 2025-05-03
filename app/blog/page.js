// @flow strict

import { personalData } from "@/utils/data/personal-data";
import BlogCard from "../components/homepage/blog/blog-card";

async function getBlogs() {
  try {
    // Fetch Medium RSS feed for @siddheshvari
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@siddheshvari`, { 
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Medium data');
    }

    const data = await res.json();
    
    // Transform Medium feed items to match your blog card component's expected format
    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const mediumPosts = data.items.map(item => {
        // Extract first image from content if thumbnail is missing
        let coverImage = item.thumbnail;
        
        if (!coverImage || coverImage === '') {
          // Try to extract image from content
          const imgRegex = /<img[^>]+src="([^">]+)"/g;
          const matches = [...item.content.matchAll(imgRegex)];
          if (matches.length > 0) {
            coverImage = matches[0][1];
          } else {
            // Default image if no image found
            coverImage = '/png/placeholder.png';
          }
        }
        
        // Clean description (remove HTML tags)
        const cleanDescription = item.description
          .replace(/<[^>]*>?/gm, '')
          .replace(/&nbsp;/g, ' ')
          .substring(0, 150) + '...';
          
        return {
          title: item.title,
          description: cleanDescription,
          cover_image: coverImage,
          url: item.link,
          published_at: item.pubDate,
          reading_time_minutes: Math.ceil(item.content.split(' ').length / 200), // Estimate reading time
          public_reactions_count: 0, // Medium doesn't provide this in the feed
          comments_count: 0 // Medium doesn't provide this in the feed
        };
      });
      
      return mediumPosts;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
};

async function page() {
  const blogs = await getBlogs();

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All Blog
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {
          blogs.map((blog, i) => (
            <BlogCard blog={blog} key={i} />
          ))
        }
      </div>
    </div>
  );
};

export default page;