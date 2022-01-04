import { Router } from "@vaadin/router";
import { state } from "../../state";

class Disconnected extends HTMLElement {
  shadow: ShadowRoot;
  rivalName: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.rivalName = state.getState().rivalName;
  }
  connectedCallback() {
    this.render();
  }
  addListener() {
    const errBtn = this.shadow.querySelector("my-button");

    errBtn.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/");
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root {
      /* box model */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 0 1.5rem;
      width: min-content;
      height: 100vh;
    }
    .root__cont-hand{
      /* box model */
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }`;

    this.shadow.innerHTML = `
    <div class="root">
        <my-text tag="h1"></my-text>
        <my-text tag="h2">Ups, el jugador ${this.rivalName} se ha desconectado.</my-text>
      
        <my-button>Ir a inicio</my-button>

        <div class="root__cont-hand">
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

customElements.define("disconnected-page", Disconnected);
