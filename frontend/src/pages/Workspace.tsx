import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Database, Layers, BrainCircuit, AlertCircle, ChevronDown, ChevronUp, Quote, ExternalLink, MessageSquare } from "lucide-react";

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
    discussionLandscape?: Array<{ title: string; explanation: string; confidence: string }>;
    strengths?: Array<{ title: string; explanation: string; examples: string[]; sourceClusters: number[] }>;
    painPoints?: Array<{ title: string; explanation: string; examples: string[]; sourceClusters: number[] }>;
    featureRequests?: Array<{ title: string; explanation: string; examples: string[]; sourceClusters: number[] }>;
    competitors?: Array<{ title: string; explanation: string; examples: string[]; sourceClusters: number[] }>;
    recommendations?: Array<{ title: string; recommendation: string; basedOn: string[]; expectedImpact: string; sourceClusters: number[] }>;
    risks?: Array<{ title: string; explanation: string; sourceClusters: number[] }>;
    opportunities?: Array<{ title: string; explanation: string; sourceClusters: number[] }>;
  };
  clusters?: Array<{
    id: string;
    clusterId: number;
    topic: string;
    confidence: number;
    overview: string;
    data: {
      positiveSignals: string[];
      negativeSignals: string[];
      customerRequests: string[];
      competitors: string[];
      evidence: string[];
      representativeIds: string[];
    };
  }>;
  discussions?: Array<{
    id: string;
    discussionId: string;
    title: string;
    subreddit: string;
    score: number;
    body: string;
    url: string;
    comments: string[];
  }>;
}

export function Workspace() {
  const { id } = useParams();
  const [data, setData] = useState<ResearchDetails | null>(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/research/${id}/details`);
        setData(res.data);
        if (res.data.status === "COMPLETED" || res.data.status === "FAILED") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch details:", err);
        setError(true);
        clearInterval(interval);
      }
    };
    fetchDetails();
    interval = setInterval(fetchDetails, 1500);
    return () => clearInterval(interval);
  }, [id]);

  const handleRetry = async () => {
    if (!data) return;
    try {
      const res = await api.post("/research", {
        query: data.query,
        depth: data.depth || "standard"
      });
      await api.delete(`/research/${id}`);
      window.dispatchEvent(new CustomEvent('refetch-history'));
      navigate(`/research/${res.data.id}`);
    } catch (err) {
      console.error("Failed to retry:", err);
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

  if (data.status !== "COMPLETED") {
    return <LoadingChecklist progress={data.progress} />;
  }

  const { report, clusters, discussions } = data;

  const renderSourceClusters = (sourceClusters?: number[]) => {
    if (!sourceClusters || sourceClusters.length === 0) return null;
    return (
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground uppercase font-semibold">Source Clusters:</span>
        {sourceClusters.map(cid => {
          const c = clusters?.find(cl => cl.clusterId === cid);
          return c ? (
            <Badge key={cid} variant="outline" className="text-xs bg-muted/50">
              {c.topic}
            </Badge>
          ) : null;
        })}
      </div>
    );
  };

  const getDiscussions = (ids?: string[]) => {
    if (!ids || !discussions) return [];
    return ids.map(id => discussions.find(d => d.discussionId === id)).filter(Boolean) as NonNullable<ResearchDetails['discussions']>[0][];
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        
        {/* Hero Section */}
        <div className="space-y-4 border-b border-border pb-8">
          <h1 className="text-5xl font-bold tracking-tight text-foreground capitalize">
            {data.query}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
              <Clock className="w-4 h-4 mr-2 opacity-70" />
              {data.processingTime?.toFixed(1)}s
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
              <Database className="w-4 h-4 mr-2 opacity-70" />
              {data.discussionCount} Discussions
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
              <Layers className="w-4 h-4 mr-2 opacity-70" />
              {data.clusterCount} Clusters
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium capitalize">
              <BrainCircuit className="w-4 h-4 mr-2 opacity-70" />
              {data.depth} Research
            </Badge>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">Executive Summary</h2>
          <Card className="bg-card/50 border-border shadow-none">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {report?.summary}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Discussion Landscape */}
        {report?.discussionLandscape && report.discussionLandscape.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4">Discussion Landscape</h2>
            <div className="space-y-4">
              {report.discussionLandscape.map((theme, i) => (
                <div key={i} className="flex flex-col space-y-2 p-4 rounded-xl border border-border bg-card/30">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{i + 1}. {theme.title}</h3>
                    <Badge variant={theme.confidence === "High" ? "default" : theme.confidence === "Medium" ? "secondary" : "outline"}>
                      {theme.confidence} Confidence
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{theme.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Topic Clusters */}
        {clusters && clusters.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4">Topic Clusters</h2>
            <div className="space-y-6">
              {clusters.map(cluster => (
                <Card key={cluster.id} className="bg-card/30 shadow-none border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">{cluster.topic}</CardTitle>
                        <p className="text-muted-foreground leading-relaxed">{cluster.overview}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{(cluster.confidence * 100).toFixed(0)}%</div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Confidence</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {cluster.data.positiveSignals?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-500 mb-2">Positive Signals</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {cluster.data.positiveSignals.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {cluster.data.negativeSignals?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-500 mb-2">Negative Signals</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {cluster.data.negativeSignals.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {cluster.data.customerRequests?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-blue-500 mb-2">Feature Requests</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {cluster.data.customerRequests.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {cluster.data.competitors?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-orange-500 mb-2">Competitors</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {cluster.data.competitors.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Representative Discussions Expandable */}
                    {cluster.data.representativeIds?.length > 0 && (
                      <ExpandableSection title="Representative Discussions">
                        <div className="space-y-4">
                          {getDiscussions(cluster.data.representativeIds).map(d => (
                            <div key={d.id} className="p-4 rounded-lg bg-background border border-border">
                              <div className="flex justify-between items-start mb-2">
                                <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline flex items-center">
                                  {d.title} <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                                <Badge variant="outline" className="text-xs">r/{d.subreddit}</Badge>
                              </div>
                              {d.body && <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{d.body}</p>}
                              {d.comments && d.comments.length > 0 && (
                                <div className="space-y-2">
                                  <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
                                    <MessageSquare className="w-3 h-3 mr-1" /> Top Comments
                                  </div>
                                  {d.comments.slice(0, 2).map((c, i) => (
                                    <div key={i} className="text-sm bg-muted/30 p-2 rounded border-l-2 border-primary/50 text-foreground/80 line-clamp-2">
                                      {c}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ExpandableSection>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Strengths */}
        {report?.strengths && report.strengths.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4">Strengths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.strengths.map((item, i) => (
                <Card key={i} className="shadow-none border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    {item.examples?.length > 0 && (
                      <ExpandableSection title="Evidence">
                        <ul className="space-y-2 text-sm italic border-l-2 border-primary/30 pl-3">
                          {item.examples.map((ex, j) => <li key={j}>"{ex}"</li>)}
                        </ul>
                      </ExpandableSection>
                    )}
                    {renderSourceClusters(item.sourceClusters)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Pain Points */}
        {report?.painPoints && report.painPoints.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4">Pain Points</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.painPoints.map((item, i) => (
                <Card key={i} className="shadow-none border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    {item.examples?.length > 0 && (
                      <ExpandableSection title="Evidence">
                        <ul className="space-y-2 text-sm italic border-l-2 border-destructive/30 pl-3">
                          {item.examples.map((ex, j) => <li key={j}>"{ex}"</li>)}
                        </ul>
                      </ExpandableSection>
                    )}
                    {renderSourceClusters(item.sourceClusters)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Feature Requests */}
        {report?.featureRequests && report.featureRequests.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4">Feature Requests</h2>
            <div className="grid grid-cols-1 gap-4">
              {report.featureRequests.map((item, i) => (
                <Card key={i} className="shadow-none border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    {item.examples?.length > 0 && (
                      <ExpandableSection title="Evidence">
                        <ul className="space-y-2 text-sm italic border-l-2 border-primary/30 pl-3">
                          {item.examples.map((ex, j) => <li key={j}>"{ex}"</li>)}
                        </ul>
                      </ExpandableSection>
                    )}
                    {renderSourceClusters(item.sourceClusters)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Competitors */}
        {report?.competitors && report.competitors.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4">Competitors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.competitors.map((item, i) => (
                <Card key={i} className="shadow-none border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    {item.examples?.length > 0 && (
                      <ExpandableSection title="Evidence">
                        <ul className="space-y-2 text-sm italic border-l-2 border-primary/30 pl-3">
                          {item.examples.map((ex, j) => <li key={j}>"{ex}"</li>)}
                        </ul>
                      </ExpandableSection>
                    )}
                    {renderSourceClusters(item.sourceClusters)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Risks & Opportunities */}
        {(report?.risks?.length || report?.opportunities?.length) ? (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {report?.risks && report.risks.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4 text-orange-500">Risks</h2>
                <div className="space-y-4">
                  {report.risks.map((item, i) => (
                    <Card key={i} className="shadow-none border-border bg-orange-500/5">
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                        {renderSourceClusters(item.sourceClusters)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {report?.opportunities && report.opportunities.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4 text-green-500">Opportunities</h2>
                <div className="space-y-4">
                  {report.opportunities.map((item, i) => (
                    <Card key={i} className="shadow-none border-border bg-green-500/5">
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                        {renderSourceClusters(item.sourceClusters)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null}

        {/* Recommendations */}
        {report?.recommendations && report.recommendations.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight border-b border-border pb-4 text-primary">Strategic Recommendations</h2>
            <div className="space-y-6">
              {report.recommendations.map((item, i) => (
                <Card key={i} className="shadow-sm border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 text-sm">
                        {i + 1}
                      </span>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed">{item.recommendation}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-primary/10">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Based On</span>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          {item.basedOn.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Expected Impact</span>
                        <p className="text-sm text-muted-foreground">{item.expectedImpact}</p>
                      </div>
                    </div>

                    {renderSourceClusters(item.sourceClusters)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

// --- Helper Components ---

function ExpandableSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-secondary/50 transition-colors"
      >
        <span className="flex items-center"><Quote className="w-4 h-4 mr-2 opacity-70" /> {title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="p-4 border-t border-border">{children}</div>}
    </div>
  );
}

const STAGES = [
  { min: 0, label: "Discovering optimal subreddits..." },
  { min: 5, label: "Fetching raw discussions..." },
  { min: 15, label: "Generating semantic embeddings..." },
  { min: 50, label: "Clustering thematic signals..." },
  { min: 70, label: "Synthesizing executive report..." },
  { min: 90, label: "Finalizing workspace..." },
];

function LoadingChecklist({ progress }: { progress: number }) {
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
