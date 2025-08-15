import PipelineBoard from '@/components/PipelineBoard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PipelinePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sales Pipeline</h1>
            <p className="text-gray-600 mt-2">Track your deals through the sales process</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/">
              <Button variant="outline">← Dashboard</Button>
            </Link>
            <Link href="/leads/new">
              <Button>Add New Lead</Button>
            </Link>
          </div>
        </div>
        
        <PipelineBoard />
      </div>
    </div>
  );
}