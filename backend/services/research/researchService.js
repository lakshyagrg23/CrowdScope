import { DEPTH_CONFIG } from '../../config/depthConfig.js';
import { prepareResearchContext } from '../reddit/subredditDiscoveryService.js';
import { buildDiscussionDataset } from './discussionDatasetService.js';
import { runSemanticPipeline } from '../analysis/semanticPipelineService.js';
import { summarizeClusters } from './clusterSummarizationService.js';
import { generateReport } from './executiveReportService.js';

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

  // 3. Run the semantic pipeline (Python HDBSCAN clustering)
  console.time("Semantic Pipeline");
  const embeddedDataset = await runSemanticPipeline(dataset);
  console.timeEnd("Semantic Pipeline");

  // 4. Summarize clusters (Generate structured business intelligence concurrently)
  console.time("Cluster Summarization");
  const clusterSummaries = await summarizeClusters(embeddedDataset);
  console.timeEnd("Cluster Summarization");

  // 5. Synthesize final Executive Report
  console.time("Executive Report Synthesis");
  const report = await generateReport(query, context, clusterSummaries);
  console.timeEnd("Executive Report Synthesis");

  // 6. Return report with top-level metadata
  return {
    query,
    depth,
    entity: context.entity,
    industry: context.industry,
    ...report
  };
};
