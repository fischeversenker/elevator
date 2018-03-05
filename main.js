document.addEventListener('DOMContentLoaded', function() {

    window.elevator = {
        leftDoor: document.querySelector('.left-door'),
        rightDoor: document.querySelector('.right-door'),
        controls: document.querySelectorAll('.elevator-control'),
        closingTime: 200,
        waitingTime: 100,
        elevating: false
    };

    window.elevator.scrollToEl = function(el, cb) {
        let distance = el.offsetTop - window.scrollY;
        if (Math.abs(distance) < 1) {
            window.setTimeout(() => Array.from(window.elevator.controls).forEach(el => el.classList.remove('active')),
                window.elevator.waitingTime
            );
            return false;
        }
        window.elevator.elevating = true;
        window.elevator.closeDoors();
        window.setTimeout(() => window.requestAnimationFrame(scrollTick), window.elevator.closingTime + window.elevator.waitingTime);
        function scrollTick() {
            if (Math.abs(distance) > 1) {
                window.requestAnimationFrame(scrollTick);
            } else {
                window.setTimeout(window.elevator.openDoors, window.elevator.waitingTime);
            }
            let dir = Math.sign(distance);
            let by = Math.sqrt(Math.abs(distance));
            window.scrollBy(0, dir * by);
            distance = el.offsetTop - window.scrollY;
        }
    };

    window.elevator.closeDoors = function() {
        window.elevator.leftDoor.classList.add('closed');
        window.elevator.rightDoor.classList.add('closed');
    }

    window.elevator.openDoors = function() {
        window.elevator.leftDoor.classList.remove('closed');
        window.elevator.rightDoor.classList.remove('closed');
        window.setTimeout(() => {
            window.elevator.elevating = false;
            Array.from(window.elevator.controls).forEach(el => el.classList.remove('active'));
        }, window.elevator.closingTime);
    }

    window.elevator.elevateTo = function(el, link) {
        if (!window.elevator.elevating) {
            Array.from(window.elevator.controls).forEach(el => el.classList.remove('active'));
            link.classList.add('active');
            window.elevator.scrollToEl(el);
        }
    }

    window.elevator.setupControls = function() {
        Array.from(window.elevator.controls).forEach(c => {
            c.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                window.elevator.elevateTo(document.querySelector(this.getAttribute('href')), this.parentElement);
            }, false);
        });
    }

    window.elevator.setupControls();

});