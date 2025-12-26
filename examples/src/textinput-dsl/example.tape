# DSL text input demo with validation

Output "../../animations/textinput-dsl.gif"

Source ../../common.tape

Set Height 634
Set FontSize 38

Hide
Type "pnpm ex:textinput-dsl"
Enter
Wait+Screen /Demo/
Show

Sleep 1s

# Type some text
Type "Jo"
Sleep 500ms
Type "hn"
Sleep 500ms
Type " Smith"
Sleep 1s

# Exit
Type "q"
Sleep 500ms
