let cnv,ctx;

let hracNahoru = false;
let hracDolu = false;
let hracVlevo = false;
let hracVpravo = false;

function stiskKlavesy(udalost) {
    if (udalost.key == "ArrowUp") {
        hracNahoru = true;
    }
    if (udalost.key == "ArrowDown") {
        hracDolu = true;
    }
    if (udalost.key == "ArrowLeft") {
        hracVlevo = true;
    }
    if (udalost.key == "ArrowRight") {
        hracVpravo = true;
    }
}

function uvolneniKlavesy(udalost) {
    if (udalost.key == "ArrowUp") {
        hracNahoru = false;
    }
    if (udalost.key == "ArrowDown") {
        hracDolu = false;
    }
    if (udalost.key == "ArrowLeft") {
        hracVlevo = false;
    }
    if (udalost.key == "ArrowRight") {
        hracVpravo = false;
    }
}

const USERID = Date.now().toString(16); //nahodne, ale "unikatni"
const url = 'wss://nodejs-3260.rostiapp.cz/bonk';
const connection = new WebSocket(url);
connection.onopen = () => {
    console.log("pripojeno");
};
connection.onmessage = e => {
    console.log(e.data);
    animace(JSON.parse(e.data)); 
};
connection.onerror = error => {
    console.log(`WebSocket error: ${JSON.stringify(error, 
         ["message", "arguments", "type", "name"])}`);
};

function poNacteni() {
    cnv = document.getElementById("platno");
    ctx = cnv.getContext("2d");

    document.addEventListener("keydown", stiskKlavesy);
    document.addEventListener("keyup", uvolneniKlavesy);
}

function pripojit() {
    let obj = {};
    obj.uid = USERID;
    obj.action = "newUser";
    obj.nickname = document.getElementById("jmeno").value;
    obj.color = document.getElementById("barva").value;
    connection.send(JSON.stringify(obj));
    setInterval(pohybHrace, 20);    
}

function pohybHrace() {
    if (!(hracNahoru || hracDolu || hracVlevo || hracVpravo)) return; //bez pohybu

    let obj = {};
    obj.uid = USERID;
    obj.action = "move";
    obj.up = hracNahoru;
    obj.down = hracDolu;
    obj.left = hracVlevo;
    obj.right = hracVpravo;
    connection.send(JSON.stringify(obj));
}


function animace(data) {
    ctx.clearRect(0,0, cnv.width, cnv.height);

    //mic
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(data.ball.x,data.ball.y,data.ball.r,0,2*Math.PI);
    ctx.fill();

    //hraci
    for (let p of data.players) {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
        ctx.fill();

        ctx.font = "10px Verdana";
        if (p.killed) {
            ctx.fillText(p.nickname + " #", p.x + p.r,p.y);
        } else {
            ctx.fillText(p.nickname, p.x + p.r,p.y);
        }
    }
}