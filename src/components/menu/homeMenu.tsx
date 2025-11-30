"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import CartDrawer from "@/components/shop/cart/drawerCart";
import {
  Fragment,
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import logo from "@/public/art-white.svg";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { fetchCurrentOrder } from "@/lib/orders-client";

type NavigationItem = {
  name: string;
  featured: {
    name: string;
    href: string;
    imageSrc: string;
    imageAlt: string;
  }[];
};

type Navigation = {
  categories: NavigationItem[];
  pages: { name: string; href: string }[];
};

type Brand = {
  id: number;
  description?: string;
  name: string;
  slug?: string;
  image?: { src: string; alt?: string };
};

type User = { id: number; name?: string; email?: string; [k: string]: any };

const currencies = ["RON"];
const baseNavigation: Navigation = {
  categories: [],
  pages: [{ name: "Shop", href: "/shop" }],
};

// Context for shared state
const HomeMenuContext = createContext<{
  cartOpen: boolean;
  setCartOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navigation: Navigation;
  user: User | null;
  setUser: (user: User | null) => void;
  userLoading: boolean;
  userError: unknown;
  totalItems?: number;
  setTotalItems?: (count: number) => void;
} | null>(null);

type HomeMenuProps = {
  withhero?: boolean;
};

export const useHomeMenu = () => {
  const context = useContext(HomeMenuContext);
  if (!context) {
    throw new Error("HomeMenu subcomponents must be used within HomeMenu");
  }
  return context;
};

// Main HomeMenu component
function HomeMenu({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState<Navigation>(baseNavigation);
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState<number | undefined>(0);

  const fetchBrands = async () => {
    const response = await fetch("/api/brands");
    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }
    const { data } = await response.json();
    return data as Brand[];
  };

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const fetchUserMe = async () => {
    const res = await fetch("/api/user/me");
    if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
    return res.json();
  };

  const {
    data: mePayload,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchUserMe,
    enabled: true,
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    if (brands) {
      const brandFeatured = brands.map((brand) => ({
        name: brand.name,
        slug: brand.slug,
        href: `/brand/${brand.slug ?? brand.id}`,
        imageSrc: brand.image?.src ?? logo.src,
        imageAlt: brand.image?.alt ?? brand.name,
        description: brand.description ?? "",
      }));

      const categoriesGrouped = [
        {
          name: "Femei",
          featured: brandFeatured.filter((item) =>
            item.slug?.toLowerCase().includes("dama")
          ),
        },
        {
          name: "Bărbați",
          featured: brandFeatured.filter((item) =>
            item.slug?.toLowerCase().includes("barbat")
          ),
        },
      ].filter((category) => category.featured.length > 0);

      setNavigation((prev) => ({ ...prev, categories: categoriesGrouped }));
    }
  }, [brands]);

  useEffect(() => {
    if (mePayload) {
      const u = mePayload?.user ?? mePayload;
      setUser(u ?? null);
    }
  }, [mePayload]);

  useEffect(() => {
    if (userError) {
      setUser(null);
    }
  }, [userError]);

  return (
    <HomeMenuContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        navigation,
        user,
        setUser,
        userLoading,
        userError,
        cartOpen,
        setCartOpen,
        totalItems,
        setTotalItems,
      }}
    >
      {children}
    </HomeMenuContext.Provider>
  );
}

// Mobile Menu Subcomponent
HomeMenu.Mobile = function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, navigation, user } = useHomeMenu();

  return (
    <Dialog
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
      className="relative z-40 lg:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
      />
      <div className="fixed inset-0 z-40 flex">
        <DialogPanel
          transition
          className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
          <div className="flex px-4 pt-5 pb-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* Links */}
          {navigation.categories.length > 0 && (
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-12 px-4 py-6"
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-md bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <Link
                            href={item.href}
                            className="mt-6 block text-sm font-medium text-gray-900"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </Link>
                          <p
                            aria-hidden="true"
                            className="mt-1 text-sm text-gray-500"
                          >
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          )}

          <div className="space-y-6 border-t border-gray-200 px-4 py-6">
            {navigation.pages.map((page) => (
              <div key={page.name} className="flow-root">
                <Link
                  href={page.href}
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  {page.name}
                </Link>
              </div>
            ))}
          </div>

          {user && (
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <Link
                  href="/profile"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Hello, {user.name ?? user.email}
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-6 border-t border-gray-200 px-4 py-6">
            {/* Currency selector */}
            <form>
              <div className="-ml-2 inline-grid grid-cols-1">
                <select
                  id="mobile-currency"
                  name="currency"
                  aria-label="Currency"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-0.5 pr-7 pl-2 text-base font-medium text-gray-700 group-hover:text-gray-800 focus:outline-2 sm:text-sm/6"
                >
                  {currencies.map((currency) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-1 size-5 self-center justify-self-end fill-gray-500"
                />
              </div>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

// Desktop Navigation Subcomponent
HomeMenu.Desktop = function DesktopNavigation() {
  const { navigation } = useHomeMenu();
  const pathname = usePathname();
  return (
    <div className="hidden h-full lg:flex">
      {/* Flyout menus */}
      <PopoverGroup className="inset-x-0 bottom-0 px-4">
        <div className="flex h-full justify-center space-x-8">
          {navigation.categories.map((category) => (
            <Popover key={category.name} className="flex">
              <div className="relative flex">
                <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-white transition-colors duration-200 ease-out focus:outline-0">
                  {category.name}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-white"
                  />
                </PopoverButton>
              </div>
              <PopoverPanel
                transition
                className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
              >
                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 top-1/2 bg-white shadow-sm"
                />
                <div className="relative bg-white">
                  <div className="mx-auto max-w-7xl px-8">
                    <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-md bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <Link
                            href={item.href}
                            className="mt-4 block font-medium text-gray-900"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </Link>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverPanel>
            </Popover>
          ))}
          {navigation.pages.map((page) => (
            <Link
              key={page.name}
              href={page.href}
              className={clsx(
                "flex items-center text-sm font-medium text-white",
                pathname === page.href && "border-b-2 border-b-white"
              )}
            >
              {page.name}
            </Link>
          ))}
        </div>
      </PopoverGroup>
    </div>
  );
};

// Navigation Header Subcomponent
HomeMenu.Header = function NavigationHeader() {
  const {
    setMobileMenuOpen,
    user,
    setUser,
    userLoading,
    setCartOpen,
    totalItems,
    setTotalItems,
  } = useHomeMenu();
  const {
    data: currentOrder,
    isLoading: orderLoading,
    isError: orderError,
  } = useQuery({
    queryKey: ["order", "current"],
    queryFn: fetchCurrentOrder,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // 30 seconds is enough for header badge
  });
  useEffect(() => {
    const itemsIncart =
      orderError || !currentOrder
        ? 0
        : (currentOrder.line_items ?? []).reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
          );
    setTotalItems?.(itemsIncart);
  }, [currentOrder]);

  const signoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      if (!res.ok) throw new Error(`Sign out failed: ${res.status}`);
    },
    onSuccess: () => {
      setUser(null);
    },
    onError: (error: any) => {
      console.error("Sign out error:", error);
    },
  });

  // Avoid text flicker while the auth state is still being resolved
  const [hasResolvedUser, setHasResolvedUser] = useState(false);
  useEffect(() => {
    if (!userLoading) {
      setHasResolvedUser(true);
    }
  }, [userLoading]);

  const renderAuthActions = () => {
    if (!hasResolvedUser) {
      return (
        <div
          className="h-5 w-28 animate-pulse rounded-full bg-white/20"
          aria-hidden
        />
      );
    }

    if (!user) {
      return (
        <>
          <Link
            href="/signin"
            className="text-sm font-medium text-white hover:text-gray-100"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-white hover:text-gray-100"
          >
            Create an account
          </Link>
        </>
      );
    }

    return (
      <Button
        onClick={() => signoutMutation.mutate()}
        className="text-sm font-medium text-white hover:text-gray-100"
      >
        Logout
      </Button>
    );
  };
  return (
    <header className="sticky top-0 z-10">
      <nav aria-label="Top">
        {/* Top navigation */}
        <div className="bg-gray-900">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Currency selector */}
            <form>
              <div className="-ml-2 inline-grid grid-cols-1">
                <select
                  id="desktop-currency"
                  name="currency"
                  aria-label="Currency"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-gray-900 py-0.5 pr-7 pl-2 text-left text-base font-medium text-white focus:outline-2 focus:-outline-offset-1 focus:outline-white sm:text-sm/6"
                >
                  {currencies.map((currency) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-1 size-5 self-center justify-self-end fill-gray-300"
                />
              </div>
            </form>

            <div className="flex items-center space-x-6">
              {renderAuthActions()}
            </div>
          </div>
        </div>

        {/* Secondary navigation */}
        <div className="bg-slate-700/80 backdrop-blur-md backdrop-filter">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div>
              <div className="flex h-16 items-center justify-between">
                {/* Logo (lg+) */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center">
                  <Link href="/">
                    <span className="sr-only">Your Company</span>
                    <Image
                      alt="Artegani | Genti de lux din piele naturala"
                      src={logo}
                      // className="h-90 w-auto"
                      width={150}
                      height={150}
                    />
                  </Link>
                </div>

                <HomeMenu.Desktop />

                {/* Mobile menu and search (lg-) */}
                <div className="flex flex-1 items-center lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-ml-2 p-2 text-white"
                  >
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                  </button>

                  {/* Search */}
                  <a href="#" className="ml-2 p-2 text-white">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="size-6"
                    />
                  </a>
                </div>

                {/* Logo (lg-) */}
                <Link href="/" className="lg:hidden">
                  <span className="sr-only">Your Company</span>
                  <Image
                    alt="artegani logo"
                    src={logo}
                    className="h-10 w-auto"
                  />
                </Link>

                <div className="flex flex-1 items-center justify-end">
                  <Link
                    href="#"
                    className="hidden text-sm font-medium text-white lg:block"
                  >
                    Search
                  </Link>

                  <div className="flex items-center lg:ml-8">
                    {/* Help */}
                    <a href="#" className="p-2 text-white lg:hidden">
                      <span className="sr-only">Help</span>
                      <QuestionMarkCircleIcon
                        aria-hidden="true"
                        className="size-6"
                      />
                    </a>
                    <Link
                      href="#"
                      className="hidden text-sm font-medium text-white lg:block"
                    >
                      Help
                    </Link>

                    {/* Cart */}
                    <div
                      className="ml-4 flow-root lg:ml-8"
                      onClick={() => setCartOpen((prev: boolean) => !prev)}
                    >
                      <a href="#" className="group -m-2 flex items-center p-2">
                        <ShoppingBagIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-white"
                        />
                        <span className="ml-2 text-sm font-medium text-white">
                          {orderLoading ? "..." : totalItems}
                        </span>
                        <span className="sr-only">items in cart, view bag</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Hero Section Subcomponent
HomeMenu.Hero = function HeroSection() {
  return (
    <div className="relative bg-gray-900 max-w-7xl mx-auto">
      {/* Decorative image and overlay */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          src="https://artegani.ro/wp-content/uploads/2025/11/cele-mai-noi-2.webp"
          className="size-full object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gray-900 opacity-50"
      />

      {/* <HomeMenu.Header /> */}

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
        <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
          New arrivals are here
        </h1>
        <p className="mt-4 text-xl text-white">
          The new arrivals have, well, newly arrived. Check out the latest
          options from our summer small-batch release while they're still in
          stock.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
        >
          Shop New Arrivals
        </Link>
      </div>
    </div>
  );
};

export default function HomeMenuComponent({ withhero }: HomeMenuProps) {
  return (
    <HomeMenu>
      <HomeMenu.Header />
      <HomeMenu.Mobile />
      {withhero && <HomeMenu.Hero />}
      <CartDrawer />
    </HomeMenu>
  );
}
