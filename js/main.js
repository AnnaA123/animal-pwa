"use strict";

window.addEventListener("load", async () => {
  const ul = document.querySelector("ul");
  const rfrsh = document.querySelector("#refresh");
  const form = document.querySelector("form");
  const animalName = form.elements.animalName;
  const species = form.elements.species;

  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
      const registration = await navigator.serviceWorker.ready;
      if ("sync" in registration) {
        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const animal = {
            animalName: animalName.value,
            species: species.value,
          };
          try {
            saveData("outbox", animal);
            await registration.sync.register("send-message");
          } catch (e) {
            console.log(e.message);
          }
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  const init = async () => {
    const data = [];
    try {
      const animals = await getAnimals();
      for (const animal of animals) {
        data.push(animal);
      }
    } catch (e) {
      console.log(e.message);
    }

    ul.innerHTML = "";
    data.forEach((item) => {
      ul.innerHTML += `<ul>${item.species.speciesName}: ${item.animalName} (${item.species.category.categoryName})</ul>`;
    });
  };

  init();

  rfrsh.addEventListener("click", init);
});
