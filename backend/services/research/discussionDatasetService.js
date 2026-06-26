import { fetchRedditData } from "../reddit/postFetchingService.js";

/**
 * Builds a structured text dataset from Reddit discussion data.
 * 
 * @param {string} entity The primary entity (e.g. Notion) to query for posts.
 * @param {Array<string>} subreddits Array of subreddit names to search.
 * @param {Object} config The depth configuration (subredditLimit, postLimit, commentLimit).
 * @returns {Promise<string>} The formatted dataset text.
 */
export const buildDiscussionDataset = async (entity, subreddits, config) => {
  const { postLimit, commentLimit } = config;

  console.log(`DatasetBuilder: Fetching up to ${postLimit} posts and ${commentLimit} comments per subreddit for entity '${entity}' in subreddits:`, subreddits);

  console.time("Reddit Retrieval");
  const posts = await fetchRedditData(subreddits, entity, postLimit, commentLimit);
  console.timeEnd("Reddit Retrieval");

  if (!posts || posts.length === 0) {
    return {
      entity,
      totalPosts: 0,
      totalComments: 0,
      discussions: []
    };
  }

  const totalComments = posts.reduce((sum, post) => sum + (post.comments ? post.comments.length : 0), 0);

  const dataset = {
    entity,
    // totalPosts: posts.length,
    // totalComments,
    discussions: posts.map(post => ({
      subreddit: post.subreddit,
      title: post.title,
      body: post.body,
      score: post.score,
      comments: post.comments
    }))
  };

  const datasetJson = JSON.stringify(dataset);
  console.log(`DatasetBuilder: Total Posts Fetched: ${posts.length}`);
  console.log(`DatasetBuilder: Total Comments Fetched: ${totalComments}`);
  console.log(`DatasetBuilder: Dataset Character Length: ${datasetJson.length}`);
  console.log(`DatasetBuilder: Approx Token Count: ${datasetJson.length / 4}`);

  return dataset;
};
