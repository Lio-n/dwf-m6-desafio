import { Router } from "@vaadin/router";
import { state } from "../../state";

class JoinRoom extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  addListener() {
    const formEl = this.shadow.querySelector(".form");
    const inputFullName = formEl["fullName"];
    const inputRoomId = formEl["roomId"];
    const alertName = formEl.querySelector(".form__warning-name");
    const alertRoomId = formEl.querySelector(".form__warning-roomId");

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const { fullName, roomId } = e.target as any;

      fullName.value == ""
        ? (inputFullName.style.border = "3px solid #e60026")
        : inputFullName.style.removeProperty("border");
      roomId.value == ""
        ? (inputRoomId.style.border = "3px solid #e60026")
        : inputRoomId.style.removeProperty("border");

      if (fullName.value !== "" && roomId.value !== "") {
        state.setState({ ...state.getState(), fullName: fullName.value, roomId: roomId.value });

        // * Check
        state.checkRoomId((err) => {
          if (err) {
            // ! Room not found
            alertRoomId.classList.add("open");
          } else {
            alertRoomId.classList.remove("open");
            // * Create User
            state.createUser((err) => {
              if (err) {
                // ! User Already Created
                alertName.classList.add("open");
                state.accessToRoom((err) => {
                  if (err) {
                    // ! fullname is not linked to the roomId
                    Router.go("/error/full_room");
                  } else {
                    alertName.classList.remove("open");
                    // * Set Online
                    state.updateProperty("online", true);
                    Router.go("/instruction");
                  }
                });
              } else {
                // ! If user Not Exists
                alertName.classList.remove("open");
                state.checkFullRoom((err) => {
                  if (err) {
                    Router.go("/error/full_room");
                  } else {
                    // * Connect
                    state.updateRivalFullName();
                    // * Set Online
                    state.updateProperty("online", true);
                    Router.go("/instruction");
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .joinRoom {
      /* box model */
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 1.5rem 1.5rem 0 1.5rem;
      width: min-content;
      height: 100vh;
    }
    .joinRoom__cont-hand {
      /* box model */
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }
    /* FORM */ 
    .form{
      text-align: center;
    }
    /* BUTTON */
    .form__btn {
      /* box model */
      max-width: 22rem;
      padding: 10px;
      min-width: 20rem;
      margin-top: 1.5rem;
      /* typography */
      letter-spacing: 1px;
      font-size: 2rem;
      font-family: "Barlow Semi Condensed", sans-serif;
      /* visual */
      cursor: pointer;
      border-radius: 10px;
      color: #D8FCFC;
      background-color: #006CFC;
      border: 5px solid #001997;
      opacity: 0.8;
      transition: all 0.2s ease-in-out;
      /* typography */
      font-family: var(--font-rubik);
    }
    .form__btn:hover {
      transform: scale(1.1);
      opacity: 1;
    }
    /* INPUT */
    .form__input {
      /* box model */
      border-radius: 10px;
      padding: 10px 10px 10px 20px;
      width: 20rem;
      margin-top: 1.5rem;
      /* typography */
      letter-spacing: 1px;
      font-size: 2rem;
      font-family: "Barlow Semi Condensed", sans-serif;
      /* visual */
      border: none;
      color: #666;
      border: 5px solid #001997;
    }
    .form__warning-roomId, .form__warning-name {
      display: none;
      margin-top: 5px;
      color: hsl(0, 93%, 68%);
    }
    .open {
      display: initial;
    }`;

    this.shadow.innerHTML = `
    <div class="joinRoom">
      <my-text tag="h1"></my-text>

      <form class="form">
        <input class="form__input" name="fullName" placeholder="Ingresar Nombre"/>
        <h4 class="form__warning-name">User Already Created</h4>

        <input class="form__input" name="roomId" placeholder="Ingresar Codigo"/>
        <h4 class="form__warning-roomId">Room not found</h4>

        <button class="form__btn">Entrar</button>
      </form>

      <div class="joinRoom__cont-hand">
        <my-hand tag="scissors"></my-hand>
        <my-hand tag="rock"></my-hand>
        <my-hand tag="paper"></my-hand>
      </div>

    </div>
    `;

    this.addListener();
    this.shadow.appendChild(style);
  }
}

customElements.define("join-room-page", JoinRoom);
