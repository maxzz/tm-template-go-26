import { type ReactNode, useEffect, ViewTransition } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { classNames } from '@/utils';
import { welcomeLogoClasses, WelcomeContent } from './1-welcome-content';
import { AppLogo } from './2-app-logo';
import { WelcomeQuadrants } from './3-welcome-quadrants';
import { MainPage, mainPageAtom, TRANSITION_TYPE_TO_MAIN, TRANSITION_TYPE_TO_WELCOME, welcomeSplitAtom } from './a-ui-app-page';

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

/**
 * Returns a fragment on purpose: React plays enter/exit only for <ViewTransition>s that have
 * no DOM element between them and the root of the inserted/removed tree, and here those must be
 * the four quadrants. Must be rendered inside a positioned container (see AppPages).
 */
function WelcomePage() {
    const [split, setSplit] = useAtom(welcomeSplitAtom);

    // Normally the quadrants' onEnter joins the page when the transition finishes;
    // this covers browsers without View Transitions and transitions that never start.
    //
    // This stays an effect. A derived atom only recomputes when the atoms it reads change, and this code writes welcomeSplitAtom 
    // back to false — immediately when the browser has no View Transitions API, or after two seconds when the quadrant join never fires. 
    // Nothing in the store changes at that two-second mark, so a derivation would keep reporting split until some other update.
    useEffect(
        () => {
            if (!split) {
                return;
            }

            if (!("startViewTransition" in document)) {
                setSplit(false);
                return;
            }

            const timer = setTimeout(() => setSplit(false), 2000);
            return () => clearTimeout(timer);
        },
        [split, setSplit]);

    return (<>
        {/* While split, the live page is hidden behind its quadrant copies; only the logo stays visible */}
        <WelcomeContent className={classNames(split && "invisible")} logo={<AppLogo className={classNames(welcomeLogoClasses, "visible")} />} />

        {split && <WelcomeQuadrants onJoin={() => setSplit(false)} />}
    </>);
}
