# Scrollable text viewport

Output "viewport-demo.gif"

Set Shell "bash"
Set FontSize 18
Set Width 850
Set Height 450
Set Theme "Catppuccin Mocha"
Set Padding 20
Set Framerate 30

Type "npx tsx viewport-demo.ts"
Sleep 500ms
Enter
Sleep 1500ms

# Scroll down
Sleep 500ms
Type "j"
Sleep 300ms
Type "j"
Sleep 300ms
Type "j"
Sleep 300ms
Type "j"
Sleep 500ms

# Page down
Type "f"
Sleep 800ms

# Page up
Type "b"
Sleep 800ms

# Half page down
Type "d"
Sleep 600ms

# Back to top
Type "g"
Sleep 800ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
