//go:build !windows

package main

// platformOpenDevTools is a no-op on non-Windows platforms.
// On macOS / Linux, use the native DevTools shortcut (e.g. ⌘⌥I on macOS).
func (a *App) platformOpenDevTools() {}

// platformCloseDevTools is a no-op on non-Windows platforms.
func (a *App) platformCloseDevTools() {}
