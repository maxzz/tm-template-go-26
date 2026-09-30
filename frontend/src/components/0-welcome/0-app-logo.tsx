import { type SVGAttributes, ViewTransition } from "react";

/**
 * TEMPORARY app logo: replace the <svg> content with the real artwork.
 * The same component is rendered on the Welcome page (large) and in the main page header (small);
 * the shared `name` makes React morph one into the other during page transitions.
 */
export function AppLogo(props: SVGAttributes<SVGSVGElement>) {
    return (
        <ViewTransition name={APP_LOGO_VT_NAME} share="vt-logo-share">
            <svg viewBox="0 0 64 64" fill="none" role="img" aria-label={`${APP_NAME} logo`} {...props}>
                <rect x="4" y="4" width="56" height="56" rx="14" className="fill-primary" />
                <path d="M20 44V20l12 14 12-14v24" className="stroke-primary-foreground" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </ViewTransition>
    );
}

export const APP_LOGO_VT_NAME = "app-logo";
export const APP_NAME = "tm-template-go-26";
