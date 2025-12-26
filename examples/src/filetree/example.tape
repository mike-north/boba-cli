# File tree browser with metadata display

Output "../../animations/filetree.gif"

Source ../../common.tape

Set Height 800
Set FontSize 40

Hide
Type "pnpm ex:filetree"
Enter
Wait+Screen /Demo/
Show

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
