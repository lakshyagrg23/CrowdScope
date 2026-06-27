import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Database, Layers, BrainCircuit, AlertCircle } from "lucide-react";

interface ResearchDetails {
  id: string;
  query: string;
  depth: string;
  status: string;
  progress: number;
  processingTime?: number;
  clusterCount?: number;
  discussionCount?: number;
  embeddingModel?: string;
  report?: {
    summary: string;
    data: any;
  };
  clusters?: any[];
}

export function Workspace() {
  const { id } = useParams();
  const [data, setData] = useState<ResearchDetails | null>(null);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchDetails = async () => {
      try {
        const res = await api.get(`/research/${id}/details`);
        setData(res.data);

        // Stop polling if done or failed
        if (res.data.status === "COMPLETED" || res.data.status === "FAILED") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch details:", err);
        setError(true);
        clearInterval(interval);
      }
    };

    // Initial fetch
    fetchDetails();

    // Poll every 1.5s
    interval = setInterval(fetchDetails, 1500);

    return () => clearInterval(interval);
  }, [id]);

  const handleRetry = async () => {
    if (!data) return;
    try {
      // Initiate new research
      const res = await api.post("/research", {
        query: data.query,
        depth: data.depth || "standard"
      });
      // Delete old failed research
      await api.delete(`/research/${id}`);
      // Refresh sidebar
      window.dispatchEvent(new CustomEvent('refetch-history'));
      // Navigate to new workspace
      navigate(`/research/${res.data.id}`);
    } catch (err) {
      console.error("Failed to retry research:", err);
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-destructive space-y-4">
        <AlertCircle className="w-12 h-12" />
        <h2 className="text-2xl font-bold">Failed to load workspace</h2>
      </div>
    );
  }

  if (!data) return null;

  if (data.status === "FAILED") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Research Failed</h2>
          <p className="text-muted-foreground max-w-md">
            The background pipeline encountered an error while processing "{data.query}".
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Retry Research
        </button>
      </div>
    );
  }

  const isGenerating = data.status !== "COMPLETED";

  if (isGenerating) {
    return <LoadingChecklist progress={data.progress} status={data.status} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4 border-b border-border pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground capitalize">
            {data.query}
          </h1>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              {data.processingTime?.toFixed(1)}s
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              <Database className="w-4 h-4 mr-2 text-muted-foreground" />
              {data.discussionCount} Discussions
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              <Layers className="w-4 h-4 mr-2 text-muted-foreground" />
              {data.clusterCount} Clusters
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              <BrainCircuit className="w-4 h-4 mr-2 text-muted-foreground" />
              {data.embeddingModel}
            </Badge>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Executive Summary</h2>
          <Card className="bg-card/50 border-border shadow-none">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {data.report?.summary}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Clusters / Discussion Landscape */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Topic Clusters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.clusters?.map((cluster) => (
              <Card key={cluster.id} className="bg-card/50 border-border shadow-none flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg leading-snug">{cluster.topic}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4 text-sm text-muted-foreground">
                  <p>{cluster.overview}</p>
                  
                  {cluster.data?.positiveSignals?.length > 0 && (
                    <div>
                      <span className="font-semibold text-green-500/90 block mb-1">Positive Signals</span>
                      <ul className="list-disc pl-4 space-y-1">
                        {cluster.data.positiveSignals.slice(0,2).map((sig: string, i: number) => (
                          <li key={i}>{sig}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cluster.data?.negativeSignals?.length > 0 && (
                    <div>
                      <span className="font-semibold text-red-500/90 block mb-1">Pain Points</span>
                      <ul className="list-disc pl-4 space-y-1">
                        {cluster.data.negativeSignals.slice(0,2).map((sig: string, i: number) => (
                          <li key={i}>{sig}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// --- Loading Component ---

const STAGES = [
  { min: 0, label: "Discovering optimal subreddits..." },
  { min: 5, label: "Fetching raw discussions..." },
  { min: 15, label: "Generating semantic embeddings..." },
  { min: 50, label: "Clustering thematic signals..." },
  { min: 70, label: "Synthesizing executive report..." },
  { min: 90, label: "Finalizing workspace..." },
];

function LoadingChecklist({ progress, status }: { progress: number, status: string }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Analyzing Community</h2>
          <p className="text-muted-foreground">This usually takes about 30 seconds.</p>
        </div>

        <div className="space-y-4">
          {STAGES.map((stage, i) => {
            const isActive = progress >= stage.min && (i === STAGES.length - 1 || progress < STAGES[i + 1].min);
            const isDone = progress >= (STAGES[i + 1]?.min || 100);

            return (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isActive || isDone ? 1 : 0.4, y: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-muted" />
                  )}
                </div>
                <span className={`text-sm font-medium ${isDone ? 'text-muted-foreground line-through' : isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
