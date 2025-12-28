---
"@boba-cli/progress": patch
---

Fix progress bar animation when setPercent() is called repeatedly in quick succession. Previously, rapid calls would cause animation frames to be rejected, making the progress bar appear stuck. Now the animation smoothly continues toward each new target.
