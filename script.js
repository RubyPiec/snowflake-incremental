let player;

let CTYPES = {
    SNOWFLAKES: "snowflakes",
    EVILSNOW: "evil snowflakes",
    SNOWBALLS: "snowballs"
} //this looks better tbh

let achmenuopen = false

let listofachievements = {
    "begin": {
        "name": "Simple beginnings",
        "displayname": "Simple",
        "desc": "Get 25 snowflakes",
        "obtained": false
    },
    "thousands": {
        "name": "In the thousands!",
        "displayname": "1,000",
        "desc": "Get 1000 snowflakes",
        "obtained": false
    },
    "nohumidity": {
        "name": "Where's the humidity?",
        "displayname": "No humidity", 
        "desc": "Reach a humidity reduction above 30%",
        "obtained": false
    },
    "humidity": {
        "name": "There's the humidity!",
        "displayname": "Humidity",
        "desc": "After getting No humidity, get your humidity reduction back below 5%.",
        "obtained": false
    }
}

for([id, ach] of Object.entries(listofachievements)){
    let achievement = document.createElement('div')
    achievement.classList.add('achievement')

    let achievementName = document.createElement('div')
    achievementName.innerHTML = ach.displayname
    achievementName.classList.add('achievementname')

    let tooltip = document.createElement('span')
    tooltip.classList.add('achdesc')
    tooltip.innerHTML = ach.desc
    achievementName.appendChild(tooltip)

    achievement.appendChild(achievementName)

    document.getElementById('achievements').appendChild(achievement)
}

function obtainAchievement(id){
    if(!player.achievementsobtained.includes(id)){
        listofachievements[id].obtained = true
        player.achievementsobtained.push(id)
        //also do cool achievement animation ig
    }
}

let upgrades = [
    { // 0
        "name": "Colder temperatures",
        "cost": 20,
        "basecost": 20, //ONLY RELEVANT FOR REPEATABLE UPGRADES
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Multiplies snowflakes gained per click by 1.5",
        "onbuy": function(){
            calcPerClick()
            this.cost = this.basecost * 5**this.bought
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
        "basecost": 100,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Collects 0.5 snowflakes per second",
        "onbuy": function(){
            this.cost = Math.floor(this.basecost * 1.3**this.bought)
            calcPerSecond()
        },
        "bought": 0,
        "repeatable": true
    },
    {
        "name": "Permafrost",
        "cost": 1000,
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
        "desc": "Humidity caps snowflakes less aggressively",
        "onbuy": function(){
            this.cost = this.basecost * 9**this.bought
        },
        "bought": 0,
        "repeatable": true
    },
    { // 5
        "name": "Snow bursts",
        "cost": 15000,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "20% chance that any event that gives snowflakes is tripled.",
        "onbuy": function(){

        },
        "bought": 0,
        "repeatable": false
    },
    { 
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
        "name": "Cloudier day",
        "cost": 50000,
        "basecost": 50000,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Produces 10 snowflakes per second, and snowflakes gained per click is multiplied by 3.",
        "onbuy": function(){
            calcPerClick()
            calcPerSecond()
            this.cost = this.basecost * 5**this.bought
        },
        "bought": 0,
        "repeatable": true
    },
    {
        "name": "Seeing... sesquiple?", //former title was "Seeing double" but it also multiplied by 2 lmao so I needed to change it to this
        "cost": 1,
        "currency": CTYPES.SNOWBALLS,
        "desc": "Multiplies EVERY CURRENCY by 1.5.",
        "onbuy": function(){
            
        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "Ice cubes",
        "cost": 150000,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Gain more snowflakes per second depending on your time since last snowball creation.",
        "onbuy": function(){
            
        },
        "bought": 0,
        "repeatable": false
    },
    { // 10
        "name": "Liquid nitrogen",
        "cost": 250000,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Multiplies snowflake gain per click by 5.",
        "onbuy": function(){
            calcPerClick()
        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "Time anti-freeze",
        "cost": 3,
        "currency": CTYPES.SNOWBALLS,
        "desc": "Offline progress is 2.5 times as effective.",
        "onbuy": function(){
            
        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "Spherical snowflakes",
        "cost": 1111111,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "Double snowball gain.",
        "onbuy": function(){

        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "Fan",
        "cost": 1200000,
        "currency": CTYPES.SNOWFLAKES,
        "desc": "All snowflake gain is doubled.",
        "onbuy": function(){

        },
        "bought": 0,
        "repeatable": false
    },
    {
        "name": "beat the game?!?!?!",
        "cost": 1500,
        "currency": CTYPES.SNOWBALLS,
        "desc": "PogChamp ggs chat isnt this hype af",
        "onbuy": function(){

        },
        "bought": 0,
        "repeatable": false
    }
]

function calcPerClick(){
    player.perclick = 1.5**upgrades[0].bought*3**upgrades[7].bought*5**upgrades[10].bought
}

function calcPerSecond(){
    player.persecond = 0.5*upgrades[2].bought+10*upgrades[7].bought
    if(upgrades[9]["bought"]>0){
        player.persecond += (Date.now()-player.lastascend)/60000
    }
}

let sps = setInterval(calcPerSecond,1000)

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
            if(upgrades[11].bought){
                spassed *= 2.5
            }
            for(let second=0; second<spassed; second++){
                giveSnowflakes(player.persecond)
            }
        }
        for(let i of player.achievementsobtained){
            listofachievements[i].obtained = true
        }
    } else{
        player = {
            "snowflakes": 0,
            "boughtupgrades": [],
            "perclick": 1,
            "settings": {
                "autosavefrequency": 10000,
                "offlineprogress": true,
                "spinspeed": 1.20
            },
            "persecond": 0,
            "lastsave": Date.now(),
            "snowballs": 0,
            "lastascend": Date.now(),
            "achievementsobtained": []
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

function snowflakeToSnowball(snowflakeam){
    // really cool formula
    let snowballamt = Math.log(snowflakeam)/Math.log(9)-4
    if(upgrades[8].bought>0){
        snowballamt = snowballamt * 1.5
    }
    if(upgrades[12].bought>0){
        snowballamt = snowballamt * 2
    }
    return snowballamt;
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

    if(snowflakeToSnowball(player.snowflakes) > 1){
        document.getElementById('ascendbutton').classList.remove('hidden')
        document.getElementById('ascendbutton').innerHTML = `CREATE SNOWBALL (+${Math.floor(snowflakeToSnowball(player.snowflakes))})`
    } else{
        document.getElementById('ascendbutton').classList.add('hidden')
    }

    if(player.snowballs>0){
        document.getElementById('snowballamount').classList.remove('hidden')
        document.getElementById('snowballamount').innerHTML = player.snowballs + autoplural(' snowball', player.snowballs)
    } else{
        document.getElementById('snowballamount').classList.add('hidden')
    }

    // ACHIEVEMENT ZONE
    if(player.snowflakes >= 25){
        obtainAchievement('begin')
    }
    if(player.snowflakes >= 1000){
        obtainAchievement('thousands')
    }
}

function updateUpgrades(){
    document.getElementById('upgrades').innerHTML = '<div class="topbar"><h1>Upgrades</h1><button class="boughtupgmenu" onclick="toggleupgrademenu()">See purchased upgrades</button></div>'
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

            switch (i.currency){
                case CTYPES.SNOWFLAKES:
                    upgradeDiv.classList.add('snowflakeupg')
                    break
                case CTYPES.SNOWBALLS:
                    upgradeDiv.classList.add('snowballupg')
                    break
            }

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
    if(upgrades[3]["bought"]>0){
        amount = 3*amount
    }
    amount = amount * (1-snowflakeToHumidity(player.snowflakes))

    if(upgrades[5]["bought"]>0){
        if(Math.random()<0.2){
            amount = amount * 3
        }
    }

    if(upgrades[8]["bought"]>0){
        amount = amount * 1.5
    }

    if(upgrades[13]["bought"]>0){
        amount = amount * 1.5
    }

    amount = amount * (1+player.snowballs/100)

    player.snowflakes+=amount
    update()
}

document.getElementById('snowflake').addEventListener('click', function(){
    giveSnowflakes(player.perclick)
})

document.getElementById('saveb').addEventListener('click', save)

function ascend(){
    player.snowballs = player.snowballs + Math.floor(snowflakeToSnowball(player.snowflakes))
    player.lastascend = Date.now()
    player.snowflakes = 0
    player.boughtupgrades = []
    player.perclick = 1
    player.persecond = 0
    for(upgrade of upgrades){
        if(upgrade.currency==CTYPES.SNOWFLAKES){
            upgrade.bought = 0
        }
        if(upgrade.basecost){
            upgrade.cost = upgrade.basecost
        }
    }
    updateAll()
}
document.getElementById('ascendbutton').addEventListener('click', function(){
    let toObtain = Math.floor(snowflakeToSnowball(player.snowflakes))
    if(confirm('Would you like to lose ALL your progress for ' + toObtain + autoplural('snowball', toObtain), ' snowflakes?')){
        ascend()
    }
})

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

document.getElementById('achb').addEventListener('click', function(){
    achmenuopen = !achmenuopen
    if(achmenuopen){
        document.getElementById('achievements').classList.remove('hidden')
    } else{
        document.getElementById('achievements').classList.add('hidden')
    }
})

let upgmenuopen = false
function toggleupgrademenu(){
    if(upgmenuopen){
        document.getElementById('currentupgrades').classList.add('hidden')
    } else{
        let prevappeared = []
        document.getElementById('currentupgrades').innerHTML = ''
        for(i of player.boughtupgrades){
            if(!prevappeared.includes(i)){
                let upgradeDiv = document.createElement('div')
                upgradeDiv.classList.add('upgrade')

                let upgName = document.createElement('h2')
                upgName.classList.add('upgtitle')
                upgName.innerHTML = upgrades[i].name

                let upgDesc = document.createElement('h3')
                upgDesc.innerHTML = upgrades[i].desc

                upgradeDiv.appendChild(upgName)
                if(upgrades[i].repeatable){
                    let upgBought = document.createElement('h4')
                    upgBought.innerHTML = 'x' + upgrades[i].bought
                    upgBought.classList.add('upgcost')
                    upgradeDiv.appendChild(upgBought)
                }
                upgradeDiv.appendChild(upgDesc)

                switch (i.currency){
                    case CTYPES.SNOWFLAKES:
                        upgradeDiv.classList.add('snowflakeupg')
                        break
                    case CTYPES.SNOWBALLS:
                        upgradeDiv.classList.add('snowballupg')
                        break
                }
                prevappeared.push(i)
                document.getElementById('currentupgrades').appendChild(upgradeDiv)
            }
        }
        document.getElementById('currentupgrades').classList.remove('hidden')
    }
    upgmenuopen = !upgmenuopen
}

function updateAll(){
    update()
    updateUpgrades()
    updateInterval()
}

updateAll()