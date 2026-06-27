import { generateResearchReport } from '../services/research/researchService.js';
import prisma from '../config/prismaClient.js';

export const createResearchController = async (req, res) => {
  try {
    const { query, depth = 'standard' } = req.body;

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

    const deviceId = req.headers['x-device-id'];

    // Create the persistent workspace record
    const research = await prisma.research.create({
      data: {
        title: query.trim(),
        query: query.trim(),
        entity: "Pending",
        industry: "Pending",
        depth: depth,
        status: "PROCESSING",
        deviceId: deviceId || null
      }
    });

    // Trigger the background pipeline without awaiting it
    generateResearchReport({ query: query.trim(), depth }, research.id)
      .catch(error => console.error("Pipeline failed for research ID:", research.id, error));

    // Return the ID and status immediately (202 Accepted)
    return res.status(202).json({
      id: research.id,
      status: research.status
    });

  } catch (error) {
    console.error(`Error inside createResearchController for query: ${req.body?.query}`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while initializing the community research.'
    });
  }
};

export const getResearchController = async (req, res) => {
  try {
    const { id } = req.params;
    const deviceId = req.headers['x-device-id'];
    
    const research = await prisma.research.findUnique({
      where: { id },
      include: {
        report: true,
      }
    });
    
    if (!research) {
      return res.status(404).json({ error: 'Not Found', message: 'Research not found' });
    }
    
    if (research.deviceId && research.deviceId !== deviceId) {
      return res.status(403).json({ error: 'Forbidden', message: 'You do not have access to this workspace' });
    }
    
    return res.status(200).json(research);
    
  } catch (error) {
    console.error(`Error inside getResearchController for id: ${req.params.id}`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while fetching the research.'
    });
  }
};

export const getAllResearchController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const skip = (page - 1) * pageSize;
    const deviceId = req.headers['x-device-id'];
    
    if (!deviceId) {
      return res.status(200).json({ data: [], meta: { page, pageSize, totalCount: 0, totalPages: 0 } });
    }

    const [workspaces, totalCount] = await Promise.all([
      prisma.research.findMany({
        where: { deviceId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          query: true,
          entity: true,
          industry: true,
          status: true,
          progress: true,
          createdAt: true,
          processingTime: true,
          clusterCount: true,
          discussionCount: true,
        }
      }),
      prisma.research.count({ where: { deviceId } })
    ]);

    return res.status(200).json({
      data: workspaces,
      meta: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    });
  } catch (error) {
    console.error(`Error inside getAllResearchController:`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while fetching the workspaces.'
    });
  }
};

export const deleteResearchController = async (req, res) => {
  try {
    const { id } = req.params;
    const deviceId = req.headers['x-device-id'];
    
    const research = await prisma.research.findUnique({
      where: { id },
      select: { deviceId: true }
    });
    
    if (!research) {
      return res.status(404).json({ error: 'Not Found', message: 'Research not found' });
    }
    
    if (research.deviceId && research.deviceId !== deviceId) {
      return res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to delete this workspace' });
    }
    
    await prisma.research.delete({
      where: { id }
    });
    
    return res.status(200).json({ message: 'Research workspace deleted successfully' });
  } catch (error) {
    // Prisma throws a known error if the record to delete does not exist (P2025)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Not Found', message: 'Research not found' });
    }
    console.error(`Error inside deleteResearchController for id: ${req.params.id}`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while deleting the workspace.'
    });
  }
};

export const getResearchDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    const deviceId = req.headers['x-device-id'];
    
    const research = await prisma.research.findUnique({
      where: { id },
      include: {
        report: true,
        clusters: {
          orderBy: { confidence: 'desc' }
        },
        discussions: {
          orderBy: { score: 'desc' }
        }
      }
    });
    
    if (!research) {
      return res.status(404).json({ error: 'Not Found', message: 'Research not found' });
    }
    
    if (research.deviceId && research.deviceId !== deviceId) {
      return res.status(403).json({ error: 'Forbidden', message: 'You do not have access to this workspace' });
    }
    
    return res.status(200).json(research);
    
  } catch (error) {
    console.error(`Error inside getResearchDetailsController for id: ${req.params.id}`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while fetching the research details.'
    });
  }
};