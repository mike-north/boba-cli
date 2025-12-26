# Page navigation dots and numbers

Output "../../animations/paginator.gif"

Source ../../common.tape

Set Height 2375
Set FontSize 86

Hide
Type "pnpm ex:paginator"
Enter
Wait+Screen /Boba/
Show

Sleep 1500ms

# Navigate pages
Sleep 500ms
Type "d"
Sleep 600ms
Type "d"
Sleep 600ms
Type "d"
Sleep 600ms

# Go back
Type "u"
Sleep 600ms

# Toggle to arabic view
Type "t"
Sleep 800ms
Type "d"
Sleep 600ms
Type "d"
Sleep 800ms

# Toggle back to dots
Type "t"
Sleep 800ms

# Exit
Sleep 500ms
Type "q"
Sleep 500ms
