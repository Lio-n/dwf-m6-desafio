import { Router } from "@vaadin/router";
import { state } from "../../state";

class WaitPage extends HTMLElement {
  shadow: ShadowRoot;
  rivalName: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.rivalName = state.getState().rivalName;
  }
  connectedCallback() {
    this.render();
    // * Varifica si ambos jugadores tiene 'ready:true'.
    // * Si, es así los redirige a '/play_game'
    state.listenReady();
  }
  render() {
    const style = document.createElement("style");

    style.innerHTML = `
    .wait__cont-text {
      margin: 2rem 0;
    }`;

    this.shadow.innerHTML = `
    <div class="wait">

      <my-header></my-header>
      
      <div class="wait__cont-info">
        <div class="wait__cont-text">
            <h2>Esperando a que</h2>
            <h1 class="code">${this.rivalName}</h1>
            <h2>presione ¡Jugar!...</h2>
        </div>
  
        <div class="info__hand">
          <my-hand tag="scissors"></my-hand>
          <my-hand tag="rock"></my-hand>
          <my-hand tag="paper"></my-hand>
        </div>
      </div>

    </div>`;

    this.appendChild(style);
  }
}
customElements.define("wait-page", WaitPage);
