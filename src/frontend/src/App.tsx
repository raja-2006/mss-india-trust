import { Toaster } from "@/components/ui/sonner";
import { LanguageContext, useLangState } from "./hooks/useLanguage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const { lang, setLang } = useLangState();
  const isAdmin =
    window.location.pathname === "/admin" ||
    window.location.pathname.startsWith("/admin/");

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {isAdmin ? <AdminPage /> : <HomePage />}
      <Toaster richColors position="top-right" />
    </LanguageContext.Provider>
  );
}
