//go:build windows

package main

import (
	"strings"
	"syscall"
	"unsafe"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// platformOpenDevTools opens the WebView2 DevTools window using the
// chrome.webview JS API that WebView2 exposes on Windows.
func (a *App) platformOpenDevTools() {
	runtime.WindowExecJS(a.ctx, "window.chrome.webview.openDevToolsWindow()")
}

// platformCloseDevTools finds any top-level window whose class is
// Chrome_WidgetWin_1 (the class used by Chromium/WebView2 windows) and
// whose title contains "DevTools", then sends it WM_CLOSE.
func (a *App) platformCloseDevTools() {
	user32 := syscall.NewLazyDLL("user32.dll")
	enumWindows := user32.NewProc("EnumWindows")
	getWindowTextW := user32.NewProc("GetWindowTextW")
	getClassNameW := user32.NewProc("GetClassNameW")
	postMessageW := user32.NewProc("PostMessageW")

	const WM_CLOSE = 0x0010

	cb := syscall.NewCallback(func(hwnd syscall.Handle, _ uintptr) uintptr {
		// Filter by Chromium window class to avoid touching unrelated windows.
		classBuf := make([]uint16, 256)
		getClassNameW.Call(uintptr(hwnd), uintptr(unsafe.Pointer(&classBuf[0])), 256)
		if syscall.UTF16ToString(classBuf) != "Chrome_WidgetWin_1" {
			return 1 // continue enumeration
		}

		// Close only if the title contains "DevTools".
		titleBuf := make([]uint16, 512)
		getWindowTextW.Call(uintptr(hwnd), uintptr(unsafe.Pointer(&titleBuf[0])), 512)
		if strings.Contains(syscall.UTF16ToString(titleBuf), "DevTools") {
			postMessageW.Call(uintptr(hwnd), WM_CLOSE, 0, 0)
		}
		return 1 // continue enumeration
	})

	enumWindows.Call(cb, 0)
}
