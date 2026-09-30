import { useSnapshot } from "valtio";
import { appSettings } from "@/store/1-ui-settings";
import { Checkbox } from "@/ui/shadcn/checkbox";
import { ButtonThemeToggle } from "./8-btn-theme-toggle";

export function Header() {
    const { skipWelcome } = useSnapshot(appSettings);
    return (
        <header className="px-3 py-2 border-b border-border bg-background flex items-center justify-between">
            <div>
                tm-template-shadcn-26
            </div>
            <div className="flex items-center gap-3">
                <label className="text-muted-foreground flex items-center gap-1.5 cursor-pointer" title="Start directly on the main page on next launch">
                    <Checkbox checked={skipWelcome} onCheckedChange={(v) => { appSettings.skipWelcome = v === true; }} />
                    Skip welcome page
                </label>
                <ButtonThemeToggle />
            </div>
        </header>
    );
}
