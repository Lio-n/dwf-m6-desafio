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

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const { roomId, fullName } = e.target as any;

      // * Create User
      state.createUser(fullName.value).then(() => {
        // * Check
        state.checkRoomId(roomId.value).then(() => {
          // * Connect
          state.updateRivalFullName(() => {
            // * Set Online
            state.updateProperty("online", true);
            Router.go("/instruction");
          });
        });
      });
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
    }`;

    this.shadow.innerHTML = `
    <div class="joinRoom">
      <my-text tag="h1"></my-text>

      <form class="form">
        <input class="form__input" name="fullName" placeholder="Ingresar Nombre"/>

        <input class="form__input" name="roomId" placeholder="Ingresar Codigo"/>
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
