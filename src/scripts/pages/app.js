import Swal from 'sweetalert2';
import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateSubscribeButtonTemplate,
  generateUnauthenticatedNavigationListTemplate,
  generateUnsubscribeButtonTemplate,
} from '../templates';
import { isServiceWorkerAvailable, setupSkipToContent, transitionHelper } from '../utils';
import { getAccessToken, getLogout } from '../utils/auth';
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from '../utils/notification-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipButton = null;

  constructor({ navigationDrawer, drawerButton, content, skipButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipButton = skipButton;

    this._init();
  }

  _init() {
    setupSkipToContent(this.#skipButton, this.#content);
    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#navigationDrawer.children.namedItem('nav-list-main');
    const navList = this.#navigationDrawer.children.namedItem('nav-list');

    // User not log in
    if (!isLogin) {
      navListMain.innerHTML = '';
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navListMain.innerHTML = generateMainNavigationListTemplate();
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();

      Swal.fire({
        title: 'Are you sure to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonAriaLabel: 'Logout',
        confirmButtonColor: '#2D3E50',
        confirmButtonText: 'Logout',
        cancelButtonAriaLabel: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          getLogout();

          // Redirect
          location.hash = '/login';

          Swal.fire({
            title: 'Logout Successfully!',
            icon: 'success',
          });
        }
      });
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', (event) => {
        Swal.fire({
          title: 'Are you sure to unsubscribe?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonAriaLabel: 'Unsubscribe',
          confirmButtonColor: '#2D3E50',
          confirmButtonText: 'Unsubscribe',
          cancelButtonAriaLabel: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            unsubscribe().finally(() => {
              this.#setupPushNotification();
            });
          }
        });
      });

      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    try {
      // Get page instance
      const page = route();

      const transition = transitionHelper({
        updateDOM: async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
        },
      });

      transition.ready.catch(console.error);
      transition.updateCallbackDone.then(() => {
        scrollTo({ top: 0, behavior: 'instant' });
        this._setupNavigationList();

        if (isServiceWorkerAvailable()) {
          this.#setupPushNotification();
        }
      });
    } catch (error) {
      location.hash = '/not-found';
    }
  }
}

export default App;
