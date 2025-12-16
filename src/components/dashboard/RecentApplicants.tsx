import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Candidate {
  id: string;
  name: string;
  email: string;
  ai_score: number | null;
  status: string;
  job: {
    title: string;
  } | null;
}

const RecentApplicants = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select(`
          id,
          name,
          email,
          ai_score,
          status,
          job:jobs(title)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setCandidates(data as unknown as Candidate[]);
      }
      setLoading(false);
    };

    fetchCandidates();
  }, []);

  const getScoreBadge = (score: number | null) => {
    if (score === null) return null;
    
    const colorClass = score >= 80 
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
      : score < 50 
        ? "bg-red-500/20 text-red-400 border-red-500/30"
        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";

    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colorClass
      )}>
        {score}
      </span>
    );
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Recent Applicants</h3>
          <p className="text-sm text-muted-foreground">Latest candidates in pipeline</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <Users className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">No applicants yet</p>
          <p className="text-xs">Add jobs to start receiving candidates</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Applied For</th>
                <th className="text-center text-xs font-medium text-muted-foreground pb-3">AI Score</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-foreground">
                      {candidate.job?.title || "—"}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {getScoreBadge(candidate.ai_score)}
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentApplicants;