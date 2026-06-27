import { DEPTH_CONFIG } from '../../config/depthConfig.js';
import { prepareResearchContext } from '../reddit/subredditDiscoveryService.js';
import { buildDiscussionDataset } from './discussionDatasetService.js';
import { runSemanticPipeline } from '../analysis/semanticPipelineService.js';
import { summarizeClusters } from './clusterSummarizationService.js';
import { generateReport } from './executiveReportService.js';
import prisma from '../../config/prismaClient.js';

/**
 * Orchestrates the creation of a community intelligence research report.
 * 
 * @param {Object} params
 * @param {string} params.query
 * @param {string} params.depth
 * @param {string} researchId
 */
export const generateResearchReport = async ({ query, depth }, researchId) => {
  const config = DEPTH_CONFIG[depth] || DEPTH_CONFIG.standard;
  const startTime = Date.now();

  console.log(`Orchestrator: Initiating ${depth} research for '${query}' (ID: ${researchId})`);

  try {
    // 1. Context Discovery (5%)
    await prisma.research.update({ 
      where: { id: researchId }, 
      data: { status: 'CONTEXT_DISCOVERY', progress: 5 } 
    });
    const context = await prepareResearchContext(query, config.subredditLimit);
    await prisma.research.update({ 
      where: { id: researchId }, 
      data: { entity: context.entity, industry: context.industry } 
    });

    // 2. Fetch Data (15%)
    await prisma.research.update({ 
      where: { id: researchId }, 
      data: { status: 'FETCHING_DISCUSSIONS', progress: 15 } 
    });
    const dataset = await buildDiscussionDataset(context.entity, context.subreddits, config);
    
    // Save raw discussions to DB
    let discussionCount = 0;
    if (dataset.discussions && dataset.discussions.length > 0) {
      discussionCount = dataset.discussions.length;
      await prisma.researchDiscussion.createMany({
        data: dataset.discussions.map(d => ({
          researchId,
          discussionId: d.id,
          title: d.title || "",
          subreddit: d.subreddit || "",
          score: d.score || 0,
          body: d.body || "",
          url: d.url || "",
          comments: d.comments || []
        }))
      });
    }

    // 3. Semantic Pipeline (50%)
    await prisma.research.update({ 
      where: { id: researchId }, 
      data: { status: 'GENERATING_EMBEDDINGS', progress: 50 } 
    });
    const embeddedDataset = await runSemanticPipeline(dataset);

    // 4. Summarization (70%)
    await prisma.research.update({ 
      where: { id: researchId }, 
      data: { status: 'SUMMARIZING', progress: 70 } 
    });
    const clusterSummaries = await summarizeClusters(embeddedDataset);

    // Save clusters to DB
    let clusterCount = 0;
    if (clusterSummaries && clusterSummaries.length > 0) {
      clusterCount = clusterSummaries.length;
      await prisma.researchCluster.createMany({
        data: clusterSummaries.map(c => ({
          researchId,
          clusterId: c.clusterId,
          topic: c.topic || "Unknown Topic",
          confidence: c.confidence || 0,
          overview: c.overview || "",
          data: {
            positiveSignals: c.positiveSignals,
            negativeSignals: c.negativeSignals,
            customerRequests: c.customerRequests,
            competitors: c.competitors,
            evidence: c.evidence,
            representativeIds: c.representativeIds
          }
        }))
      });
    }

    // 5. Synthesis (90%)
    await prisma.research.update({ 
      where: { id: researchId }, 
      data: { status: 'GENERATING_REPORT', progress: 90 } 
    });
    const report = await generateReport(query, context, clusterSummaries);

    // Save report to DB
    await prisma.researchReport.create({
      data: {
        researchId,
        summary: report.summary || "No summary generated.",
        data: report
      }
    });

    // 6. Complete (100%)
    const processingTime = (Date.now() - startTime) / 1000; // in seconds
    
    await prisma.research.update({ 
      where: { id: researchId }, 
      data: { 
        status: 'COMPLETED', 
        progress: 100,
        discussionCount,
        clusterCount,
        processingTime
      } 
    });
    console.log(`Orchestrator: Research ${researchId} completed successfully in ${processingTime}s.`);

  } catch (error) {
    console.error(`Orchestrator Error for Research ${researchId}:`, error);
    await prisma.research.update({ 
      where: { id: researchId }, 
      data: { status: 'FAILED' } 
    });
  }
};
