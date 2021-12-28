import { Router } from "@vaadin/router";
import { state } from "../../state";
type Move = "rock" | "paper" | "scissors";

class Play extends HTMLElement {
  shadow: ShadowRoot;
  // * This boolean controls whether any of the three options are selected
  isSelected: boolean = false;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  addListener() {
    const myMove = this.shadow.querySelectorAll("my-hand");

    for (const choice of myMove) {
      choice.addEventListener("change", (e: any) => {
        const myPlay = e.detail.myPlay as Move;
        state.setMove(myPlay).then(() => {
          this.getMoves();
        });
      });
    }
  }
  getMoves() {
    state.getRivalMove();

    state.subscribe(() => {
      const { choice, rivalChoice } = state.getState();
      if ((choice && rivalChoice) as Move) {
        this.isSelected = true;
      }
    });
  }
  render() {
    let count = 8;

    const style = document.createElement("style");
    style.innerHTML = `
    .playGame__countdown {
      font-size: 4rem;
      color: aqua;
    }
    .playGame__cont-hand {
      display: flex;
      width: 100wh;
      margin: 4rem 0;
      justify-content: space-between;
    }
    my-hand {
      border: solid 2px aqua;
    }`;
    this.shadow.innerHTML = `
      <h1 class="playGame__countdown">${count}</h1>
      
      <div class="playGame__cont-hand">
        <my-hand tag="scissors"></my-hand>
        <my-hand tag="rock"></my-hand>
        <my-hand tag="paper"></my-hand>
      </div>`;

    const countDown = this.shadow.querySelector(".playGame__countdown");

    countDown.textContent = "9";
    // & Set time 3s
    const intervalId = setInterval(() => {
      countDown.textContent = `${count}`;

      count--;
      // & If I don't select any of the three options.
      // & It stops counting and redirects to "/instruction".
      if (count < 0 && !this.isSelected) {
        clearInterval(intervalId);
        state.setReady(false);
        Router.go("/instruction");
      }
      // & If I select any of the Three Options
      // & It stops counting and redirects to "/results".
      if (this.isSelected) {
        clearInterval(intervalId);
        state.setReady(false);
        Router.go("/results");
      }
    }, 1000);

    this.addListener();
    this.shadow.appendChild(style);
  }
}
customElements.define("play-game-page", Play);
