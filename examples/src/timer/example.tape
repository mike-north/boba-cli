# Countdown timer with controls

Output "../../animations/timer.gif"

Source ../../common.tape

Set Height 475
Set FontSize 43

Hide
Type "pnpm ex:timer"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms

# Let timer run
Sleep 2s

# Pause
Space
Sleep 1s

# Resume
Space
Sleep 1500ms

# Restart
Type "r"
Sleep 2s

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
