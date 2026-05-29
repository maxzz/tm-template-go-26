import { useEffect, useState } from 'react';
import wailsLogo from './assets/wails.png';
import './App.css';
import { ToggleDevTools } from '../wailsjs/go/main/App';

export function App() {
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.code === 'KeyI'))) {
                e.preventDefault();
                ToggleDevTools()
                    .then((isEnabled) => {
                        clearTimeout(timer);
                        if (isEnabled) {
                            setToast('🚀 DevTools enabled for next startup! Press Ctrl+Shift+F12 to open them now.');
                        } else {
                            setToast('💤 DevTools disabled for next startup.');
                        }
                        timer = setTimeout(() => setToast(null), 6000);
                    })
                    .catch(console.error);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white grid grid-cols-1 place-items-center justify-items-center mx-auto py-8 relative">
            <div className="text-blue-900 text-2xl font-bold font-mono">
                <h1 className="content-center">Vite + React + TS + Tailwind</h1>
            </div>
            <div className="w-fit max-w-md">
                <a href="https://wails.io" target="_blank">
                    <img src={wailsLogo} className="logo wails" alt="Wails logo" />
                </a>
            </div>

            {toast && (
                <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 font-sans z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">{toast}</span>
                        <span className="text-xs text-slate-400">Restart the application for changes to take effect on startup.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
