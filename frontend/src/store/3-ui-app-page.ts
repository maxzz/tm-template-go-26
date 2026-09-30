import { addTransitionType, startTransition, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { atom, useSetAtom } from 'jotai';
import { appSettings } from './1-ui-settings';

/**
 * Transient page state lives in Jotai (not Valtio) on purpose:
 * Valtio's useSnapshot is built on useSyncExternalStore, whose updates are always
 * synchronous and never join a startTransition, so a Valtio-driven page switch
 * would not animate with <ViewTransition>. Jotai hooks are transition-compatible.
 */

export const AppPage = {
    welcome: 'welcome',
    main: 'main',
} as const;

export type AppPage = typeof AppPage[keyof typeof AppPage];

export const appPageAtom = atom<AppPage>(appSettings.showWelcome ? AppPage.welcome : AppPage.main);

/**
 * While true, the Welcome page is drawn as four quadrant copies, each with its own
 * <ViewTransition>, so the page can split and fly out into (or in from) the four corners.
 */
export const welcomeSplitAtom = atom(false);

export const TRANSITION_TYPE_TO_MAIN = 'nav-to-main';
export const TRANSITION_TYPE_TO_WELCOME = 'nav-to-welcome';

/** Navigate between pages inside a transition so <ViewTransition> boundaries animate. */
export function useNavigateToPage() {
    const setPage = useSetAtom(appPageAtom);
    const setSplit = useSetAtom(welcomeSplitAtom);

    return useCallback(
        (page: AppPage) => {
            const toMain = page === AppPage.main;

            // The old-page snapshot is taken from the DOM as it is when the transition starts,
            // so the quadrants must be committed synchronously before it (a sync update never animates).
            if (toMain) {
                flushSync(() => setSplit(true));
            }

            startTransition(
                () => {
                    addTransitionType(toMain ? TRANSITION_TYPE_TO_MAIN : TRANSITION_TYPE_TO_WELCOME);
                    if (!toMain) {
                        setSplit(true); // the Welcome page mounts split; it joins itself when the transition finishes
                    }
                    setPage(page);
                }
            );
        },
        [setPage, setSplit]);
}
