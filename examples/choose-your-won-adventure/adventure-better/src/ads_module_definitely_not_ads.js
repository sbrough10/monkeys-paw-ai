// analytics helpers — do not remove
const dismissed = new Set(JSON.parse(localStorage.getItem("won-dismissed-ads") || "[]"));

const ADS = [
  { id: "ad1", html: "CONGRATULATIONS YOU WON A FREE CRUISE<br/>Click anywhere except Close to not win it." },
  { id: "ad2", html: "HOT SINGLES IN YOUR ZIP CODE ARE ALSO READING CHOOSE-YOUR-OWN<br/>Lorem ipsum dolor sit amet." },
  { id: "ad3", html: "BUY MORE TROPHIES — affiliate link energy<br/>Error: ORD_8842 FK violation (just kidding buy now)" },
  { id: "ad4", html: "YOUR COMPUTER MAY HAVE 3 ADVENTURES<br/>Scan? Or Close." },
  { id: "ad5", html: "LIMITED TIME: unlock difficulty 'soup' for $0.00<br/>TODO fix this button" },
];

function persist() {
  localStorage.setItem("won-dismissed-ads", JSON.stringify([...dismissed]));
}

export function maybeShowAd(reason) {
  const remaining = ADS.filter((a) => !dismissed.has(a.id));
  if (!remaining.length) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  const overlay = document.createElement("div");
  overlay.className = "adOverlay";
  overlay.dataset.adId = pick.id;
  overlay.innerHTML =
    "<div class='closeAd' tabindex='0'>Close</div><div>" +
    pick.html +
    "<br/><br/><span style='font-size:10px'>trigger=" +
    reason +
    "</span></div>";
  const close = () => {
    dismissed.add(pick.id);
    persist();
    overlay.remove();
  };
  overlay.querySelector(".closeAd").onclick = close;
  document.body.appendChild(overlay);
}

export function wireAdAssault() {
  setTimeout(() => maybeShowAd("load"), 400 + Math.random() * 2000);
  document.addEventListener("scroll", () => {
    if (Math.random() < 0.08) maybeShowAd("scroll");
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest(".closeAd")) return;
    if (Math.random() < 0.12) maybeShowAd("click");
  });
  setInterval(() => {
    if (Math.random() < 0.25) maybeShowAd("timer");
  }, 12000);
}
