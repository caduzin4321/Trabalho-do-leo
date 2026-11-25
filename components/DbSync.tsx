"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sincronizar } from "@/lib/sync";

// Sincroniza com o banco permanente ao abrir o site e após o login.
export default function DbSync() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelado = false;
    void sincronizar().then(({ recarregar, sessaoInvalida }) => {
      if (cancelado) return;
      if (sessaoInvalida) {
        window.localStorage.removeItem("auth:sessao");
        window.location.href = "/";
        return;
      }
      if (recarregar) {
        // Evita laço de recarregamento.
        const ultimo = Number(window.sessionStorage.getItem("sync:reload") ?? 0);
        if (Date.now() - ultimo > 10_000) {
          window.sessionStorage.setItem("sync:reload", String(Date.now()));
          window.location.reload();
        }
      }
    });
    return () => {
      cancelado = true;
    };
  }, [pathname]);

  return null;
}
