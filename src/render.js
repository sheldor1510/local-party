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
const socket = io.connect("https://local-party.herokuapp.com")

const append = message => {
    document.getElementById("messages-box").innerHTML = document.getElementById("messages-box").innerHTML + `<div class="col-12 mb-4"><div class="row justify-content-center"><div class="col-1 text-center"><div class="pfp-small"><img src="https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png" alt="pfp" class="pfp-small"></div></div><div class="col-10 message"><span>${message.name}</span><br>${message.content}</div></div></div>`
}

socket.on('user-joined', name =>{
    append({
        name: name,
        content: `${name} just popped into the party.`
    })
    document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
})

socket.on('receive', data=>{
    append({
        name: data.name,
        content: data.message
    })
    document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
})

socket.on('left', data =>{
    append({
        name: data.name,
        content: `${data.name} left the party.`
    })
    document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
})

if(localStorage.getItem("username") == undefined) {
    localStorage.setItem("username", "unknown")
}

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
        if(roomName.length == 0) {
            console.log("error")
            document.getElementById("createRoomText").innerHTML = "Please fill in all the fields"
        } else {
            if(localStorage.getItem("videoPath") == null || localStorage.getItem("videoSize") == null) {
                document.getElementById("createRoomText").innerHTML = "Please fill in all the fields"
            } else {
                localStorage.setItem("roomName", roomName)
                const roomCode = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                document.getElementById("createRoomText").innerHTML = ""
                document.getElementById("roomNameText").innerHTML = roomName
                document.getElementById("roomCodeText").innerHTML = roomCode
                videoPlayer.setAttribute("src", localStorage.getItem("videoPath"))
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "roomName": roomName,
                    "roomCode": roomCode,
                    "videoSize": localStorage.getItem("videoSize")
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("https://local-party.herokuapp.com/room/create", requestOptions)
                .then( async (result) => {
                    const resp = await result.json()
                    if(resp.message == "success") {
                        localStorage.setItem("roomCode", roomCode)
                        append({name: "Local Party", content: "Local Party allows you to watch local videos with your friends synchronously while chatting."})
                        append({name: "Local Party", content: "Source code for the project is available at https://github.com/sheldor1510/local-party"})
                        append({name: "Local Party", content: `Welcome to ${roomName}`})
                        append({name: "Local Party", content: `Share the room code (${roomCode}) with others to invite them to the party.`})
                        append({name: "Local Party", content: "They would need to have the same video file with them to join this watch party."})
                        append({name: "Local Party", content: "You can change your username in the settings page."})
                        createPage.style.display = "none"
                        roomPage.style.display = "block"
                    }
                })
                .catch(error => console.log('error', error));
            }
        }
    }
    if(e.target.id == "joinRoomButton") {
        landingPage.style.display = "none"
        joinPage.style.display = "block"
    }
    if(e.target.id == "roomJoinButton") {
        const inputRoomCode = document.getElementById("roomCode").value
        const videoSize = localStorage.getItem("videoSize")
        if(inputRoomCode.length == 0) {
            document.getElementById("joinRoomText").innerHTML = "Please fill in all the fields"
        } else {
            if(localStorage.getItem("joinVideoPath") == null || localStorage.getItem("videoSize") == null) {
                document.getElementById("joinRoomText").innerHTML = "Please fill in all the fields"
            } else {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "roomCode": inputRoomCode,
                    "videoSize": localStorage.getItem("videoSize")
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("https://local-party.herokuapp.com/room/join", requestOptions)
                .then( async (result) => {
                    const resp = await result.json()
                    if(resp.message != "success") {
                        document.getElementById("joinRoomText").innerHTML = resp.message
                    } else {
                        document.getElementById("joinRoomText").innerHTML = ""
                        document.getElementById("roomNameText").innerHTML = resp.roomName 
                        document.getElementById("roomCodeText").innerHTML = resp.roomCode
                        localStorage.setItem("roomCode", inputRoomCode)
                        videoPlayer.setAttribute("src", localStorage.getItem("joinVideoPath"))
                        append({name: "Local Party", content: "Local Party allows you to watch local videos with your friends synchronously while chatting."})
                        append({name: "Local Party", content: "Source code for the project is available at https://github.com/sheldor1510/local-party"})
                        append({name: "Local Party", content: `Welcome to ${resp.roomName}!`})
                        append({name: "Local Party", content: `Share the room code (${resp.roomCode}) with others to invite them to the party.`})
                        append({name: "Local Party", content: "They would need to have the same video file with them to join this watch party."})
                        append({name: "Local Party", content: "You can change your username in the settings page."})
                        socket.emit('new-user-joined', localStorage.getItem("username"));
                        joinPage.style.display = "none"
                        roomPage.style.display = "block"
                    }   
                })
                .catch(error => console.log('error', error));
            }
        }
    }
    // localStorage.getItem("joinVideoPath")
    if(e.target.id == "roomLeaveButton") {
        videoPlayer.setAttribute("src", "C:\Users\anshu\Desktop\Anshul\Projects\local-party\src\test.mp4")
        location.reload()
    }
    if(e.target.id == "backButton") {
        location.reload()
    }
    if(e.target.id == "sendButton") {
        const messageInput = document.getElementById("messageInp").value
        socket.emit('send', messageInput)
        append({
            name: localStorage.getItem("username"),
            content: messageInput
        })
        document.getElementById("messageInp").value = ""
    }
})

const form = document.getElementById("send-form")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageInput = document.getElementById("messageInp").value
    socket.emit('send', messageInput)
    append({
        name: localStorage.getItem("username"),
        content: messageInput
    })
    document.getElementById("messageInp").value = ""
    document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
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
