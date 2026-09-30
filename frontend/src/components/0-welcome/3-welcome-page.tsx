import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { WelcomeContent } from "./2-welcome-content";

export const WELCOME_DURATION = 1.1; // seconds
export const WELCOME_EASE = [0.76, 0, 0.24, 1] as const;

// Welcome page overlay. On start the content zooms in while the page splits in two halves
// that slide apart (top up, bottom down), a glowing seam flashes in the middle,
// and the main page underneath (see App) scales up into place.

export function WelcomePage({ onOpening, onDone }: { onOpening?: () => void; onDone: () => void; }) {
    const [opening, setOpening] = useState(false);

    useEffect(
        () => {
            if (!opening) return;
            const id = setTimeout(onDone, WELCOME_DURATION * 1000 + 50);
            return () => clearTimeout(id);
        }, [opening]
    );

    function start() {
        if (opening) return;
        setOpening(true);
        onOpening?.();
    }

    const half = "absolute inset-0 will-change-transform";
    const transition = { duration: WELCOME_DURATION, ease: WELCOME_EASE };

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" role="dialog" aria-label="Welcome">

            {/* Top half */}
            <motion.div
                className={half + (opening ? "" : " pointer-events-auto")}
                style={{ clipPath: "inset(0 0 50% 0)" }}
                initial={{ y: "0%", scale: 1 }}
                animate={opening ? { y: "-100%", scale: 1.2 } : { y: "0%", scale: 1 }}
                transition={transition}
            >
                <WelcomeContent onStart={start} />
            </motion.div>

            {/* Bottom half: same content (the button may sit in this half, so it must be clickable) */}
            <motion.div
                className={half + (opening ? "" : " pointer-events-auto")}
                style={{ clipPath: "inset(50% 0 0 0)" }}
                initial={{ y: "0%", scale: 1 }}
                animate={opening ? { y: "100%", scale: 1.2 } : { y: "0%", scale: 1 }}
                transition={transition}
                aria-hidden
            >
                <WelcomeContent onStart={start} />
            </motion.div>

            {/* Seam of light along the split */}
            <motion.div
                className="absolute inset-x-0 top-1/2 h-1 -mt-0.5 bg-primary shadow-[0_0_40px_10px_var(--color-primary)]"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={opening ? { opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 1] } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: WELCOME_DURATION, times: [0, 0.25, 0.6, 1] }}
            />
        </div>
    );
}
