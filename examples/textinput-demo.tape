# Single-line text input with validation

Output "textinput-demo.gif"

Set Shell "bash"
Set FontSize 18
Set Width 800
Set Height 200
Set Theme "Catppuccin Mocha"
Set Padding 20
Set Framerate 30

Type "npx tsx textinput-demo.ts"
Sleep 500ms
Enter
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
