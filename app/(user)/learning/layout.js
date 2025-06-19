export const metadata = {
  title: "My Learning",
  description: "User Learning Dashboard",
};

const UserLearningLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">{children}</main>
    </div>
  );
};

export default UserLearningLayout;
