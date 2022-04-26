import { baseDeDatos, realtimeDatabase } from "./database"
import * as cors from "cors"
import * as express from "express"


const port = process.env.PORT || 3002
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const userCollection = baseDeDatos.collection("users")
const roomCollection = baseDeDatos.collection("rooms")
const rtdbRoomRef = realtimeDatabase.ref("rooms")



app.get('/rooms/:roomid/:username', (req, res) => {
    const roomid = req.params.roomid  
    const userName = req.params.username  
    const roomidToNumber = Number(roomid)
    
    roomCollection.where("id", "==", roomidToNumber).get().then((e)=>{
      if(e.empty){
        res.status(404).json({
          message:"room not found"
        })
      }else{ 
        res.send(e.docs[0].data())
        const roomRef = realtimeDatabase.ref("rooms/" + roomid)
        roomRef.update({
          invited: userName,
          invitedonline: true
        })
      }
    })
  })
  
 
  app.post("/rooms/:roomid/:username/:play", (req, res) => {
    const roomid = req.params.roomid  
    const userName = req.params.username  
    const userPlay = req.params.play  
    
    const roomRef = realtimeDatabase.ref("rooms/" + roomid)
    roomRef.get().then((snap)=>{
      const data = snap.val()
      if(userName == data.owner){
        roomRef.update({
          ownerplay: userPlay,
               }).then(()=>{
                 roomRef.get().then((snap)=>{
                   const dataNueva = snap.val()
                   res.send(dataNueva)
                  })
                })
              }else if(userName == data.invited){
                roomRef.update({
                  invitedplay: userPlay,
                }).then(()=>{
                  roomRef.get().then((snap)=>{
                    const dataNueva = snap.val()
                    res.send(dataNueva)
                  })
                })
              }
            })
          })
          app.post("/users", function (req, res) {
            const newUserDoc = userCollection.doc()
            newUserDoc.create(req.body).then(()=>{
              res.send(newUserDoc.id)
            })
          });
          
         
          app.post("/rooms", function (req, res) {
            const newRoomDoc = roomCollection.doc()
            newRoomDoc.create(req.body).then(()=>{
              res.send(newRoomDoc.id)
            });
          })
          

         /*  const roomRef = rtdb.ref("rooms/"+ nanoid())
          roomRef.set({
              messages: [],
              owner: userId, */
          app.post("/rooms/:roomid/:users", function (req, res) {
            const roomid = req.params.roomid
            const user = req.params.users
            
            rtdbRoomRef.update({
              [roomid]:{
                owner: user,
                owneronline: true,
                invitedonline: false
              }
            }).then(()=>{
              res.send("Room Created")
            })
          })
         
          app.post("/invitedoff/:roomid", function (req, res) {
            const roomid = req.params.roomid
            const roomRef = realtimeDatabase.ref("rooms/" + roomid)
            roomRef.update({
              
                invitedonline: false
              
            }).then(()=>{
              res.send("Invited Off")
            })
          })
          
          app.post("/readyoff/:roomid", function (req, res) {
            const roomid = req.params.roomid
            const roomRef = realtimeDatabase.ref("rooms/" + roomid)
            roomRef.update({
              
                invitedready: false,
                ownerready: false
              
            }).then(()=>{
              res.send("Invited Off")
            })
          })
          
          app.post("/playerready/:roomid/:user", function (req, res) {
            const roomid = req.params.roomid
            const user = req.params.user
  
            const roomRef = realtimeDatabase.ref("rooms/" + roomid)
            roomRef.update({
              
              [user]: true
              
            }).then(()=>{
              res.send("Player Ready")
            })
          })
        
        
          app.delete("/rooms/:roomid", function (req , res){
            const roomid = req.params.roomid
            const roomRefInvited = realtimeDatabase.ref("rooms/" + roomid + "/invitedplay")
            const roomRefOwner = realtimeDatabase.ref("rooms/" + roomid + "/ownerplay")
            roomRefOwner.remove()
            roomRefInvited.remove()
            res.send("Jugadas Eliminadas")
          })
          
         
          app.get("*",( req, res ) =>{
            res.send(__dirname + "/dist/index.html")
          })
          
          app.listen(port, () => {
            console.log(`Iniciando en http://localhost:${port}`)
          })