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
    document.getElementById("messages-box").innerHTML = document.getElementById("messages-box").innerHTML + `<div class="col-12 mb-4"><div class="row justify-content-center"><div class="col-1 text-center"><div class="pfp-small"><img src=${message.pfp} alt="pfp" class="pfp-small"></div></div><div class="col-10 message"><span>${message.name}</span><br>${message.content}</div></div></div>`
}

socket.on('user-joined', data => {
    if(data.roomCode == localStorage.getItem("roomCode")) {
        append({
            name: data.name,
            content: `${data.name} just popped into the party.`,
            pfp: data.pfp
        })
        document.getElementById('memberCount').innerHTML = `People in party: ${data.members}`
        document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
    }
})

socket.on('updateMemberInfo', data => {
    if(data.roomCode == localStorage.getItem("roomCode")){
        document.getElementById('memberCount').innerHTML = `People in party: ${data.members}`
    }
})


socket.on('receive', data => {
    if(data.roomCode == localStorage.getItem("roomCode")) {
        append({
            name: data.name,
            content: data.message,
            pfp: data.pfp
        })
        document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
    }
})

socket.on('left', data => {
    if(data.roomCode == localStorage.getItem("roomCode")) {
        append({
            name: data.name,
            content: `${data.name} left the party.`,
            pfp: data.pfp,
        })
        document.getElementById('memberCount').innerHTML = `People in party: ${data.members}`
        document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
    }
})

socket.on('playerControlUpdate', data => {
    if(data.roomCode == localStorage.getItem("roomCode")) {
        if(data.message == "play") {
            console.log(data)
            videoPlayer.currentTime = data.context
            allowEmit = false;
            videoPlayer.play()
            let hours = parseInt(Math.round(data.context) / 60 /60, 10);
            let minutes = parseInt((data.context / 60) % 60, 10);
            let seconds = Math.round(data.context) % 60
            hours = hours < 10 ? "0" + hours.toString() : hours.toString();
            minutes = minutes < 10 ? '0'+ minutes.toString() : minutes.toString()
            seconds = seconds < 10 ? '0'+ seconds.toString() : seconds.toString()
            let contentString = `${data.username} played the video from ${minutes}:${seconds}`
            if(hours != 0){
                contentString = `${data.username} played the video from ${hours}:${minutes}:${seconds}` 
            }
            append({
                name: "Local Party", 
                content: contentString,
                pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"
            })
            document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
        }
        if(data.message == "pause") {
            console.log(data)
            videoPlayer.currentTime = data.context
            allowEmit = false;
            videoPlayer.pause()
            let hours = parseInt(Math.round(data.context) / 60 /60, 10);
            let minutes = parseInt((data.context / 60) % 60, 10);
            let seconds = Math.round(data.context) % 60
            hours = hours < 10 ? "0" + hours.toString() : hours.toString();
            minutes = minutes < 10 ? '0'+ minutes.toString() : minutes.toString()
            seconds = seconds < 10 ? '0'+ seconds.toString() : seconds.toString()
            let contentString = `${data.username} paused the video at ${minutes}:${seconds}`
            if(hours != 0){
                contentString = `${data.username} paused the video at ${hours}:${minutes}:${seconds}` 
            }
            append({
                name: "Local Party", 
                content: contentString,
                pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"
            })
            document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
        }
    }
})

if(localStorage.getItem("username") == null) {
    localStorage.setItem("username", "unknown")
}

const colors = ['F26E5C', 'FCE060', '63E683', '6085FC', 'F52C93']

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

const color = random_item(colors)

if(localStorage.getItem("pfpUrl") == null) {
    localStorage.setItem("pfpUrl", `https://dummyimage.com/500x500/${color}/${color}`)
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
                        append({name: "Local Party", content: "Local Party allows you to watch local videos with your friends synchronously while chatting.", pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: "Source code for the project is available at https://github.com/sheldor1510/local-party", pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: `Welcome to ${roomName}`, pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: `Share the room code (${roomCode}) with others to invite them to the party.`, pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: "They would need to have the same video file with them to join this watch party.", pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: "You can change your username in the settings page.", pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        socket.emit('new-user-joined', { name: localStorage.getItem("username"), roomCode: roomCode, pfp: localStorage.getItem("pfpUrl") });
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
                        append({name: "Local Party", content: "Local Party allows you to watch local videos with your friends synchronously while chatting.", pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: "Source code for the project is available at https://github.com/sheldor1510/local-party", pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: `Welcome to ${resp.roomName}`, pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: `Share the room code (${resp.roomCode}) with others to invite them to the party.`, pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: "They would need to have the same video file with them to join this watch party.", pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        append({name: "Local Party", content: "You can change your username in the settings page.", pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"})
                        socket.emit('new-user-joined', { name: localStorage.getItem("username"), roomCode: resp.roomCode, pfp: localStorage.getItem("pfpUrl") });
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
        socket.emit('disconnectUser')
        location.reload()
    }
    if(e.target.id == "backButton") {
        location.reload()
    }
})

const form = document.getElementById("send-form")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageInput = document.getElementById("messageInp").value
    if(messageInput.split(" ").join("").length != 0) {
        socket.emit('send', messageInput)
        append({
            name: localStorage.getItem("username"),
            content: messageInput,
            pfp: localStorage.getItem("pfpUrl")
        })
        document.getElementById("messageInp").value = ""
        document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
    }
})

let allowEmit = true;

videoPlayer.addEventListener('play', videoControlsHandler, false);
videoPlayer.addEventListener('pause', videoControlsHandler, false);
videoPlayer.addEventListener('d', videoControlsHandler, false);

function videoControlsHandler(e) {
    if (e.type == 'play') {
        if(allowEmit == true){
            socket.emit("playerControl", {message: "play", context: videoPlayer.currentTime}) 
            let hours = parseInt(Math.round(videoPlayer.currentTime) / 60 /60, 10);
            let minutes = parseInt((videoPlayer.currentTime / 60) % 60, 10);
            let seconds = Math.round(videoPlayer.currentTime) % 60
            hours = hours < 10 ? "0" + hours.toString() : hours.toString();
            minutes = minutes < 10 ? '0'+ minutes.toString() : minutes.toString()
            seconds = seconds < 10 ? '0'+ seconds.toString() : seconds.toString()
            let contentString = `You played the video from ${minutes}:${seconds}`
            if(hours != 0){
                contentString = `You played the video from ${hours}:${minutes}:${seconds}` 
            }
            append({
                name: "Local Party", 
                content: contentString,
                pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"
            })
            document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
        } 
        setTimeout(() => {
            allowEmit = true
        }, 500);
    } else if (e.type == 'pause') {
        if(allowEmit == true){
            socket.emit("playerControl", {message: "pause", context: videoPlayer.currentTime})
            let hours = parseInt(Math.round(videoPlayer.currentTime) / 60 /60, 10);
            let minutes = parseInt((videoPlayer.currentTime / 60) % 60, 10);
            let seconds = Math.round(videoPlayer.currentTime) % 60
            hours = hours < 10 ? "0" + hours.toString() : hours.toString();
            minutes = minutes < 10 ? '0'+ minutes.toString() : minutes.toString()
            seconds = seconds < 10 ? '0'+ seconds.toString() : seconds.toString()
            let contentString = `You paused the video at ${minutes}:${seconds}`
            if(hours != 0){
                contentString = `You paused the video at ${hours}:${minutes}:${seconds}` 
            }
            append({
                name: "Local Party", 
                content: contentString,
                pfp: "https://cdn.discordapp.com/attachments/751511569971675216/818749306893762570/Untitled-3.png"
            })
            document.getElementById("messages-box").scrollTop = document.getElementById("messages-box").scrollHeight
        }
        setTimeout(() => {
            allowEmit = true
        }, 500);
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
