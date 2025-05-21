# userscripts

Violentmonkey userscripts

## YouTube Video Age and Category Filter

This user script allows you to filter out old YouTube videos and hide videos in certain categories.

It fetches video details such as upload date and category, and then applies filters based on user-defined preferences.

The script hides videos that are older than a specified age, as well as videos in specific categories.

It also provides visual cues by adjusting the opacity and adding borders to the videos based on the defined criteria.

The user can customize the maximum video age, opacity, categories to hide, and border colors through the script's settings.

Default Values:

    {
      "maxVideoAge": 15,
      "opacity": 0.25,
      "categoriesToHide": "['Music', 'Sports']",
      "notSeenBorderColor": "#00FF00",
      "seenBorderColor": "#FF0000"
    }

- maxVideoAge: days
- opacity: 0-1
- categoriesToHide: string list
- notSeenBorderColor & seenBorderColor: RGB Hex color code or color name

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
