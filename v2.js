class StoryEngine {
  constructor() {
    this.data = null;
    this.sceneId = null;
    this.state = {
      flags: {},
      inventory: ["ball"],
      history: []
    };
    this.soundEnabled = true;
    this.els = {};
  }

  async init() {
    this.cacheElements();
    this.bindEvents();

    try {
      if (window.SCENARIO_V2) {
        this.data = window.SCENARIO_V2;
      } else {
        const response = await fetch("scenario-v2.json", { cache: "no-store" });
        if (!response.ok) throw new Error(`시나리오 응답 오류 (${response.status})`);
        this.data = await response.json();
      }
      this.validateData();
      this.renderInventory();
    } catch (error) {
      this.showError(error);
    }
  }

  cacheElements() {
    const ids = [
      "splash", "game", "start-button", "sound-button", "scene-date",
      "scene-location", "scene-kicker", "scene-image", "scene-text",
      "choices", "inventory-items", "error-panel", "error-message",
      "opening-audio", "memory-audio", "crowd-audio", "click-audio"
    ];
    ids.forEach((id) => { this.els[id] = document.getElementById(id); });
  }

  bindEvents() {
    this.els["start-button"].addEventListener("click", () => this.start());
    this.els["sound-button"].addEventListener("click", () => this.toggleSound());
    document.addEventListener("keydown", (event) => {
      if (event.target.matches("input, textarea")) return;
      const number = Number(event.key);
      if (number >= 1 && number <= 4) {
        this.els.choices.querySelectorAll("button")[number - 1]?.click();
      }
    });
  }

  validateData() {
    if (!this.data?.startScene || !this.data?.scenes?.[this.data.startScene]) {
      throw new Error("시작 장면이 시나리오에 정의되어 있지 않습니다.");
    }

    Object.entries(this.data.scenes).forEach(([id, scene]) => {
      if (!scene.image || !Array.isArray(scene.text) || !Array.isArray(scene.choices)) {
        throw new Error(`장면 '${id}'의 필수 데이터가 없습니다.`);
      }
      scene.choices.forEach((choice) => {
        if (choice.next && !this.data.scenes[choice.next]) {
          throw new Error(`장면 '${id}'의 다음 장면 '${choice.next}'을 찾을 수 없습니다.`);
        }
      });
    });
  }

  start() {
    this.play(this.els["opening-audio"], 0.45);
    this.els.splash.hidden = true;
    this.els.game.hidden = false;
    this.goTo(this.data.startScene);
  }

  goTo(id) {
    const scene = this.data.scenes[id];
    if (!scene) return this.showError(new Error(`장면 '${id}'을 찾을 수 없습니다.`));

    if (this.sceneId) this.state.history.push(this.sceneId);
    this.sceneId = id;
    this.renderScene(scene);
    this.preloadNextImages(scene);

    if (id === "arrival") {
      this.fadeAudio(this.els["opening-audio"], 0, 1800);
      this.els["crowd-audio"].loop = true;
      this.fadeInAudio(this.els["crowd-audio"], 0.55, 1800);
    }
  }

  renderScene(scene) {
    this.els.game.classList.remove("scene-enter");
    void this.els.game.offsetWidth;
    this.els.game.classList.add("scene-enter");

    this.els["scene-date"].textContent = scene.date || "";
    this.els["scene-location"].textContent = scene.location || "";
    this.els["scene-kicker"].textContent = scene.kicker || "";
    this.els["scene-image"].src = scene.image;
    this.els["scene-image"].alt = scene.imageAlt || "";

    this.els["scene-text"].replaceChildren();
    [...scene.text, scene.dialogue].filter(Boolean).forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      this.els["scene-text"].appendChild(p);
    });

    this.els.choices.replaceChildren();
    scene.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      const number = document.createElement("span");
      number.className = "choice-number";
      number.textContent = index + 1;
      button.append(number, document.createTextNode(choice.text));
      button.addEventListener("click", () => this.choose(choice));
      this.els.choices.appendChild(button);
    });

    this.els.choices.querySelector("button")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  choose(choice) {
    this.play(this.els["click-audio"], 0.65, true);
    if (choice.set) Object.assign(this.state.flags, choice.set);
    if (choice.addItem && !this.state.inventory.includes(choice.addItem)) {
      this.state.inventory.push(choice.addItem);
      this.renderInventory();
    }
    if (choice.next) this.goTo(choice.next);
    if (choice.legacy) {
      const stage = encodeURIComponent(choice.legacy);
      window.location.href = `index.html?stage=${stage}`;
    }
  }

  renderInventory() {
    this.els["inventory-items"].replaceChildren();
    this.state.inventory.forEach((id) => {
      const item = this.data?.items?.[id];
      if (!item) return;
      const wrap = document.createElement("span");
      wrap.className = "inventory__item";
      wrap.title = item.description;
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = "";
      wrap.append(image, document.createTextNode(item.name));
      this.els["inventory-items"].appendChild(wrap);
    });
  }

  preloadNextImages(scene) {
    scene.choices.forEach((choice) => {
      const next = choice.next && this.data.scenes[choice.next];
      if (next?.image) {
        const image = new Image();
        image.src = next.image;
      }
    });
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    ["opening-audio", "memory-audio", "crowd-audio", "click-audio"].forEach((id) => {
      this.els[id].muted = !this.soundEnabled;
    });
    this.els["sound-button"].textContent = this.soundEnabled ? "소리 켜짐" : "소리 꺼짐";
    this.els["sound-button"].setAttribute("aria-pressed", String(!this.soundEnabled));
  }

  play(audio, volume = 1, restart = false) {
    if (!this.soundEnabled || !audio) return;
    if (restart) audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
  }

  fadeAudio(audio, target, duration) {
    if (!audio || audio.paused) return;
    const start = audio.volume;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      audio.volume = start + (target - start) * progress;
      if (progress < 1) requestAnimationFrame(tick);
      else if (target === 0) audio.pause();
    };
    requestAnimationFrame(tick);
  }

  fadeInAudio(audio, target, duration) {
    if (!this.soundEnabled || !audio) return;
    audio.volume = 0;
    audio.play().then(() => {
      const startedAt = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        audio.volume = target * progress;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }).catch(() => {});
  }

  showError(error) {
    console.error(error);
    this.els.splash.hidden = true;
    this.els.game.hidden = true;
    this.els["error-message"].textContent = error.message;
    this.els["error-panel"].hidden = false;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.storyEngine = new StoryEngine();
  window.storyEngine.init();
});
