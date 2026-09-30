import { ViewTransition } from "react";
import { TRANSITION_TYPE_TO_MAIN, TRANSITION_TYPE_TO_WELCOME } from "@/store/4-ui-app-page-atoms";
import { WelcomeContent, WelcomeLogoOverlay } from "./2-welcome-content";

// The Welcome page is built from four quadrants (each shows its part of the same content).
// Each quadrant is its own <ViewTransition>, so when leaving to the main page the content
// expands outward to the four corners (see 2-view-transitions.css), and comes back the same way.

const quadrants = [
    { id: "tl", box: "top-0 left-0", inner: "top-0 left-0" },
    { id: "tr", box: "top-0 right-0", inner: "top-0 right-0" },
    { id: "br", box: "right-0 bottom-0", inner: "right-0 bottom-0" },
    { id: "bl", box: "bottom-0 left-0", inner: "bottom-0 left-0" },
] as const;

export function WelcomePage() {
    return (
        <div className="relative h-dvh overflow-hidden bg-background">
            {quadrants.map(
                (q, idx) => (
                    <ViewTransition
                        key={q.id}
                        enter={{ [TRANSITION_TYPE_TO_WELCOME]: `vt-corner-in vt-${q.id}`, default: "none" }}
                        exit={{ [TRANSITION_TYPE_TO_MAIN]: `vt-corner-out vt-${q.id}`, default: "none" }}
                    >
                        <div className={`absolute ${q.box} size-1/2 overflow-hidden`}>
                            <div className={`absolute ${q.inner} w-[200%] h-[200%]`}>
                                <WelcomeContent primary={idx === 0} />
                            </div>
                        </div>
                    </ViewTransition>
                )
            )}

            <WelcomeLogoOverlay />
        </div>
    );
}

