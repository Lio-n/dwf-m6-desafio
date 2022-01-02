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
    const inputFullName = formEl["fullName"];
    const alertName = formEl.querySelector(".form__warning-name");

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const { fullName } = e.target as any;

      if (fullName.value == "") {
        inputFullName.style.border = "3px solid #e60026";
      } else {
        inputFullName.style.removeProperty("border");

        state.setState({ ...state.getState(), fullName: fullName.value });
        // * Create User
        state.createUser((err) => {
          if (err) {
            // ! User Already Created
            alertName.classList.add("open");
          } else {
            alertName.classList.remove("open");
            // * Create Room
            state.createRoom().then(() => {
              // * Set Online
              state.updateProperty("online", true);
              Router.go("/share_code");
            });
          }
        });
      }
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .newRoom {
      /* box model */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 0 1.5rem;
      width: min-content;
      height: 100vh;
    }
    .newRoom__cont-hand{
      /* box model */
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }
    /* FORM */ 
    .form {
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
    .form__warning-name {
      display: none;
      margin-top: 5px;
      color: hsl(0, 93%, 68%);
    }
    .open {
      display: initial;
    }`;

    this.shadow.innerHTML = `
    <div class="newRoom">
      <my-text tag="h1"></my-text>
      
      <form class="form">
        <input class="form__input" name="fullName" placeholder="Ingresar Nombre"/>
        <h4 class="form__warning-name">User Already Created</h4>

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
