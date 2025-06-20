export const NotificationSettings = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Notification Settings</h2>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Email Notifications</h3>
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-start sm:items-center text-sm sm:text-base">
              <input type="checkbox" className="mr-2 mt-1 sm:mt-0" defaultChecked />
              <span>Account updates</span>
            </label>
            <label className="flex items-start sm:items-center text-sm sm:text-base">
              <input type="checkbox" className="mr-2 mt-1 sm:mt-0" defaultChecked />
              <span>Security alerts</span>
            </label>
            <label className="flex items-start sm:items-center text-sm sm:text-base">
              <input type="checkbox" className="mr-2 mt-1 sm:mt-0" />
              <span>Marketing emails</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Push Notifications</h3>
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-start sm:items-center text-sm sm:text-base">
              <input type="checkbox" className="mr-2 mt-1 sm:mt-0" defaultChecked />
              <span>New messages</span>
            </label>
            <label className="flex items-start sm:items-center text-sm sm:text-base">
              <input type="checkbox" className="mr-2 mt-1 sm:mt-0" />
              <span>Daily reminders</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
