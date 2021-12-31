import { Router } from "@vaadin/router";
import { state } from "../../state";

const winSvg = require("url:../../../assets/images/win.svg");
const loseSvg = require("url:../../../assets/images/lose.svg");
const drawSvg = require("url:../../../assets/images/draw.svg");
type Move = "rock" | "paper" | "scissors";

class Results extends HTMLElement {
  shadow: ShadowRoot;
  result: string;
  resultURL: string;
  choice: Move;
  rivalChoice: Move;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const { choice, rivalChoice } = state.getState();
    this.choice = choice;
    this.rivalChoice = rivalChoice;
  }
  connectedCallback() {
    this.result = state.whoWon(this.choice, this.rivalChoice);
    this.render();
  }
  addListener() {
    const btnResultEl = this.shadow.querySelector(".layer__btn");

    btnResultEl.addEventListener("click", (e) => {
      e.preventDefault();
      // * Seteo 'ready:false', así no tengo problemas con el listenOnline
      // * El cual siempre se que "escuchando" cada actualizacion en la 'Real Time Database'.
      state.updateProperty("ready", false);
      Router.go("/instruction");
    });
  }
  showResult() {
    const { history, fullName, rivalName } = state.getState();
    this.resultURL = this.result == "Win" ? winSvg : this.result == "Lose" ? loseSvg : drawSvg;

    const layerEl = document.createElement("div");

    const plusMe = this.result == "Win" ? "plusMe" : "";
    const plusRival = this.result == "Lose" ? "plusRival" : "";

    layerEl.classList.add("layer", `${this.result}`);
    layerEl.innerHTML = `
      <div class="layer__cont-img">
        <img class="cont-img__stateSvg" src="${this.resultURL}" alt="${this.result}">
      </div> 

      <div class="layer__cont-score">
        <h3>Score</h3>
        <h5>${fullName}: <span class="${plusMe}">${history.myScore}</span></h5>
        <h5>${rivalName}: <span class="${plusRival}"> ${history.rivalScore}</span></h5>
      </div>
      
      <my-button class="layer__btn">Volver a Jugar</my-button>`;

    return layerEl;
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .result {
      /* box model */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100vh;
      width: 320px;
    }
    /* LAYER */
    .layer {
      /* box model */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100%;
      /* visual */
      animation: fadein 1s linear;
      animation-fill-mode: forwards;
      /* typography */
      text-align: center;
      /* positioning */
      position: absolute;
    }
    .cont-img__stateSvg {
      /* box model */
      height: 250px;
      width: 250px;
    }
    @keyframes fadein {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    .layer__cont-score {
      /* box model */
      margin: 1rem 0;
      height: 217px;
      width: 260px;
      /* typography */
      font-size: 45px;
      font-family: var(--font-rubik);
      /* visual */
      border: solid 10px;
      background-color: #fff;
      border-radius: 5px;
    }
    .Win {
      background-color: #6cb46cb0;
    }
    .Lose {
      background-color: #dc5b49b0;
    }
    .Draw {
      background-color: #828282b0;
    }
    .plusMe {
      color: #6cb46cb0;
    }
    .plusRival {
      color: #dc5b49b0;
    }`;

    const divEl = document.createElement("div");

    divEl.classList.add("result");
    divEl.innerHTML = `
    <my-hand style="transform: rotate(180deg);" tag="${this.rivalChoice}"></my-hand>
    <my-hand tag="${this.choice}"></my-hand>`;

    const itervalId = setInterval(() => {
      clearInterval(itervalId);

      const layerEl = this.showResult();
      divEl.appendChild(layerEl);

      this.addListener();
    }, 1500);

    this.shadow.appendChild(divEl);
    this.shadow.appendChild(style);
  }
}

customElements.define("results-page", Results);
