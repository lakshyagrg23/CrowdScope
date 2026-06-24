import { DEPTH_CONFIG } from '../../config/depthConfig.js';
import { prepareResearchContext } from '../reddit/subredditDiscoveryService.js';
import { buildDiscussionCorpus } from './corpusBuilderService.js';
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
  const context = await prepareResearchContext(query, config.subredditLimit);
  console.log(`Orchestrator: Discovered context:`, context);

  // 2. Fetch data from Reddit using the general subject/entity to build a rich corpus
  const corpus = await buildDiscussionCorpus(context.entity, context.subreddits, config);

  // 3. Prompt Gemini to extract insights tailored to the user's specific query
  const report = await generateReport(query, context, corpus);

  // 4. Return report with top-level metadata
  return {
    query,
    depth,
    entity: context.entity,
    industry: context.industry,
    ...report
  };
};

