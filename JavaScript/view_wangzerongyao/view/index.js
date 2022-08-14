import Game from "./game/game.js";
let game = new Game();
// 所有的节点
let eles = {
    login:{
        loginView:document.querySelector(".login"),
        username:document.querySelector(".username"),
        loginSub:document.querySelector(".sub")
    },
    game:{
        gameView:document.querySelector(".game"),
        chioseusername:document.querySelector(".chioseusername"),
        heroView:document.querySelector(".heroView"),
        heroShow:document.querySelector(".heroShow"),
        skillsView:document.querySelector(".skillsView")
    }
}

eles.login.loginSub.onclick = function () {
    let username = eles.login.username.value;
    if(username){
        game.login(username);
        // 隐藏登录页面、显示游戏页面
        eles.login.loginView.style.display = "none";
        eles.game.gameView.style.display = "block";
        // 修改用户名；
        eles.game.chioseusername.innerHTML = username;
        renderHero(game.player.heroes);    //渲染英雄
    }
}

// 渲染英雄视图；
function renderHero(heroes){
    eles.game.heroView.innerHTML = "";
    heroes.forEach(hero=>{
        let heroItem =  document.createElement("div");
        heroItem.classList.add("heroItem")
        heroItem.innerHTML = ` 
                            <img src="${hero.ico}" />
                            <span>${hero.name}</span>`;
        eles.game.heroView.appendChild(heroItem);
        heroItem.onclick = function(){
            eles.game.heroShow.innerHTML = "";
            // 选中英雄呈现；
            let img = document.createElement("img");
            img.src = hero.ico;
            eles.game.heroShow.appendChild(img);
            renderSkills(hero.skills)
        }
    })
}

function renderSkills(skills){
    eles.game.skillsView.innerHTML = "";
    skills.forEach(skill=>{
        let img = document.createElement("img");
        img.src = skill.ico;
        eles.game.skillsView.appendChild(img);
    })
}

