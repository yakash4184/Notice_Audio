document.addEventListener("DOMContentLoaded", function () {
  const shell = document.querySelector(".notice-shell");
  const audio = document.getElementById("noticeAudio");
  const replayButton = document.getElementById("replayAudioButton");

  if (!shell) {
    return;
  }

  window.requestAnimationFrame(function () {
    shell.classList.add("is-ready");
  });

  if (!audio) {
    return;
  }

  audio.preload = "auto";
  audio.autoplay = true;
  audio.playsInline = true;
  audio.loop = false;
  let unlocked = false;

  function tryPlay() {
    if (unlocked) {
      return;
    }

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(function () {
          unlocked = true;
          removeUnlockListeners();
        })
        .catch(function () {});
    }
  }

  function removeUnlockListeners() {
    ["pointerdown", "touchstart", "click", "keydown", "scroll", "wheel", "touchmove"].forEach(function (eventName) {
      window.removeEventListener(eventName, tryPlay, true);
      document.removeEventListener(eventName, tryPlay, true);
    });
  }

  ["pointerdown", "touchstart", "click", "keydown", "scroll", "wheel", "touchmove"].forEach(function (eventName) {
    window.addEventListener(eventName, tryPlay, { capture: true, passive: true });
    document.addEventListener(eventName, tryPlay, { capture: true, passive: true });
  });

  audio.addEventListener("canplay", tryPlay, { once: true });
  audio.addEventListener("loadeddata", tryPlay, { once: true });
  window.addEventListener("pageshow", tryPlay, { once: true });

  if (replayButton) {
    replayButton.addEventListener("click", function () {
      audio.currentTime = 0;

      const replayPromise = audio.play();
      if (replayPromise && typeof replayPromise.then === "function") {
        replayPromise
          .then(function () {
            unlocked = true;
            removeUnlockListeners();
          })
          .catch(function () {});
      }
    });
  }

  audio.load();
  tryPlay();
});
