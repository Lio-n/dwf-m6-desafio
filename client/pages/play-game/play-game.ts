import { Router } from "@vaadin/router";
import { state } from "../../state";

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
        choice.classList.add("selected");
        const myPlay = e.detail.myPlay;
        state.setMove(myPlay);
      });
    }
  }
  render() {
    let count = 3;

    const style = document.createElement("style");
    style.innerHTML = `
    .playGame {
      /* box model */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100vh;
    }
    .playGame__countdown {
      /* typography */
      font-size: 4rem;
      /* visual */
      color: aqua;
    }
    .playGame__cont-hand {
      /* box model */
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      width: 320px;
      /* positioning */
      position: relative;
      transform: scale(1.5);
      top: -30px;
    }
    /* SELECT HAND */
    my-hand {
      transition: all 0s ease-in-out;
    }
    my-hand.selected {
      /* positioning */
      position: relative;
      transform: scaleY(1.5);
      bottom: 29px;
    }
    .playGame__cont-countdown {
      /* typograpy */
      text-align: center;
      font-size: 5rem;
      /* visual */
      color: aqua;
    }`;

    this.shadow.innerHTML = `
    <div class="playGame">
      
      <div class="playGame__cont-countdown">
        <h1 class="playGame__countdown">${count}</h1>
      </div>
      
      <div class="playGame__cont-hand">
        <my-hand tag="scissors"></my-hand>
        <my-hand tag="rock"></my-hand>
        <my-hand tag="paper"></my-hand>
      </div>
    
    </div>`;

    this.addListener();
    state.getRivalChoice();

    const countDown = this.shadow.querySelector(".playGame__countdown");

    countDown.textContent = "3";
    // & Set time 3s
    const intervalId = setInterval(() => {
      countDown.textContent = `${count}`;

      const { choice, rivalChoice } = state.getState();
      if (choice !== "null" && rivalChoice !== "null") {
        this.isSelected = true;
      }

      // & If I don't select any of the three options.
      // & It stops counting and redirects to "/instruction".
      if (count < 0 && !this.isSelected) {
        clearInterval(intervalId);
        state.updateProperty("ready", false);
        Router.go("/instruction");
      }
      // & If I select any of the Three Options
      // & It stops counting and redirects to "/results".
      if (this.isSelected) {
        clearInterval(intervalId);
        state.updateProperty("ready", false);
        Router.go("/results");
      }

      count--;
    }, 1000);

    this.shadow.appendChild(style);

    // ! Player Disconnected
    window.onbeforeunload = function playerDisconnected() {
      state.playerDisconnected();
    };
  }
}
customElements.define("play-game-page", Play);
