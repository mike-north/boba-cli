# Filterable list with pagination

Output "../../animations/list.gif"

Source ../../common.tape

Set Height 1900
Set FontSize 68

Hide
Type "pnpm ex:list"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms

# Navigate the list
Sleep 500ms
Down
Sleep 400ms
Down
Sleep 400ms
Down
Sleep 600ms

# Go back up
Up
Sleep 400ms
Up
Sleep 600ms

# Try filtering
Type "/"
Sleep 500ms
Type@150ms "test"
Sleep 800ms
Enter
Sleep 800ms

# Clear filter
Escape
Sleep 800ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
