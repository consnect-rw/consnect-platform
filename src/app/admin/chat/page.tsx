"use client";

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Send,
  X,
  Loader2,
  CheckCheck,
  Check,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { fetchAllUsers } from '@/server/messaging/user';
import { createMessage, fetchMessages } from '@/server/messaging/message';
import { useView } from '@/context/ViewContext';
import { EDeviceView } from '@/types/enums';

interface MessageData {
  id: string;
  message: string;
  status?: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  receiver?: {
    id: string;
    name: string | null;
    image?: string | null;
  } | null;
}

interface UserForChat {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  role?: string;
  company?: {
    id: string;
    name: string;
  } | null;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { deviceType } = useView();
  const isMobileView = deviceType === EDeviceView.MOBILE;

  // Fetch all users
  const { data: allUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['all-users', searchQuery],
    queryFn: () => fetchAllUsers(user?.id, searchQuery || undefined),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch messages with selected user
  const { data: messagesResponse, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', user?.id, selectedUserId],
    queryFn: () =>
      fetchMessages(
        {
          id: true,
          message: true,
          createdAt: true,
          senderId: true,
          receiverId: true,
          sender: { select: { id: true, name: true, image: true } },
          receiver: { select: { id: true, name: true, image: true } },
        },
        {
          OR: [
            { AND: [{ senderId: user?.id || '' }, { receiverId: selectedUserId || '' }] },
            { AND: [{ senderId: selectedUserId || '' }, { receiverId: user?.id || '' }] },
          ],
        },
        100,
        0,
        { createdAt: 'asc' }
      ),
    enabled: !!user?.id && !!selectedUserId,
  });

  const messagesData = messagesResponse?.data || [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent: string) => {
      if (!selectedUserId) return;
      await createMessage({
        message: messageContent,
        status: 'SENT',
        sender: { connect: { id: user?.id || '' } },
        receiver: { connect: { id: selectedUserId } },
      });
    },
    onSuccess: () => {
      setMessageText('');
      setAttachmentFile(null);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
  });

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessageMutation.mutate(messageText);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
    }
  };

  const selectedUser = allUsers.find((u) => u.id === selectedUserId);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Real-time messaging with platform members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat List */}
        <div
          className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${
            isMobileView && selectedUserId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {loadingUsers ? (
              <LoadingSkeletons />
            ) : allUsers.length > 0 ? (
              allUsers.map((u) => (
                <UserChatItem
                  key={u.id}
                  user={u}
                  isSelected={selectedUserId === u.id}
                  onClick={() => setSelectedUserId(u.id)}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-gray-500 text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedUser ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                {isMobileView && (
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}

                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${
                  selectedUser.role === 'ADMIN'
                    ? 'bg-linear-to-br from-purple-400 to-purple-500'
                    : 'bg-linear-to-br from-yellow-400 to-yellow-500'
                }`}>
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image as string}
                      alt={selectedUser.name || ''}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(selectedUser.name)
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{selectedUser.name || 'User'}</h3>
                    {selectedUser.role === 'ADMIN' && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {selectedUser.company?.name || selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voice Call">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Video Call">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                </div>
              ) : messagesData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messagesData.map((msg: MessageData) => (
                  <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === user?.id} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
              {attachmentFile && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{attachmentFile.name}</span>
                  </div>
                  <button
                    onClick={() => setAttachmentFile(null)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAttachmentClick}
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  title="File attachment"
                />

                <label htmlFor="message-input" className="sr-only">
                  Message input
                </label>
                <input
                  id="message-input"
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending || !messageText.trim()}
                  className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
            <div className="text-center">
              <MessageCircle className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start a Conversation</h2>
              <p className="text-gray-500 max-w-sm">Select a user from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// User Chat Item Component
function UserChatItem({
  user,
  isSelected,
  onClick,
}: {
  user: UserForChat;
  isSelected: boolean;
  onClick: () => void;
}) {
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left ${
        isSelected ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${
        user.role === 'ADMIN'
          ? 'bg-linear-to-br from-purple-400 to-purple-500'
          : 'bg-linear-to-br from-yellow-400 to-yellow-500'
      }`}>
        {user.image ? (
          <img
            src={user.image as string}
            alt={user.name || ''}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitials(user.name)
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">{user.name || 'User'}</h3>
          {user.role === 'ADMIN' && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium shrink-0">
              Admin
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">
          {user.company?.name || user.email}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-xs text-gray-500">Active</p>
        </div>
      </div>
    </button>
  );
}

// Message Bubble Component
function MessageBubble({
  message,
  isOwn,
}: {
  message: MessageData;
  isOwn: boolean;
}) {
  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-sm whitespace-normal">{message.message}</p>
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'text-yellow-100' : 'text-gray-500'}`}>
          <span className="text-xs">{formatTime(new Date(message.createdAt))}</span>
          {isOwn && (
            <>
              {message.status === 'READ' ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Skeletons
function LoadingSkeletons() {
  return (
    <div className="space-y-2 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 p-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}