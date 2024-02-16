import {registerUser, loginUser} from "./api.js";

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

    run = () => {
        if (this.queue.length === 0) return;

        const action = this.queue.pop();
        console.log('action-queue::run(): action:', action);

        const actions = {
            'register-user': this.registerUserAction,
            'login': this.loginAction,
            'go': this.goAction,
        };
        actions[action.type](action.data);
    }

    registerUserAction = async (data) => {
        const user = await registerUser(data);
        console.log('action-queue::registerUserAction(): user:', user);
    }
    loginAction = async (data) => {
        const user = await loginUser(data);
        console.log('action-queue::loginAction(): user:', user);
    }
    goAction = (data) => {
        console.log('action-queue::goAction(): this.navbar:', this.navbar);
        if (!this.navbar) return;

        this.navbar.setCurrentLink(data.name);
    }
}

const actionQueue = new ActionQueue();
export {actionQueue}
