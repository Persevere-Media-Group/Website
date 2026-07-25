import { PopupWidget } from "react-calendly";

// same link used in HeroSection/CtaBanner, keep these in sync if it ever changes
const CALENDLY_URL = "https://calendly.com/keir-choosepersevere/30min";

export function FloatingCta() {
  return (
    <PopupWidget
      url={CALENDLY_URL}
      rootElement={document.getElementById("root")!}
      text="📞 Give us a bell!"
      color="#edb03e"
      textColor="#4a1f1d"
      branding={false}
    />
  );
}
