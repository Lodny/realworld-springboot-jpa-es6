import {registerUser} from "./api.js";

class ActionQueue {
    constructor() {
        this.queue = [];
        this.timerId = setInterval(this.run, 100);
        // this.router = document.querySelector('real-router');
        // console.log('action-queue::constructor(): this.router:', this.router);
        this.navbar = document.querySelector('real-navbar');
        console.log('action-queue::constructor(): this.navbar:', this.navbar);
    }

    addAction(action) {
        this.queue.push(action);
    }

    run = async () => {
        if (this.queue.length === 0) return;

        const action = this.queue.pop();
        console.log('action-queue::run(): action:', action);

        switch (action.type) {
            case 'register-user':
                console.log('action-queue::run():', 10101010);
                const user = await registerUser(action.data);
                break;

            case 'go':
                console.log('action-queue::run(): this.router:', this.navbar);
                if (!this.navbar) return;

                this.navbar.setCurrentLink(action.data.name);
                break;
        }
    }
}

const actionQueue = new ActionQueue();
export {actionQueue}
