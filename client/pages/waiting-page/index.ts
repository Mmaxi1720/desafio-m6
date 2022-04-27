import { Router } from "@vaadin/router";
import { state } from "../../state";
class Waiting extends HTMLElement {
    shadow: ShadowRoot
    constructor() {
      super(); 
      this.shadow = this.attachShadow({mode: 'open'});
      this.render()
      state.subscribe(()=>{
        this.render()
    })
    }
    
    render(){
        const div = document.createElement("div")
        div.innerHTML=`
        <div class="container">
                <header-comp owner-name = "${state.getState().onlineRoom.owner}">${state.getState().onlineRoom.invited}</header-comp>
            
                <text-comp variant = "paragraph">Esperando a tu rival..".</text-comp>
                
                <div class="container-images">
                    <imagen-el type = "piedra"></imagen-el>
                    <imagen-el type = "papel"></imagen-el>
                    <imagen-el type = "tijera"></imagen-el>
                </div>
        </div>
    `
    const style = document.createElement("style")
    style.textContent=
        `
        .container{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            height: 782px;
            
        }
        `
        this.shadow.appendChild(div)
        this.shadow.appendChild(style)
        const currentGame = state.getState().onlineRoom
        const roomId = state.getState().rooms.id
        if(currentGame.ownerready && currentGame.invitedready == true){
            Router.go("game-page")
            state.readyOff(roomId)
        }
    }
    
  }
customElements.define("waiting-comp", Waiting);  