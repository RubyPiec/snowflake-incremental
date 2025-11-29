let player;

let CTYPES = {
    SNOWFLAKES: "snowflakes",
    EVILSNOW: "evil snowflakes"
} //this looks better tbh

let upgrades = [
    // 0
    {
        "name": "Colder temperatures",
        "cost": 20,
        "basecost": 20, //ONLY RELEVANT FOR REPEATABLE UPGRADES
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Doubles snowflakes gained per click",
        "onbuy": function(){
            player.perclick = 2**upgrades[0].bought
            upgrades[0].cost = upgrades[0].basecost * 5**upgrades[0].bought
        },
        "bought": 0,
        "repeatable": true
    },
    {
        "name": "Self-freezing",
        "cost": 50,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Snowflakes gained is boosted by snowflake amount",
        "onbuy": function(){
            
        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "beat the game?!?!?!",
        "cost": 1.9266e8,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "PogChamp ggs chat isnt this hype af",
        "onbuy": function(){

        },
        "bought": 0,
        "repeatable": false
    }
]

function save(){
    localStorage.setItem('playerdata', JSON.stringify(player))
    let savedText = document.createElement('h4')
    savedText.innerHTML = 'Saved!'
    savedText.classList.add('fadeout')
    setTimeout(function(){
        savedText.remove()
    }, 2000)
    document.getElementById('savedlist').appendChild(savedText)
}

function load(){
    for(let upgrade of upgrades){
        upgrade.bought = 0
        if(upgrade.basecost){
            upgrade.cost = upgrade.basecost
        }
    }
    if(localStorage.getItem('playerdata')){
        player = JSON.parse(localStorage.getItem('playerdata'))
        for(let buyupg of player.boughtupgrades){
            upgrades[buyupg].bought++
            upgrades[buyupg].onbuy()
        }
    } else{
        player = {
            "snowflakes": 0,
            "boughtupgrades": [],
            "perclick": 1,
            "autosavefrequency": 10000
        }
    }
    update()
    updateUpgrades()
}

load()

function autoplural(word, amount){ 
    if(amount!=1){
        return word + 's'
    }
    return word
}

function update(){
    document.getElementById('snowflakeamount').innerHTML = player.snowflakes + autoplural(' snowflake', player.snowflakes)
    document.getElementById('asft').innerHTML = Math.round(document.getElementById('asfr').value/10)/100 + 's'
}

function updateUpgrades(){
    document.getElementById('upgrades').innerHTML = '<h1>Upgrades</h1>'
    for(let j in upgrades){
        let i = upgrades[j]
        if(i.bought==0||i.repeatable){
            let upgradeDiv = document.createElement('div')
            upgradeDiv.classList.add('upgrade')

            let upgName = document.createElement('h2')
            upgName.classList.add('upgtitle')
            upgName.innerHTML = i.name

            let upgCost = document.createElement('h5')
            upgCost.classList.add('upgcost')
            upgCost.innerHTML = i.cost + ' ' + i.currency

            let upgDesc = document.createElement('h3')
            upgDesc.innerHTML = i.desc

            upgradeDiv.appendChild(upgName)
            upgradeDiv.appendChild(upgCost)
            upgradeDiv.appendChild(upgDesc)

            upgradeDiv.addEventListener('click', function(){
                console.log(player[i.currency])
                console.log(i.cost)
                if(player[i.currency] >= i.cost){
                    i.bought++
                    console.log('wow')
                    player[i.currency] -= i.cost
                    player.boughtupgrades.push(j)
                    i.onbuy()
                    updateUpgrades()
                }
                update()
            })

            document.getElementById('upgrades').appendChild(upgradeDiv)
        }
    }
}

document.getElementById('snowflake').addEventListener('click', function(){
    player.snowflakes+=player.perclick
    update()
})

let saveInterval = setInterval(save, player.autosavefrequency)

document.getElementById('asfr').addEventListener('input', function(){
    player.autosavefrequency = Number(document.getElementById('asfr').value)
    clearInterval(saveInterval)
    saveInterval = setInterval(save, player.autosavefrequency)
    update()
})

let settingsopen = false
document.getElementById('settings').addEventListener('click', function(){
    settingsopen = !settingsopen
    if(settingsopen){
        document.getElementById('settingsmenu').style.display = 'block'
    } else{
        document.getElementById('settingsmenu').style.display = 'none'
    }
})

update()
updateUpgrades()