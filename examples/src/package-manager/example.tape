# Package manager demo - simulates downloading and installing packages

Output "../../animations/package-manager.gif"

Source ../../common.tape

Set Height 800
Set FontSize 38

Hide
Type "pnpm ex:package-manager"
Enter
Wait+Screen /Demo/
Show

# Wait for all packages to install (they install with random delays)
Sleep 6s

# Exit
Type "q"
Sleep 500ms
