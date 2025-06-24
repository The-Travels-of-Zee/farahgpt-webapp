import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Explore Courses",
  description: "Explore a wide range of courses to increase in your deen and knowledge",
};

const ExploreCoursesLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default ExploreCoursesLayout;
