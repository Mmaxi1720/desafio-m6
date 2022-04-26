

import "./components/button"
import "./components/text-comp"
import "./components/jugada"
import "./components/header"
import "./components/timer"
import "./components/score-comp"
import "./router"
import "./db"
import "./pages/home-page"
import "./pages/new-user"
import "./pages/sala-code"
import "./pages/room-page"
import "./pages/logging-page"
import "./pages/instructions"
import "./pages/game-page"
import "./pages/play-waiting"
import "./pages/waiting-page"
import "./pages/result-page"
import "./pages/tied-page"
import "./pages/win-page"
import "./pages/loss-page"



import { Router } from "@vaadin/router"


function main(){
    Router.go("/home-page")
    
}

main()