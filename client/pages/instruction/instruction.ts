import { Router } from "@vaadin/router";
import { state } from "../../state";

class Instruction extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    // * Seteo 'online:false', así no tengo problemas con el listenOnline
    // * El cual siempre se que "escuchando" cada actualizacion en la 'Real Time Database'.
    state.updateProperty("online", false);

    state.getRivalInfo(() => {
      this.render();
    });
  }
  addListener() {
    const instBtn = this.shadow.querySelector(".info__ready-btn");
    instBtn.addEventListener("click", () => {
      state.updateProperty("ready", true);
      Router.go("/wait");
    });
  }
  render() {
    const text =
      "Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.";

    const style = document.createElement("style");

    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 2.2rem 1.2rem 0 1.2rem;
      height: 100vh;
    }
    .root__container {
      width: min-content;
    }
    .root__cont-info {
      boder: solid 1px;
    }
    .info__title {
      margin: 0 0 2rm 0;
    }
    .root__cont-hand {
      /* box model */
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      width: 320px;
    }`;

    this.shadow.innerHTML = `
    <div class="root">

      <my-header></my-header>
      
      <div class="root__container">
        <div class="root__cont-info">
          <my-text tag="h2">${text}</my-text>
          <my-button class="info__ready-btn">¡Jugar!</my-button>
        </div>
  
        <div class="root__cont-hand">
          <my-hand tag="scissors"></my-hand>
          <my-hand tag="rock"></my-hand>
          <my-hand tag="paper"></my-hand>
        </div>
      </div>

    </div>`;

    this.addListener();
    this.shadow.appendChild(style);
  }
}
customElements.define("instruction-page", Instruction);
