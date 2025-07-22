"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  MoreVertical,
  Loader2,
  Edit3,
} from "lucide-react";
import { fetchWithdrawals, updateWithdrawalStatus } from "@/lib/actions/withdrawalsActions";
import { getInstructorProfile } from "@/lib/actions/instructorActions";

// Utilities
const formatDate = (date) =>
  new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatAmount = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "text-yellow-700 bg-yellow-50 ring-yellow-300";
    case "approved":
      return "text-green-700 bg-green-50 ring-green-300";
    case "rejected":
      return "text-red-700 bg-red-50 ring-red-300";
    default:
      return "text-gray-700 bg-gray-100 ring-gray-300";
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "approved":
      return <CheckCircle className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

// Card Component
const WithdrawalCard = ({ withdrawal, index, onStatusUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(true);

  useEffect(() => {
    getInstructorProfile(withdrawal.seller_id)
      .then((res) => res.success && setSellerInfo(res.data))
      .finally(() => setLoadingSeller(false));
  }, [withdrawal.seller_id]);

  const handleStatusUpdate = async (status) => {
    setIsUpdating(true);
    const res = await updateWithdrawalStatus(withdrawal.id, status);
    if (res.success) {
      onStatusUpdate(withdrawal.id, status);
    } else {
      alert("Error updating status: " + res.error);
    }
    setIsUpdating(false);
    setShowStatusModal(false);
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-xl border border-gray-200 p-6 shadow hover:shadow-md transition-all"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{formatAmount(withdrawal.amount)}</h3>
              <p className="text-sm text-gray-500">Withdrawal #{withdrawal.id}</p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
                <button
                  onClick={() => {
                    setShowStatusModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Update Status
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Seller Info */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-700">
          {loadingSeller ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : sellerInfo ? (
            <>
              <div>
                <strong>Name:</strong> {sellerInfo.name}
              </div>
              <div>
                <strong>Email:</strong> {sellerInfo.email}
              </div>
              <div>
                <strong>Revenue:</strong> {formatAmount(sellerInfo.total_revenue)}
              </div>
              <div>
                <strong>Students:</strong> {sellerInfo.total_students}
              </div>
            </>
          ) : null}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(withdrawal.created_at)}
          </div>
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ring-2 ${getStatusColor(
              withdrawal.status
            )} font-medium`}
          >
            {getStatusIcon(withdrawal.status)}
            <span className="capitalize">{withdrawal.status}</span>
          </div>
        </div>
      </motion.div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative z-10"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Update Withdrawal Status</h3>

              <div className="space-y-3">
                {["pending", "approved", "rejected"].map((status) => {
                  const isSelected = status === withdrawal.status;
                  const baseClass =
                    "w-full flex items-center justify-between px-4 py-2 rounded-md border text-sm font-medium transition";
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={isUpdating || isSelected}
                      className={`${baseClass} ${
                        isSelected
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                      }`}
                    >
                      <span className="capitalize flex items-center gap-2">
                        {getStatusIcon(status)}
                        {status}
                      </span>
                      {isSelected && <span className="text-xs">(Current)</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Main Component
const WithdrawalsManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWithdrawals = async () => {
    setLoading(true);
    const res = await fetchWithdrawals();
    if (res.success) {
      setWithdrawals(res.data);
      setError(null);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const updateStatus = (id, status) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status, updated_at: new Date().toISOString() } : w))
    );
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Withdrawals Management</h1>
        <button
          onClick={loadWithdrawals}
          className="mt-4 sm:mt-0 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Error loading withdrawals: {error}</span>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <DollarSign className="w-10 h-10 mx-auto mb-2" />
          <p>No withdrawals found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {withdrawals.map((wd, idx) => (
            <WithdrawalCard key={wd.id} withdrawal={wd} index={idx} onStatusUpdate={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WithdrawalsManagement;
