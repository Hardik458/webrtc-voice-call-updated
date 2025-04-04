const peer = new Peer();
let localStream;
let remoteStream;
const remoteAudio = document.getElementById("remote-audio");

peer.on("open", (id) => {
  document.getElementById("room-id").placeholder = "Your Room ID: " + id;
});

function joinCall() {
  const roomId = document.getElementById("room-id").value.trim();

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then((stream) => {
      localStream = stream;
      const call = peer.call(roomId, stream);

      call.on("stream", (incomingStream) => {
        remoteStream = incomingStream;
        remoteAudio.srcObject = remoteStream;
        console.log("Receiving remote stream...");
      });
    })
    .catch((err) => console.error("Failed to get local stream:", err));
}

peer.on("call", (incomingCall) => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then((stream) => {
      localStream = stream;
      incomingCall.answer(stream);

      incomingCall.on("stream", (incomingStream) => {
        remoteStream = incomingStream;
        remoteAudio.srcObject = remoteStream;
        console.log("Connected to remote stream");
      });
    })
    .catch((err) => console.error("Error answering call:", err));
});

function unlockAudio() {
  if (remoteAudio && remoteAudio.srcObject) {
    remoteAudio.play().then(() => {
      console.log("Audio playback started");
    }).catch((err) => {
      console.warn("Manual play required:", err);
    });
  } else {
    alert("No audio stream yet. Please try again after joining the room.");
  }
}
