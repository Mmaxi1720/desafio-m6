import { Router } from "@vaadin/router";
import { state } from "../../state";
class NewUser extends HTMLElement {
    constructor() {
      super(); 
      this.render()
    }
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    render(){
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML=`
        <div class="container">
            <text-comp variant = "title">Piedra, Papel o Tijera.</text-comp>
            <button-el type="full-button" label="Ingresa tu nombre" button="Empezar" id="button"></button-el>
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
            height: 780px;
            }
            
        @media(max-width:375px){ 
            .container{
                height: 600px
            }
            }
        `
        shadow.appendChild(style)
        const buttonEl = shadow.getElementById("button")
        const formShadowEL =buttonEl.shadowRoot.getElementById("form")
        const inputShadowEL =buttonEl.shadowRoot.querySelector("input")
        formShadowEL.addEventListener("submit",(e)=>{
            e.preventDefault()
            const nuevoNombre = inputShadowEL.value
            const randomNumber = this.getRandomNumber(1000,9999)
            state.setUser(nuevoNombre)
            .then(()=>{
                const user = state.getState().users.nombre
                state.createNewRoom(randomNumber, user).then(()=>{
                    Router.go("room-page")
                })
            })
        })
        
    }
    
  }
customElements.define("newuser-comp", NewUser);  