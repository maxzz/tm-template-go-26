package main

import (
	"context"
	"fmt"
	"reflect"
	"unsafe"
)

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

func (a *App) openDevToolsNative() {
	if a.ctx == nil {
		return
	}
	fe := a.ctx.Value("frontend")
	if fe == nil {
		return
	}

	// Use reflection to inspect the frontend struct
	val := reflect.ValueOf(fe)
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}
	if val.Kind() != reflect.Struct {
		return
	}

	// Find the chromium field (on Windows)
	chromField := val.FieldByName("chromium")
	if chromField.IsValid() {
		// Create a readable reflect.Value for the unexported field using unsafe
		ptr := unsafe.Pointer(chromField.UnsafeAddr())
		exportedChromField := reflect.NewAt(chromField.Type(), ptr).Elem()
		chromVal := exportedChromField.Interface()
		if chromVal != nil {
			// Call OpenDevToolsWindow method dynamically
			method := reflect.ValueOf(chromVal).MethodByName("OpenDevToolsWindow")
			if method.IsValid() {
				method.Call(nil)
			}
		}
	}
}

// ToggleDevTools toggles the devTools option state programmatically in the current session
func (a *App) ToggleDevTools() {
	opts, err := loadIniFileOptions()
	var currentDevTools bool
	if err == nil && opts != nil {
		currentDevTools = opts.DevTools
	}

	nextState := !currentDevTools
	a.SetDevToolsState(nextState)

	if nextState {
		a.openDevToolsNative()
	}
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
