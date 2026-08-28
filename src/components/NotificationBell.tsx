"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  CheckCheck,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface NotificationItem {
  _id: string;
  type: "new_enrollment" | "new_question" | "question_reply";
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [isAuthenticated]);

  // Poll every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, link: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark notification read:", e);
    } finally {
      setIsOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await fetch("/api/notifications/read-all", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all read:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-black/5 transition relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red text-white text-[10px] font-black flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-2xl shadow-2xl z-50 overflow-hidden space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-extrabold text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="text-[11px] font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition"
              >
                {loading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )}
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={n.link}
                  onClick={() => handleMarkAsRead(n._id, n.link)}
                  className={`p-3.5 flex items-start gap-3 text-xs transition-colors block ${
                    n.isRead
                      ? "hover:bg-black/5 opacity-75"
                      : "bg-primary-tint/30 hover:bg-primary-tint/50 font-medium"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-surface border border-border text-primary shrink-0 mt-0.5">
                    {n.type === "new_enrollment" && <BookOpen className="w-3.5 h-3.5 text-green" />}
                    {n.type === "new_question" && <HelpCircle className="w-3.5 h-3.5 text-gold" />}
                    {n.type === "question_reply" && <MessageSquare className="w-3.5 h-3.5 text-primary" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-xs leading-snug break-words">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-muted block mt-1">
                      {getRelativeTime(n.createdAt)}
                    </span>
                  </div>

                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
