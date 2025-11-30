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
        "desc": "Multiplies snowflakes gained per click by 1.5",
        "onbuy": function(){
            player.perclick = 1.5**upgrades[0].bought
            upgrades[0].cost = upgrades[0].basecost * 5**upgrades[0].bought
        },
        "bought": 0,
        "repeatable": true
    },
    {
        "name": "Self-freezing",
        "cost": 50,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Snowflake gain is boosted by snowflake amount",
        "onbuy": function(){
            
        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "Bucket",
        "cost": 100,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Collects 0.5 snowflakes per second",
        "onbuy": function(){
            player.persecond += 0.5
        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "Permafrost",
        "cost": 500,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "All snowflake gain is tripled",
        "onbuy": function(){
            
        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "Humidifier",
        "cost": 9000,
        "basecost": 9000,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Decreases the cap set by humidity",
        "onbuy": function(){
            upgrades[4].cost = upgrades[4].basecost * 9**upgrades[4].bought
        },
        "bought": 0,
        "repeatable": true
    },
    { // 5
        "name": "Longer winters",
        "cost": 30000,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Offline progress is twice as effective (1/10 -> 1/5)",
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
    player.lastsave = Date.now()
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
        if(player.settings.offlineprogress){
            let spassed = (Date.now()-player.lastsave)/1000
            // giveSnowflakes(spassed*player.persecond)
            if(spassed>604800){ // Cap it to 1 week
                spassed = 604800
            }
            spassed /= 10 //Make offline far less effective
            if(upgrades[5].bought){
                spassed *= 2
            }
            for(let second=0; second<spassed; second++){
                giveSnowflakes(player.persecond)
            }
        }
    } else{
        player = {
            "snowflakes": 0,
            "boughtupgrades": [],
            "perclick": 1,
            "settings": {
                "autosavefrequency": 10000,
                "offlineprogress": true,
                "spinspeed": 0.83
            },
            "persecond": 0,
            "lastsave": Date.now()
        }
    }

    document.getElementById('asfr').value = player.settings.autosavefrequency
    document.getElementById('spinspeed').value = player.settings.spinspeed
    if(player.settings.spinspeed==0){
        document.getElementById('snowflake').parentElement.style.animationDuration = '999999999s'
    } else{
        document.getElementById('snowflake').parentElement.style.animationDuration = 60/player.settings.spinspeed + 's'
    }
    document.getElementById('offline').checked = player.settings.offlineprogress

    update()
    updateUpgrades()
    updateInterval()
}

let spsInterval = setInterval(function(){ giveSnowflakes(player.persecond/5) }, 200)

load()

function updateInterval(){
    if(spsInterval){
        clearInterval(spsInterval)
        spsInterval = setInterval(function(){ giveSnowflakes(player.persecond/5) }, 200)
    }
}

function autoplural(word, amount){ 
    if(amount!=1){
        return word + 's'
    }
    return word
}

function snowflakeToHumidity(snowflakeam){
    if(upgrades[4].bought>0){
        return snowflakeam**(1.15-0.1*upgrades[4].bought)/1000/(upgrades[4].bought*2+1)/100
    }
    return snowflakeam**1.15/1000/100
}

function update(){
    document.getElementById('snowflakeamount').innerHTML = Math.round(player.snowflakes) + autoplural(' snowflake', player.snowflakes)
    document.getElementById('asft').innerHTML = Math.round(document.getElementById('asfr').value/10)/100 + 's'
    document.getElementById('spintext').innerHTML = document.getElementById('spinspeed').value + ' rpm'

    if(snowflakeToHumidity(player.snowflakes) > 0.05){
        document.getElementById('tmsnow').classList.remove('hidden')
        document.getElementById('tmsnow').innerHTML = `Your snowflake amount is decreasing the humidity by ${Math.round(100*snowflakeToHumidity(player.snowflakes))}%!`
    } else{
        document.getElementById('tmsnow').classList.add('hidden')
    }
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
                updateInterval()
            })

            document.getElementById('upgrades').appendChild(upgradeDiv)
        }
    }
}

function giveSnowflakes(amount){
    if(upgrades[1]["bought"]>0){
        amount = amount * Math.max(0.5*Math.log(player.snowflakes),1)
    }
    if(upgrades[3]["bought"]){
        amount = 3*amount
    }
    amount = amount * (1-snowflakeToHumidity(player.snowflakes))

    player.snowflakes+=amount
    update()
}

document.getElementById('snowflake').addEventListener('click', function(){
    giveSnowflakes(player.perclick)
})

document.getElementById('saveb').addEventListener('click', save)

let saveInterval = setInterval(save, player.settings.autosavefrequency)

document.getElementById('asfr').addEventListener('input', function(){
    player.settings.autosavefrequency = Number(document.getElementById('asfr').value)
    clearInterval(saveInterval)
    saveInterval = setInterval(save, player.settings.autosavefrequency)
    update()
})

document.getElementById('spinspeed').addEventListener('input', function(){
    player.settings.spinspeed = Number(document.getElementById('spinspeed').value)
    if(player.settings.spinspeed==0){
        document.getElementById('snowflake').parentElement.style.animationDuration = '999999999s'
    } else{
        document.getElementById('snowflake').parentElement.style.animationDuration = 60/player.settings.spinspeed + 's'
    }
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