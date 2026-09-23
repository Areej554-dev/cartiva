"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3.75h6.5v6.5h-6.5v-6.5ZM13.75 3.75h6.5v6.5h-6.5v-6.5ZM3.75 13.75h6.5v6.5h-6.5v-6.5ZM13.75 13.75h6.5v6.5h-6.5v-6.5Z"
        />
      </svg>
    ),
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7.5 4.5 4.5-2 4.5 2m-9 0v5l4.5 2 4.5-2v-5M5.25 9.75 3 11v8l9 3 9-3v-8l-2.25-1.25M12 12v10"
        />
      </svg>
    ),
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v13.5H4.5V6.75A2.25 2.25 0 0 1 6.75 4.5ZM8.25 4.5v-1.5h7.5v1.5M8.25 10.5h7.5M8.25 14.25h4.5"
        />
      </svg>
    ),
  },
  {
    name: "Customers",
    href: "/admin/users",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 8.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0M18 8.25h3M19.5 6.75v3"
        />
      </svg>
    ),
  },
  {
    name: "Contact Messages",
    href: "/admin/contact",
    isContact: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.25c0 4.556-4.03 8.25-9 8.25-1.12 0-2.19-.18-3.17-.52L4.5 20.25l1.19-3.57A7.87 7.87 0 0 1 3 11.25C3 6.694 7.03 3 12 3s9 3.694 9 8.25Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 11.25h.008v.008H8.25v-.008ZM11.996 11.25h.008v.008h-.008v-.008ZM15.742 11.25h.008v.008h-.008v-.008Z"
        />
      </svg>
    ),
  },
];

function BackToStoreLink({ onNavigate }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-xl border border-[#E9DED6] bg-[#FFF9F5] px-4 py-3.5 text-base font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF1E8] hover:text-[#C96C35]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-5 w-5 text-[#E98B50]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6.75 4.5 12l6 5.25M19.5 12h-15"
        />
      </svg>

      <span>Back to Store</span>
    </Link>
  );
}

function SidebarContent({
  onNavigate,
  newMessages,
  mobile = false,
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-[#E9DED6] bg-white">
      {/* Mobile Back to Store */}
      {mobile && (
        <div className="border-b border-[#E9DED6] px-4 py-4">
          <BackToStoreLink onNavigate={onNavigate} />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {menuItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                active
                  ? "bg-[#E98B50] text-white shadow-sm"
                  : "text-[#2D2723] hover:bg-[#FFF9F5] hover:text-[#C96C35]"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}

                <span className="font-medium">
                  {item.name}
                </span>
              </div>

              {item.isContact && newMessages > 0 && (
                <span
                  className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold ${
                    active
                      ? "bg-white text-[#E98B50]"
                      : "bg-[#E98B50] text-white"
                  }`}
                >
                  {newMessages > 99 ? "99+" : newMessages}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Back to Store */}
      {!mobile && (
        <div className="px-4 pb-5">
          <BackToStoreLink onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newMessages, setNewMessages] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchNewMessages = async () => {
      try {
        const res = await fetch("/api/admin/contact", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (!cancelled && Array.isArray(data)) {
          const count = data.filter(
            (message) => message.status === "New"
          ).length;

          setNewMessages(count);
        }
      } catch (error) {
        console.error(
          "Failed to fetch contact messages:",
          error
        );
      }
    };

    fetchNewMessages();

    const interval = setInterval(
      fetchNewMessages,
      30000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-[#E9DED6] bg-white px-4 py-3 lg:hidden">
        <Link
          href="/admin"
          className="text-xl font-bold text-[#E98B50]"
        >
          Cartiva
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[#2D2723] transition hover:bg-[#FFF9F5] hover:text-[#C96C35]"
          aria-label="Open admin menu"
          aria-expanded={mobileOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 lg:block">
        <SidebarContent newMessages={newMessages} />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute bottom-0 left-0 top-0 w-72 max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full">
              <SidebarContent
                newMessages={newMessages}
                mobile
                onNavigate={() => setMobileOpen(false)}
              />

              {/* Close Menu */}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#2D2723] shadow-sm transition hover:bg-[#FFF1E8] hover:text-[#C96C35]"
                aria-label="Close admin menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6.75 6.75 10.5 10.5M17.25 6.75l-10.5 10.5"
                  />
                </svg>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}