import Game from "./game/game.js";
let game = new Game();
// 所有的节点
let eles = {
    login: {
        loginView: document.querySelector(".login"),
        username: document.querySelector(".username"),
        loginSub: document.querySelector(".sub")
    },
    game: {
        gameView: document.querySelector(".game"),
        chioseusername: document.querySelector(".chioseusername"),
        heroView: document.querySelector(".heroView"),
        heroShow: document.querySelector(".heroShow"),
        skillsView: document.querySelector(".skillsView"),
        heroBtn: document.querySelector(".heroBtn"),
        heroContainer: document.querySelector('.heroContainer'),
        skinBtn: document.querySelector(".skinBtn"),
        skinContainer: document.querySelector('.skinContainer'),
        skinView: document.querySelector('.skinView'),
        skinShow: document.querySelector('.skinShow'),
    }
}

eles.login.loginSub.onclick = function () {
    let username = eles.login.username.value;
    if (username) {
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
function renderHero(heroes) {
    eles.game.heroView.innerHTML = "";
    heroes.forEach(hero => {
        let heroItem = document.createElement("div");
        heroItem.classList.add("heroItem")
        heroItem.innerHTML = ` 
                            <img src="${hero.ico}" />
                            <span>${hero.name}</span>`;
        eles.game.heroView.appendChild(heroItem);
        heroItem.onclick = function () {
            eles.game.heroShow.innerHTML = "";
            // 选中英雄呈现；
            let img = document.createElement("img");
            img.src = hero.ico;
            eles.game.heroShow.appendChild(img);
            renderSkills(hero.skills);
            //渲染皮肤
            renderSkins(hero.skins);
        }
    })
}

//渲染技能
function renderSkills(skills) {
    eles.game.skillsView.innerHTML = "";
    skills.forEach(skill => {
        let img = document.createElement("img");
        img.src = skill.ico;
        eles.game.skillsView.appendChild(img);
    })
}
//渲染皮肤
function renderSkins(skins) {
    console.log(skins);
    eles.game.skinView.innerHTML = "";
    skins.forEach(skin => {
        let div = document.createElement('div');
        div.classList.add('skinItem');
        div.innerHTML = `
                <img src="${skin.ico}" />
                <span>${skin.name}</span>
        `;
        eles.game.skinView.appendChild(div);

        div.onclick = function () {
            eles.game.skinShow.innerHTML = "";
            // 选中英雄呈现；
            let img = document.createElement("img");
            img.src = skin.img;
            eles.game.skinShow.appendChild(img);
        }
    })

}

//切换英雄、皮肤界面
eles.game.heroBtn.onclick = function () {
    eles.game.heroContainer.style.display = "block";
    eles.game.skinContainer.style.display = "none";
}
eles.game.skinBtn.onclick = function () {
    eles.game.skinContainer.style.display = "block";
    eles.game.heroContainer.style.display = "none";
}
