let mediaStream = null;

export default async function getMediaStream(mediaConstraints, cb) {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    cb(null, mediaStream);
  } catch (error) {
    cb(error, null);
  }
}