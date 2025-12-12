"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2, User, Info } from "lucide-react";
import { adminService, OrderComment } from "@/app/services/adminService";
import toast from "react-hot-toast";

interface OrderCommentsProps {
  orderId: string;
  userRole: string;
  onClose?: () => void;
  readOnly?: boolean;
}

const OrderComments: React.FC<OrderCommentsProps> = ({
  orderId,
  userRole,

  readOnly = false,
}) => {
  const [comments, setComments] = useState<OrderComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ FIX: Add cleanup to prevent double requests
  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await adminService.getOrderComments(orderId);

        if (isMounted) {
          setComments(response.comments || []);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);

        // ✅ Better error handling with status code check
        if (error && typeof error === "object" && "response" in error) {
          const response = (
            error as {
              response?: {
                status?: number;
                data?: { error?: string; message?: string };
              };
            }
          ).response;

          if (response?.status === 403) {
            if (isMounted) {
              toast.error("You do not have permission to view comments");
            }
          } else if (response?.status === 404) {
            if (isMounted) {
              // Order not found or no comments - not an error
              console.log("No comments found for this order");
            }
          } else {
            if (isMounted) {
              toast.error("Failed to load comments");
            }
          }
        } else if (isMounted) {
          toast.error("Failed to load comments");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    // ✅ Cleanup function
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      await adminService.addOrderComment(orderId, newComment.trim());
      toast.success("Comment added successfully");
      setNewComment("");

      // ✅ Refetch comments after adding
      const response = await adminService.getOrderComments(orderId);
      setComments(response.comments || []);
    } catch (error) {
      console.error("Failed to add comment:", error);

      // ✅ Better error messages
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as {
            response?: {
              status?: number;
              data?: { error?: string; message?: string };
            };
          }
        ).response;

        if (response?.status === 403) {
          toast.error("You do not have permission to add comments");
        } else if (response?.data?.error) {
          toast.error(response.data.error);
        } else if (response?.data?.message) {
          toast.error(response.data.message);
        } else {
          toast.error("Failed to add comment");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add comment");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare size={20} />
            <h3 className="text-lg font-semibold">Order Comments</h3>
            {readOnly && (
              <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-medium">
                Read Only
              </span>
            )}
          </div>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>
        <p className="text-xs text-blue-100 mt-1">
          Order ID: {orderId.slice(0, 13)}...
        </p>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No comments yet</p>
            {!readOnly && (
              <p className="text-gray-400 text-xs mt-1">
                Be the first to add a comment
              </p>
            )}
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* Add Comment Form */}
      {!readOnly ? (
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleAddComment} className="flex space-x-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="border-t border-gray-200 p-4 bg-blue-50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Info size={16} className="text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                View-Only Mode
              </p>
              <p className="text-xs text-blue-700 mt-1">
                {userRole === "admin"
                  ? "You are viewing comments from printing and plant teams. Admin users cannot add comments."
                  : "This order is completed. Comments are view-only."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Comment Card Component
interface CommentCardProps {
  comment: OrderComment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            <User size={20} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${adminService.getRoleBadgeColor(
                comment.role
              )}`}
            >
              {comment.role.charAt(0).toUpperCase() + comment.role.slice(1)}
            </span>
            <span className="text-xs text-gray-500">
              {adminService.formatCommentTime(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed break-words">
            {comment.comment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderComments;
