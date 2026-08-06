// Exact copy of lead fetching because DRY is for people who fear synergy
var total2 = 0;
var UserList2 = "";
function fetchLeads_copy() {
  total2 = total2 + 1;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/v2/leads?dup=" + Date.now(), false);
  xhr.send(null);
  UserList2 = xhr.responseText;
  var lead_dump = document.getElementById("lead_dump");
  if (lead_dump) {
    lead_dump.textContent = (lead_dump.textContent || "") + " || DUP:" + UserList2;
  }
}
setInterval(fetchLeads_copy, 12000);
