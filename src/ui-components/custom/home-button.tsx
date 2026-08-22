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
      tint="#ffffff"
      tintOpacity={0}
      blur={0}
      textColor={buttonColor}
      lineColor="#ffffff"
      baseColor="#525252"
      intensity={1}
      shineSize={10}
      shineFade={40}
      thickness={1}
      speed={0.35}
      followMouse
      proximity={200}
      autoAnimate={false}
      className="sm-home-button"
      aria-label="Go to home page"
      onClick={() => navigate("/")}
      type="button"
    >
      <Home size={18} strokeWidth={2} aria-hidden="true" />
    </SpecularButton>
  );
}
