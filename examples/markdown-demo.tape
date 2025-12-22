# Markdown viewer component with scrollable viewport

Output markdown-demo.gif

Set Shell "bash"
Set FontSize 18
Set Width 1200
Set Height 800
Set Theme "Catppuccin Mocha"
Set Padding 20
Set Framerate 30

Type "pnpm tsx markdown-demo.ts"
Sleep 500ms
Enter

Sleep 2s

# Smooth scrolling down - slower timing to avoid flicker
Type "j" Sleep 100ms
Type "j" Sleep 100ms
Type "j" Sleep 100ms
Type "j" Sleep 100ms
Type "j" Sleep 100ms
Type "j" Sleep 100ms

Sleep 500ms

# Page down for faster navigation
Type "f"
Sleep 800ms

# Page up
Type "b"
Sleep 800ms

# Half page down
Type "d"
Sleep 600ms

# Scroll up smoothly
Type "k" Sleep 100ms
Type "k" Sleep 100ms
Type "k" Sleep 100ms
Type "k" Sleep 100ms

Sleep 500ms

# Exit
Type "q"
Sleep 500ms
