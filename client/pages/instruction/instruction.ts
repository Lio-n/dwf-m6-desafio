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
    const rulesBtn = this.shadow.querySelector(".info__ready-btn");
    rulesBtn.addEventListener("click", () => {
      state.updateProperty("ready", true);
      Router.go("/wait");
    });
  }
  render() {
    const style = document.createElement("style");

    style.innerHTML = `
    .rules__cont-info {
      width: 40rem;
      boder: solid 1px;
    }
    .info__title {
      margin: 0 0 2rm 0;
    }`;

    this.shadow.innerHTML = `
    <div class="rules">

      <my-header></my-header>
      
      <div class="rules__cont-info">
        <h1 class="info__title">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 2 segundos.</h1>
        <my-button class="info__ready-btn">¡Jugar!</my-button>
        
        <div class="info__hand">
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
