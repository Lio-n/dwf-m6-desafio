import { Router } from "@vaadin/router";
import { rtdb } from "./rtdb";

const API_BASE_URL = "http://localhost:3000";
let i = 0;

const state = {
  data: {
    fullName: "",
    score: "",
    choice: "none",
    roomId: "",
    rtdbRoomId: "",
    player: "", // # Si es Player1 ó Player2
    rivalName: "",
    rivalScore: "",
    rivalChoice: "none",
  },

  listeners: [],
  init() {},

  getState() {
    return this.data;
  },

  // # CREATE USER
  createUser(fullName: string) {
    this.setState({
      ...this.getState(),
      fullName,
    });

    return fetch(`${API_BASE_URL}/signup`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName,
      }),
    });
  },

  // # CREATE ROOM
  createRoom(fullName: string) {
    return fetch(`${API_BASE_URL}/rooms`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { roomId, rtdbRoomId, player } = data;

        this.setState({
          ...this.getState(),
          fullName,
          roomId,
          rtdbRoomId,
          player,
        });
      });
  },

  // # CHECKEA EL ROOM ID [RTDBROOMID]
  checkRoomId(roomId: string) {
    return fetch(`${API_BASE_URL}/checkId/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        const { rtdbRoomId } = data;
        state.setState({
          ...this.getState(),
          roomId,
          rtdbRoomId,
        });
      });
  },

  // # VERIFICA SI AMBOS JUGADORES ESTAN ONLINE
  listenOnline() {
    const { rtdbRoomId } = this.getState();

    rtdb.ref(`/rooms/${rtdbRoomId}`).on("value", (snap) => {
      const { player1, player2 } = snap.val();
      console.log("LISTENER ONLINE", snap.val());

      if (player1.online && player2.online) {
        Router.go("/rules");
      }
    });
  },

  // # CAMBIA EL VALOR EN ONLINE
  setOnline(onlineValue: boolean) {
    const { rtdbRoomId, player } = this.getState();
    fetch(`${API_BASE_URL}/updateOnline`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        player,
        rtdbRoomId,
        onlineValue,
      }),
    });
  },

  // # VERIFICA SI AMBOS JUGADORES ESTAN READY
  listenReady() {
    const { rtdbRoomId } = this.getState();

    rtdb.ref(`/rooms/${rtdbRoomId}`).on("value", (snap) => {
      const { player1, player2 } = snap.val();
      console.log("LISTENER READY", snap.val());

      if (player1.ready && player2.ready) {
        Router.go("/play_game");
      }
    });
  },

  // # CAMBIA EL VALOR EN READY
  setReady(readyValue: boolean) {
    const { rtdbRoomId, player } = this.getState();
    fetch(`${API_BASE_URL}/updateReady`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        player,
        rtdbRoomId,
        readyValue,
      }),
    });
  },

  // # VERIFICO QUE PLAYER SOY [PLAYER1] or [PLAYER2]
  connectToRoom(callback?) {
    const { rtdbRoomId, fullName, roomId } = this.getState();
    return fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        roomId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { player } = data;
        this.setState({ ...this.getState(), player });
        callback();
      });
  },

  // # OBTENGO LA INFO DEL RIVAL
  getRivalInfo(callback?) {
    const { rtdbRoomId, player } = this.getState();

    return fetch(`${API_BASE_URL}/rooms/rival_info/${rtdbRoomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        player,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { rivalName, score, rivalScore } = data;

        this.setState({ ...this.getState(), rivalName, score, rivalScore });
        callback();
      });
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    // localStorage.setItem("save-state", JSON.stringify(newState));

    console.log("soy el state, he cambiado", i++, this.data);
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};
export { state };
