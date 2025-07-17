// lib/utils/toast.js
import toast from "react-hot-toast";

// Custom toast configurations
const toastConfig = {
  duration: 4000,
  position: "top-right",
  style: {
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
    maxWidth: "400px",
  },
  // Custom styles for different toast types
  success: {
    iconTheme: {
      primary: "#10b981",
      secondary: "#ffffff",
    },
    style: {
      background: "#f0fdf4",
      color: "#065f46",
      border: "1px solid #bbf7d0",
    },
  },
  error: {
    iconTheme: {
      primary: "#ef4444",
      secondary: "#ffffff",
    },
    style: {
      background: "#fef2f2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },
  },
  loading: {
    iconTheme: {
      primary: "#0891b2",
      secondary: "#ffffff",
    },
    style: {
      background: "#f0f9ff",
      color: "#0c4a6e",
      border: "1px solid #bae6fd",
    },
  },
};

// Success toast
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    ...toastConfig,
    ...toastConfig.success,
    ...options,
  });
};

// Error toast
export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    ...toastConfig,
    ...toastConfig.error,
    ...options,
  });
};

// Loading toast
export const showLoadingToast = (message, options = {}) => {
  return toast.loading(message, {
    ...toastConfig,
    ...toastConfig.loading,
    ...options,
  });
};

// Promise toast - handles loading, success, and error states automatically
export const showPromiseToast = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong",
    },
    {
      ...toastConfig,
      success: {
        ...toastConfig.success,
        ...options.success,
      },
      error: {
        ...toastConfig.error,
        ...options.error,
      },
      loading: {
        ...toastConfig.loading,
        ...options.loading,
      },
    }
  );
};

// Custom toast with icon
export const showCustomToast = (message, icon, options = {}) => {
  return toast(message, {
    ...toastConfig,
    icon,
    ...options,
  });
};

// Update existing toast
export const updateToast = (toastId, message, type = "success", options = {}) => {
  const config = type === "success" ? toastConfig.success : toastConfig.error;

  return toast[type](message, {
    id: toastId,
    ...toastConfig,
    ...config,
    ...options,
  });
};

// Dismiss toast
export const dismissToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss(); // Dismiss all toasts
  }
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Subscription-specific toast helpers
export const subscriptionToasts = {
  upgradeSuccess: () => showSuccessToast("🎉 Successfully upgraded to Premium!", { duration: 5000 }),
  upgradeError: (error) => showErrorToast(error || "Failed to upgrade subscription"),
  cancelSuccess: () => showSuccessToast("✅ Subscription canceled successfully"),
  cancelError: (error) => showErrorToast(error || "Failed to cancel subscription"),
  restoreSuccess: () => showSuccessToast("🔄 Subscription restored successfully!"),
  restoreError: (error) => showErrorToast(error || "No active subscription found to restore"),

  // Promise-based toasts for async operations
  upgradePromise: (promise) =>
    showPromiseToast(promise, {
      loading: "Processing upgrade...",
      success: "🎉 Successfully upgraded to Premium!",
      error: "Failed to upgrade subscription",
    }),

  cancelPromise: (promise) =>
    showPromiseToast(promise, {
      loading: "Canceling subscription...",
      success: "✅ Subscription canceled successfully",
      error: "Failed to cancel subscription",
    }),

  restorePromise: (promise) =>
    showPromiseToast(promise, {
      loading: "Restoring purchases...",
      success: "🔄 Subscription restored successfully!",
      error: "No active subscription found to restore",
    }),
};

export default {
  success: showSuccessToast,
  error: showErrorToast,
  loading: showLoadingToast,
  promise: showPromiseToast,
  custom: showCustomToast,
  update: updateToast,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  subscription: subscriptionToasts,
};
