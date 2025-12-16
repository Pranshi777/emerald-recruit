import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Recruit-AI | Agentic Hiring for SMBs</title>
        <meta name="description" content="Let AI agents handle your entire hiring workflow—from sourcing candidates to scheduling interviews. Save time, reduce bias, and hire the best talent faster." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
      </div>
    </>
  );
};

export default Index;