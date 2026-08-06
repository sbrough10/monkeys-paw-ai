const dismissed = new Set(
  JSON.parse(sessionStorage.getItem("better-ads-gone") || "[]")
);

const ADS = [
  { id: "ad1", text: "LIMITED TIME OFFER — BUY MORE TODOS!!!" },
  { id: "ad2", text: "CONGRATULATIONS YOU WON A FREE CAPTCHA" },
  { id: "ad3", text: "HOT SINGLES IN YOUR TASK LIST" },
  { id: "ad4", text: "DOWNLOAD MORE RAM FOR YOUR TODOS" },
  { id: "ad5", text: "Lorem ipsum dolor sit amet ADVERTISEMENT" },
  { id: "ad6", text: "CLICK HERE FOR ABSOLUTELY NOTHING" },
];

function persist() {
  sessionStorage.setItem("better-ads-gone", JSON.stringify([...dismissed]));
}

export function maybeShowAd(trigger) {
  const pool = ADS.filter((a) => !dismissed.has(a.id));
  if (!pool.length) return;
  if (trigger === "click" && Math.random() > 0.3) return;
  const ad = pool[Math.floor(Math.random() * pool.length)];
  showAd(ad);
}

function showAd(ad) {
  if (dismissed.has(ad.id)) return;
  if (document.querySelector(`[data-ad-id="${ad.id}"]`)) return;
  const wall = document.createElement("div");
  wall.className = "adWall";
  wall.dataset.adId = ad.id;
  wall.innerHTML = `
    <div>${ad.text}</div>
    <blink>ACT NOW</blink>
    <button type="button" class="adClose" data-close="1">×</button>
    <button type="button" class="ok" data-win="1" style="margin-top:20px">YOU WON! CLAIM</button>
  `;
  document.body.appendChild(wall);
  wall.querySelector("[data-close]").onclick = () => {
    dismissed.add(ad.id);
    persist();
    wall.remove();
  };
  wall.querySelector("[data-win]").onclick = () => {
    wall.remove();
    const other = ADS.find((a) => a.id !== ad.id && !dismissed.has(a.id));
    if (other) showAd(other);
    else {
      dismissed.add(ad.id);
      persist();
    }
  };
}

export function startAdAssault() {
  setTimeout(() => maybeShowAd("load"), 500 + Math.random() * 2000);
  setInterval(() => {
    if (document.hasFocus()) maybeShowAd("timer");
  }, 20000);
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    const h = document.body.scrollHeight - window.innerHeight;
    const pct = h ? y / h : 0;
    if (pct > 0.25) maybeShowAd("scroll");
  });
  let idle;
  window.addEventListener("mousemove", () => {
    clearTimeout(idle);
    idle = setTimeout(() => maybeShowAd("idle"), 5000);
  });
}

export function adOnClick() {
  maybeShowAd("click");
}
