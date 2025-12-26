# Scrollable text viewport

Output "../../animations/viewport.gif"

Source ../../common.tape

Set Height 1006
Set FontSize 40

Hide
Type "pnpm ex:viewport"
Enter
Wait+Screen /Demo/
Show

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
