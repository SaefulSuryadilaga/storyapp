export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async addNewStory({ description, photos, lat, lon }) {
    this.#view.showSubmitLoadingButton();
    try {
      const data = {
        description: description,
        photos: photos,
        lat: lat,
        lon: lon,
      };
      const response = await this.#model.addNewStory(data);

      if (!response.ok) {
        console.error('addNewStory: response:', response);
        this.#view.createFailed(response.message);
        return;
      }

      this.#view.createSuccessfully(response.message, response.data);
    } catch (error) {
      console.error('addNewStory: error:', error);
      this.#view.createFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
