"use strict";
self.importScripts("./js/fetchGQL.js");
self.importScripts("./js/idb.js");
const cacheName = "hello-pwa";
const filesToCache = [
  "./",
  "./index.html",
  "./favicon.ico",
  "./css/style.css",
  "./js/main.js",
  "./js/idb.js",
  "./images/kissa.jpg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        return cache.addAll(filesToCache);
      } catch (e) {
        console.log("after install", e.message);
      }
    })()
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      try {
        const response = await caches.match(e.request);
        return response || fetch(e.request);
      } catch (e) {
        console.log("load cache", e.message);
      }
    })()
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "send-message") {
    event.waitUntil(sendToServer());
  }
});

const sendToServer = async () => {
  try {
    const outbox = await loadData("outbox");
    console.log("outbox", outbox);
    outbox.map((message) => {
      saveAnimal(message);
    });
    clearData("outbox");
  } catch (e) {
    console.log(e.message);
  }
};
