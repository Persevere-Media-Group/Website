import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/pages/Layout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { ServicesKeir } from "@/pages/ServicesKeir";
import { ServicesCalum } from "@/pages/ServicesCalum";
import { CaseStudies } from "@/pages/CaseStudies";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { Contact } from "@/pages/Contact";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { NotFound } from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
      { path: "/services/keir", element: <ServicesKeir /> },
      { path: "/services/calum", element: <ServicesCalum /> },
      { path: "/case-studies", element: <CaseStudies /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:slug", element: <BlogPost /> },
      { path: "/contact", element: <Contact /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      // catch-all: matches any path not explicitly defined above
      { path: "*", element: <NotFound /> },
    ],
  },
]);
