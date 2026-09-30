import { useEffect } from "react";
import { useAtom } from "jotai";
import { classNames } from "@/utils";
import { welcomeLogoClasses, WelcomeContent } from "./2-welcome-content";
import { AppLogo } from "./3-app-logo";
import { WelcomeQuadrants } from "./4-welcome-quadrants";
import { welcomeSplitAtom } from "./a-ui-app-page";

/**
 * Returns a fragment on purpose: React plays enter/exit only for <ViewTransition>s that have
 * no DOM element between them and the root of the inserted/removed tree, and here those must be
 * the four quadrants. Must be rendered inside a positioned container (see AppPages).
 */
export function WelcomePage() {
    const [split, setSplit] = useAtom(welcomeSplitAtom);

    // Normally the quadrants' onEnter joins the page when the transition finishes;
    // this covers browsers without View Transitions and transitions that never start.
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
