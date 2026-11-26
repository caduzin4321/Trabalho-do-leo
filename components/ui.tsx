// components/ui.tsx
import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-md border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 bg-[#0C141F] focus:outline-none focus:ring-2 focus:ring-lime-300/60 " +
        (props.className ?? "")
      }
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        "w-full rounded-md border border-white/10 px-3 py-2 text-sm text-white bg-[#0C141F] focus:outline-none focus:ring-2 focus:ring-lime-300/60 " +
        (props.className ?? "")
      }
    />
  );
}

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
  }
) {
  const { variant = "primary", className, ...rest } = props;
  const styles = {
    primary: "bg-lime-300 font-bold text-[#101810] hover:bg-lime-200",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    danger: "bg-red-500/15 text-red-300 hover:bg-red-500/25",
  }[variant];
  return (
    <button
      {...rest}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${styles} ${
        className ?? ""
      }`}
    />
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-[#111D2A] p-5 shadow-none ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium text-slate-300">
      {children}
    </label>
  );
}

export function Badge({
  children,
  color,
}: {
  children: ReactNode;
  color: "green" | "red" | "slate";
}) {
  const styles = {
    green: "bg-green-500/15 text-green-300",
    red: "bg-red-500/15 text-red-300",
    slate: "bg-white/5 text-slate-300",
  }[color];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}
    >
      {children}
    </span>
  );
}
