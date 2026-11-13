---
'@sanring/cli': minor
---

`image-cropper` gains `mode="pan-zoom"`: the crop frame stays fixed and the user drags the image (mouse or one finger) and zooms it (wheel, trackpad or two-finger pinch, `+` / `−`, or the new `sanring-image-cropper-zoom` slider), the usual avatar flow on desktop and phones. The image always covers the frame, zoom runs from 1 (whole image fits) to `maxZoom` (default 4), and `zoom()` / `setZoom()` expose it. `export()`, `crop`, preview, and format picker work unchanged; the default `mode="box"` behaves as before. `instructions` now defaults to text that matches the mode.
