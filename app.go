package main

import (
	"context"
	"fmt"
	"sync"
)

// App struct
type App struct {
	ctx          context.Context
	devToolsOpen bool
	mu           sync.Mutex
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	// Initialise in-memory state from the ini file so the first toggle goes the right direction.
	opts, err := loadIniFileOptions()
	if err == nil && opts != nil {
		a.mu.Lock()
		a.devToolsOpen = opts.DevTools
		a.mu.Unlock()
	}
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

// SetDevToolsState sets DevTools state explicitly and persists it to the ini file.
func (a *App) SetDevToolsState(open bool) {
	a.mu.Lock()
	a.devToolsOpen = open
	a.mu.Unlock()

	a.saveDevToolsState(open)
}

// ToggleDevTools flips DevTools visibility and persists the new state to the ini file.
func (a *App) ToggleDevTools() {
	a.mu.Lock()
	a.devToolsOpen = !a.devToolsOpen
	open := a.devToolsOpen
	a.mu.Unlock()

	if open {
		a.platformOpenDevTools()
	} else {
		a.platformCloseDevTools()
	}

	a.saveDevToolsState(open)
}

func (a *App) saveDevToolsState(open bool) {
	opts, err := loadIniFileOptions()
	if err != nil {
		opts = &IniOptions{}
	}
	opts.DevTools = open
	saveIniFileOptions(opts)
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
