import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';


interface Resource {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  location?: string;
  requirements?: string[];
}

// Filter types
interface FilterState {
  topics: string[];
  locations: string[];
}

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    topics: [],
    locations: []
  });

  // Mock resources data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Policy Updates',
      description: 'Latest updates on housing and assistance policies',
      tags: ['Policy', 'Updates'],
      category: 'Information',
    },
    {
      id: '2',
      title: 'Housing Search',
      description: 'Tools and resources for finding housing',
      tags: ['Housing', 'Search'],
      category: 'Tools',
    },
    {
      id: '3',
      title: 'Getting Phone Access',
      description: 'Information on free and low-cost phone services',
      tags: ['Phone', 'Communication'],
      category: 'Information',
    },
    {
      id: '4',
      title: 'Day Center',
      description: 'Drop-in center with showers, meals, and case management',
      tags: ['No Wait List', 'Same Day'],
      category: 'Day Centers',
      location: 'Downtown'
    },
    {
      id: '5',
      title: 'Imperial Street Shelter',
      description: '90-day housing program with on-site support services',
      tags: ['Application Required'],
      category: 'Shelters/transitional housing',
      location: 'Imperial Street'
    },
    {
      id: '6',
      title: 'Housing First Program',
      description: 'Permanent supportive housing opportunities',
      tags: ['Application Required', 'Case Manager Referral'],
      category: 'Permanent housing',
    },
    {
      id: '7',
      title: 'Central Library Resources',
      description: 'Computer access, job search assistance, and resource navigation',
      tags: ['Walk-in Welcome'],
      category: 'Information',
      location: 'Downtown'
    },
    {
      id: '8',
      title: 'Old Town Station Mobile Clinic',
      description: 'Free healthcare services available Tuesday and Thursday',
      tags: ['No Insurance Required', 'Walk-in Welcome'],
      category: 'Health',
      location: 'Old Town Station'
    },
    {
      id: '9',
      title: 'Community Food Bank',
      description: 'Weekly food distribution at multiple locations',
      tags: ['No ID Required', 'Walk-in Welcome'],
      category: 'Food',
      location: 'Multiple Locations'
    }
  ];

  // Topic options for the filter
  const topicOptions = [
    { id: 'emergency', label: 'Emergency services' },
    { id: 'daycenters', label: 'Day Centers' },
    { id: 'shelters', label: 'Shelters/transitional housing' },
    { id: 'permanent', label: 'Permanent housing' },
    { id: 'health', label: 'Health' },
    { id: 'hazards', label: 'Hazards' }
  ];

  // Location options for the filter
  const locationOptions = [
    { id: 'imperial', label: 'Imperial Street' },
    { id: 'nearby', label: 'Near my location' }
  ];

  const toggleTopic = (topicId: string) => {
    setFilters(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(id => id !== topicId)
        : [...prev.topics, topicId]
    }));
  };

  const toggleLocation = (locationId: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(locationId)
        ? prev.locations.filter(id => id !== locationId)
        : [...prev.locations, locationId]
    }));
  };

  // Filter resources based on current filters and search term
  const filteredResources = resources.filter(resource => {
    // Filter by search term
    if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !resource.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by topics
    if (filters.topics.length > 0) {
      const matchesTopic = filters.topics.some(topic => {
        if (topic === 'daycenters') return resource.category === 'Day Centers';
        if (topic === 'shelters') return resource.category === 'Shelters/transitional housing';
        if (topic === 'permanent') return resource.category === 'Permanent housing';
        if (topic === 'health') return resource.category === 'Health';
        if (topic === 'hazards') return resource.category === 'Hazards';
        return false;
      });
      if (!matchesTopic) return false;
    }

    // Filter by locations
    if (filters.locations.length > 0) {
      const matchesLocation = filters.locations.some(location => {
        if (location === 'imperial') return resource.location === 'Imperial Street';
        if (location === 'nearby') return resource.location === 'Near my location';
        return false;
      });
      if (!matchesLocation) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col min-h-screen pb-20">
    
      
      <div className="flex flex-col md:flex-row flex-1">
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 bg-navy text-white p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-white mb-2 block font-medium">TOPIC</h3>
            <div className="space-y-2">
              {topicOptions.map(topic => (
                <label
                  key={topic.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.topics.includes(topic.id)}
                    onChange={() => toggleTopic(topic.id)}
                    className="rounded border-white/20 bg-white/10"
                  />
                  <span className="text-sm">{topic.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-white mb-2 block font-medium">LOCATION</h3>
            <div className="space-y-2">
              {locationOptions.map(location => (
                <label
                  key={location.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(location.id)}
                    onChange={() => toggleLocation(location.id)}
                    className="rounded border-white/20 bg-white/10"
                  />
                  <span className="text-sm">{location.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Resources Grid */}
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-6">Resource Library</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <Card key={resource.id} className="hover:shadow-lg transition-duration-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {resource.description}
                  </p>
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {resource.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {resource.location && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Location: {resource.location}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;