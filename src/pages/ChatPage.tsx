import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Send, 
  Plus, 
  X, 
  Phone, 
  Users, 
  ChevronLeft, 
  MoreVertical,
  MessageCircle,
  Trash, // Trash icon for delete functionality
  UserMinus, // Added for contact deletion
  AlertTriangle // Added for warnings/alerts
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  role: 'client' | 'case_manager';
  email: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  conversationId: string;
  timestamp: string; // ISO string for storage
  isDeleted?: boolean; // Added to track if message was deleted
}

interface Conversation {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: string;
  lastMessageSenderId?: string; // Added to track who sent the last message
  lastTimestamp?: string;
  unread?: number;
}

const ChatPage: React.FC = () => {
  const { user } = useUser();
  const [mobileView, setMobileView] = useState<'contacts' | 'chat'>('contacts');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRole, setNewContactRole] = useState<'client' | 'case_manager'>('client');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // New state for confirmation dialogs
  const [showDeleteThreadDialog, setShowDeleteThreadDialog] = useState(false);
  const [showDeleteContactDialog, setShowDeleteContactDialog] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<Conversation | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Load contacts from localStorage on initial render
  useEffect(() => {
    const savedContacts = localStorage.getItem('communicare_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Set up default contacts if none exist
      const defaultContacts: Contact[] = [
        {
          id: '1',
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/150?img=68',
          role: 'client',
          email: 'john@example.com'
        },
        {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://i.pravatar.cc/150?img=47',
          role: 'case_manager',
          email: 'jane@example.com'
        }
      ];
      setContacts(defaultContacts);
      localStorage.setItem('communicare_contacts', JSON.stringify(defaultContacts));
    }
  }, []);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem('communicare_conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    } else {
      // Set up default conversation if none exist
      const defaultConversation: Conversation = {
        id: 'conv-1',
        participants: ['1', '2'], // John and Jane
        lastMessage: 'Hello, how can I help you?',
        lastMessageSenderId: '2', // Jane sent the last message
        lastTimestamp: new Date().toISOString(),
        unread: 0
      };
      setConversations([defaultConversation]);
      localStorage.setItem('communicare_conversations', JSON.stringify([defaultConversation]));
    }
  }, []);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('communicare_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Set up default messages if none exist
      const defaultMessages: Message[] = [
        {
          id: 'msg-1',
          text: 'Hello, how can I help you?',
          senderId: '2', // Jane (case manager)
          senderName: 'Jane Smith',
          conversationId: 'conv-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 'msg-2',
          text: 'I need help finding housing resources.',
          senderId: '1', // John (client)
          senderName: 'John Doe',
          conversationId: 'conv-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()
        },
        {
          id: 'msg-3',
          text: 'I can help you with that. Have you checked our housing search tool in the Resources section?',
          senderId: '2', // Jane (case manager)
          senderName: 'Jane Smith',
          conversationId: 'conv-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
        }
      ];
      setMessages(defaultMessages);
      localStorage.setItem('communicare_messages', JSON.stringify(defaultMessages));
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeConversation]);

  // Get visible conversations for the current user
  const getVisibleConversations = () => {
    // Filter conversations that include the current user
    return conversations.filter(conv => 
      conv.participants.includes(user?.id || '')
    );
  };

  // Get the other participant in a conversation
  const getOtherParticipant = (conversation: Conversation) => {
    const otherParticipantId = conversation.participants.find(id => id !== user?.id);
    return contacts.find(c => c.id === otherParticipantId) || null;
  };

  // Find contact by ID
  const getContactById = (contactId: string) => {
    return contacts.find(c => c.id === contactId) || null;
  };

  // Select a conversation
  const handleConversationClick = (conversation: Conversation) => {
    setActiveConversation(conversation);
    const otherParticipant = getOtherParticipant(conversation);
    setActiveContact(otherParticipant);
    setMobileView('chat');
    
    // Mark conversation as read if current user is the recipient of the last message
    if (conversation.unread && conversation.unread > 0 && 
        conversation.lastMessageSenderId !== user?.id) {
      const updatedConversations = conversations.map(conv => 
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv
      );
      setConversations(updatedConversations);
      localStorage.setItem('communicare_conversations', JSON.stringify(updatedConversations));
    }
  };

  // Get messages for the active conversation
  const getConversationMessages = () => {
    if (!activeConversation) return [];
    return messages
      .filter(msg => msg.conversationId === activeConversation.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  // Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !user) return;

    // Create new message
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      senderId: user.id,
      senderName: user.name,
      conversationId: activeConversation.id,
      timestamp: new Date().toISOString()
    };

    // Add message to state
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    // Get the recipient ID (the other participant)
    const recipientId = activeConversation.participants.find(id => id !== user.id);
    
    // Update conversation with last message info
    const updatedConversations = conversations.map(conv => 
      conv.id === activeConversation.id ? {
        ...conv,
        lastMessage: newMessage,
        lastMessageSenderId: user.id, // Track who sent the last message
        lastTimestamp: new Date().toISOString(),
        // Set unread count for the recipient
        unread: 1
      } : conv
    );
    
    // Save to localStorage
    localStorage.setItem('communicare_messages', JSON.stringify(updatedMessages));
    localStorage.setItem('communicare_conversations', JSON.stringify(updatedConversations));
    
    setConversations(updatedConversations);
    setNewMessage('');
  };

  // Handle deleting a message - MODIFIED to mark as deleted instead of removing
  const handleDeleteMessage = (messageId: string) => {
    // First, check if the message exists and was sent by the current user
    const messageToDelete = messages.find(msg => msg.id === messageId);
    
    if (!messageToDelete || messageToDelete.senderId !== user?.id) {
      return; // Only allow users to delete their own messages
    }
    
    // Mark the message as deleted instead of removing it
    const updatedMessages = messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, text: "This message was deleted", isDeleted: true } 
        : msg
    );
    
    setMessages(updatedMessages);
    
    // Save to localStorage
    localStorage.setItem('communicare_messages', JSON.stringify(updatedMessages));
    
    // If this was the last message in the conversation, update the conversation
    if (activeConversation && 
        activeConversation.lastMessage === messageToDelete.text) {
      
      // Update the last message text if it was the deleted message
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            lastMessage: "This message was deleted"
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      localStorage.setItem('communicare_conversations', JSON.stringify(updatedConversations));
    }
  };

  // NEW FUNCTION: Handle initiating thread deletion
  const initiateThreadDeletion = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering conversation selection
    setThreadToDelete(conversation);
    setShowDeleteThreadDialog(true);
  };

  // NEW FUNCTION: Handle thread deletion confirmation
  const handleDeleteThread = () => {
    if (!threadToDelete) return;
    
    // Remove the conversation
    const updatedConversations = conversations.filter(
      conv => conv.id !== threadToDelete.id
    );
    setConversations(updatedConversations);
    
    // If this was the active conversation, clear it
    if (activeConversation && activeConversation.id === threadToDelete.id) {
      setActiveConversation(null);
      setActiveContact(null);
      setMobileView('contacts');
    }
    
    // Save to localStorage
    localStorage.setItem('communicare_conversations', JSON.stringify(updatedConversations));
    
    // Close the dialog
    setShowDeleteThreadDialog(false);
    setThreadToDelete(null);
  };

  // NEW FUNCTION: Handle initiating contact deletion
  const initiateContactDeletion = () => {
    if (!activeContact) return;
    setContactToDelete(activeContact);
    setShowDeleteContactDialog(true);
  };

  // NEW FUNCTION: Handle contact deletion confirmation
  const handleDeleteContact = () => {
    if (!contactToDelete) return;
    
    // Remove the contact
    const updatedContacts = contacts.filter(
      contact => contact.id !== contactToDelete.id
    );
    setContacts(updatedContacts);
    
    // Remove all conversations with this contact
    const updatedConversations = conversations.filter(conv => 
      !conv.participants.includes(contactToDelete.id)
    );
    setConversations(updatedConversations);
    
    // If this was the active contact, clear it
    if (activeContact && activeContact.id === contactToDelete.id) {
      setActiveConversation(null);
      setActiveContact(null);
      setMobileView('contacts');
    }
    
    // Save to localStorage
    localStorage.setItem('communicare_contacts', JSON.stringify(updatedContacts));
    localStorage.setItem('communicare_conversations', JSON.stringify(updatedConversations));
    
    // Close the dialog
    setShowDeleteContactDialog(false);
    setContactToDelete(null);
  };

  // Create a new contact
  const handleAddContact = () => {
    // Validate inputs
    if (!newContactName.trim() || !newContactEmail.trim()) return;

    // Create new contact
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContactName,
      role: newContactRole,
      email: newContactEmail
    };

    // Add contact to state
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    
    // Create a new conversation with this contact
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [user?.id || '', newContact.id],
      unread: 0
    };
    
    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    
    // Save to localStorage
    localStorage.setItem('communicare_contacts', JSON.stringify(updatedContacts));
    localStorage.setItem('communicare_conversations', JSON.stringify(updatedConversations));
    
    // Reset form
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setShowAddContactDialog(false);
  };

  // Handle back button click
  const handleBackToContacts = () => {
    setMobileView('contacts');
  };

  // Get visible conversations that match the search term
  const filteredConversations = getVisibleConversations().filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    if (!otherParticipant) return false;
    
    return (
      otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.lastMessage && conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Render preview of last message with sender name
  const renderLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) return null;
    
    // Determine if the last message was sent by the current user
    const isFromCurrentUser = conversation.lastMessageSenderId === user?.id;
    
    return (
      <p className="text-sm text-muted-foreground truncate">
        {isFromCurrentUser ? 'You: ' : ''}{conversation.lastMessage}
      </p>
    );
  };

  return (
    <div className="pt-16 h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row pb-16 md:pb-0">
        {/* Conversations Sidebar - Hidden on mobile when chat is active */}
        <div className={`${mobileView === 'chat' ? 'hidden md:block' : 'block'} w-full md:w-80 md:border-r h-full`}>
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-8 pr-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute right-2 top-2.5" 
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border-b">
            <h2 className="font-semibold">Conversations</h2>
            <Button 
              size="sm" 
              className="rounded-full h-8 w-8 p-0" 
              onClick={() => setShowAddContactDialog(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100%-105px)]">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-40" />
                <p>No conversations found</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowAddContactDialog(true)}
                >
                  Start a conversation
                </Button>
              </div>
            ) : (
              filteredConversations.map(conversation => {
                const otherParticipant = getOtherParticipant(conversation);
                if (!otherParticipant) return null;
                
                return (
                  <div 
                    key={conversation.id}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors relative group"
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={`${otherParticipant.role === 'case_manager' ? 'bg-purple' : 'bg-orange'} text-white`}>
                        {otherParticipant.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{otherParticipant.name}</span>
                        {conversation.lastTimestamp && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(conversation.lastTimestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      {renderLastMessagePreview(conversation)}
                    </div>
                    {conversation.unread && conversation.unread > 0 && 
                     conversation.lastMessageSenderId !== user?.id && (
                      <div className="h-5 w-5 rounded-full bg-orange text-white flex items-center justify-center text-xs">
                        {conversation.unread}
                      </div>
                    )}
                    
                    {/* Delete Thread Button - visible on hover */}
                    <button
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                      onClick={(e) => initiateThreadDeletion(conversation, e)}
                      title="Delete conversation"
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </div>
        
        {/* Chat Area - Hidden on mobile when contacts are shown */}
        <div className={`${mobileView === 'contacts' ? 'hidden md:flex' : 'flex'} flex-1 flex-col h-full`}>
          {/* Chat Header */}
          {activeContact && (
            <div className="p-3 border-b flex items-center gap-3">
              <button 
                className="md:hidden" 
                onClick={handleBackToContacts}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <Avatar className="h-10 w-10">
                <AvatarFallback className={`${activeContact.role === 'case_manager' ? 'bg-purple' : 'bg-orange'} text-white`}>
                  {activeContact.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium">{activeContact.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeContact.role === 'case_manager' ? 'Case Manager' : 'Client'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-red-500" 
                  onClick={initiateContactDeletion}
                  title="Delete Contact"
                >
                  <UserMinus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-4 pb-20 md:pb-4">
            {activeConversation ? (
              <div className="space-y-4">
                {getConversationMessages().map((message) => {
                  // Determine if the message was sent by the current user
                  const isCurrentUserMessage = message.senderId === user?.id;
                  // Get the contact who sent this message (for avatar display)
                  const messageSender = getContactById(message.senderId);
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'} group`}
                    >
                      {/* If it's not from the current user, show the avatar */}
                      {!isCurrentUserMessage && (
                        <Avatar className="h-8 w-8 mr-2 self-end mb-1">
                          <AvatarFallback className={`${messageSender?.role === 'case_manager' ? 'bg-purple' : 'bg-orange'} text-white text-xs`}>
                            {message.senderName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="relative">
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUserMessage
                              ? message.isDeleted 
                                ? 'bg-gray-300 text-gray-600' 
                                : 'bg-orange text-white rounded-tr-none'
                              : message.isDeleted
                                ? 'bg-gray-200 text-gray-600'
                                : 'bg-gray-100 rounded-tl-none'
                          }`}
                        >
                          <p className={`text-sm ${message.isDeleted ? 'italic' : ''}`}>{message.text}</p>
                          <div className="flex justify-end mt-1">
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        {/* Delete button - only shown for current user's messages that aren't deleted, and on hover */}
                        {isCurrentUserMessage && !message.isDeleted && (
                          <button
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteMessage(message.id)}
                            aria-label="Delete message"
                          >
                            <Trash className="h-3 w-3 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4">
                <Users className="h-12 w-12 mb-4" />
                <p className="text-center">Select a conversation or start a new one</p>
              </div>
            )}
          </ScrollArea>
          
          {/* Message Input */}
          {activeConversation && (
            <form 
              onSubmit={handleSendMessage} 
              className="p-3 flex gap-2 border-t bg-white"
              style={{ 
                position: 'fixed', 
                bottom: '4rem', 
                left: 0, 
                right: 0, 
                zIndex: 10,
                '@media (min-width: 768px)': {
                  position: 'relative',
                  bottom: 'auto',
                  left: 'auto',
                  right: 'auto'
                }
              }}
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
      
      {/* Add Contact Dialog */}
      <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                placeholder="Contact name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number (Optional)</label>
              <Input
                id="phone"
                placeholder="Phone number"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    checked={newContactRole === 'client'}
                    onChange={() => setNewContactRole('client')}
                  />
                  <span>Client</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    checked={newContactRole === 'case_manager'}
                    onChange={() => setNewContactRole('case_manager')}
                  />
                  <span>Case Manager</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContactDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact}>
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Thread Confirmation Dialog */}
      <Dialog open={showDeleteThreadDialog} onOpenChange={setShowDeleteThreadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteThreadDialog(false);
                setThreadToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteThread}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Contact Confirmation Dialog */}
      <Dialog open={showDeleteContactDialog} onOpenChange={setShowDeleteContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {contactToDelete?.name}? This will also delete all conversations with this contact. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteContactDialog(false);
                setContactToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteContact}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPage;