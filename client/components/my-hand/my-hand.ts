const rock = require("url:../../../assets/images/icon-rock.svg");
const paper = require("url:../../../assets/images/icon-paper.svg");
const scissors = require("url:../../../assets/images/icon-scissors.svg");

export class Hand extends HTMLElement {
  shadow: ShadowRoot;
  tag: string;
  handURL: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.tag = this.getAttribute("tag") || "";
    this.handURL = this.tag == "rock" ? rock : this.tag == "paper" ? paper : scissors;
    this.render();
  }
  listeners() {
    const handEl = this.shadow.querySelector(`.${this.tag}`);
    handEl.addEventListener("click", (e: any) => {
      const event = new CustomEvent("change", {
        detail: { myPlay: this.tag },
      });
      this.dispatchEvent(event);
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `* {box-sizing: border-box;margin: 0;padding: 0;}
    .hand {
      /* visual */
      cursor: pointer;
    }
    img {
      height: 7rem;
    }
    `;

    if (this.tag !== "") {
      this.shadow.innerHTML = `
        <div class="hand ${this.tag}">
          <img src="${this.handURL}" alt="${this.tag}">
        </div>
      `;

      this.listeners();
    }

    this.shadow.appendChild(style);
  }
}

customElements.define("my-hand", Hand);
