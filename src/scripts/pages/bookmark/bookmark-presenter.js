import { storyMapper } from '../../data/api-mapper';

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoriesListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      const listOfStories = await this.#model.getAllStories();
      const stories = await Promise.all(listOfStories.map(storyMapper));

      console.log(stories);

      this.#view.populateBookmarkedStories(stories.message, stories);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateBookmarkedStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
