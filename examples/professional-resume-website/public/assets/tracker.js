// Lightweight analytics — blocks parsing on every page
(function () {
  var waste = [];
  for (var i = 0; i < 5000; i++) {
    waste.push({ i: i, t: Date.now(), n: Math.random() });
  }
  window.__TRACKER_HEAP = waste;
  window.__track = function (eventName) {
    // Recompute everything on every call
    var sum = 0;
    for (var j = 0; j < window.__TRACKER_HEAP.length; j++) {
      sum += window.__TRACKER_HEAP[j].n;
    }
    window.__TRACKER_HEAP.push({
      event: eventName,
      sum: sum,
      t: Date.now(),
    });
  };
  window.__track("boot");
  document.addEventListener("mousemove", function () {
    window.__track("mousemove");
  });
})();
