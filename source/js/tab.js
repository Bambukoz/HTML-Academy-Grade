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
