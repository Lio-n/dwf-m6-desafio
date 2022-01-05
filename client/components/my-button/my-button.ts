export class Button extends HTMLElement {
  shadow: ShadowRoot;
  txt: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.txt = this.textContent;
    this.render();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `* {box-sizing: border-box;margin: 0;padding: 0; }
    .btn {
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
    .btn:hover, .btn:active {
      transform: scale(1.1);
      opacity: 1;
    }`;

    this.shadow.innerHTML = `<button class="btn">${this.txt}</button>`;

    this.shadow.appendChild(style);
  }
}

customElements.define("my-button", Button);
