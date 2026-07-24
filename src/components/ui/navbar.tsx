import {
  StaggeredMenu,
  type StaggeredMenuItem,
  type StaggeredMenuSocialItem,
} from "@/components/ui/staggered-menu";

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
  { label: "Instagram", link: "#" },
  { label: "LinkedIn", link: "#" },
  { label: "Twitter", link: "#" },
];

export function Navbar() {
  return (
    <StaggeredMenu
      position="right"
      items={MENU_ITEMS}
      socialItems={SOCIAL_ITEMS}
      displaySocials
      displayItemNumbering
      // two brand tones for the staggered colour wipe, deep plum lands first, terracotta on top
      colors={["var(--color-deep-plum)", "var(--color-terracotta)"]}
      logoUrl="/logo-placeholder.svg"
      menuButtonColor="var(--color-ivory)"
      openMenuButtonColor="var(--color-ivory)"
      changeMenuColorOnOpen={false}
      accentColor="var(--color-amber-gold)"
      isFixed
    />
  );
}
