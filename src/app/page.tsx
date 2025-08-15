import LeadsList from '@/components/LeadsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function Home() {
  const leads = await db.lead.findMany({
    include: {
      contact: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sales Dashboard</h1>
          <div className="flex space-x-2">
            <Link href="/pipeline">
              <Button variant="outline">View Pipeline</Button>
            </Link>
            <Link href="/leads/new">
              <Button>Add New Lead</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calls Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsList leads={leads} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
