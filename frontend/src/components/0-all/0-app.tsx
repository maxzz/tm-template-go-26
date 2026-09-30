import { ViewTransition } from 'react';
import { useAtomValue } from 'jotai';
import { AppPage, pageAtom, TRANSITION_TYPE_TO_MAIN, TRANSITION_TYPE_TO_WELCOME } from '@/store/4-ui-app-page-atoms';
import { WelcomePage } from '../0-welcome';
import { Toaster } from '@/ui/shadcn/sonner';
import { AllDialogs } from './1-globals';
import { Header } from '../1-header';
import { MainBody } from '../2-main';
import { Section3_Footer } from '../3-footer';
import './2-view-transitions.css';

export function App() {
    const page = useAtomValue(pageAtom);
    return (<>
        <Toaster />
        <AllDialogs />

        {page === AppPage.welcome
            ? <WelcomePage key={AppPage.welcome} />
            : (
                <ViewTransition key={AppPage.main} enter={mainEnter} exit={mainExit}>
                    <main className="min-h-screen text-xs bg-background grid grid-rows-[auto_1fr_auto]">
                        <Header />
                        <MainBody />
                        <Section3_Footer />
                    </main>
                </ViewTransition>
            )
        }
    </>);
}

// Classes are defined in 2-view-transitions.css; the Welcome page quadrants define their own (see 0-welcome)
const mainEnter = { [TRANSITION_TYPE_TO_MAIN]: 'vt-main-reveal', default: 'none' };
const mainExit = { [TRANSITION_TYPE_TO_WELCOME]: 'vt-main-exit', default: 'none' };
/*
import { useEffect } from 'react';
import { ToggleDevTools } from '../../wailsjs/go/backend/App';
// import wailsLogo from './assets/wails.png';

export function App() {

    useEffect(
        () => {
            function handleKeyDown(e: KeyboardEvent) {
                const isDevToolsShortcut = (e.ctrlKey && e.shiftKey && e.code === 'F12') || (e.ctrlKey && e.shiftKey && e.code === 'KeyI');
                if (isDevToolsShortcut) {
                    ToggleDevTools().catch(console.error);
                }
            }
            
            const controller = new AbortController();
            window.addEventListener('keydown', handleKeyDown, { signal: controller.signal });
            return () => controller.abort();
        }, []
    );

    return (
        <div className="min-h-screen text-sm bg-white grid grid-rows-[auto_1fr_auto]">

            <header className="p-3 text-center text-white bg-linear-to-r from-blue-500 to-blue-700 border-b border-blue-900 shadow">
                Go wrapped frontend
            </header>

            <main className="self-center justify-self-center p-4">
                <div className="text-blue-900 font-bold">
                    Go wrapped frontend
                </div>
            </main>

            <footer className="p-3 text-center text-white bg-linear-to-r from-blue-500 to-blue-700 border-t border-blue-900">
                <p>&copy; 2026 No rights reserved.</p>
                {/* <div className="w-fit max-w-md">
                    <a href="https://wails.io" target="_blank">
                        <img src={wailsLogo} className="logo wails" alt="Wails logo" />
                    </a>
                </div> * /}
                </footer>

                </div>
            );
        }
        
*/
