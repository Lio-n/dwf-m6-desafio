import { Router } from "@vaadin/router";
import { state } from "../../state";

class NewRoom extends HTMLElement {
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
      const { fullName } = e.target as any;

      // * Create User
      state.createUser(fullName.value).then(() => {
        // * Create Room
        state.createRoom(fullName.value).then(() => {
          // * Set Online
          state.setOnline(true);
          Router.go("/share_code");
        });
      });
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .newRoom {
      padding: 1.5rem 1.5rem 0 1.5rem;
      width: min-content;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100vh;
    }
    .newRoom__title {
      font-size: 3rem;
      line-height: 6rem;
      margin-bottom: 1.5rem;
      color: var(--title);
    }
    .newRoom__title span {
      color: #91ccaf;
    }
    .newRoom__cont-hand{
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
      }
    /* FORM */ 
    .form{
      text-align: center;
    }
    .form__subtitle{
        margin: 5px;
    }
    /* BUTTON */
    .form__btn {
      /* box model */
      max-width: 22rem;
      padding: 10px;
      min-width: 20rem;
      margin-top: 2rem;
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
    }
    /* INPUT */
    .form__input {
      /* box model */
      border-radius: 10px;
      padding: 10px 10px 10px 20px;
      width: 20rem;
      /* typography */
      letter-spacing: 1px;
      font-size: 2rem;
      font-family: "Barlow Semi Condensed", sans-serif;
      /* visual */
      border: none;
      color: #666;
    }`;

    this.shadow.innerHTML = `
    <div class="newRoom">
      <h1 class="newRoom__title">Piedra Papel <span>ó</span> Tijera</h1>
      
      <form class="form">
        <h2 class="form__subtitle">Tu Nombre</h2>
        <input class="form__input" name="fullName" placeholder="Ingresar Nombre"/>
        <button class="form__btn">Entrar</button>
      </form>
      
      <div class="newRoom__cont-hand">
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

customElements.define("new-room-page", NewRoom);
