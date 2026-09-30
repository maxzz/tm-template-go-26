import { AppPage, useNavigateToPage } from "@/store/3-ui-app-page";
import { AppLogo, APP_NAME } from "@/components/5-welcome";
import { ButtonThemeToggle } from "./8-btn-theme-toggle";

export function Header() {
    const navigate = useNavigateToPage();

    return (
        <header className="px-3 py-2 bg-background border-b border-border flex items-center justify-between">
            <button
                className="-ml-1 px-1 py-0.5 text-sm font-semibold hover:bg-muted rounded flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(AppPage.welcome)}
                title="Show the Welcome page"
                type="button"
            >
                <AppLogo className="size-6" />
                {APP_NAME}
            </button>

            <div className="flex items-center gap-2">
                <ButtonThemeToggle />
            </div>
        </header>
    );
}
