function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

var videoPlayer = document.getElementById("video-player")
const loader = document.getElementById("loader")
loader.style.display = "none"
let lastcurrentime = 0;

const landingPage = document.getElementById("landing")
const profilePage = document.getElementById("profile")
const createPage = document.getElementById("create")
const joinPage = document.getElementById("join")
const roomPage = document.getElementById("room")

landingPage.style.display = "block"

document.addEventListener("click", function (e) {
    if (e.target.id == "profileButton") {
        landingPage.style.display = "none"
        if(localStorage.getItem("username") != null) {
            document.getElementById("username").value = localStorage.getItem("username")
        }
        profilePage.style.display = "block"
    }
    if(e.target.id == "profileSaveButton") {
        const inputVal = document.getElementById("username").value
        if(inputVal == "") {
            document.getElementById("profilePageText").innerHTML = "Please fill in all the fields"
        } else {
            localStorage.setItem("username", inputVal)
            profilePage.style.display = "none"
            landingPage.style.display = "block"
            document.getElementById("profilePageText").innerHTML = ""
        }
    }
    if(e.target.id == "createRoomButton") {
        landingPage.style.display = "none"
        createPage.style.display = "block"
    }
    if(e.target.id == "roomCreateButton") {
        const roomName = document.getElementById("roomname").value
        if(roomName == "") {
            document.getElementById("createRoomText").innerHTML = "Please fill in all the fields"
        }
        if(localStorage.getItem("videoPath") == null || localStorage.getItem("videoSize") == null) {
            document.getElementById("createRoomText").innerHTML = "Please fill in all the fields"
        } 
        localStorage.setItem("roomName", roomName)
        const roomCode = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        localStorage.setItem("roomCode", roomCode)
        document.getElementById("createRoomText").innerHTML = ""
        document.getElementById("roomNameText").innerHTML = roomName
        document.getElementById("roomCodeText").innerHTML = roomCode
        videoPlayer.setAttribute("src", localStorage.getItem("videoPath"))
        createPage.style.display = "none"
        roomPage.style.display = "block"
        // make api request to create room in DB
    }
    if(e.target.id == "joinRoomButton") {
        landingPage.style.display = "none"
        joinPage.style.display = "block"
    }
    if(e.target.id == "roomJoinButton") {
        const inputRoomCode = document.getElementById("roomCode").value
        const videoSize = localStorage.getItem("videoSize")
        if(roomCode == "") {
            document.getElementById("joinRoomText").innerHTML = "Please fill in all the fields"
        }
        if(localStorage.getItem("joinVideoPath") == null || localStorage.getItem("videoSize") == null) {
            document.getElementById("joinRoomText").innerHTML = "Please fill in all the fields"
        } 
        // check roomCode and videoSize using API and get room name and other stuff
        document.getElementById("joinRoomText").innerHTML = ""
        document.getElementById("roomNameText").innerHTML = "wanda vision ep1" 
        document.getElementById("roomCodeText").innerHTML = inputRoomCode
        videoPlayer.setAttribute("src", "C:\Users\Administrator\Desktop\Giga-bite pro\JS\local-party\src\test.mp4")
        joinPage.style.display = "none"
        roomPage.style.display = "block"
    }
    // localStorage.getItem("joinVideoPath")
    if(e.target.id == "roomLeaveButton") {
        videoPlayer.setAttribute("src", "C:\Users\anshu\Desktop\Anshul\Projects\local-party\src\test.mp4")
        roomPage.style.display = "none"
        landingPage.style.display = "block"
    }
})

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

fileChooser.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const filePath = e.dataTransfer.files[0].path
    fileChooser.style.display = "none"
    loader.style.display = "block"
    const fileSize = await e.dataTransfer.files[0].size
    localStorage.setItem("videoSize", fileSize)
    localStorage.setItem("videoPath", filePath)
    document.getElementById("filePathText").innerHTML = "File Path: " + filePath
    // fileChooser.style.display = "none" // use this to hide the file chooser
    videoPlayer.setAttribute("src", filePath)
    videoPlayer.load()
    loader.style.display = "none"
    fileChooser.style.display = "block"
});

fileChooser.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

const joinRoomfileChooser = document.getElementById("joinRoomfileChooser")

joinRoomfileChooser.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const filePath = e.dataTransfer.files[0].path
    joinRoomfileChooser.style.display = "none"
    loader.style.display = "block"
    const fileSize = await e.dataTransfer.files[0].size
    localStorage.setItem("videoSize", fileSize)
    localStorage.setItem("joinVideoPath", filePath)
    document.getElementById("joinRoomfilePathText").innerHTML = "File Path: " + filePath
    // joinRoomfileChooser.style.display = "none" // use this to hide the file chooser
    videoPlayer.setAttribute("src", filePath)
    videoPlayer.load()
    loader.style.display = "none"
    joinRoomfileChooser.style.display = "block"
});

joinRoomfileChooser.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
