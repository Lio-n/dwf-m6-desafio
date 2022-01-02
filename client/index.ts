// ? COMPONENTS
import "./components/my-button/my-button";
import "./components/my-hand/my-hand";
import "./components/my-header/my-header";
import "./components/my-text/my-text";

// ? PAGES
import "./pages/home/home";
import "./pages/join-room/join-room";
import "./pages/new-room/new-room";
import "./pages/share-code/share-code";
import "./pages/instruction/instruction";
import "./pages/wait/wait";
import "./pages/play-game/play-game";
import "./pages/results/results";

// ? SOMETHING ELSE
import "./routes";
import { state } from "./state";

(() => {
  state.init();
})();
