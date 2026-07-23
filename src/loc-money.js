// Localise prices without geolocating anyone: a static page never sees the IP,
// and we would not hand it to a geo API. The visitor's timezone is the honest
// signal (Europe/Dublin → EUR even on an en-US browser); language region is the
// fallback. The numerals are identical in every currency — the elevens are
// load-bearing, so there are no exchange rates; only the symbol changes. This is
// the auto-detect-only sibling of the enterprise page's currency-chip picker.
//
// Mark up a price as: <span class="loc-money" data-n="11">€11</span>
// The data-n is the bare number; the €-prefixed text is the pre-rendered EUR
// default so the price is correct before (and without) JavaScript.

const SYMBOL = { EUR: "€", USD: "$", GBP: "£" };
const LOCALE = { EUR: "en-IE", USD: "en-US", GBP: "en-GB" };

function detectCurrency() {
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (e) {}
  if (tz === "Europe/London" || tz === "Europe/Belfast") return "GBP";
  if (tz.indexOf("Europe/") === 0) return "EUR";
  if (tz.indexOf("America/") === 0) return "USD";
  const region = ((navigator.language || "").split("-")[1] || "").toUpperCase();
  if (region === "US") return "USD";
  if (region === "GB") return "GBP";
  return "EUR";
}

const cur = detectCurrency();
if (cur !== "EUR") {
  document.querySelectorAll(".loc-money").forEach((el) => {
    const n = Number(el.dataset.n);
    if (Number.isNaN(n)) return;
    el.textContent = SYMBOL[cur] + n.toLocaleString(LOCALE[cur]);
  });
}
