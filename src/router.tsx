import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/pages/Layout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { CaseStudies } from "@/pages/CaseStudies";
import { Blog } from "@/pages/Blog";
import { Contact } from "@/pages/Contact";
import { NotFound } from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
      { path: "/case-studies", element: <CaseStudies /> },
      { path: "/blog", element: <Blog /> },
      { path: "/contact", element: <Contact /> },
      // catch-all: matches any path not explicitly defined above
      { path: "*", element: <NotFound /> },
    ],
  },
]);
