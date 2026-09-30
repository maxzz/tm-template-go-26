import { type ReactNode, ViewTransition } from 'react';
import { useAtomValue } from 'jotai';
import { WelcomePage } from './1-welcome-page';
import { AppPage, appPageAtom, TRANSITION_TYPE_TO_MAIN, TRANSITION_TYPE_TO_WELCOME } from './a-ui-app-page';

import './c-view-transitions.css';
import "./c-welcome-bkg.css";

// View Transition classes (see 5-welcome/c-view-transitions.css), selected by the transition type set in navigateToPageAtom

const mainEnter = { [TRANSITION_TYPE_TO_MAIN]: 'vt-main-reveal', default: 'none' };
const mainExit = { [TRANSITION_TYPE_TO_WELCOME]: 'vt-main-hide', default: 'none' };

export function AppPages({ children }: { children: ReactNode; }) {
    const page = useAtomValue(appPageAtom);

    return (
        /* Stays mounted across pages: a DOM element above the pages' <ViewTransition>s must not be part of the switch */
        <div className="relative">
            {page === AppPage.welcome
                ? <WelcomePage />
                : (
                    <ViewTransition key={AppPage.main} enter={mainEnter} exit={mainExit}>
                        {children}
                    </ViewTransition>
                )
            }
        </div>
    );
}
