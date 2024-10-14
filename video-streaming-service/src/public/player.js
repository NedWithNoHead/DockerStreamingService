<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Player</title>
</head>
<body>
    <h1>Video Player</h1>
    <video id="videoPlayer" width="650" controls>
        <source src="" type="video/mp4">
        Your browser does not support the video tag.
    </video>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('id');
        if (videoId) {
            document.getElementById('videoPlayer').src = `/video/${videoId}`;
        }
    </script>
</body>
</html>