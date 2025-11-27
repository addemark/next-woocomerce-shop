import HomeMenu from "@/components/menu/homeMenu";
import SiteFooter from "@/components/layout/footer";
import { Fragment } from "react/jsx-runtime";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HomeMenu withhero={false} />
      <main className="min-h-screen container mx-auto">{children}</main>
      <SiteFooter />
    </div>
  );
}
