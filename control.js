AFRAME.registerComponent('control',{
    init: function() {
        let camera = document.getElementById('camera');
        // camera.removeAttribute('wasd-controls');
        let camRig = document.getElementById('camRig');
        camera.setAttribute('velocity',[]);
        window.addEventListener('keydown',(key)=>{
            // let vel = camRig.getAttribute('movement-controls');
            // console.log(vel);
            if(key.key == "w") {
                // vel.speed = 1 - ((1 - vel.speed) * 0.98);
                // camRig.setAttribute('movement-controls',vel);
                var direction = new THREE.Vector3();
                camera.object3D.getWorldDirection(direction);
                let camVel = camera.getAttribute('velocity');
                // let of2 = camVel.x ** 2 + camVel.y ** 2 + camVel.z ** 2;
                // let oldFactor = Math.sqrt(of2)/2;
                // // let oldFactor = camera.getAttribute('velocity').z;
                // // oldFactor *= -1;
                // let factor = 1 - ((1 - oldFactor) * 0.98);
                // // factor *= -1;
                // // camera.setAttribute('velocity',{z:factor});
                camVel.x -= ((direction.x/20) * 0.2 * (10 - Math.sqrt(camVel.x ** 2)));
                // camVel.y -= ((direction.y/20) * 0.2 * (10 - Math.sqrt(camVel.y ** 2)));
                camVel.z -= ((direction.z/20) * 0.2 * (10 - Math.sqrt(camVel.z ** 2)));
                camera.setAttribute('velocity',{x: camVel.x, y: camVel.y, z: camVel.z});
            }
            else if(key.key == " ") {
                // vel.speed *= (1 - ((1 - vel.speed) * 0.2));
                // camRig.setAttribute('movement-controls',vel);
                let oldx = camera.getAttribute('velocity').x/10;
                let oldy = camera.getAttribute('velocity').y/10;
                let oldz = camera.getAttribute('velocity').z/10;
                let newx = oldx * (1 - ((1 - Math.abs(oldx)) * 0.2));
                let newy = oldy * (1 - ((1 - Math.abs(oldy)) * 0.2));
                let newz = oldz * (1 - ((1 - Math.abs(oldz)) * 0.2));
                camera.setAttribute('velocity',{x:newx*10,y:newy*10,z:newz*10});
            }
            if(key.key == "a" && camera.object3D.position.y < 5) {
            //     vel.x += 0.05;
            //     camRig.setAttribute('speed',vel);
                let rot = camera.object3D.rotation;
                rot.y += 0.01;
            }
            else if(key.key == "d" && camera.object3D.position.y < 5) {
            //     vel.x -= 0.05;
            //     camRig.setAttribute('speed',vel);
                let rot = camera.object3D.rotation;
                rot.y -= 0.01;
            }
            if(key.key == "q"  && camera.object3D.position.y > 5) {
            //     vel.y += 0.05;
            //     camRig.setAttribute('speed',vel);
                let rot = camera.object3D.rotation;
                let pos = camera.object3D.position;
                if(rot.z < 0.7) {
                    rot.z += 0.01;
                };
                rot.y += 0.01;
                var direction = new THREE.Vector3();
                camera.object3D.getWorldDirection(direction);
                let oldx = direction.x;
                let oldz = direction.z;
                direction.x = oldz;
                direction.z = -1 * oldx;
                pos.x -= 0.15 * direction.x;
                pos.z -= 0.15 * direction.z;
            }
            else if(key.key == "e" && camera.object3D.position.y > 5) {
            //     vel.y -= 0.05;
            //     camRig.setAttribute('speed',vel);
                let rot = camera.object3D.rotation;
                let pos = camera.object3D.position;
                if(rot.z > -0.7) {
                    rot.z -= 0.01;
                };
                rot.y -= 0.01;
                var direction = new THREE.Vector3();
                camera.object3D.getWorldDirection(direction);
                let oldx = direction.x;
                let oldz = direction.z;
                direction.z = oldx;
                direction.x = -1 * oldz;
                pos.x -= 0.15 * direction.x;
                pos.z -= 0.15 * direction.z;
            };
            if(key.key == "z") {
                let camVel = camera.getAttribute('velocity');
                if(camVel.y < 2 && (Math.sqrt(camVel.x ** 2 + camVel.z ** 2) > 5)) {
                    camVel.y += 0.01;
                };
                camera.setAttribute('velocity',camVel);
            } else if(key.key == "x") {
                let camVel = camera.getAttribute('velocity');
                if(camVel.y > -2) {
                    camVel.y -= 0.01;
                };
                camera.setAttribute('velocity',camVel);
            };
        });
    },
    updateFacing: function() {
        let direction = new THREE.Vector3();
        camera.object3D.getWorldDirection(direction);
        let angle = Math.atan(direction.z/direction.x)*180/3.14159265 - 90;
        if(angle.toString().includes('e')) angle = 0;
        angle *= -1;
        if(direction.x < 0) angle += 180;
        angle = 360 - angle;
        let directionText = "Facing: " + angle.toString().substring(0,6) + " deg";
        let facing = document.getElementById('facing');
        let facingAtt = facing.getAttribute('text');
        facingAtt.value = directionText;
        facing.setAttribute('text',facingAtt);
    },
    updateHeading: function() {
        let camera = document.getElementById('camera');
        let velocity = camera.getAttribute('velocity');
        let angle = Math.atan(-1 * velocity.z/velocity.x)*180/3.14159265 - 90;
        if(angle.toString().includes('e') || isNaN(angle)) angle = 0;
        angle *= -1;
        if(velocity.x < 0) angle += 180;
        let velocityText = "Heading: " + angle.toString().substring(0,6) + " deg";
        let heading = document.getElementById('heading');
        let headingAtt = heading.getAttribute('text');
        headingAtt.value = velocityText;
        heading.setAttribute('text',headingAtt);
    },
    updateSpeed: function() {
        let camera = document.getElementById('camera');
        let camVel = camera.getAttribute('velocity');
        let speed = Math.sqrt(camVel.x ** 2 + camVel.z ** 2);
        if(speed.toString().includes('e')) speed = 0;
        let speedEl = document.getElementById('speed');
        let speedAtt = speedEl.getAttribute('text');
        speedAtt.value = 'Speed: ' + speed.toString().substring(0,6);
        speedEl.setAttribute('text',speedAtt);
    },
    updateAltitude: function() {
        let camera = document.getElementById('camera');
        let camPos = camera.getAttribute('position');
        let altitude = camPos.y;
        let altitudeEl = document.getElementById('altitude');
        let altitudeAtt = altitudeEl.getAttribute('text');
        altitudeAtt.value = 'Altitude: ' + altitude.toString().substring(0,6);
        altitudeEl.setAttribute('text',altitudeAtt);
    },
    updateAltitudeGain: function() {
        let camera = document.getElementById('camera');
        let camVel = camera.getAttribute('velocity');
        let gain = camVel.y;
        if(gain.toString().includes('e')) gain = 0;
        let gainEl = document.getElementById('altitudegain');
        let gainAtt = gainEl.getAttribute('text');
        gainAtt.value = 'Altitude gain: ' + gain.toString().substring(0,6);
        gainEl.setAttribute('text',gainAtt);
    },
    updateCoords: function() {
        let camera = document.getElementById('camera');
        let camPos = camera.getAttribute('position');
        let x = camPos.x, z = camPos.z;
        if(x.toString().includes('e')) x = 0;
        if(z.toString().includes('e')) z = 0;
        let posx = document.getElementById('xpos');
        let posz = document.getElementById('zpos');
        let posxtext = posx.getAttribute('text');
        let posztext = posz.getAttribute('text');
        posxtext.value = 'X: ' + x.toString().substring(0,6);
        posztext.value = 'Z: ' + z.toString().substring(0,6);
        posx.setAttribute('text',posxtext);
        posz.setAttribute('text',posztext);
    },
    tick: function() {
        let camera = document.getElementById('camera');
        let camPos = camera.getAttribute('position');
        if(camPos.y < 0.5) {
            let camVel = camera.getAttribute('velocity');
            if(camVel.y < 0) {
                camVel.y = Math.abs(camVel.y)/4;
            }
            camera.setAttribute('velocity',camVel);
        };
        camera.object3D.rotation.z *= 0.99;
        this.updateFacing();
        this.updateHeading();
        this.updateSpeed();
        this.updateAltitude();
        this.updateAltitudeGain();
        this.updateCoords();
    }
});