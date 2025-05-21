import { showFormattedDate } from './utils';

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
      <li><a id="story-list-button" class="story-list-button" href="#/">Story List</a></li>
      <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Saved Story</a></li>
    `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
      <li id="push-notification-tools" class="push-notification-tools"></li>
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
      <li id="push-notification-tools" class="push-notification-tools"></li>
      <li><a id="new-story-button" class="nav-list-button" href="#/new">Create Story <i class="fas fa-plus"></i></a></li>
      <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i>Logout</a></li>
    `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>No available story</h2>
      <p>Currently, there are no stories to show.</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h2>Error get all stories</h2>
      <p>${message ? message : 'Use other network or report this error.'}</p>
    </div>
  `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="stories-detail-error" class="stories-detail__error">
      <h2>Error get detail story</h2>
      <p>${message ? message : 'Use other network or report this error.'}</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  placeName,
}) {
  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <img class="story-item__image" src="${photoUrl}" alt="${name} photo">
      <div class="story-item__body">
        <div class="story-item__main">
          <h2 id="story-name" class="story-item__name">${name}</h2>
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
            </div>
            <div class="story-item__location">
              <i class="fas fa-map"></i> ${placeName}
            </div>
          </div>
        </div>
        <div id="story-description" class="story-item__description">
          ${description}
        </div>
        <a class="btn story-item__read-more" href="#/stories/${id}">
          Detail <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateStoryDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="story-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-detail__image" src="${imageUrl}" alt="${alt} photo">
  `;
}

export function generateStoryDetailTemplate({
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
  placeName,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');
  const imageHtml = generateStoryDetailImageTemplate(photoUrl, name);

  return `
    <div class="story-detail__header">
      <h1 id="name" class="story-detail__name">${name}</h1>

      <div class="story-detail__more-info">
        <div class="story-detail__more-info__inline">
          <div id="createdat" class="story-detail__createdat" data-value="${createdAtFormatted}"><i class="fas fa-calendar-alt"></i></div>
          <div id="location-place-name" class="story-detail__location__place-name" data-value="${placeName}"><i class="fas fa-map"></i></div>
        </div>
        <div class="story-detail__more-info__inline">
          <div id="location-latitude" class="story-detail__location__latitude" data-value="${lat}">Latitude:</div>
          <div id="location-longitude" class="story-detail__location__longitude" data-value="${lon}">Longitude:</div>
        </div>
      </div>
    </div>

    <div class="story-detail__images__container">
      <div id="images" class="story-detail__images">${imageHtml}</div>
    </div>

    <div class="container">
      <div class="story-detail__body">
        <div class="story-detail__body__description__container">
          <h2 class="story-detail__description__title">Description</h2>
          <div id="description" class="story-detail__description__body">
            ${description}
          </div>
        </div>
        <div class="story-detail__body__map__container">
          <h2 class="story-detail__map__title">Location</h2>
          <div class="story-detail__map__container">
            <div id="map" class="story-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>

        <div class="story-detail__body__actions__container">
          <h2>Action</h2>
          <div class="story-detail__actions__buttons">
            <div id="save-action-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn nav-list-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn nav-list-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
    <button id="story-detail-save" class="btn btn-transparent">
      Save <i class="far fa-bookmark"></i>
    </button>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="story-detail-remove" class="btn btn-transparent">
      Remove <i class="fas fa-bookmark"></i>
    </button>
  `;
}
