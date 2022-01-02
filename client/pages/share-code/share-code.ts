import { state } from "../../state";

export class ShareCode extends HTMLElement {
  shadow: ShadowRoot;
  roomId: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.roomId = state.getState().roomId;
    this.render();
    // * Varifica si ambos jugadores tiene 'online:true'.
    // * Si, es así los redirige a '/instruction'
    state.listenProperty("online");
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root {
      /* box model */
      display: flex;
      align-items: end;
      height: 100vh;
    }
    .shareCode {
      /* box model */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 0 1.5rem;
      height: 80vh;
    }
    .shareCode__cont-text {
      /* typography */
      font-size: 2rem;
      text-align: center;
    }
    .shareCode__cont-text > h2 {
      font-weight: 300;
    }
    .shareCode__cont-text > .code {
      /* box model */
      margin: 1rem;
      font-weight: 600;
      /* visual */
      color: #006CFC;
    }
    .shareCode__cont-hand {
      /* box model */
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      width: 320px;
    }`;

    this.shadow.innerHTML = `
    <div class="root">

      <div class="shareCode">
        <div class="shareCode__cont-text">
          <h2>Compartí el código:</h2>
          <h2 class="code">${this.roomId}</h2>
          <h2>Con tu contrincante</h2>
        </div>
  
        <div class="shareCode__cont-hand">
          <my-hand tag="scissors"></my-hand>
          <my-hand tag="rock"></my-hand>
          <my-hand tag="paper"></my-hand>
        </div>
      </div>

    </div>`;

    this.shadow.appendChild(style);
  }
}
customElements.define("share-code-page", ShareCode);
