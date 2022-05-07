import { Router } from "@vaadin/router";
import { state } from "../../state";
class Gamepage extends HTMLElement {
  shadow: ShadowRoot;
  username: string
  roomid: any
  timer: any
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.username = state.getState().users.nombre;
    this.roomid = state.getState().rooms.id;
    this.render();
  }
    render() {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="container">
            <timer-comp></timer-comp>
            <div class="container-images">
                <imagen-el type = "piedra" class="play"></imagen-el>
                <imagen-el type = "papel" class="play"></imagen-el>
                <imagen-el type = "tijera" class="play"></imagen-el>
            </div>
        </div>
        `;
    const style = document.createElement("style");
    style.textContent = `
        .container{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            height: 600px;
            
        }
        `;
    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
    
    const imagenEls = this.shadow.querySelectorAll(".play");
    imagenEls.forEach((ev) => {
      ev.addEventListener("click", (e) => {
        e.stopPropagation;
        const move = ev.getAttribute("type");
        if (move == "piedra") {
          clearTimeout(this.timer)
          state.setMove("piedra", this.username, this.roomid).then(() => {
            Router.go("waiting-play");
          });
        } if (move == "papel") {
          clearTimeout(this.timer)
          state.setMove("papel", this.username, this.roomid).then(() => {
            Router.go("waiting-play");
          });
        }  if(move == "tijera"){
          clearTimeout(this.timer)
          state.setMove("tijera", this.username, this.roomid).then(() => {
            Router.go("waiting-play");
          });
        } else{
          Router.go("/instructions")
        }
      })
    },1000) 
  }
}
customElements.define("game-comp", Gamepage);