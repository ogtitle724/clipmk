import { store } from "@/redux/store";
import { setChatAlarm } from "@/redux/slice/signSlice";

class Socket {
  constructor() {
    this.url = process.env.NEXT_PUBLIC_SOCKET_URL;
    this.socket = null;
    this.listeners = { close: [], open: [], message: [], error: [] };
    this.intentionalClose = false;
  }

  setListeners(senderId, senderNick = null) {
    this.socket.addEventListener("open", () => {
      console.log("socket connect");

      if (senderNick) {
        const checkCreateUser = (e) => {
          console.log("create user...");
          const message = JSON.parse(e.data);
          const action = message.action;

          if (action === "createUser") {
            if (message.isSuccess) {
              console.log("create chat user success");
              this.disconnect();
            } else {
              //생성 실패시 처리 다시볼것
              setTimeout(() => {
                this.send({
                  action: "createUser",
                  senderId,
                  senderNick,
                });
              }, 1000);
              return alert(
                "채팅 서비스 유저 생성에 실패했습니다. 서비스 이용을 위해서 문의가 필요합니다."
              );
              //throw new Error("create chat user failed"); this.connection 다시 호출??
            }
          }
        };

        this.socket.addEventListener("message", checkCreateUser);
        this.send({
          action: "createUser",
          senderId,
          senderNick,
        });
      } else {
        this.send({
          action: "setConnection",
          senderId,
        });
      }
      socket.send({ action: "getConnectionData", senderId });
    });

    this.socket.addEventListener("close", () => {
      if (!this.intentionalClose) {
        console.log("socket closed => reconnect...");
        setTimeout(() => this.connect(senderId, senderNick), 1000);
      }
    });

    const countAlarm = (e) => {
      console.log("set alarm cnt");
      const message = JSON.parse(e.data);
      const action = message.action;

      if (action === "getConnectionData") {
        const alarmCnt = Object.values(message.data).reduce((acc, cur) => {
          acc += cur.alarm_cnt;
          return acc;
        }, 0);
        store.dispatch(setChatAlarm({ num: alarmCnt }));
      }
    };

    this.socket.addEventListener("message", countAlarm);

    for (let eventName in this.listeners) {
      this.listeners[eventName].forEach((callback) => {
        this.socket.addEventListener(eventName, callback);
      });
    }
  }

  connect(senderId, senderNick = null) {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(this.url);
      this.setListeners(senderId, senderNick);
    }
  }

  disconnect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.intentionalClose = true;
      setTimeout(() => (this.intentionalClose = false), 1000);
      this.socket.close();
      this.socket = null;
    }
  }

  send(message) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    try {
      this.socket.send(JSON.stringify(message));
      console.log("send success", message);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  get readyState() {
    return this.socket.readyState;
  }

  on(eventName, callback) {
    this.listeners[eventName].push(callback);

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.addEventListener(eventName, callback);
    }
  }

  off(eventName, callback) {
    const eventIdx = this.listeners[eventName].indexOf(callback);

    if (eventIdx) {
      this.listeners[eventName].splice(eventIdx, 1);
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.removeEventListener(eventName, callback);
    }
  }
}

const socket = new Socket();

export default socket;
