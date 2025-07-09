export const metadata = {
  title: "Course",
  description: "User Learning Course Chat",
};

const UserLearningLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">{children}</main>
    </div>
  );
};

export default UserLearningLayout;
