import Swal from 'sweetalert2';
import * as StoryAPI from '../../../data/api';
import RegisterPresenter from './register-presenter';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
          <section class="register-container">
            <div class="register-form-container">
              <h1 class="register__title">Register Account</h1>
    
              <form id="register-form" class="register-form">
                <div class="form-control">
                  <label for="name-input" class="register-form__name-title">Name</label>
    
                  <div class="register-form__title-container">
                    <input id="name-input" type="text" name="name" placeholder="Input your name" required>
                  </div>
                </div>
                <div class="form-control">
                  <label for="email-input" class="register-form__email-title">Email</label>
    
                  <div class="register-form__title-container">
                    <input id="email-input" type="email" name="email" placeholder="Example: name@email.com" required>
                  </div>
                </div>
                <div class="form-control">
                  <label for="password-input" class="register-form__password-title">Password</label>
    
                  <div class="register-form__title-container">
                    <input id="password-input" type="password" name="password" placeholder="Input new password" minlength="8" required>
                  </div>
                </div>
                <div class="form-buttons register-form__form-buttons">
                  <div id="submit-button-container">
                    <button class="btn" type="submit">Register</button>
                  </div>
                  <p class="register-form__already-have-account">Have an account? <a href="#/login">Login</a></p>
                </div>
              </form>
            </div>
          </section>
        `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('register-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };
      await this.#presenter.getRegistered(data);
    });
  }

  registeredSuccessfully(message) {
    Swal.fire({
      title: 'Register Successfully!',
      icon: 'success',
      text: message,
    });

    // Redirect
    location.hash = '/login';
  }

  registeredFailed(message) {
    Swal.fire({
      title: 'Register Failed',
      icon: 'error',
      text: message,
    });
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
          <button class="btn" type="submit" disabled>
            <i class="fas fa-spinner loader-button"></i> Register
          </button>
        `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
          <button class="btn" type="submit">Register</button>
        `;
  }
}
