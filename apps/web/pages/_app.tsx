import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Dashboard from "../components/Dashboard";

export default function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;

  return (
    <Dashboard>
      <AnyComponent {...pageProps} />
    </Dashboard>
  );
}
