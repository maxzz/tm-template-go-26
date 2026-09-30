import { type ReactNode, ViewTransition } from 'react';
import { useAtomValue } from 'jotai';
import { WelcomePage } from './1-welcome-page';
import { MainPage, mainPageAtom, TRANSITION_TYPE_TO_MAIN, TRANSITION_TYPE_TO_WELCOME } from './a-ui-app-page';

import './c-view-transitions.css';
import "./c-welcome-bkg.css";

export function AppPages({ children }: { children: ReactNode; }) {
    const mainPage = useAtomValue(mainPageAtom);

    return (
        /* Stays mounted across pages: a DOM element above the pages' <ViewTransition>s must not be part of the switch */
        <div className="relative">
            {mainPage === MainPage.welcome
                ? (
                    <WelcomePage />
                ) : (
                    <ViewTransition key={MainPage.main} enter={mainEnter} exit={mainExit}>
                        {children}
                    </ViewTransition>
                )
            }
        </div>
    );
}

// View Transition classes (see 5-welcome/c-view-transitions.css), selected by the transition type set in navigateToPageAtom
const mainEnter = { [TRANSITION_TYPE_TO_MAIN]: 'vt-main-reveal', default: 'none' };
const mainExit = { [TRANSITION_TYPE_TO_WELCOME]: 'vt-main-hide', default: 'none' };

//---------------------------------------------------------------------------
