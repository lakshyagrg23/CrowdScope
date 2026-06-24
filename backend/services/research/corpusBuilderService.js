import { fetchRedditData } from "../reddit/postFetchingService.js";

/**
 * Builds a structured text corpus from Reddit discussion data.
 * 
 * @param {string} entity The primary entity (e.g. Notion) to query for posts.
 * @param {Array<string>} subreddits Array of subreddit names to search.
 * @param {Object} config The depth configuration (subredditLimit, postLimit, commentLimit).
 * @returns {Promise<string>} The formatted corpus text.
 */
export const buildDiscussionCorpus = async (entity, subreddits, config) => {
  const { postLimit, commentLimit } = config;

  console.log(`CorpusBuilder: Fetching up to ${postLimit} posts and ${commentLimit} comments per subreddit for entity '${entity}' in subreddits:`, subreddits);

  const posts = await fetchRedditData(subreddits, entity, postLimit, commentLimit);

  if (!posts || posts.length === 0) {
    return `No discussions or posts were found on Reddit matching ${entity}.`;
  }

  let corpus = `COMMUNITY DISCUSSION CORPUS FOR: "${entity.toUpperCase()}"\n`;
  corpus += `Total discussions fetched: ${posts.length}\n\n`;

  posts.forEach((post, index) => {
    corpus += `=========================================\n`;
    corpus += `DISCUSSION #${index + 1}\n`;
    corpus += `Subreddit: r/${post.subreddit}\n`;
    corpus += `Title: ${post.title}\n`;
    corpus += `Score: ${post.score}\n`;
    corpus += `URL: ${post.url || "N/A"}\n`;
    corpus += `-----------------------------------------\n`;
    
    if (post.comments && post.comments.length > 0) {
      corpus += `Comments / Discussions:\n`;
      post.comments.forEach((comment, cIndex) => {
        // Strip out newlines inside comments to keep output clean and separate
        const cleanComment = comment.replace(/\n+/g, " ").trim();
        corpus += `  - [Comment ${cIndex + 1}] ${cleanComment}\n`;
      });
    } else {
      corpus += `Comments / Discussions: No comments fetched or found.\n`;
    }
    corpus += `=========================================\n\n`;
  });

  return corpus;
};
