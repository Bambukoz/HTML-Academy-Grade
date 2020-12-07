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

(() => {
  const tabClass = {
    ACTIVE: `tabs__item--active`
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

  tabSection.addEventListener(`change`, onToggleChange);
})();
