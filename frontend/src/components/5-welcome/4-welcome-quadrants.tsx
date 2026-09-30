import { ViewTransition } from "react";
import { TRANSITION_TYPE_TO_MAIN, TRANSITION_TYPE_TO_WELCOME } from "@/store/3-ui-app-page";
import { classNames } from "@/utils";
import { AppLogoImage } from "./1-app-logo";
import { WELCOME_LOGO_CLASSES, WelcomeContent } from "./3-welcome-content";

/**
 * Four inert copies of the Welcome page, each clipped to one quarter of it.
 * Every quarter is its own <ViewTransition>, so it gets its own snapshot and can fly
 * out to its corner (Welcome -> Main) or in from it (Main -> Welcome); see 2-view-transitions.css.
 * The logo in the copies is an invisible placeholder: the real one morphs separately.
 * The quadrants must stay the outermost DOM nodes of the page; see WelcomePage.
 */
export function WelcomeQuadrants({ onJoin }: { onJoin: () => void; }) {
    return QUADRANTS.map(
        ({ corner, anchor }) => (
            <ViewTransition
                key={corner}
                enter={{ [TRANSITION_TYPE_TO_WELCOME]: `vt-welcome-quad vt-welcome-quad-in-${corner}`, default: "none" }}
                exit={{ [TRANSITION_TYPE_TO_MAIN]: `vt-welcome-quad vt-welcome-quad-out-${corner}`, default: "none" }}
                onEnter={() => onJoin} // the returned cleanup runs when the view transition finishes
            >
                <div className={classNames("absolute w-1/2 h-1/2 overflow-hidden", anchor)} aria-hidden>
                    <div className={classNames("absolute w-[200%] h-[200%]", anchor)}>
                        <WelcomeContent className="h-full" logo={<AppLogoImage className={classNames(WELCOME_LOGO_CLASSES, "invisible")} />} inert />
                    </div>
                </div>
            </ViewTransition>
        )
    );
}

const QUADRANTS = [
    { corner: "tl", anchor: "top-0 left-0" },
    { corner: "tr", anchor: "top-0 right-0" },
    { corner: "br", anchor: "right-0 bottom-0" },
    { corner: "bl", anchor: "bottom-0 left-0" },
] as const;
