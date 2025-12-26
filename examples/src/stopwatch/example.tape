# Stopwatch with start/stop/reset

Output "../../animations/stopwatch.gif"

Source ../../common.tape

Set Height 634
Set FontSize 57

Hide
Type "pnpm ex:stopwatch"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms

# Let stopwatch run
Sleep 2s

# Pause
Space
Sleep 1s

# Resume
Space
Sleep 1500ms

# Reset
Type "r"
Sleep 1s

# Run again
Sleep 2s

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
