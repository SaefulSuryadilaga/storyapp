import LoginPresenter from './login-presenter';
import * as StoryAPI from '../../../data/api';
import * as AuthModel from '../../../utils/auth';
import Swal from 'sweetalert2';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
            <section class="login-container">
                <article class="login-form-container">
                    <h1 class="login__title">Login Account</h1>

                    <form id="login-form" class="login-form">
                        <div class="form-control">
                            <label for="email-input" class="login-form__email-title">Email</label>

                            <div class="login-form__title-container">
                                <input id="email-input" type="email" name="email" placeholder="Example: name@email.com" required>
                            </div>
                        </div>
                        <div class="form-control">
                            <label for="password-input" class="login-form__password-title">Password</label>

                            <div class="login-form__title-container">
                                <input id="password-input" type="password" name="password" placeholder="Input your password" required>
                            </div>
                        </div>
                        <div class="form-buttons login-form__form-buttons">
                            <div id="submit-button-container">
                                <button class="btn" type="submit">Login</button>
                            </div>
                            <p class="login-form__do-not-have-account">Don't have an account? <a href="#/register">Register</a></p>
                        </div>
                    </form>
                </article>
            </section>
        `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };
      await this.#presenter.getLogin(data);
    });
  }

  loginSuccessfully(message) {
    Swal.fire({
      title: 'Login Successfully',
      icon: 'success',
      text: message,
    });

    // Redirect
    location.hash = '/';
  }

  loginFailed(message) {
    Swal.fire({
      title: 'Login Failed',
      icon: 'error',
      text: message,
      color: '#2D3E50',
    });
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit" disabled>
                <i class="fas fa-spinner loader-button"></i> Login
            </button>
        `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit">Login</button>
        `;
  }
}
