import io from "socket.io-client";
// export const socket = io("http://localhost:5000", { autoConnect: false });
export const socket = io("https://rtc-t6ec.onrender.com", {
  autoConnect: false,
});
