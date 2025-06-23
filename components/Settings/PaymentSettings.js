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
            <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Add Payment Method
            </button>
            <button className="w-full sm:w-auto border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition">
              View Billing History
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-4">Subscription</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">Current plan: Premium</p>
          <button className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
