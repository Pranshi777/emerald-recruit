import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

const ActionRequired = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      const { count: pendingCount, error } = await supabase
        .from("candidates")
        .select("*", { count: "exact", head: true })
        .eq("status", "interview_pending");

      if (!error) {
        setCount(pendingCount || 0);
      }
      setLoading(false);
    };

    fetchCount();
  }, []);

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-amber-500" />
        </div>
        <h3 className="font-display font-semibold text-foreground">Action Required</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <p className="text-5xl font-display font-bold text-foreground mb-2">
              {count}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Candidates awaiting<br />interview approval
            </p>
          </>
        )}
      </div>

      {!loading && count > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            Review pending →
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionRequired;