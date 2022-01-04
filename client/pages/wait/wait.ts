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
    state.listenProperty("ready");
  }
  render() {
    const style = document.createElement("style");

    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .wait {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100vh;
      padding: 2.2rem 1.2rem 0 1.2rem;
    }
    .wait__cont-text {
      text-align: center;
      margin-bottom: 6.4rem;
    }
    .wait__cont-hand {
      /* box model */
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      width: 320px;
    }
    .wait__cont-text h2 {
      font-weight: 300;
      font-size: 2rem;
      font-family: var(--font-rubik);
    }
    .wait__rivalFullName {
      font-weight: 600;
      color: #006CFC;
    }`;

    this.shadow.innerHTML = `
    <div class="wait">

      <my-header></my-header>
      
      <div class="wait__cont-info">
        <div class="wait__cont-text">
            <h2>Esperando a que</h2>
            <h2 class="wait__rivalFullName">${this.rivalName}</h2>
            <h2>presione ¡Jugar!...</h2>
        </div>
  
        <div class="wait__cont-hand">
          <my-hand tag="scissors"></my-hand>
          <my-hand tag="rock"></my-hand>
          <my-hand tag="paper"></my-hand>
        </div>
      </div>

    </div>`;

    this.shadow.appendChild(style);

    // ! Player Disconnected
    window.onbeforeunload = function playerDisconnected() {
      state.playerDisconnected();
    };
  }
}
customElements.define("wait-page", WaitPage);
