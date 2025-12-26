# Scrollable data table

Output "../../animations/table.gif"

Source ../../common.tape

Set Height 1188
Set FontSize 43

Hide
Type "pnpm ex:table"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms

# Navigate the table
Sleep 500ms
Type "j"
Sleep 400ms
Type "j"
Sleep 400ms
Type "j"
Sleep 600ms

# Go back up
Type "k"
Sleep 400ms
Type "k"
Sleep 600ms

# Jump to bottom
Type "G"
Sleep 800ms

# Jump to top
Type "g"
Sleep 800ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
