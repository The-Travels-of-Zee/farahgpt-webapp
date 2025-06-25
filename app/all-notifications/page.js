"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Info, Clock, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { dummyNotifications } from "@/constants";

const AllNotification = () => {
  const [activeTab, setActiveTab] = useState("notifications");

  const [notificationList, setNotificationList] = useState(dummyNotifications);

  const [archivedNotifications, setArchivedNotifications] = useState(dummyNotifications.filter((n) => n.archivedAt));

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const archiveNotification = (id) => {
    const notificationToArchive = notificationList.find((n) => n.id === id);
    if (notificationToArchive) {
      const archivedNotification = {
        ...notificationToArchive,
        unread: false,
        archivedAt: "Just now",
      };
      setArchivedNotifications((prev) => [archivedNotification, ...prev]);
      setNotificationList((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const archiveAll = () => {
    const toArchive = notificationList.map((n) => ({
      ...n,
      unread: false,
      archivedAt: "Just now",
    }));
    setArchivedNotifications((prev) => [...toArchive, ...prev]);
    setNotificationList([]);
  };

  const unarchiveNotification = (id) => {
    const notificationToUnarchive = archivedNotifications.find((n) => n.id === id);
    if (notificationToUnarchive) {
      const { archivedAt, ...restoredNotification } = notificationToUnarchive;
      setNotificationList((prev) => [restoredNotification, ...prev]);
      setArchivedNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const deleteArchivedNotification = (id) => {
    setArchivedNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllArchived = () => {
    setArchivedNotifications([]);
  };

  const unreadCount = notificationList.filter((n) => n.unread).length;

  const TabButton = ({ id, label, count, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`relative px-6 py-3 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300"
      }`}
    >
      <span className="flex items-center gap-2">
        {label}
        {count > 0 && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );

  const NotificationItem = ({ notification, onMarkAsRead, onArchive, onUnarchive, onDelete, isArchived = false }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition group ${
        notification.unread ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex space-x-3 sm:space-x-4 items-start">
        <div className="mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h2>
                {notification.unread && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500 flex-wrap gap-1">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {notification.time}
                </div>
                {isArchived && (
                  <div className="flex items-center">
                    <span className="mx-2">•</span>
                    <Archive className="h-3 w-3 mr-1" />
                    Archived {notification.archivedAt}
                  </div>
                )}
              </div>
            </div>
            {/* Mobile: Always visible action buttons, Desktop: Show on hover */}
            <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {!isArchived ? (
                <>
                  {notification.unread && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      className="p-2 sm:p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 touch-manipulation"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-5 w-5 sm:h-4 sm:w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(notification.id);
                    }}
                    className="p-2 sm:p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 touch-manipulation"
                    title="Archive"
                  >
                    <Archive className="h-5 w-5 sm:h-4 sm:w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnarchive(notification.id);
                    }}
                    className="p-2 sm:p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 touch-manipulation"
                    title="Unarchive"
                  >
                    <ArchiveRestore className="h-5 w-5 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                    className="p-2 sm:p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-600 touch-manipulation"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h1>

          {/* Tabs */}
          <div className="flex space-x-0 border-b border-gray-200 -mb-px overflow-x-auto">
            <TabButton
              id="notifications"
              label="Active"
              count={unreadCount}
              isActive={activeTab === "notifications"}
              onClick={setActiveTab}
            />
            <TabButton
              id="archived"
              label="Archived"
              count={archivedNotifications.length}
              isActive={activeTab === "archived"}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "notifications" ? (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Action Buttons */}
              {notificationList.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-100 gap-2">
                  <span className="text-sm text-gray-600">
                    {notificationList.length} notification{notificationList.length !== 1 ? "s" : ""}
                    {unreadCount > 0 && ` (${unreadCount} unread)`}
                  </span>
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={markAllAsRead}
                      className="text-blue-600 hover:text-blue-800 font-medium touch-manipulation"
                    >
                      Mark All as Read
                    </button>
                    <button
                      onClick={archiveAll}
                      className="text-gray-600 hover:text-gray-800 font-medium touch-manipulation"
                    >
                      Archive All
                    </button>
                  </div>
                </div>
              )}

              {/* Notification List */}
              <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                {notificationList.length > 0 ? (
                  notificationList.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onArchive={archiveNotification}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <Bell className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                    <p className="font-medium">No active notifications</p>
                    <p className="text-sm mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="archived"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Archive Action Buttons */}
              {archivedNotifications.length > 0 && (
                <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    {archivedNotifications.length} archived notification{archivedNotifications.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex gap-3">
                    <button onClick={clearAllArchived} className="text-sm text-red-600 hover:text-red-800 font-medium">
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {/* Archived Notification List */}
              <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                {archivedNotifications.length > 0 ? (
                  archivedNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onUnarchive={unarchiveNotification}
                      onDelete={deleteArchivedNotification}
                      isArchived={true}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <Archive className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                    <p className="font-medium">No archived notifications</p>
                    <p className="text-sm mt-1">Archived notifications will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllNotification;
