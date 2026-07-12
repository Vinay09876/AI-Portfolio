import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { RightSidebar } from '../components/RightSidebar';
import { SettingsModal } from '../components/SettingsModal';
import { ToastHost } from '../components/ToastHost';

export const metadata: Metadata = {
  title: 'AI Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppProvider>
          <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-200">
            <Sidebar />

            <main className="flex-1 h-full flex flex-col min-w-0 relative">
              {children}
            </main>

            <RightSidebar />

            <SettingsModal />
            <ToastHost />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
