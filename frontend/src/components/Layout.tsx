import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TitleBar } from './TitleBar';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <TitleBar />
            <div className="flex-1 flex overflow-hidden">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Mobile Drawer (Simplified for now) */}
                {sidebarOpen && (
                    <div className="absolute inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                        <div className="relative h-full w-64 bg-background border-r p-0 shadow-lg animate-in slide-in-from-left">
                            <Sidebar />
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 overflow-y-auto p-4 md:p-8">
                        <div className="max-w-4xl mx-auto h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
            );
}
