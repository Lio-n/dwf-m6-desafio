import { Router } from "@vaadin/router";
import { state } from "../../state";

class Error extends HTMLElement {
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
      Router.go("/rules");
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    body{background: linear-gradient(to bottom, hsl(310, 47%, 23%), rgb(57, 20, 54));}
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
    }`;

    this.shadow.innerHTML = `
    <div class="newRoom">
      <h1 class="newRoom__title">Piedra Papel <span>ó</span> Tijera</h1>
      
      <form class="form">
        <h2 class="form__subtitle">Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.</h2>
        <button class="form__btn">Volver a Intentar</button>
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

customElements.define("error-page", Error);
