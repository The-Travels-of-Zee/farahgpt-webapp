export const CloseAccount = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Close Account</h2>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-md sm:text-lg font-semibold text-red-800 mb-2 sm:mb-4">Danger Zone</h3>
          <p className="text-red-700 text-sm sm:text-base mb-2 sm:mb-4">
            Once you close your account, there is no going back. Please be certain.
          </p>
          <p className="text-red-600 text-xs sm:text-sm mb-4 sm:mb-6">
            This action will permanently delete your account and all associated data.
          </p>
          <button className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Close Account
          </button>
        </div>
      </div>
    </div>
  );
};
