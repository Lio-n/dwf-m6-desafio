import { Router } from "@vaadin/router";
import { rtdb } from "./rtdb";

const API_BASE_URL = "http://localhost:3000";
let i = 0;
type Move = "rock" | "paper" | "scissors";
type Result = "Draw" | "Win" | "Lose";
type Game = {
  myScore: Number;
  rivalScore: Number;
};
const state = {
  data: {
    fullName: "",
    choice: "none",
    roomId: "",
    rtdbRoomId: "",
    player: "", // # Si es Player1 ó Player2
    rivalName: "",
    rivalChoice: "none",
    // # Save results
    history: {
      myScore: 0,
      rivalScore: 0,
    },
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

  // # VERIFICA SI AMBOS JUGADORES TIENEN ONLINE:TRUE
  listenOnline() {
    const { rtdbRoomId } = this.getState();

    rtdb.ref(`/rooms/${rtdbRoomId}`).on("value", (snap) => {
      const { player1, player2 } = snap.val();
      console.log("LISTENER ONLINE", snap.val());

      if (player1.online && player2.online) {
        Router.go("/instruction");
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

  // # VERIFICA SI AMBOS JUGADORES TIENE READY:TRUE
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

  // # OBTENGO EL MOVE DEL RIVAL
  getRivalMove() {
    const { rtdbRoomId, player } = this.getState();
    const rivalPlayer = player == "player1" ? "player2" : "player1";

    rtdb.ref(`/rooms/${rtdbRoomId}/${rivalPlayer}`).on("value", (snap) => {
      const { choice } = snap.val();

      this.setState({ ...this.getState(), rivalChoice: choice });
    });
  },

  // # GUARDO EL MOVE EN LA REALTIME DATABASE
  setMove(myPlay: Move) {
    const { player, rtdbRoomId } = this.getState();
    this.setState({ ...this.getState(), choice: myPlay });

    return fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}/set_move`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        player,
        myPlay,
      }),
    });
  },

  // # Scissors > Paper > Rock > Scissors
  // # How to determine who won?
  whoWin(myPlay: Move, rivalPlay: Move) {
    let result = "Draw";
    if (myPlay == rivalPlay) {
      this.pushToHistory({ myScore: 0, rivalScore: 0 });
      return result;
    }
    const winScissors = myPlay == "scissors" && rivalPlay == "paper";
    const winPaper = myPlay == "paper" && rivalPlay == "rock";
    const winRock = myPlay == "rock" && rivalPlay == "scissors";

    // If this returns False, the Rival wins
    result = [winScissors, winPaper, winRock].includes(true) ? "Win" : "Lose";

    result == "Win"
      ? this.pushToHistory({ myScore: 1, rivalScore: 0 }, result)
      : this.pushToHistory({ myScore: 0, rivalScore: 1 });
    return result;
  },

  // # STORE THE SCORE ON REALTIME DATABASE AND HISTORY
  pushToHistory(score: Game, result?: Result) {
    const { myScore, rivalScore } = score;
    const { history, rtdbRoomId, player } = this.getState();

    history.myScore += myScore;
    history.rivalScore += rivalScore;
    this.setState({ ...this.getState(), history });
    // $ Al ganador se le suma puntos, y se envia el score a la rtdb.
    // $ Junto con player, el cual verifica que jugador soy [player1 ó player2].
    if (result == "Win") {
      const { myScore } = history;

      fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}/set_score`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          myScore,
          player,
        }),
      });
    }
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
