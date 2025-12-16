import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartData {
  hour: string;
  count: number;
}

const HiringVelocity = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: candidates, error } = await supabase
        .from("candidates")
        .select("created_at")
        .gte("created_at", today.toISOString());

      if (!error && candidates) {
        // Group by hour
        const hourCounts: { [key: string]: number } = {};
        
        // Initialize hours
        for (let i = 0; i < 24; i++) {
          const hourLabel = `${i.toString().padStart(2, '0')}:00`;
          hourCounts[hourLabel] = 0;
        }

        candidates.forEach((c) => {
          const hour = new Date(c.created_at).getHours();
          const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
          hourCounts[hourLabel]++;
        });

        const currentHour = new Date().getHours();
        const chartData = Object.entries(hourCounts)
          .filter(([hour]) => parseInt(hour) <= currentHour)
          .slice(-8)
          .map(([hour, count]) => ({
            hour: hour.replace(':00', 'h'),
            count,
          }));

        setData(chartData);
        setTotalToday(candidates.length);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Hiring Velocity</h3>
            <p className="text-sm text-muted-foreground">Candidates processed today</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-bold text-foreground">{totalToday}</p>
          <p className="text-xs text-muted-foreground">today</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="hour" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(222 47% 13%)',
                  border: '1px solid hsl(217 33% 20%)',
                  borderRadius: '8px',
                  color: 'hsl(210 40% 98%)',
                }}
                cursor={{ fill: 'hsl(160 84% 39% / 0.1)' }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(160 84% 39%)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HiringVelocity;