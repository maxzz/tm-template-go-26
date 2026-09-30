import { useSnapshot } from "valtio";
import { appSettings } from "@/store/1-ui-settings";
import { Button } from "@/ui/shadcn/button";
import { Checkbox } from "@/ui/shadcn/checkbox";
import { welcomeConfig } from "./1-welcome-content-config";

// Pure presentational content. It is rendered twice (top and bottom halves) by the Welcome page to make the "opening" effect.

export function WelcomeContent({ onStart }: { onStart: () => void; }) {
    const { skipWelcome } = useSnapshot(appSettings);
    return (
        <div className="size-full bg-linear-to-b from-background to-muted grid place-items-center">
            <div className="max-w-xl px-6 text-center flex flex-col items-center gap-6">

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

                <Button size="lg" onClick={onStart} type="button">
                    {welcomeConfig.startLabel}
                </Button>

                <label className="text-xs text-muted-foreground flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={skipWelcome} onCheckedChange={(v) => { appSettings.skipWelcome = v === true; }} />
                    {welcomeConfig.skipLabel}
                </label>
            </div>
        </div>
    );
}
