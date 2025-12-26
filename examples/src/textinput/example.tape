# Single-line text input with validation

Output "../../animations/textinput.gif"

Source ../../common.tape

Set Height 475
Set FontSize 43

Hide
Type "pnpm ex:textinput"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms

# Type a short name (validation error)
Type "Hi"
Sleep 1s

# Clear and type a valid name
Backspace 2
Sleep 500ms
Type@100ms "Alice Smith"
Sleep 1500ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
