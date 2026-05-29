package main

import (
	"context"
	"fmt"
	"runtime"
	"syscall"
)

var (
	user32         *syscall.LazyDLL
	procKeybdEvent *syscall.LazyProc
)

const (
	vkControl      = 0x11
	vkShift        = 0x10
	vkF12          = 0x7B
	keyeventfKeyUp = 0x0002
)

func init() {
	if runtime.GOOS == "windows" {
		user32 = syscall.NewLazyDLL("user32.dll")
		procKeybdEvent = user32.NewProc("keybd_event")
	}
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a *App) domReady(ctx context.Context) {
	restoreWindowOptions(ctx)
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	saveWindowOptions(ctx)
	return false
}

// SetDevToolsState is called by frontend to update the devTools state in options
func (a *App) SetDevToolsState(open bool) {
	opts, err := loadIniFileOptions()
	if err != nil {
		opts = &IniOptions{}
	}
	opts.DevTools = open
	saveIniFileOptions(opts)
}

func (a *App) toggleDevToolsNative() {
	if runtime.GOOS == "windows" && procKeybdEvent != nil {
		// Press Control
		procKeybdEvent.Call(vkControl, 0, 0, 0)
		// Press Shift
		procKeybdEvent.Call(vkShift, 0, 0, 0)
		// Press F12
		procKeybdEvent.Call(vkF12, 0, 0, 0)

		// Release F12
		procKeybdEvent.Call(vkF12, 0, keyeventfKeyUp, 0)
		// Release Shift
		procKeybdEvent.Call(vkShift, 0, keyeventfKeyUp, 0)
		// Release Control
		procKeybdEvent.Call(vkControl, 0, keyeventfKeyUp, 0)
	}
}

// ToggleDevTools toggles the devTools option state programmatically in the current session
func (a *App) ToggleDevTools() {
	a.toggleDevToolsNative()
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
