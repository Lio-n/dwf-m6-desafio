import { state } from "../../state";

export class Header extends HTMLElement {
  shadow: ShadowRoot;
  fullName: string;
  rivalName: string;
  score: number;
  rivalScore: number;
  roomId: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const { fullName, rivalName, score, rivalScore, roomId } = state.getState();
    this.fullName = fullName;
    this.score = score;
    this.rivalName = rivalName;
    this.rivalScore = rivalScore;
    this.roomId = roomId;

    this.render();
  }

  render() {
    const style = document.createElement("style");
    style.innerHTML = `* {box-sizing: border-box;margin: 0;padding: 0; }
      .header {
        display: flex;
        justify-content: space-between;
        width: 23rem;
        padding: 2rem 0;
        transition: all 0.2s ease-in-out;
      }
      .header h2 {
        font-weight: 400;
      }
      @media (min-width: 530px) {
        .header {
          width: 30rem;
        }
      }
      @media (min-width: 600px) {
        .header {
          width: 35rem;
        }
      }
      .guess {
        color: #006CFC;
      }`;

    this.shadow.innerHTML = `
      <header class="header">

        <div class="header__container">
          <h2 class="header__name owner">${this.fullName} : ${this.score}</h2>
          <h2 class="header__name guess">${this.rivalName} : ${this.rivalScore}</h2>
        </div>

        <div class="header__room">
          <h2 class="room__title">SALA</h3>
          <h2 class="room__id">${this.roomId}</h1>
        </div>

      </header>`;

    this.shadow.appendChild(style);
  }
}

customElements.define("my-header", Header);
