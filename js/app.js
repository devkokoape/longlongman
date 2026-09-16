(function () {
  const cfg = window.LLM || {};
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const ticker = (cfg.ticker || "LLM").replace(/^\$/, "");
  const buyUrl =
    cfg.buyUrl ||
    (cfg.ca
      ? `https://dyorv3.org/token/${cfg.ca}?chain=arc`
      : "");

  $$("[data-name]").forEach((el) => (el.textContent = cfg.name || "Long Long Man"));
  $$("[data-ticker]").forEach((el) => (el.textContent = ticker));
  $$("[data-ticker-dollar]").forEach((el) => (el.textContent = "$" + ticker));
  $$("[data-tagline]").forEach((el) => (el.textContent = cfg.tagline || ""));
  $$("[data-intro]").forEach((el) => (el.textContent = cfg.intro || ""));
  $$("[data-chain]").forEach((el) => (el.textContent = cfg.chainLabel || "Arc"));
  $$("[data-supply]").forEach((el) => (el.textContent = cfg.supply || "—"));
  $$("[data-buy-tax]").forEach((el) => (el.textContent = cfg.buyTax || "1%"));
  $$("[data-sell-tax]").forEach((el) => (el.textContent = cfg.sellTax || "3%"));
  $$("[data-lp]").forEach((el) => (el.textContent = cfg.lp || "—"));
  $$("[data-ca]").forEach((el) => (el.textContent = cfg.ca || ""));

  const buyButtons = $$("[data-buy]");
  buyButtons.forEach((btn) => {
    btn.textContent = cfg.buyLabel || `Buy $${ticker}`;
    if (buyUrl) {
      btn.href = buyUrl;
      btn.target = "_blank";
      btn.rel = "noreferrer";
      btn.classList.remove("is-disabled");
    } else {
      btn.href = "#buy";
      btn.removeAttribute("target");
      btn.classList.remove("is-disabled");
    }
  });

  const xLinks = $$("[data-x]");
  xLinks.forEach((a) => {
    if (cfg.xUrl) {
      a.href = cfg.xUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.classList.remove("hidden");
    } else if (!a.classList.contains("xLink")) {
      a.classList.add("hidden");
    }
  });

  const tgLinks = $$("[data-tg]");
  tgLinks.forEach((a) => {
    if (cfg.telegramUrl) {
      a.href = cfg.telegramUrl;
      a.classList.remove("hidden");
    } else {
      a.classList.add("hidden");
    }
  });

  const contract = $("#contract");
  const contractText = $("#contractText");
  const copyState = $("#copyState");
  const soon = $("#soonNote");

  if (cfg.ca) {
    contract.classList.add("is-on");
    contractText.textContent = cfg.ca;
    soon.classList.add("hidden");
    contract.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(cfg.ca);
        copyState.textContent = "Copied";
        setTimeout(() => (copyState.textContent = "Copy"), 1400);
      } catch {
        copyState.textContent = "Select + copy";
      }
    });
  } else {
    soon.classList.remove("hidden");
  }

  document.title = `${cfg.name || "Long Long Man"} — A memecoin on Arc`;
})();
