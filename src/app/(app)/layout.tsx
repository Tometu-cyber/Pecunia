import { getClientAppData } from "@/lib/data/queries";
import { AppDataProvider } from "@/components/app/app-data";
import { BottomNav, ContentFrame, Sidebar } from "@/components/app/navigation";
import { ToastProvider } from "@/components/ui/toasts";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const data = await getClientAppData();
  return (
    <AppDataProvider value={data}>
      <ToastProvider>
        {/* pt-app-finances : la couleur d'accent de Pecunia (vert) pour tout ce qui est dessous */}
        <div className="pt-app-finances min-h-dvh">
          <Sidebar />
          <ContentFrame>{children}</ContentFrame>
          <BottomNav />
        </div>
      </ToastProvider>
    </AppDataProvider>
  );
}
