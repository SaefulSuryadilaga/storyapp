import Swal from 'sweetalert2';
import * as StoryAPI from '../../../data/api';
import { parseActivePathname } from '../../../routes/url-parser';
import {
  generateLoaderAbsoluteTemplate,
  generateRemoveStoryButtonTemplate,
  generateSaveStoryButtonTemplate,
  generateStoryDetailErrorTemplate,
  generateStoryDetailTemplate,
} from '../../../templates';
import Map from '../../../utils/map';
import StoryDetailPresenter from './story-detail-presenter';
import Database from '../../../data/database';
import { tns } from 'tiny-slider';

export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: StoryAPI,
      dbModel: Database,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById('story-detail').innerHTML = generateStoryDetailTemplate({
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
      placeName: story.placeName,
    });

    // Carousel image
    tns({
      container: document.getElementById('images'),
      mouseDrag: true,
      swipeAngle: false,
      speed: 600,

      nav: true,
      navPosition: 'bottom',

      autoplay: false,
      controls: false,
    });

    // Map
    await this.#presenter.showStoryDetailMap();
    if (this.#map) {
      const storyCoordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: story.name };

      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    }

    // Action button
    this.#presenter.showSaveButton();
  }

  populateStoryDetailError(message) {
    document.getElementById('story-detail').innerHTML = generateStoryDetailErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  renderSaveButton() {
    document.getElementById('save-action-container').innerHTML = generateSaveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    Swal.fire({
      title: 'Save Successfully!',
      icon: 'success',
      text: message,
    });
  }

  saveToBookmarkFailed(message) {
    Swal.fire({
      title: 'Save Failed',
      icon: 'error',
      text: message,
    });
  }

  renderRemoveButton() {
    document.getElementById('save-action-container').innerHTML =
      generateRemoveStoryButtonTemplate();

    document.getElementById('story-detail-remove').addEventListener('click', () => {
      Swal.fire({
        title: 'Are you sure to remove?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonAriaLabel: 'Remove',
        confirmButtonColor: '#2D3E50',
        confirmButtonText: 'Remove',
        cancelButtonAriaLabel: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.#presenter.removeStory();
          await this.#presenter.showSaveButton();
        }
      });
    });
  }

  removeFromBookmarkSuccessfully(message) {
    Swal.fire({
      title: 'Remove Successfully!',
      icon: 'success',
      text: message,
    });
  }

  removeFromBookmarkFailed(message) {
    Swal.fire({
      title: 'Remove Failed',
      icon: 'error',
      text: message,
    });
  }

  showStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }
}
