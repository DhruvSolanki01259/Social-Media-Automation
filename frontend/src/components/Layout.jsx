import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();

  // Define routes that should display Header and Footer
  const layoutRoutes = [
    "/", // Home
    "/about-us", // About page
    "/contact", // Contact page
    "/profile", // User Profile
    "/analytics", // Analytics Dashboard
    "/content-studio", // CRUD Posts
  ];

  // Define routes that should NOT display Header and Footer
  const excludedRoutes = ["/login", "/signup"];

  // Determine if the current path is one of the valid layout routes
  const isLayoutRoute = layoutRoutes.includes(pathname);

  // Determine if the current path is excluded (auth routes)
  const isExcludedRoute = excludedRoutes.includes(pathname);

  // If it's not in layoutRoutes or is excluded, hide Header/Footer
  const showLayout = isLayoutRoute && !isExcludedRoute;

  return (
    <div className='flex flex-col min-h-screen bg-[#F8FAFC] text-[#012A4A] transition-all duration-300'>
      {/* Show Header only for allowed routes */}
      {showLayout && <Header />}

      {/* Main content */}
      <main
        className={`flex-grow ${
          showLayout ? "pt-20 px-4 md:px-8 lg:px-16" : ""
        }`}>
        {children}
      </main>

      {/* Show Footer only for allowed routes */}
      {showLayout && <Footer />}
    </div>
  );
};

export default Layout;
