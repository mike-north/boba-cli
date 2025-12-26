# Markdown viewer component with scrollable viewport

Output "../../animations/markdown.gif"

Source ../../common.tape

Set Height 800
Set FontSize 18

Hide
Type "pnpm ex:markdown"
Enter
Wait+Screen /Demo/
Show

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
