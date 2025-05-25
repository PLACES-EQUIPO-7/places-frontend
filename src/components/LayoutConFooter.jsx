import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const LayoutConFooter = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutConFooter;
