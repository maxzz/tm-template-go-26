import { addTransitionType, startTransition } from 'react';
import { flushSync } from 'react-dom';
import { atom, getDefaultStore } from 'jotai';
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

/**
 * Navigate between pages inside a transition so <ViewTransition> boundaries animate.
 * Call with useSetAtom(navigateToPageAtom).
 *
 * The write `set` does not notify React until this function returns, so it cannot
 * sit inside flushSync or startTransition. store.set flushes each update in the
 * callback that wraps it. There is no Jotai <Provider>, so the default store is
 * the one the hooks read.
 */
export const navigateToPageAtom = atom(null, (_get, _set, page: AppPage) => {
    const store = getDefaultStore();
    const toMain = page === AppPage.main;

    // The old-page snapshot is taken from the DOM as it is when the transition starts,
    // so the quadrants must be committed synchronously before it (a sync update never animates).
    if (toMain) {
        flushSync(() => store.set(welcomeSplitAtom, true));
    }

    startTransition(
        () => {
            addTransitionType(toMain ? TRANSITION_TYPE_TO_MAIN : TRANSITION_TYPE_TO_WELCOME);
            if (!toMain) {
                store.set(welcomeSplitAtom, true); // the Welcome page mounts split; it joins itself when the transition finishes
            }
            store.set(appPageAtom, page);
        }
    );
});
