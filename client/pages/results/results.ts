import { Router } from "@vaadin/router";
import { state } from "../../state";

class Results extends HTMLElement {
  shadow: ShadowRoot;
  result: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { choice, rivalChoice } = state.getState();
    this.result = state.whoWon(choice, rivalChoice);
    this.render();
  }
  addListener() {
    const btnResultEl = this.shadow.querySelector(".result__btn");

    btnResultEl.addEventListener("click", (e) => {
      e.preventDefault();
      // * Seteo 'ready:false', así no tengo problemas con el listenOnline
      // * El cual siempre se que "escuchando" cada actualizacion en la 'Real Time Database'.
      state.updateProperty("ready", false);
      Router.go("/instruction");
    });
  }
  showResult() {
    const resultEl = this.shadow.querySelector(".result");

    resultEl.textContent = this.result;
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
    .newRoom__cont-hand {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }
    .result {
      font-size: 3rem;
      color: aqua;
      margin: 3rem;
    }
      
      `;

    this.shadow.innerHTML = `
    <div class="newRoom">
      <h1 class="result"></h1>

      <my-button class="result__btn">¡Jugar!</my-button>

      <div class="newRoom__cont-hand">
        <my-hand tag="scissors"></my-hand>
        <my-hand tag="rock"></my-hand>
        <my-hand tag="paper"></my-hand>
      </div>
    </div>
    `;

    this.showResult();
    this.addListener();
    this.shadow.appendChild(style);
  }
}

customElements.define("results-page", Results);
