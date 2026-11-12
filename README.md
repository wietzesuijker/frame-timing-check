# Frame-timing check (Appendix V.5)

A static page for the frame-timing check of Appendix V.5 of the submission: how long it takes to answer "empty or unlabelable" versus naming the species on 60 fixed iWildCam 2022 camera-trap frames, and the ratio of the two mean times.

How to use:
1. Serve this folder (`python3 -m http.server`) or open it as a GitHub Pages site, then open `index.html`. Nothing is sent anywhere.
2. Press Space to start. Per frame press `E` for empty or unlabelable, or `A`, type the species and press Enter (`Esc` pauses, left arrow goes back).
3. At the end the page shows n and mean seconds per class, the ratio mean empty / mean animal with its 95% bootstrap CI, and offers the session CSV. `node test_ratio.js timing_session.csv` recomputes the same numbers from a saved CSV.

`strata.js` holds the stored empty/animal status of each frame, used only after the last frame. Frames with a failed load or over 120 s are excluded from timing.

Data: frames are from iWildCam 2022 (camera-trap images, via LILA BC, https://lila.science/datasets/iwildcam-2022). License: see LILA BC for license.
