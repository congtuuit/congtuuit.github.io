
class FollowObject {
    constructor(symbol, minPrice, maxPrice) {
        this.notifySound = "https://congtuuit.github.io/libs/audios/mixkit-long-pop-2358.wav";
        this.audio = new Audio(this.notifySound);
        this.symbol = symbol.toUpperCase();
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }
    notify() {
        var today = new Date();
        var time = today.toLocaleString();
        var lastPrice = $(`#${this.symbol}_lastPrice`).data("sort");
        if (lastPrice <= this.minPrice) {
            this.audio.play();
            console.log(">> ", lastPrice, time);
        }
    }
}

class TraderDetection {
    constructor() {
        this.followers = [];
        this.isRunning = false;
        this.notifySound = "https://congtuuit.github.io/libs/audios/mixkit-long-pop-2358.wav";
        this.processing = null;
        this.setup();
    }
    setup() {
        var script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    start() {
    	if(!this.isRunning){
    		console.log("start")
    	}

        this.isRunning = true;
        this.run();
    }
    stop() {
        this.isRunning = false;
        clearInterval(this.processing);
    }
    notify(messages) {
        const audio = new Audio(this.notifySound);
        audio.play();
        var today = new Date();
        var time = today.toLocaleString();
        if (messages) {
            console.log(">> ", messages, time);
        } else {
            console.log(">> ", time);
        }
    }
    detect() {
        if (this.followers.length > 0) {
            this.followers.forEach(follower => {
                follower.notify();
            });
        }
    }
    add(symbol, minPrice, maxPrice) {
        this.followers.push(new FollowObject(symbol, minPrice, maxPrice));
    }
    remove(symbol) {
        this.followers = this.followers.filter(follower => {
            return follower.symbol != symbol;
        });
    }
    run() {
        if (this.isRunning) {
            this.processing = setInterval(() => {
                this.detect();
            }, 1000);
        }
    }
}

var traderDetection = new TraderDetection();
traderDetection.run();