import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react'

function Main(){
    const navigate = useNavigate()
    const [gameId, setGameId] = useState()
    const [color, setColor] = useState("white")
    function CreateRoom(){
        // navigate("/game/1") Example
        fetch(process.env.REACT_APP_BACKEND_URL + "/create-room", {
            method: 'POST'
        })
        .then((response)=>response.json())
        .then(data => navigate(`/game/`+data.id+"?color="+color))
        // .then(data => console.log(data))
        // '123' + 'qwe' ='123qwe'
    }

    function JoinRoom(){
        // localhost:3000/game/fdsngjnds?color=white
        navigate(`/game/`+gameId+"?color="+color);

    }

    return <div>
        <header style={{alignItems: "center"}}>
        <h1 >Chess Game</h1>
        </header>
        <button onClick={CreateRoom}>Create Room</button>
        <input type="text"
        placeholder="Game Id"
        value={gameId}
        onChange={(e)=>setGameId(e.target.value)}></input>
        <button onClick={JoinRoom} >Join Rooms</button>
        <div>
            <span>
            <input type="radio"
            value="black"
            checked={color=="black"}
            onChange={(e)=>setColor(e.target.value)}
            />
            black
            </span>

            <span>
            <input type="radio"
            value="white"
            checked={color=="white"}
            onChange={(e)=>setColor(e.target.value)}
            />
            white
            </span>
            
            <span>
            <input type="radio"
            value="spectator"
            checked={color !== "black" && color !== "white"}
            onChange={(e)=>setColor(e.target.value)}
            />
            spectator
            </span>

        </div>
    </div>
    
}

export default Main;