import { useSnapshot } from "valtio";
import { appSettings } from "@/store/1-ui-settings";
import { AppPage, useNavigateToPage } from "@/store/4-ui-app-page-atoms";
import { Button } from "@/ui/shadcn/button";
import { Checkbox } from "@/ui/shadcn/checkbox";
import { welcomeConfig } from "./1-welcome-content-config";
import { AppLogo } from "./0-app-logo";

// Layout box shared by the content copies and the logo overlay so the logo lands exactly in its slot.
export const contentBoxClasses = "px-6 w-full max-w-xl h-[26rem] flex flex-col items-center";
export const logoClasses = "size-24 shrink-0";

/** Only the primary copy is interactive for keyboard/screen readers; the other copies are visual (they are the quadrants of the same page). */
export function WelcomeContent({ primary }: { primary: boolean; }) {
    const { skipWelcome } = useSnapshot(appSettings);
    const navigate = useNavigateToPage();
    const tabIndex = primary ? undefined : -1;

    return (
        <div className="size-full bg-linear-to-b from-background to-muted grid place-items-center" aria-hidden={primary ? undefined : true}>
            <div className={`${contentBoxClasses} text-center gap-5`}>

                <div className={logoClasses} /> {/* slot for <AppLogo/> overlay */}

                <div className="text-sm tracking-widest text-muted-foreground uppercase">
                    {welcomeConfig.subtitle}
                </div>

                <h1 className="text-5xl font-semibold text-foreground">
                    {welcomeConfig.title}
                </h1>

                <p className="text-base text-muted-foreground">
                    {welcomeConfig.description}
                </p>

                <div className="w-full grid grid-cols-3 gap-3">
                    {welcomeConfig.features.map((f) => (
                        <div className="p-3 text-left bg-card border border-border rounded-lg" key={f.title}>
                            <div className="text-sm font-medium text-card-foreground">{f.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{f.text}</div>
                        </div>
                    ))}
                </div>

                <Button size="lg" tabIndex={tabIndex} onClick={() => navigate(AppPage.main)} type="button">
                    {welcomeConfig.startLabel}
                </Button>

                <label className="text-xs text-muted-foreground flex items-center gap-2 cursor-pointer">
                    <Checkbox tabIndex={tabIndex} checked={skipWelcome} onCheckedChange={(v) => { appSettings.skipWelcome = v === true; }} />
                    {welcomeConfig.skipLabel}
                </label>
            </div>
        </div>
    );
}

export function WelcomeLogoOverlay() {
    return (
        <div className="absolute inset-0 grid place-items-center pointer-events-none bg-blue-500/10">
            <div className={`${contentBoxClasses} justify-start`}>
                <AppLogo className={logoClasses} />
            </div>
        </div>
    );
}
