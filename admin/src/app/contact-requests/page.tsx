"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calendar,
  MessageSquare,
  Building,
  Loader2,
  RefreshCw,
  Eye,
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "sonner";
import { dashboardAPI, type ContactEntry } from "@/lib/api";

function ContactRequestsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactEntry | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContactRequests = async () => {
    try {
      setError(null);
      const response = await dashboardAPI.getAllContactRequests();
      if (response.success && response.data) {
        // Backend returns data: contacts array directly
        setContacts(response.data || []);
      } else {
        setError("Failed to fetch contact requests");
      }
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      setError("An error occurred while fetching contact requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchContactRequests();
    setRefreshing(false);
    toast.success("Contact requests refreshed");
  };

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInquiryTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Product Information": "bg-blue-100 text-blue-800",
      "Bulk & Wholesale Orders": "bg-green-100 text-green-800",
      "Custom Spice Blends": "bg-purple-100 text-purple-800",
      "Restaurant Supply": "bg-orange-100 text-orange-800",
      "Quality Concern": "bg-red-100 text-red-800",
      "Business Partnership": "bg-indigo-100 text-indigo-800",
      "General Questions": "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <AdminHeader 
          title="VD Foods Admin" 
          subtitle="Contact Requests" 
          currentPage="contact-requests" 
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contact Requests</h2>
              <p className="text-gray-600">Manage customer inquiries and contact requests</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
          {error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center text-red-800">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-red-400" />
                  <h3 className="text-lg font-semibold mb-2">Error Loading Contact Requests</h3>
                  <p className="text-red-600">{error}</p>
                  <Button
                    onClick={handleRefresh}
                    className="mt-4"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : contacts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Contact Requests</h3>
                  <p>No contact requests have been submitted yet.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {contacts.length} contact request{contacts.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <Card key={contact._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold text-gray-900">{contact.fullName}</span>
                            </div>
                            <Badge className={getInquiryTypeColor(contact.inquiryType)}>
                              {contact.inquiryType}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{contact.email}</span>
                            </div>
                            {contact.phoneNumber && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-4 w-4" />
                                <span>{contact.phoneNumber}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(contact.createdAt)}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700 overflow-hidden">
                              {contact.message.length > 100 
                                ? contact.message.substring(0, 100) + "..." 
                                : contact.message}
                            </p>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-4 flex items-center space-x-1"
                              onClick={() => setSelectedContact(contact)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5" />
                                <span>Contact Request Details</span>
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedContact && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="text-gray-900">{selectedContact.fullName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Inquiry Type</label>
                                    <Badge className={getInquiryTypeColor(selectedContact.inquiryType)}>
                                      {selectedContact.inquiryType}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-gray-900">{selectedContact.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                    <p className="text-gray-900">{selectedContact.phoneNumber || "Not provided"}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Submitted At</label>
                                    <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Message</label>
                                  <div className="mt-2 bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ContactRequestsPage;