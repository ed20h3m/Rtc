import io from "socket.io-client";
// export const socket = io("http://192.168.0.17:3000", { autoConnect: false });
export const socket = io("https://rtc-t6ec.onrender.com", {
  autoConnect: false,
});
