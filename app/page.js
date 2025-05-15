import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

async function getData() {
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

      // Sort randomly like the original code did
      return mediumPosts.sort(() => Math.random() - 0.5);
    }

    return [];
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
};

export default async function Home() {
  const blogs = await getData();

  return (
    <div suppressHydrationWarning >
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Blog blogs={blogs} />
    </div>
  )
};
