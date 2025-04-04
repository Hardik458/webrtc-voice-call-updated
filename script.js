const peer = new Peer();
let localStream;
let remoteStream;
const remoteAudio = document.getElementById("remote-audio");

peer.on("open", (id) => {
  document.getElementById("room-id").placeholder = "Your Room ID: " + id;
});

// This function tries to play audio as soon as possible
function tryPlayAudio() {
  if (remoteAudio && remoteAudio.srcObject) {
    remoteAudio.play().then(() => {
      console.log("Audio autoplayed");
    }).catch((err) => {
      console.warn("Autoplay blocked. Tap anywhere to enable audio.");
    });
  }
}

function joinCall() {
  const roomId = document.getElementById("room-id").value.trim();

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then((stream) => {
      localStream = stream;
      const call = peer.call(roomId, stream);

      call.on("stream", (incomingStream) => {
        remoteStream = incomingStream;
        remoteAudio.srcObject = remoteStream;
        tryPlayAudio();
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
        tryPlayAudio();
      });
    })
    .catch((err) => console.error("Error answering call:", err));
});

// Bonus: allow user tap anywhere to enable audio in case autoplay fails
document.body.addEventListener("click", tryPlayAudio, { once: true });
