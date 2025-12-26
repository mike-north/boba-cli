# Scrollable help bubble

Output "../../animations/help-bubble.gif"

Source ../../common.tape

Set Height 1006
Set FontSize 40

Hide
Type "pnpm ex:help-bubble"
Enter
Wait+Screen /Help/
Show

Sleep 1500ms

# Scroll down to see more entries
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

# Scroll up
Type "k"
Sleep 300ms
Type "k"
Sleep 300ms
Type "k"
Sleep 500ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
