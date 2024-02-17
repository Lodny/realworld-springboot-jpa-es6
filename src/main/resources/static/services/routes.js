import {HomePage} from '../pages/home-page.js';
import {RegisterPage} from '../pages/register-page.js';
import {LoginPage} from '../pages/login-page.js';
import {EditorPage} from "../pages/editor-page.js";
import {SettingsPage} from "../pages/settings-page.js";
import {ProfilePage} from "../pages/profile-page.js";

const routeInfo = {
    active: 'home',
    routes: [
        {
            url: '/',
            name: 'home',
            element: HomePage
        },
        {
            url: '/login',
            name: 'login',
            element: LoginPage
        },
        {
            url: '/register',
            name: 'register',
            element: RegisterPage
        },
        {
            url: 'new-article',
            name: 'new-article',
            element: EditorPage
        },
        {
            url: '/settings',
            name: 'settings',
            element: SettingsPage
        },
        {
            url: '/profile',
            name: 'profile',
            element: ProfilePage
        },
    ]
};

export {routeInfo}
