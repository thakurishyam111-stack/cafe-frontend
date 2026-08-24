"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    const publicRoutes = ["/Admin/Login", "/Admin/Register"];

    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/Admin/Login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
