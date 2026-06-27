import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { PlusCircle, Database, History, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface WorkspaceMeta {
  id: string;
  query: string;
  status: string;
  progress: number;
}

export function AppShell() {
  const [history, setHistory] = useState<WorkspaceMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchHistory();

    const handleRefetch = () => fetchHistory();
    window.addEventListener("refetch-history", handleRefetch);

    return () => {
      window.removeEventListener("refetch-history", handleRefetch);
    };
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/research?pageSize=20");
      setHistory(res.data.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent link click
    try {
      await api.delete(`/research/${id}`);
      window.dispatchEvent(new CustomEvent("refetch-history"));
      if (location.pathname === `/research/${id}`) {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to delete workspace:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-r border-border bg-card/30 flex flex-col group/sidebar">
        {/* Header / Brand */}
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Database className="w-5 h-5 mr-3 text-primary" />
          <span className="font-semibold text-lg tracking-tight">CrowdScope</span>
        </div>

        {/* Primary Action */}
        <div className="p-4">
          <Button 
            className="w-full justify-start text-sm shadow-none" 
            onClick={() => navigate("/")}
            variant={location.pathname === "/" ? "secondary" : "default"}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Research
          </Button>
        </div>

        <Separator className="opacity-50" />

        {/* History Section */}
        <div className="flex-1 flex flex-col overflow-hidden py-4">
          <div className="px-6 mb-2 flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <History className="mr-2 h-3.5 w-3.5" />
            Recent Workspaces
          </div>
          
          <ScrollArea className="flex-1 px-4">
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : history.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                No research found.
              </div>
            ) : (
              <div className="space-y-1">
                {history.map((workspace) => (
                  <Link 
                    key={workspace.id} 
                    to={`/research/${workspace.id}`}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors relative",
                      location.pathname === `/research/${workspace.id}` 
                        ? "bg-secondary text-secondary-foreground font-medium" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="truncate">{workspace.query}</div>
                      <div className="flex items-center mt-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          workspace.status === "COMPLETED" ? "bg-green-500" : 
                          workspace.status === "FAILED" ? "bg-red-500" : "bg-blue-500 animate-pulse"
                        )} />
                        <span className="text-xs opacity-70">
                          {workspace.status === "COMPLETED" ? "Done" : 
                           workspace.status === "FAILED" ? "Failed" : `${workspace.progress}%`}
                        </span>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(e, workspace.id)}
                      className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}
