# userscripts

Violentmonkey userscripts

## YouTube Video Age and Category Filter

A powerful userscript that enhances your YouTube browsing experience by automatically hiding old or unwanted videos with a sleek, modern interface.

Instead of just making videos disappear, this script applies a stylish "frosted glass" blur effect over filtered thumbnails, with a clear badge indicating _why_ the video was hidden. It also provides distinct borders to track your watch status at a glance.

### Features

- **Modern "Frosted Glass" Overlay:** Hides unwanted videos using an elegant blur effect, keeping your feed clean without being jarring.
- **Informative Badges:** Each hidden video displays a clear badge in the corner, so you always know why it was filtered.
  - Filtered by age: **OLD (365 days)**
  - Filtered by category: **MUSIC**
- **Clear Visual Indicators for Watched Status:** Uses colored borders to track video progress:
  - **Green Border:** New video, not filtered, and completely unwatched.
  - **Purple Border:** Video is partially watched.
  - **Red Border:** Video has been fully watched.
- **Clickable Overlays:** Hidden videos can still be opened with a single click on the overlay, which also prevents the annoying hover-to-play feature on thumbnails.
- **Highly Customizable:** Easily tweak settings like video age, categories, colors, and the blur intensity directly from the Violentmonkey dashboard.
- **Future-Proof Updates:** The script is designed to safely add new configuration options in future updates without overwriting your existing settings.

### Customization

You can customize the script's behavior by editing its values in the Violentmonkey dashboard's "Values" tab for this script.

#### Default Configuration:

```json
{
  "maxVideoAge": 15,
  "categoriesToHide": ["Music", "Sports"],
  "notSeenBorderColor": "#00FF00",
  "seenBorderColor": "#FF0000",
  "partiallySeenBorderColor": "#8A2BE2",
  "overlayBlurAmount": 8,
  "iconUrlByAge": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Calendar_%2889059%29_-_The_Noun_Project.svg",
  "iconUrlByCategory": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Discrete_category.svg",
  "debug": false
}
```

#### Parameter Descriptions:

- **maxVideoAge**: (Number) The maximum age of a video in days. Videos older than this will be hidden.
- **categoriesToHide**: (Array of Strings) A list of YouTube categories to hide. Any video matching a category in this list will be hidden.
- **notSeenBorderColor**: (String) Hex color code for new, unwatched videos.
- **seenBorderColor**: (String) Hex color code for fully watched videos.
- **partiallySeenBorderColor**: (String) Hex color code for partially watched videos.
- **overlayBlurAmount**: (Number) The intensity of the blur effect in pixels for hidden videos. `0` means no blur.
- **iconUrlByAge**: (String) The URL for the icon displayed on videos hidden due to their age.
- **iconUrlByCategory**: (String) The URL for the icon displayed on videos hidden due to their category.
- **debug**: (Boolean) Set to `true` to print detailed logs to the browser's Developer Console for troubleshooting.

## YouTube Mouse Control for Volume and Time

This user script allows you to control the volume and time of a YouTube video using the mouse wheel.

When scrolling up or down, the script adjusts the volume or seeks the video time accordingly.

The left half of the video controls the volume, while the right half controls the time.

Use the Shift key while scrolling in the right side of the video to go forward/backward by 0.5 secs.

This script provides a convenient way to interact with YouTube videos using the mouse, making it easier to adjust the volume and seek to specific times during playback.

## Netflix Mouse Control User Script

This user script allows you to control the volume and time of Netflix videos using your mouse wheel.

By scrolling up or down, you can adjust the volume and seek forward or backward in the video.

The left half of the video controls the volume, while the right half controls the time.

The script also ensures that the mouse control is only active when watching a Netflix video, providing a seamless and convenient viewing experience.

## Netflix seamless play

This user script automates the process of skipping intro and recaps, and jumping to the next video on Netflix.

## TwitchTV autoplay stop

This user script stops autoplay videos on the main page of Twitch.tv

## HackerNews Favicons

This script adds favicons to links on the Hacker News website main page. For each link , it fetches the favicon from Google's favicon service and adds it to the link's title line as an image.

In addition to adding favicons to links, the script also allows users to open links in a new tab by clicking on the favicon.

## HackerNews links in article

This user script adds a "Show Links" button to HackerNews articles, displaying external links as an overlay when clicked. It collects external links, adds anchors to comments, and opens links in new tabs.

## YouTube Remove Inline Shorts

This userscript removes inline YouTube Shorts from your feed. It identifies Shorts by looking for the `ytm-shorts-lockup-view-model-v2` tag and then removes their containing parent element from the page. This helps in decluttering your YouTube browsing experience if you prefer not to see inline Shorts.
