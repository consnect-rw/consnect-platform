"use client";

import { useState } from "react";
import { Search, Mail, MailOpen, Phone, Calendar, Image, X, ChevronLeft, ChevronRight, Filter, CheckCircle, Clock } from "lucide-react";
import { SSupportMessage, TSupportMessage } from "@/types/management/support-message";
import { fetchSupportMessages, updateSupportMessage } from "@/server/management/support-message";
import { useQuery } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";


// Support Message Card Component
function SupportMessageCard({ message, onView }:{message: TSupportMessage, onView: (message: TSupportMessage) => void}) {
  const formatDate = (dateString:string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const onToggleRead = async () => {

  }
  return (
    <div className={`bg-white rounded-xl border-2 ${message.isRead ? 'border-gray-200' : 'border-yellow-400'} p-5 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${message.isRead ? 'bg-gray-100' : 'bg-yellow-100'}`}>
            {message.isRead ? (
              <MailOpen className="w-5 h-5 text-gray-600" />
            ) : (
              <Mail className="w-5 h-5 text-yellow-600" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 truncate">{message.name}</h3>
              {!message.isRead && (
                <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-medium rounded-full">New</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{message.email}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Phone className="w-3 h-3" />
              {message.phone}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          {formatDate(message.createdAt)}
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 mb-2">{message.subject}</h4>
        <p className="text-sm text-gray-700 line-clamp-2">{message.message}</p>
      </div>

      {message.images && message.images.length > 0 && (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <Image className="w-4 h-4" />
          <span>{message.images.length} attachment{message.images.length > 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => onView(message)}
          className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
        >
          View Message
        </button>
        <button
          type="button"
          onClick={onToggleRead}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
        >
          {message.isRead ? 'Mark Unread' : 'Mark Read'}
        </button>
      </div>
    </div>
  );
}

export default function AdminSupportPage() {
  const perPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedMessage, setSelectedMessage] = useState<TSupportMessage | null>(null);

     const {data: supportMessagesData, isLoading} = useQuery({
          queryKey: ['support-messages', currentPage,searchTerm, filterStatus],
          queryFn: () => fetchSupportMessages(SSupportMessage, {
               ...(searchTerm ? {
                    OR: [
                         { name: { contains: searchTerm, mode: 'insensitive' } },
                         { email: { contains: searchTerm, mode: 'insensitive' } },
                         { subject: { contains: searchTerm, mode: 'insensitive' } },
                    ]
               } :{}),
               ...(filterStatus === "UNREAD" ? { isRead: false } : {}),
               ...(filterStatus === "READ" ? { isRead: true } : {}),
          }, perPage, (currentPage -1) * perPage),
     });
     const totalMessages = supportMessagesData?.pagination.total ?? 0;
     const messages = supportMessagesData?.data ?? [];

  const totalPages = Math.ceil(totalMessages / perPage);
     const filteredMessages = messages;

  const unreadCount = messages.filter(msg => !msg.isRead).length;

     const handleToggleRead = async (id: string, isRead: boolean) => {
          const res = await updateSupportMessage(id, { isRead });
          if(res) {
               queryClient.invalidateQueries();
          }
     }

  const handleViewMessage = async(message: TSupportMessage) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      await updateSupportMessage(message.id, { isRead: true });
    }
  };

  const formatDateTime = (dateString: Date | string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Support Messages</h1>
            {unreadCount > 0 && (
              <span className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-full text-sm">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-gray-600">Manage customer inquiries and support requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Mail className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{totalMessages}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{totalMessages - unreadCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="flex gap-2">
              <select
               aria-label="Filter Messages"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="ALL">All Messages</option>
                <option value="UNREAD">Unread Only</option>
                <option value="READ">Read Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages Grid */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No messages found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {filteredMessages.map((message) => (
                <SupportMessageCard
                  key={message.id}
                  message={message}
                  onView={handleViewMessage}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalMessages)} of {totalMessages} messages
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-yellow-500 text-white font-medium'
                            : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div 
            className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMessage(null)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-3 rounded-lg ${selectedMessage.isRead ? 'bg-gray-100' : 'bg-yellow-100'}`}>
                    {selectedMessage.isRead ? (
                      <MailOpen className="w-6 h-6 text-gray-600" />
                    ) : (
                      <Mail className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedMessage.subject}</h2>
                    <p className="text-sm text-gray-600">From: {selectedMessage.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedMessage.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Received</p>
                      <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedMessage.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Message</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Attachments */}
                {selectedMessage.images && selectedMessage.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Attachments ({selectedMessage.images.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedMessage.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                            <button className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-white text-gray-900 rounded-lg text-sm font-medium">
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleToggleRead(selectedMessage.id, !selectedMessage.isRead);
                      setSelectedMessage({ ...selectedMessage, isRead: !selectedMessage.isRead });
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Reply via Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}