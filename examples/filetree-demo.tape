# File tree browser with metadata display

Output "filetree-demo.gif"

Set Shell "bash"
Set FontSize 40
Set Width 1200
Set Height 800
Set Theme "Catppuccin Mocha"
Set Padding 40
Set Framerate 30

Type "npx tsx filetree-demo.ts"
Sleep 500ms
Enter
Sleep 1500ms

# Navigate down through files
Sleep 500ms
Down
Sleep 400ms
Down
Sleep 400ms
Down
Sleep 400ms
Down
Sleep 600ms

# Continue scrolling to see subdirectories
Down
Sleep 400ms
Down
Sleep 600ms

# Navigate back up
Up
Sleep 400ms
Up
Sleep 600ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms

