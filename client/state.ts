import { Router } from "@vaadin/router";
import { rtdb } from "./rtdb";

const API_BASE_URL = "http://localhost:3000";
let i = 0;

type Property = "online" | "ready";
type Move = "rock" | "paper" | "scissors" | "null";
type Result = "Draw" | "Win" | "Lose";
type Game = {
  myScore: Number;
  rivalScore: Number;
};

const state = {
  data: {
    fullName: "",
    choice: "null",
    roomId: "",
    rtdbRoomId: "",
    player: "", // # Si es Player1 ó Player2
    rivalName: "",
    rivalChoice: "null",
    // # Save results
    history: {
      myScore: 0,
      rivalScore: 0,
    },
  },

  listeners: [],
  init() {
    // Get the local data
    const localData = JSON.parse(localStorage.getItem("saved-state"));
    // If localdata retuns "null", do nothing
    if (!localData) {
      return;
    } else {
      this.setState(localData);
    }
  },

  getState() {
    return this.data;
  },

  // # CREATE USER
  createUser(callback?) {
    const { fullName } = this.getState();

    return fetch(`${API_BASE_URL}/signup`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName,
      }),
    }).then((res) => {
      if (res.status == 400) {
        return callback(true);
      }
      return callback();
    });
  },

  // # CREATE ROOM
  createRoom() {
    const { fullName } = this.getState();

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
          roomId,
          rtdbRoomId,
          player,
        });
      });
  },

  // # CHECK THE ROOM ID [RTDBROOMID]
  checkRoomId(callback?) {
    const { roomId } = this.getState();

    return fetch(`${API_BASE_URL}/rooms/${roomId}`)
      .then((res) => {
        if (res.status == 404) {
          return callback(true);
        }
        return res.json();
      })
      .then((data) => {
        const { rtdbRoomId } = data;
        this.setState({
          ...this.getState(),
          rtdbRoomId,
        });
        return callback();
      });
  },

  // # ACCESS TO ROOM
  accessToRoom(callback?) {
    const { rtdbRoomId, fullName } = this.getState();

    return fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}/player/${fullName}`)
      .then((res) => {
        if (res.status == 404) {
          return callback(true);
        }
        return res.json();
      })
      .then((data) => {
        const { player, fullName, myScore } = data;

        this.setState({
          ...this.getState(),
          player,
          fullName,
          myScore,
        });
        return callback();
      });
  },

  // # CHECK IF BOTH PLAYERS HAVE READY:TRUE OR ONLINE:TRUE
  listenProperty(property: Property) {
    const { rtdbRoomId } = this.getState();

    rtdb.ref(`/rooms/${rtdbRoomId}`).on("value", (snap) => {
      const { player1, player2 } = snap.val();

      if (property.includes("online") && player1.online && player2.online) {
        Router.go("/instruction");
      }
      if (property.includes("ready") && player1.ready && player2.ready) {
        Router.go("/play_game");
      }
    });
  },

  // # UPDATE PROPERTY [READY or ONLINE]
  updateProperty(property: Property, value: boolean) {
    const { rtdbRoomId, player } = this.getState();

    fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}/player`, {
      method: "put",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        player,
        property,
        value,
      }),
    });
  },

  // # UPDATE THE PLAYER2 FULLNAME
  updateRivalFullName() {
    const { rtdbRoomId, fullName } = this.getState();
    this.setState({ ...this.getState(), player: "player2" });

    fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}/player2/?fullName=${fullName}`, {
      method: "put",
      headers: {
        "content-type": "application/json",
      },
    });
  },

  // # GET CURRENT RIVAL INFO
  getRivalInfo(callback?) {
    const { rtdbRoomId, player } = this.getState();

    return fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}/rival_player/?player=${player}`, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
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

  // # GET RIVAL CHOICE
  getRivalChoice() {
    const { rtdbRoomId, player } = this.getState();

    rtdb.ref(`/rooms/${rtdbRoomId}`).on("value", (snap) => {
      const { player1, player2 } = snap.val();

      const rivalPlayer = player == "player1" ? player2 : player1;
      const emptyChoice: boolean = player1.choice !== "null" && player2.choice !== "null";

      if (emptyChoice) {
        this.setState({ ...this.getState(), rivalChoice: rivalPlayer.choice });
      }
    });
  },

  // # SAVE THE CHOICE IN THE REAL TIME DATABASE
  setMove(myPlay: Move) {
    const { player, rtdbRoomId } = this.getState();
    this.setState({ ...this.getState(), choice: myPlay });

    return fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}/player/choice`, {
      method: "put",
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
  whoWon(myPlay: Move, rivalPlay: Move) {
    let result = "Draw";
    if (myPlay == rivalPlay) {
      this.pushToHistory({ myScore: 0, rivalScore: 0 });
      return result;
    }
    const winScissors = myPlay == "scissors" && rivalPlay == "paper";
    const winPaper = myPlay == "paper" && rivalPlay == "rock";
    const winRock = myPlay == "rock" && rivalPlay == "scissors";

    // # If this returns False, the Rival wins
    result = [winScissors, winPaper, winRock].includes(true) ? "Win" : "Lose";

    result == "Win"
      ? this.pushToHistory({ myScore: 1, rivalScore: 0 }, result)
      : this.pushToHistory({ myScore: 0, rivalScore: 1 });
    return result;
  },

  // # STORE THE SCORE AND HISTORY, IN THE REALTIME DATABASE
  pushToHistory(score: Game, result?: Result) {
    const { myScore, rivalScore } = score;
    const { history, rtdbRoomId, player } = this.getState();

    history.myScore += myScore;
    history.rivalScore += rivalScore;
    this.setState({ ...this.getState(), history });
    // $ Points are added to the winner, and the score is sent to the rtdb.
    // $ Together with player, which verifies which player won [player1 or player2].
    if (result == "Win") {
      const { myScore } = history;

      fetch(`${API_BASE_URL}/rooms/${rtdbRoomId}/player/score`, {
        method: "put",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          player,
          myScore,
        }),
      });
    }
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("saved-state", JSON.stringify(newState));

    console.log("soy el state, he cambiado", i++, this.data);
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};
export { state };
