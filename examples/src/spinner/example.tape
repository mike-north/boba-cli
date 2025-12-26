# Animated spinners with multiple styles

Output "../../animations/spinner.gif"

Source ../../common.tape

Set Height 634
Set FontSize 38

Hide
Type "pnpm ex:spinner"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms

# Cycle through spinner styles
Sleep 1s
Type "s"
Sleep 800ms
Type "s"
Sleep 800ms
Type "s"
Sleep 800ms
Type "s"
Sleep 800ms
Type "s"
Sleep 1s

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
