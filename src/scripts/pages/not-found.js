export default class NotFoundPage {
  async render() {
    return `
            <section class="not-found-container">
                <h1 class="not-found-title">404 - Page Not Found</h1>
                <p>We couldn't find the page you were looking for</p>
            </section>
        `;
  }

  async afterRender() {}
}
