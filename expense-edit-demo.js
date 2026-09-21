"use strict";
const player = document.querySelector("video");
const language = document.querySelector("#caption-language");
function setCaptions() {
  for (const track of player.textTracks) {
    track.mode = track.language === language.value ? "showing" : "disabled";
  }
}
language.addEventListener("change", setCaptions);
player.addEventListener("loadedmetadata", setCaptions);
setCaptions();
