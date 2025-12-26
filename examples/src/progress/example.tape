# Animated progress bar with gradient

Output "../../animations/progress.gif"

Source ../../common.tape

Set Height 634
Set FontSize 38

Hide
Type "pnpm ex:progress"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms


# Increase progress
Sleep 500ms
Type "+"
Sleep 600ms
Type "+"
Sleep 600ms
Type "+"
Sleep 600ms

# Decrease progress
Type "-"
Sleep 600ms

# Toggle gradient mode
Type "g"
Sleep 800ms
Type "+"
Sleep 600ms
Type "+"
Sleep 800ms

# Reset
Type "r"
Sleep 800ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
