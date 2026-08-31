import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/containers/Layout";
import { Home } from "@/containers/Home";
import { About } from "@/containers/About";
import { Services } from "@/containers/Services";
import { ServicePersonPage } from "@/containers/ServicePage";
import { CaseStudies } from "@/containers/CaseStudies";
import { Blog } from "@/containers/Blog";
import { BlogPost } from "@/containers/BlogPost";
import { Contact } from "@/containers/Contact";
import { PrivacyPolicy } from "@/containers/PrivacyPolicy";
import { NotFound } from "@/containers/NotFound";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
      { path: "/services/ads", element: <ServicePersonPage name="keir" /> },
      { path: "/services/creative", element: <ServicePersonPage name="calum" /> },
      // old paths, kept as redirects so existing bookmarks/indexed links still resolve
      { path: "/services/keir", element: <Navigate to="/services/ads" replace /> },
      { path: "/services/calum", element: <Navigate to="/services/creative" replace /> },
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
