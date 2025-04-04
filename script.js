const peer = new Peer();
let call;
let localStream;
let remoteAudio;

peer.on('open', id => {
    document.getElementById('room-id').placeholder = "Your Room ID: " + id;
});

function joinCall() {
    const roomId = document.getElementById('room-id').value.trim();
    remoteAudio = document.getElementById('remote-audio');

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            localStream = stream;
            call = peer.call(roomId, stream);
            call.on('stream', remoteStream => {
                remoteAudio.srcObject = remoteStream;
            });
        });
}

peer.on('call', incomingCall => {
    remoteAudio = document.getElementById('remote-audio');

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            localStream = stream;
            incomingCall.answer(stream);
            incomingCall.on('stream', remoteStream => {
                remoteAudio.srcObject = remoteStream;
            });
        });
});

function startAudioPlayback() {
    if (remoteAudio) {
        remoteAudio.play().catch(e => console.error("Playback failed:", e));
    }
}
