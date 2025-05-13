import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, MessageCircle, Map, Search, Bell, Calendar, 
  Plus, Users, User, ChevronRight, MapPin, Clock, Navigation
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });
  
  // Staff dashboard mock data
  const recentMessages = [
    {
      id: '1',
      sender: 'Jessie Smith',
      time: '4:12 PM',
      initial: 'J',
      unread: true
    },
    {
      id: '2',
      sender: 'Case Manager Alex',
      time: '3:12 PM',
      initial: 'C',
      unread: false
    },
    {
      id: '3',
      sender: 'Housing Specialist Jordan',
      time: '4:12 PM',
      initial: 'H',
      unread: false
    }
  ];
  
  const recentCheckIns = [
    {
      id: '1',
      name: 'Jessie Smith',
      location: 'Day Center',
      time: '3:44 PM',
      initials: 'JS'
    },
    {
      id: '2',
      name: 'Taylor Johnson',
      location: 'Old Town Station',
      time: '2:14 PM',
      initials: 'TJ'
    },
    {
      id: '3',
      name: 'Casey Brown',
      location: 'Imperial Street Shelter',
      time: '1:14 PM',
      initials: 'CB'
    }
  ];
  
  const clientLocations = [
    {
      id: '1',
      name: 'Jessie Smith',
      location: 'Central Library',
      initials: 'JS'
    },
    {
      id: '2',
      name: 'Taylor Johnson',
      location: 'Old Town Station',
      initials: 'TJ'
    }
  ];
  
  const todaySchedule = [
    {
      id: '1',
      title: 'Team Meeting',
      location: 'Central Library, Conference Room',
      startTime: '9:30 AM',
      endTime: '10:30 AM',
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Client Session - Jessie Smith',
      location: 'Day Center, Office 3',
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      type: 'client'
    }
  ];
  
  // Render staff dashboard for case managers
  if (user?.role === 'case_manager') {
    return (
      <div className="container mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Staff Dashboard</h1>
            <p className="text-gray-500">May 12</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </Button>
            <Button className="bg-navy hover:bg-navy/90 text-white flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Clients
            </Button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <Button 
            className={`rounded-md ${activeTab === 'overview' ? 'bg-white text-navy shadow-sm' : 'bg-transparent text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button 
            variant="ghost" 
            className={`rounded-md ${activeTab === 'checkins' ? 'bg-white text-navy shadow-sm' : 'bg-transparent text-gray-500'}`}
            onClick={() => setActiveTab('checkins')}
          >
            Check-ins
          </Button>
          <Button 
            variant="ghost" 
            className={`rounded-md ${activeTab === 'messages' ? 'bg-white text-navy shadow-sm' : 'bg-transparent text-gray-500'}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </Button>
          <Button 
            variant="ghost" 
            className={`rounded-md ${activeTab === 'locations' ? 'bg-white text-navy shadow-sm' : 'bg-transparent text-gray-500'}`}
            onClick={() => setActiveTab('locations')}
          >
            Client Locations
          </Button>
        </div>
        
        {/* Dashboard Widgets - Only show in Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Recent Messages */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="text-orange h-5 w-5" />
                  <h2 className="text-lg font-semibold">Recent Messages</h2>
                </div>
                
                <div className="space-y-4">
                  {recentMessages.map(message => (
                    <div key={message.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-gray-200">
                          <AvatarFallback>{message.initial}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{message.sender}</p>
                          <p className="text-sm text-gray-500">{message.time}</p>
                        </div>
                      </div>
                      {message.unread && (
                        <div className="h-6 w-6 bg-orange rounded-full flex items-center justify-center text-white text-xs">
                          1
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    className="text-orange flex items-center gap-1"
                    onClick={() => navigate('/chat')}
                  >
                    View All Messages
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Check-ins */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="text-navy h-5 w-5" />
                  <h2 className="text-lg font-semibold">Recent Check-ins</h2>
                </div>
                
                <div className="space-y-4">
                  {recentCheckIns.map(checkin => (
                    <div key={checkin.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-navy text-white">
                          <AvatarFallback>{checkin.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{checkin.name}</p>
                          <p className="text-sm text-gray-500">{checkin.location} • {checkin.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    className="text-purple flex items-center gap-1"
                    onClick={() => setActiveTab('checkins')}
                  >
                    View All Check-ins
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Client Locations */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-sky-blue h-5 w-5" />
                  <h2 className="text-lg font-semibold">Client Locations</h2>
                </div>
                
                <div className="space-y-4">
                  {clientLocations.map(client => (
                    <div key={client.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-sky-blue text-white">
                          <AvatarFallback>{client.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.location}</p>
                        </div>
                      </div>
                      <MapPin className="h-5 w-5 text-sky-blue" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    className="text-sky-blue flex items-center gap-1"
                    onClick={() => navigate('/map')}
                  >
                    View All Locations
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Today's Schedule - Only show in Overview Tab */}
        {activeTab === 'overview' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Today's Schedule</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Add Event
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                {todaySchedule.map(event => (
                  <div key={event.id} className="p-4 border-b last:border-0 flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${event.type === 'meeting' ? 'bg-purple/10' : 'bg-orange/10'}`}>
                      {event.type === 'meeting' ? (
                        <Calendar className={`h-5 w-5 ${event.type === 'meeting' ? 'text-purple' : 'text-orange'}`} />
                      ) : (
                        <User className={`h-5 w-5 ${event.type === 'meeting' ? 'text-purple' : 'text-orange'}`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    
                    <div className="text-right text-gray-500">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Check-ins Tab Content */}
        {activeTab === 'checkins' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">All Check-ins</h2>
              <div className="space-y-4">
                {recentCheckIns.map(checkin => (
                  <div key={checkin.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-navy text-white">
                        <AvatarFallback>{checkin.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{checkin.name}</p>
                        <p className="text-sm text-gray-500">{checkin.location} • {checkin.time}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Messages Tab Content */}
        {activeTab === 'messages' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">All Messages</h2>
              <div className="space-y-4">
                {recentMessages.map(message => (
                  <div key={message.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-gray-200">
                        <AvatarFallback>{message.initial}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{message.sender}</p>
                        <p className="text-sm text-gray-500">{message.time}</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-orange hover:bg-orange/90 text-white" 
                      size="sm"
                      onClick={() => navigate('/chat')}
                    >
                      Reply
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Client Locations Tab Content */}
        {activeTab === 'locations' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">All Client Locations</h2>
              <div className="space-y-4">
                {clientLocations.map(client => (
                  <div key={client.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-sky-blue text-white">
                        <AvatarFallback>{client.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.location}</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-sky-blue hover:bg-sky-blue/90 text-white" 
                      size="sm"
                      onClick={() => navigate('/map')}
                    >
                      View on Map
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  // Render client dashboard for regular users
  return (
    <div className="flex flex-col min-h-screen pb-20">
    
      
      <main className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">
            {greeting()}, {user?.name.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-muted-foreground">
            What would you like to do today?
          </p>
        </div>
        
        <h3 className="font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check In Now */}
          <Card className="bg-navy text-white overflow-hidden border-0">
            <CardContent 
              className="p-6 flex flex-col items-center justify-center text-center h-full cursor-pointer"
              onClick={() => navigate('/check-in')}
            >
              <div className="bg-white/20 rounded-full p-4 mb-3">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg mb-1">Check In Now</h3>
              <p className="text-sm text-white/80">Mark your attendance for today's services</p>
            </CardContent>
          </Card>
          
          {/* Messages */}
          <Card className="bg-orange text-white overflow-hidden border-0">
            <CardContent 
              className="p-6 flex flex-col items-center justify-center text-center h-full cursor-pointer"
              onClick={() => navigate('/chat')}
            >
              <div className="bg-white/20 rounded-full p-4 mb-3">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg mb-1">Messages</h3>
              <p className="text-sm text-white/80">Connect with your case manager</p>
            </CardContent>
          </Card>
          
          {/* Share Location */}
          <Card className="bg-sky-blue text-white overflow-hidden border-0">
            <CardContent 
              className="p-6 flex flex-col items-center justify-center text-center h-full cursor-pointer"
              onClick={() => navigate('/map')}
            >
              <div className="bg-white/20 rounded-full p-4 mb-3">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg mb-1">Share Location</h3>
              <p className="text-sm text-white/80">Let your team know where you are</p>
            </CardContent>
          </Card>
          
          {/* Find Services */}
          <Card className="bg-gold text-white overflow-hidden border-0">
            <CardContent 
              className="p-6 flex flex-col items-center justify-center text-center h-full cursor-pointer"
              onClick={() => navigate('/resources')}
            >
              <div className="bg-white/20 rounded-full p-4 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg mb-1">Find Services</h3>
              <p className="text-sm text-white/80">Discover nearby resources and help</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Today's Updates</h3>
              <Button variant="ghost" size="sm" className="text-orange">
                See All Updates
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="h-5 w-5 text-sky-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium">Mobile Clinic Today</h4>
                    <p className="text-sm text-muted-foreground">
                      Old Town Station from 10am-2pm
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Bell className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <h4 className="font-medium">Weather Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      Rain tonight. Extra beds at Imperial Street Shelter.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Your Appointments</h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add New
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Calendar className="h-5 w-5 text-purple mt-0.5" />
                  <div>
                    <h4 className="font-medium">Case Manager Meeting</h4>
                    <p className="text-sm text-muted-foreground">
                      Central Library, 2nd Floor
                    </p>
                    <p className="text-sm font-medium text-orange mt-1">
                      Tomorrow at 2:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;