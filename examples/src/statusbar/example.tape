# Statusbar component demonstration

Output "../../animations/statusbar.gif"

Source ../../common.tape

Set Height 634
Set FontSize 57

Hide
Type "pnpm ex:statusbar"
Enter
Wait+Screen /Content/
Show

Sleep 2s

# Let the statusbar display for a bit
Sleep 2s

# Exit
Type "q"
Sleep 500ms
