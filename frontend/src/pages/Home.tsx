import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Home() {
  const [query, setQuery] = useState("");
  const [isDeepSearch, setIsDeepSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.post("/research", { 
        query: query.trim(),
        depth: isDeepSearch ? "deep" : "standard" 
      });
      
      const { id } = res.data;
      // Trigger sidebar refresh
      window.dispatchEvent(new CustomEvent('refetch-history'));
      navigate(`/research/${id}`);
    } catch (error) {
      console.error("Failed to initiate research:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Community Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            What do you want to research?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Instantly aggregate, analyze, and synthesize discussions across Reddit to uncover hidden market signals.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="e.g., Nintendo Switch 2 rumors, React Server Components..."
            className="block w-full pl-14 pr-16 py-5 bg-card/50 border border-border rounded-2xl text-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 outline-none placeholder:text-muted-foreground"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="p-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Depth Selection */}
        <div className="flex items-center justify-center space-x-3 w-full">
          <Switch 
            id="deep-search" 
            checked={isDeepSearch}
            onCheckedChange={setIsDeepSearch}
            disabled={loading}
          />
          <label 
            htmlFor="deep-search" 
            className="text-sm font-medium text-foreground cursor-pointer select-none"
          >
            Deep Search
          </label>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border-border max-w-[200px] text-center">
                <p>Deeper search analyzes 4x more discussions but takes longer to process.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <span className="text-sm text-muted-foreground mr-2">Try:</span>
          {["AI wearable devices", "Elden Ring DLC", "Next.js 15 features"].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              disabled={loading}
              className="text-sm px-3 py-1.5 rounded-full border border-border bg-card hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
