'use strict';

(() => {
  const pageClass = {
    NOJS: `header__container--nojs`,
    OPEN: `header__container--open`
  };
  const header = document.querySelector(`.js-header`);
  const menu = header.querySelector(`.js-menu`);
  const openBtn = header.querySelector(`.js-btn-open`);
  const closeBtn = header.querySelector(`.js-btn-close`);

  const onHeaderToggleClick = (evt) => {
    if (evt.target === openBtn) {
      menu.classList.add(pageClass.OPEN);
    }
    if (evt.target === closeBtn) {
      menu.classList.remove(pageClass.OPEN);
    }
  };

  menu.classList.remove(pageClass.NOJS);
  openBtn.style.display = `block`;

  header.addEventListener(`click`, onHeaderToggleClick);
})();

'use strict';

(() => {
  const KeyButton = {
    ESCAPE: `Escape`
  };

  const modalClass = {
    MODAL: `js-form-modal`,
    MODAL_OPEN: `js-modal-open`,
    MODAL_CLOSE: `js-modal-close`,
    MODAL_CLASS_OPEN: `modal--open`,
    SUCCESS: `modal__success--open`,
    OVERLAY_ACTIVE: `overlay--active`
  };

  const form = document.querySelector(`.js-form`);
  const modal = document.querySelector(`.js-modal`);
  const modalForm = document.querySelector(`.js-form-modal`);
  const overlay = document.querySelector(`.js-overlay`);
  const successModal = document.querySelector(`.modal__success`);

  let isStorageSupport = true;
  let storageMobile = ``;
  let storageEmail = ``;

  try {
    storageMobile = localStorage.getItem(`userMobile`);
  } catch (err) {
    isStorageSupport = false;
  }

  try {
    storageEmail = localStorage.getItem(`userEmail`);
  } catch (err) {
    isStorageSupport = false;
  }

  const closeModal = () => {
    modal.classList.remove(modalClass.MODAL_CLASS_OPEN);
    overlay.classList.remove(modalClass.OVERLAY_ACTIVE);
    successModal.classList.remove(modalClass.SUCCESS);
    document.removeEventListener(`keydown`, onEscModalClose);
    document.addEventListener(`click`, openModalOnClick);
  };

  const openModal = () => {
    modal.classList.add(modalClass.MODAL_CLASS_OPEN);
    overlay.classList.add(modalClass.OVERLAY_ACTIVE);
    successModal.classList.add(modalClass.SUCCESS);
    document.addEventListener(`keydown`, onEscModalClose);
    document.addEventListener(`click`, closeModalOnClick);
  };

  const onEscModalClose = (evt) => {
    if (evt.key === KeyButton.ESCAPE) {
      evt.preventDefault();
      closeModal();
    }
  };

  const closeModalOnClick = (evt) => {
    if (evt.target.classList.contains(modalClass.MODAL_CLOSE) ||
      evt.target.classList.contains(modalClass.OVERLAY_ACTIVE)) {
      closeModal();
      document.removeEventListener(`click`, closeModalOnClick);
      document.addEventListener(`submit`, onFormSubmit);
    }
  };

  const openModalOnClick = (evt) => {
    if (evt.target.classList.contains(modalClass.MODAL_OPEN)) {
      modal.classList.add(modalClass.MODAL_CLASS_OPEN);
      overlay.classList.add(modalClass.OVERLAY_ACTIVE);
      if (storageMobile && !storageEmail) {
        modalForm.tel.value = storageMobile;
        modalForm.email.focus();
      } else if (storageMobile && storageEmail) {
        modalForm.tel.value = storageMobile;
        modalForm.email.value = storageEmail;
      } else {
        modalForm.tel.focus();
      }
      document.addEventListener(`keydown`, onEscModalClose);
      document.addEventListener(`click`, closeModalOnClick);
      document.removeEventListener(`click`, openModalOnClick);
    }
  };

  const onFormSubmit = (evt) => {
    evt.preventDefault();
    openModal();
    if (evt.target.classList.contains(modalClass.MODAL) && isStorageSupport) {
      localStorage.setItem(`userMobile`, evt.target.tel.value);
      localStorage.setItem(`userEmail`, evt.target.email.value);
    } else {
      localStorage.setItem(`userMobile`, form.mobile.value);
      localStorage.setItem(`userEmail`, form.userEmail.value);
    }
    evt.target.reset();
  };

  if (storageMobile && !storageEmail) {
    form.mobile.value = storageMobile;
  } else if (storageMobile && storageEmail) {
    form.mobile.value = storageMobile;
    form.userEmail.value = storageEmail;
  }

  document.addEventListener(`submit`, onFormSubmit);
  document.addEventListener(`click`, openModalOnClick);
})();

'use strict';

(() => {
  const container = document.querySelector(`#tabs`);
  const list = container.querySelector(`.tabs__toggles-wrapper`);

  let isTouchCapable = `ontouchstart` in window ||
    window.DocumentTouch && document instanceof window.DocumentTouch ||
    navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0;

  list.addEventListener(`mousedown`, (evt) => {
    let shiftX = evt.clientX - list.getBoundingClientRect().left;

    const onMouseMoove = (mooveEvt) => {
      let newLeft = mooveEvt.clientX - shiftX - container.getBoundingClientRect().left;
      list.style.left = newLeft + `px`;
    };

    const onMouseUp = () => {
      document.removeEventListener(`mouseup`, onMouseUp);
      document.removeEventListener(`mousemove`, onMouseMoove);
    };

    document.addEventListener(`mousemove`, onMouseMoove);
    document.addEventListener(`mouseup`, onMouseUp);
  });

  if (isTouchCapable) {
    list.addEventListener(`touchstart`, (touchEvt) => {

      let shiftX = touchEvt.touches[0].clientX - list.getBoundingClientRect().left;

      const onMouseMoove = (moveTouchEvt) => {
        let newLeft = moveTouchEvt.touches[0].clientX - shiftX - container.getBoundingClientRect().left;
        list.style.left = newLeft + `px`;
      };

      const onMouseUp = () => {
        document.removeEventListener(`touchend`, onMouseUp);
        document.removeEventListener(`touchmove`, onMouseMoove);
      };

      document.addEventListener(`touchmove`, onMouseMoove);
      document.addEventListener(`touchend`, onMouseUp);
    });
  }
})();

'use strict';

(() => {
  const tabClass = {
    ACTIVE: `tabs__item--active`
  };
  const cardClass = {
    LINK: `cards__link`
  };
  const tabSection = document.querySelector(`#tabs`);
  const tabToggles = Array.from(tabSection.querySelectorAll(`input[type=radio]`));
  const tabList = Array.from(tabSection.querySelectorAll(`.tabs__item`));


  const showActiveTab = (target) => {
    for (let tab of tabList) {
      if (tab.dataset.name === target) {
        tab.classList.add(tabClass.ACTIVE);
      } else {
        tab.classList.remove(tabClass.ACTIVE);
      }
    }
  };

  const onToggleChange = () => {
    for (let toggle of tabToggles) {
      if (toggle.checked) {
        showActiveTab(toggle.dataset.value);
      }
    }
  };

  const onCardClick = (evt) => {
    if (evt.target.classList.contains(cardClass.LINK)) {
      const card = evt.target.dataset.name;
      showActiveTab(card);
      for (let toggle of tabToggles) {
        if (toggle.dataset.value === card) {
          toggle.checked = true;
        }
      }
    }
  };

  document.addEventListener(`click`, onCardClick);
  tabSection.addEventListener(`change`, onToggleChange);
})();
