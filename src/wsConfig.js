let DEBUG = false;

let HOST_URL = "https://165.227.12.224";
let SOCKET_URL = "wss://165.227.12.224";

if (DEBUG) {
  HOST_URL = "http://127.0.0.1:8000";
  SOCKET_URL = "ws://127.0.0.1:8000";
}

export { HOST_URL, SOCKET_URL };
