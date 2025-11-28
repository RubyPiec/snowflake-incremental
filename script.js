let c = document.getElementById('snowflake')
let ctx = c.getContext('2d')

let mode = 'C'

function update(){
    mode = document.getElementById('temptype').value

    if(mode == 'C'){
        document.getElementById('temptext').innerHTML = Math.round(document.getElementById('temp').value)
    } else if(mode == 'F'){
        document.getElementById('temptext').innerHTML = Math.round(document.getElementById('temp').value*9/5+32)
    }

    let currentsst = Math.round(document.getElementById('sst').value*10)/100

    if(currentsst % 1 == 0){
        currentsst = currentsst + '.00'
    }
    currentsst = String(currentsst).padEnd(4, '0')
    document.getElementById('ssttext').innerHTML = currentsst + ' g/m³'

    let temp = Number(document.getElementById('temp').value)
    let sat = Math.round(document.getElementById('sst').value*10)/100
    if(temp<-22){
        // saturation 0-0.4, avg 0.2
        if(sat>0.2){
            document.getElementById('prediction').innerHTML = 'Prediction: Column'
        } else{
            document.getElementById('prediction').innerHTML = 'Prediction: Plate'
        }
    } else if(temp < -10){
        // saturation 1.2. always
        if(sat>1.2){
            document.getElementById('prediction').innerHTML = 'Prediction: Dendrite ❅'
        } else{
            document.getElementById('prediction').innerHTML = 'Prediction: Plate'
        }
    } else if(temp < -3.5){
        // saturation 0.5-1.2, avg 0.85
        if(sat>0.85){
            document.getElementById('prediction').innerHTML = 'Prediction: Needle'
        } else{
            document.getElementById('prediction').innerHTML = 'Prediction: Prism'
        }
    } else{
        // saturation 0-0.5, avg 0.25
        if(sat>0.25){
            document.getElementById('prediction').innerHTML = 'Prediction: Dendrite ❅'
        } else{
            document.getElementById('prediction').innerHTML = 'Prediction: Plate'
        }
    }
}


document.getElementById('temp').addEventListener('input', function(){
    update()
})

document.getElementById('temptype').addEventListener('change', function(){
    update()
})

document.getElementById('sst').addEventListener('input', function(){
    update()
})

update()

function genSnowflake(){
    ctx.clearRect(-250,-250,1000,1000)
    let temp = Number(document.getElementById('temp').value)
    let sat = Math.round(document.getElementById('sst').value*10)/100

    if(temp<-22){
        let snowflakeSat = Math.random()*0.4
        if(sat>snowflakeSat){
            // GENERATE COLUMN FOR LOWER VALUES, PRISM FOR HIGHER VALUES
        } else{
            // GENERATE SOLID PLATE FOR LOWER VALUES, THIN PLATE FOR HIGHER VALUES
            if(sat<Math.random()*snowflakeSat){
                getSolidPlate(Math.random()*40+50)
            }
        }
    } else if(temp<-10){
        let snowflakeSat = 1.2
        if(sat>snowflakeSat){
            // GENERATE SECTORED PLATES FOR LOWER VALUES, GENERATE DENDRITE FOR HIGHER
        } else{
            // GENERATE SOLID PLATES FOR LOWER VALUES, THIN PLATE FOR HIGHER VALUES
        }
    } else if(temp<-3.5){
        let snowflakeSat = Math.random()*0.7+0.5
        if(sat>snowflakeSat){
            // GENERATE HOLLOW PRISMS FOR LOWER VALUES, NEEDLES FOR HIGHER VALUES
        } else{
            // GENERATE SOLID PRISMS FOR LOWER VALUES, HOLLOW PRISMS FOR HIGHER VALUES
        }
    } else{
        let snowflakeSat = Math.random()*0.5
        if(sat>snowflakeSat){
            // GENERATE THIN PLATES FOR LOWER VALUES, DENDRITES FOR HIGHER VALUES
            if(sat+Math.random()*0.5-0.5<0.2){
                
            } else{
                // dendrite code
            }
        } else{
            // GENERATE SOLID PLATE.
            getSolidPlate(Math.random()*25+50)
        }
    }
}

ctx.translate(250,250)

function getSolidPlate(size){
    ctx.beginPath()

    let startAngle = Math.random()
    let startPoint = [size * Math.cos(startAngle), size * Math.sin(startAngle)]

    let ra = Math.PI/3 // ra = Rotation Angle. equal to 60 degrees (because 360/6 = 60)

    ctx.moveTo(startPoint[0], startPoint[1])
    let nextPoint = startPoint
    for(let point=0;point<6;point++){
        nextPoint = [nextPoint[0]*Math.cos(ra)-nextPoint[1]*Math.sin(ra), nextPoint[0]*Math.sin(ra)+nextPoint[1]*Math.cos(ra)]
        ctx.lineTo(nextPoint[0], nextPoint[1])
    }

    let sHSPT = [size*2/3 * Math.cos(startAngle), size*2/3 * Math.sin(startAngle)] //smaller Hexagon StartPoinT
    ctx.moveTo(sHSPT[0], sHSPT[1])
    nextPoint = sHSPT
    for(let point=0;point<6;point++){
        nextPoint = [nextPoint[0]*Math.cos(ra)-nextPoint[1]*Math.sin(ra), nextPoint[0]*Math.sin(ra)+nextPoint[1]*Math.cos(ra)]
        ctx.lineTo(nextPoint[0], nextPoint[1])
    }
    
    ctx.stroke()
}


function getThinPlate(size){
    ctx.beginPath()

    let startAngle = Math.random()
    let startPoint = [size * Math.cos(startAngle), size * Math.sin(startAngle)]

    let ra = Math.PI/3 // thin plates are still rotated 6 times, like all snowflakes. isn't that cool?

    ctx.moveTo(startPoint[0], startPoint[1])
    let nextPoint = startPoint // this is the next point of the regular hexagon
    let lastPoint = nextPoint

    let outPush = size/3*(Math.random()*0.1+0.1)

    for(let point=0;point<6;point++){
        nextPoint = [nextPoint[0]*Math.cos(ra)-nextPoint[1]*Math.sin(ra), nextPoint[0]*Math.sin(ra)+nextPoint[1]*Math.cos(ra)]

        let dx = nextPoint[0]-lastPoint[0]
        let dy = nextPoint[1]-lastPoint[1]

        ctx.lineTo(dx/3+lastPoint[0], dy/3+lastPoint[1])

        ctx.lineTo(dx/3+lastPoint[0]-outPush, dy/3+lastPoint[1]-outPush)

        ctx.lineTo(dx*2/3+lastPoint[0]-outPush, dy*2/3+lastPoint[1]-outPush)

        //todo tomorrow: make the outPush perpendicular to the line
        ctx.lineTo(dx*2/3+lastPoint[0], dy*2/3+lastPoint[1])

        ctx.lineTo(nextPoint[0], nextPoint[1])

        lastPoint = nextPoint
    }

    let sHSPT = [size*2/3 * Math.cos(startAngle), size*2/3 * Math.sin(startAngle)] //smaller Hexagon StartPoinT
    ctx.moveTo(sHSPT[0], sHSPT[1])
    nextPoint = sHSPT
    for(let point=0;point<6;point++){
        nextPoint = [nextPoint[0]*Math.cos(ra)-nextPoint[1]*Math.sin(ra), nextPoint[0]*Math.sin(ra)+nextPoint[1]*Math.cos(ra)]
        ctx.lineTo(nextPoint[0], nextPoint[1])
    }
    
    ctx.stroke()
}


