import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import RecentApplicants from "@/components/dashboard/RecentApplicants";
import HiringVelocity from "@/components/dashboard/HiringVelocity";
import ActionRequired from "@/components/dashboard/ActionRequired";
import { SidebarProvider } from "@/components/ui/sidebar";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Dashboard | Recruit-AI</title>
        <meta name="description" content="Manage your recruitment pipeline with AI-powered insights and candidate tracking." />
      </Helmet>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's your hiring overview.</p>
              </header>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Large Widget - Recent Applicants (spans 2 columns) */}
                <div className="lg:col-span-2 min-h-[380px]">
                  <RecentApplicants />
                </div>

                {/* Small Widget - Action Required */}
                <div className="min-h-[180px]">
                  <ActionRequired />
                </div>

                {/* Medium Widget - Hiring Velocity (spans 2 columns on medium+) */}
                <div className="md:col-span-2 lg:col-span-2 min-h-[280px]">
                  <HiringVelocity />
                </div>

                {/* Placeholder for future widget */}
                <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-muted-foreground min-h-[180px]">
                  <p className="text-sm">More insights coming soon</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;