import {
  StaggeredMenu,
  type StaggeredMenuItem,
  type StaggeredMenuSocialItem,
} from "@/components/primitive/staggered-menu";
import { useHeaderContrast } from "@/hooks/use-header-contrast";

const MENU_ITEMS: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "Learn about us", link: "/about" },
  { label: "Services", ariaLabel: "View our services", link: "/services" },
  { label: "Case Studies", ariaLabel: "View our case studies", link: "/case-studies" },
  { label: "Blog", ariaLabel: "Read our blog", link: "/blog" },
  { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

const SOCIAL_ITEMS: StaggeredMenuSocialItem[] = [
  { label: "@persevere.media", link: "https://www.instagram.com/persevere.media/" },
  { label: "@calummakesvideos", link: "https://www.instagram.com/calummakesvideos/" },
  { label: "@keirdoesads", link: "https://www.instagram.com/keirdoesads/" },
];

export function Navbar() {
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
