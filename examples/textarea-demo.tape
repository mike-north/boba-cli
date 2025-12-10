# Multi-line text editor with line numbers

Output "textarea-demo.gif"

Set Shell "bash"
Set FontSize 18
Set Width 800
Set Height 300
Set Theme "Catppuccin Mocha"
Set Padding 20
Set Framerate 30

Type "npx tsx textarea-demo.ts"
Sleep 500ms
Enter
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
