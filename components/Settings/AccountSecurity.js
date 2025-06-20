// AccountSecurity.js
export const AccountSecurity = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Account Security</h2>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-4">Password</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
            Update your password to keep your account secure.
          </p>
          <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Change Password
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-4">Two-Factor Authentication</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
            Add an extra layer of security to your account.
          </p>
          <button className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );
};
