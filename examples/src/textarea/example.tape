# Multi-line text editor with line numbers

Output "../../animations/textarea.gif"

Source ../../common.tape

Set Height 713
Set FontSize 43

Hide
Type "pnpm ex:textarea"
Enter
Wait+Screen /Demo/
Show

Sleep 1500ms

# Type some content
Type@80ms "Hello, this is a textarea demo!"
Sleep 500ms
Enter
Type@80ms "It supports multiple lines."
Sleep 500ms
Enter
Type@80ms "With validation and line numbers."
Sleep 1500ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
