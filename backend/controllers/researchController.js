import { generateResearchReport } from '../services/research/researchService.js';

export const researchController = async (req, res) => {
  try {
    const { query, depth = 'standard' } = req.body;

    // 1. Basic Input Validation
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'A valid string "query" parameter is required.'
      });
    }

    if (!['standard', 'deep'].includes(depth)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'The "depth" parameter must be either "standard" or "deep".'
      });
    }

    // 2. Delegate to the Service Layer
    const report = await generateResearchReport({ 
      query: query.trim(), 
      depth 
    });

    // 3. Return the payload
    return res.status(200).json(report);

  } catch (error) {
    console.error(`Error inside researchController for query: ${req.body?.query}`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while executing the community research.'
    });
  }
};