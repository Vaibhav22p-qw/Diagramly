"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Image
        src="/DIAGRAMLY.gif"
        alt="Diagramly"
        width={520}
        height={520}
        priority
        className="animate-pulse"
      />
    </div>
  );
}
