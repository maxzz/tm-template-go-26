import { AppPage, useNavigateToPage } from "@/store/4-ui-app-page-atoms";
import { AppLogo, APP_NAME } from "../0-welcome";
import { ButtonThemeToggle } from "./8-btn-theme-toggle";

export function Header() {
    const navigate = useNavigateToPage();
    return (
        <header className="px-3 py-2 border-b border-border bg-background flex items-center justify-between">
            <button
                className="px-1 py-0.5 hover:bg-muted rounded flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(AppPage.welcome)}
                title="Back to the welcome page"
                type="button"
            >
                <AppLogo className="size-6" />
                <span>{APP_NAME}</span>
            </button>

            <div className="flex items-center gap-2">
                <ButtonThemeToggle />
            </div>
        </header>
    );
}
