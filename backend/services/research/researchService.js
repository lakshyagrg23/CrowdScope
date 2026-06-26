import { DEPTH_CONFIG } from '../../config/depthConfig.js';
import { prepareResearchContext } from '../reddit/subredditDiscoveryService.js';
import { buildDiscussionDataset } from './discussionDatasetService.js';
import { generateReport } from './reportGenerationService.js';

/**
 * Orchestrates the creation of a community intelligence research report.
 * 
 * @param {Object} params
 * @param {string} params.query
 * @param {string} params.depth
 * @returns {Promise<Object>}
 */
export const generateResearchReport = async ({ query, depth }) => {
  const config = DEPTH_CONFIG[depth] || DEPTH_CONFIG.standard;

  console.log(`Orchestrator: Initiating ${depth} research for '${query}'`);

  // 1. Extract context (entity, industry) and discover subreddits
  console.time("Context Discovery");
  const context = await prepareResearchContext(query, config.subredditLimit);
  console.timeEnd("Context Discovery");
  console.log(`Orchestrator: Discovered context:`, context);

  // 2. Fetch data from Reddit using the general subject/entity to build a rich dataset
  console.time("Dataset Building");
  const dataset = await buildDiscussionDataset(context.entity, context.subreddits, config);
  console.timeEnd("Dataset Building");

  // 3. Prompt Gemini to extract insights tailored to the user's specific query
  console.time("Gemini Report");
  const report = await generateReport(query, context, dataset);
  console.timeEnd("Gemini Report");

  // 4. Return report with top-level metadata
  return {
    query,
    depth,
    entity: context.entity,
    industry: context.industry,
    ...report
  };
};

