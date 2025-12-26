# Contextual help display

Output "../../animations/help.gif"

Source ../../common.tape

Set Height 950
Set FontSize 49

Hide
Type "pnpm ex:help"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms

# Navigate the list
Sleep 500ms
Type "j"
Sleep 400ms
Type "j"
Sleep 400ms

# Select an item
Enter
Sleep 800ms

# Toggle full help
Type "?"
Sleep 1200ms

# Toggle back to short help
Type "?"
Sleep 800ms

# Navigate more
Type "k"
Sleep 400ms
Enter
Sleep 800ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
