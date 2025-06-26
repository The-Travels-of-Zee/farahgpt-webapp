import Button from "@/components/ui/Button";

// PaymentSettings.js
const PaymentSettings = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Payment Settings</h2>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-4">Payment Methods</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
            Manage your payment methods and billing information.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
            <Button variant="primarySettings">Add Payment Method</Button>
            <Button variant="outline">View Billing History</Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-4">Subscription</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">Current plan: Premium</p>
          <Button variant="secondary">Manage Subscription</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
