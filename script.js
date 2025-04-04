const peer = new Peer();
let call;
let localStream;
let remoteStream;
let remoteAudio = document.getElementById('remote-audio');

peer.on('open', id => {
    document.getElementById('room-id').placeholder = "Your Room ID: " + id;
});

function joinCall() {
    const roomId = document.getElementById('room-id').value.trim();

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            localStream = stream;
            call = peer.call(roomId, stream);
            call.on('stream', stream => {
                remoteStream = stream;
                remoteAudio.srcObject = remoteStream;
            });
        });
}

peer.on('call', incomingCall => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            localStream = stream;
            incomingCall.answer(stream);
            incomingCall.on('stream', stream => {
                remoteStream = stream;
                remoteAudio.srcObject = remoteStream;
            });
        });
});

// Unlock audio playback on Safari/iOS
function unlockAudio() {
    if (remoteStream) {
        remoteAudio.play().then(() => {
            console.log("Audio playback started");
        }).catch(err => {
            console.error("Audio playback failed:", err);
        });
    } else {
        console.warn("No remote stream yet. Try again after call connects.");
    }
}
