var videoPlayer = document.getElementById("video-player")
let lastcurrentime = 0;

videoPlayer.addEventListener('play', videoControlsHandler, false);
videoPlayer.addEventListener('pause', videoControlsHandler, false);
videoPlayer.addEventListener('timeupdate', videoControlsHandler, false);

function videoControlsHandler(e) {
    if (e.type == 'play') {
        console.log("video played")
    } else if (e.type == 'pause') {
        console.log("video paused")
    } else if (e.type == 'timeupdate') {
        var timeDifference = lastcurrentime - videoPlayer.currentTime
        if(timeDifference < -1 || timeDifference > 1) {
            console.log("time updated to", videoPlayer.currentTime)
        }
        lastcurrentime = videoPlayer.currentTime
    }
}

const fileChooser = document.getElementById("fileChooser")

fileChooser.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const filePath = e.dataTransfer.files[0].path
    document.getElementById("filePathText").innerHTML = "File Path: " + filePath
    // fileChooser.style.display = "none" // use this to hide the file chooser
    videoPlayer.setAttribute("src", filePath)
    videoPlayer.load()
    video.play();
});

fileChooser.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
