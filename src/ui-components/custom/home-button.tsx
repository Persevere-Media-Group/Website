import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import SpecularButton from "@/ui-components/primitive/specular-button";
import "./home-button.css";

interface HomeButtonProps {
  buttonColor: string;
}

// Sits beside the menu toggle (see .sm-header-actions in staggered-menu.css),
// hidden on the home page itself via the isHome check in Navbar.
export function HomeButton({ buttonColor }: HomeButtonProps) {
  const navigate = useNavigate();

  return (
    <SpecularButton
      size="sm"
      radius={12}
      textColor={buttonColor}
      tintOpacity={0.08}
      blur={14}
      proximity={200}
      className="sm-home-button"
      aria-label="Go to home page"
      onClick={() => navigate("/")}
    >
      <Home size={18} strokeWidth={2} aria-hidden="true" />
    </SpecularButton>
  );
}
