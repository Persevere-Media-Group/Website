import {
  StaggeredMenu,
  type StaggeredMenuItem,
  type StaggeredMenuSocialItem,
} from "@/ui-components/custom/staggered-menu";
import { HomeButton } from "@/ui-components/custom/home-button";
import { useHeaderContrast } from "@/hooks/use-header-contrast";

const MENU_ITEMS: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "Learn about us", link: "/about" },
  {
    label: "Services",
    ariaLabel: "View our services",
    link: "/services",
    children: [
      {
        label: "Ads",
        ariaLabel: "Paid Media & Performance Marketing",
        link: "/ads",
      },
      {
        label: "Creative",
        ariaLabel: "Creative Strategy, Content Creation & Organic Social",
        link: "/creative",
      },
    ],
  },
  // Case Studies and Blog routes still exist but are hidden from the menu
  // until there's actual content to show on them.
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
      headerActions={<HomeButton buttonColor={buttonColor} />}
    />
  );
}
