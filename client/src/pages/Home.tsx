import { Hero } from "@/components/layout/Hero";
import { Navbar } from "@/components/layout/Navbar";
import { InitiatePanel } from "@/components/panels/InitiatePanel";
import { PipelinePanel } from "@/components/panels/PipelinePanel";
import { SimulationPanel } from "@/components/panels/SimulationPanel";
import { useEffect } from "react";
import { useSetSimulationStatus } from "@/hooks/use-simulation";

export default function Home() {
  const simMutation = useSetSimulationStatus();

  // Ensure backend simulation starts in 'success' state on load
  useEffect(() => {
    simMutation.mutate('success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Background ambient lighting */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none"></div>

      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-stretch">
            {/* Left: Initiation */}
            <div className="lg:col-span-1 h-full">
              <InitiatePanel />
            </div>

            {/* Center: Live Pipeline */}
            <div className="lg:col-span-1 h-full">
              <PipelinePanel />
            </div>

            {/* Right: Controller */}
            <div className="lg:col-span-1 h-full">
              <SimulationPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
