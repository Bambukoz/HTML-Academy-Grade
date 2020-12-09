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
