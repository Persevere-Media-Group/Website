import {
  StaggeredMenu,
  type StaggeredMenuItem,
  type StaggeredMenuSocialItem,
} from "@/components/ui/staggered-menu";
import { useHeaderContrast } from "@/hooks/useHeaderContrast";

// placeholder tabs, structured to match StaggeredMenuItem's shape, swap these for your real site sections
const MENU_ITEMS: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to home page", link: "#" },
  { label: "About", ariaLabel: "Learn about us", link: "#" },
  { label: "Services", ariaLabel: "View our services", link: "#" },
  { label: "Case Studies", ariaLabel: "View our case studies", link: "#" },
  { label: "Blog", ariaLabel: "Read our blog", link: "#" },
  { label: "Contact", ariaLabel: "Get in touch", link: "#" },
];

const SOCIAL_ITEMS: StaggeredMenuSocialItem[] = [
  { label: "@perseveremedia", link: "https://www.instagram.com/persevere.media/" },
  { label: "@calummakesvideos", link: "https://www.instagram.com/calummakesvideos/" },
  { label: "@keirdoesads", link: "https://www.instagram.com/keirdoesads/" },
];

export function Navbar() {
  // reads the actual background colour behind the fixed header as the page scrolls,
  // ivory sections need oxblood text, everything else (terracotta hero, etc) needs ivory text
  const buttonColor = useHeaderContrast("var(--color-oxblood)", "var(--color-ivory)");

  return (
    <StaggeredMenu
      position="right"
      items={MENU_ITEMS}
      socialItems={SOCIAL_ITEMS}
      displaySocials
      displayItemNumbering
      colors={["var(--color-deep-plum)", "var(--color-terracotta)"]}
      menuButtonColor={buttonColor}
      openMenuButtonColor="var(--color-ivory)"
      changeMenuColorOnOpen
      accentColor="var(--color-amber-gold)"
      isFixed
    />
  );
}
