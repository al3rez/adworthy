
import { FC } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/Sidebar';
import { LineChart, BarChart } from 'lucide-react';

const Analyze: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          
          <div className="flex-1 w-full p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Ad Performance</h2>
                    <LineChart className="text-muted-foreground" size={20} />
                  </div>
                  <p className="text-muted-foreground mb-8">Analytics features coming soon</p>
                  <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
                    <p className="text-muted-foreground">Performance metrics will appear here</p>
                  </div>
                </div>
                
                <div className="p-6 border rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Ad Engagement</h2>
                    <BarChart className="text-muted-foreground" size={20} />
                  </div>
                  <p className="text-muted-foreground mb-8">Engagement metrics coming soon</p>
                  <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
                    <p className="text-muted-foreground">Engagement data will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Analyze;
