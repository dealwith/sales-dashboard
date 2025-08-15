'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Phone, User } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  value: number;
  probability: number;
  stage: string;
  contact: {
    firstName: string;
    lastName: string;
    company?: string;
    phone?: string;
  };
}

const stages = [
  { key: 'QUALIFICATION', label: 'Qualification', color: 'bg-blue-100 text-blue-800' },
  { key: 'PROPOSAL', label: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { key: 'CLOSING', label: 'Closing', color: 'bg-purple-100 text-purple-800' },
  { key: 'WON', label: 'Won', color: 'bg-green-500 text-white' },
  { key: 'LOST', label: 'Lost', color: 'bg-red-100 text-red-800' },
];

export default function PipelineBoard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDealsByStage = (stage: string) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getTotalValue = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) {
    return <div className="animate-pulse">Loading pipeline...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.key);
          const totalValue = getTotalValue(stage.key);
          
          return (
            <Card key={stage.key} className="min-h-[400px]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">{stage.label}</CardTitle>
                  <Badge className={stage.color}>
                    {stageDeals.length}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  ${totalValue.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="space-y-2">
                      <div className="font-medium text-sm">{deal.title}</div>
                      
                      <div className="flex items-center text-xs text-gray-600">
                        <User className="h-3 w-3 mr-1" />
                        {deal.contact.firstName} {deal.contact.lastName}
                      </div>
                      
                      {deal.contact.company && (
                        <div className="text-xs text-gray-500">
                          {deal.contact.company}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {deal.value.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {deal.probability}%
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {deal.contact.phone && (
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Phone className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8">
                    No deals in this stage
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}