
"use client";
import { Search, MessageSquare, Users, Send, Paperclip, Smile, MoreVertical, Phone, Video, Check, CheckCheck, Plus, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

type Conversation = {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
  participants?: number;
};

// Mock data
const mockPersonalChats: Conversation[] = [
  { id: 1, name: "John Builder", lastMessage: "Thanks for the quote!", timestamp: "2m ago", unread: 2, avatar: "JB", isGroup: false },
  { id: 2, name: "Sarah Architect", lastMessage: "Can we schedule a meeting?", timestamp: "1h ago", unread: 0, avatar: "SA", isGroup: false },
  { id: 3, name: "Mike Constructor", lastMessage: "Project looks great!", timestamp: "3h ago", unread: 1, avatar: "MC", isGroup: false },
];

const mockGroupChats: Conversation[] = [
  { id: 4, name: "Downtown Plaza Project", lastMessage: "Alice: Updated the timeline", timestamp: "30m ago", unread: 5, avatar: "DP", isGroup: true, participants: 8 },
  { id: 5, name: "Material Suppliers", lastMessage: "You: When can we expect delivery?", timestamp: "2h ago", unread: 0, avatar: "MS", isGroup: true, participants: 12 },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'conversations'>('personal');
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Chat Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat List */}
        <ChatSidebar
          activeTab={activeTab}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setShowNewConversation={setShowNewConversation}
          personalChats={mockPersonalChats}
          groupChats={mockGroupChats}
          isMobileView={isMobileView}
        />

        {/* Chat Area */}
        <ChatArea
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          isMobileView={isMobileView}
        />

        {/* New Conversation Modal */}
        {showNewConversation && (
          <NewConversationModal onClose={() => setShowNewConversation(false)} />
        )}
      </div>
    </div>
  );
}

// Header Component
function Header({ activeTab, setActiveTab }: {
  activeTab: 'personal' | 'conversations';
  setActiveTab: (tab: 'personal' | 'conversations') => void;
}) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
        <div className="flex gap-2">
          <button type='button'
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'personal'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Personal
          </button>
          <button type='button'
            onClick={() => setActiveTab('conversations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'conversations'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Conversations
          </button>
        </div>
      </div>
    </div>
  );
}

// Chat Sidebar Component
function ChatSidebar({ activeTab, selectedChat, setSelectedChat, setShowNewConversation, personalChats, groupChats, isMobileView }: {
  activeTab: 'personal' | 'conversations';
  selectedChat: Conversation | null;
  setSelectedChat: (chat: Conversation) => void;
  setShowNewConversation: (show: boolean) => void;
  personalChats: Conversation[];
  groupChats: Conversation[];
  isMobileView: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const chats = activeTab === 'personal' ? personalChats : groupChats;

  return (
    <div className={`w-full md:w-96 bg-white border-r border-gray-200 flex flex-col ${isMobileView && selectedChat ? 'hidden md:flex' : 'flex'}`}>
      {/* Search & New Chat */}
      <div className="p-4 space-y-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        
        {activeTab === 'conversations' && (
          <button
            onClick={() => setShowNewConversation(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Conversation
          </button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChat?.id === chat.id}
            onClick={() => setSelectedChat(chat)}
          />
        ))}
      </div>
    </div>
  );
}

// Chat List Item Component
function ChatListItem({ chat, isSelected, onClick }: {
  chat: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
        isSelected ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
          {chat.avatar}
        </div>
        {chat.isGroup && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
            <Users className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.timestamp}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
        {chat.isGroup && chat.participants && (
          <p className="text-xs text-gray-500 mt-1">{chat.participants} participants</p>
        )}
      </div>
      
      {chat.unread > 0 && (
        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-gray-900">{chat.unread}</span>
        </div>
      )}
    </button>
  );
}

// Chat Area Component
function ChatArea({ selectedChat, setSelectedChat, isMobileView }: {
  selectedChat: Conversation | null;
  setSelectedChat: (chat: Conversation | null) => void;
  isMobileView: boolean;
}) {
  if (!selectedChat) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Chat Selected</h3>
          <p className="text-gray-600">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <ChatHeader chat={selectedChat} setSelectedChat={setSelectedChat} isMobileView={isMobileView} />
      
      {/* Messages Area */}
      <MessagesArea chat={selectedChat} />
      
      {/* Message Input */}
      <MessageInput />
    </div>
  );
}

// Chat Header Component
function ChatHeader({ chat, setSelectedChat, isMobileView }: {
  chat: Conversation;
  setSelectedChat: (chat: Conversation | null) => void;
  isMobileView: boolean;
}) {
  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isMobileView && (
          <button aria-label='button' type='button'
            onClick={() => setSelectedChat(null)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
          {chat.avatar}
        </div>
        <div>
          <h2 className="font-bold text-gray-900">{chat.name}</h2>
          {chat.isGroup && chat.participants && (
            <p className="text-sm text-gray-600">{chat.participants} participants</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button aria-label='button' type='button' className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button aria-label='button' type='button' className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Video className="w-5 h-5 text-gray-600" />
        </button>
        <button aria-label='button' type='button' className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

// Messages Area Component
function MessagesArea({ chat }: { chat: Conversation }) {
  const mockMessages = [
    { id: 1, text: "Hey! How's the project going?", isSent: false, timestamp: "10:30 AM", status: 'READ' },
    { id: 2, text: "Going well! We're on schedule.", isSent: true, timestamp: "10:32 AM", status: 'READ' },
    { id: 3, text: "That's great to hear. When can we review the plans?", isSent: false, timestamp: "10:35 AM", status: 'READ' },
    { id: 4, text: "How about tomorrow at 2 PM?", isSent: true, timestamp: "10:36 AM", status: 'DELIVERED' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {mockMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: any }) {
  const StatusIcon = message.status === 'READ' ? CheckCheck : Check;
  
  return (
    <div className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${message.isSent ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            message.isSent
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-white text-gray-900 border border-gray-200'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${message.isSent ? 'justify-end' : 'justify-start'}`}>
          <span>{message.timestamp}</span>
          {message.isSent && <StatusIcon className="w-3 h-3" />}
        </div>
      </div>
    </div>
  );
}

// Message Input Component
function MessageInput() {
  const [message, setMessage] = useState('');

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-2">
        <button aria-label='button' type='button' className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 flex items-center px-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent py-3 focus:outline-none text-gray-900"
          />
          <button aria-label='button' type='button' className="p-1 hover:bg-gray-200 rounded transition-colors">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <button aria-label='button' type='button' className="p-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors">
          <Send className="w-5 h-5 text-gray-900" />
        </button>
      </div>
    </div>
  );
}

// New Conversation Modal Component
function NewConversationModal({ onClose }: { onClose: () => void }) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [conversationName, setConversationName] = useState('');
  
  const mockUsers = [
    { id: 1, name: "John Builder", company: "BuildCorp", avatar: "JB" },
    { id: 2, name: "Sarah Architect", company: "DesignPro", avatar: "SA" },
    { id: 3, name: "Mike Constructor", company: "BuildRight", avatar: "MC" },
    { id: 4, name: "Alice Engineer", company: "TechBuild", avatar: "AE" },
  ];

  const toggleUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">New Conversation</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conversation Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Downtown Project Team"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Participants
            </label>
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedUsers.includes(user.id)
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.company}</p>
                  </div>
                  {selectedUsers.includes(user.id) && (
                    <CheckCheck className="w-5 h-5 text-yellow-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={selectedUsers.length === 0}
            className="flex-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Create ({selectedUsers.length})
          </button>
        </div>
      </div>
    </div>
  );
}