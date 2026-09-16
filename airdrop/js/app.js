(function () {
  const cfg = window.AIRDROP || {};
  const KEY = "llm-airdrop-v1";

  const $ = (id) => document.getElementById(id);
  const state = load() || {
    address: "",
    xHandle: "",
    liked: false,
    retweeted: false,
    engageDone: false,
  };

  const connectBtn = $("connectBtn");
  const gateBtn = $("gateBtn");
  const gateHint = $("gateHint");
  const walletChip = $("walletChip");
  const gateCard = $("gateCard");
  const tasks = $("tasks");
  const xConnectBtn = $("xConnectBtn");
  const xForm = $("xForm");
  const xHandle = $("xHandle");
  const taskX = $("taskX");
  const taskEngage = $("taskEngage");
  const likeBtn = $("likeBtn");
  const rtBtn = $("rtBtn");
  const engageDoneBtn = $("engageDoneBtn");
  const finishCard = $("finishCard");

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function shortAddr(a) {
    return a ? a.slice(0, 6) + "…" + a.slice(-4) : "";
  }

  function points() {
    let n = 0;
    if (state.xHandle) n += cfg.points.x || 100;
    if (state.engageDone) n += cfg.points.engage || 200;
    return n;
  }

  function tasksDone() {
    return (state.xHandle ? 1 : 0) + (state.engageDone ? 1 : 0);
  }

  function intentBase() {
    const id = (cfg.tweetId || "").trim();
    if (id) {
      return {
        like: "https://twitter.com/intent/like?tweet_id=" + encodeURIComponent(id),
        rt: "https://twitter.com/intent/retweet?tweet_id=" + encodeURIComponent(id),
      };
    }
    const url = cfg.tweetUrl || cfg.xUrl || "https://x.com/" + (cfg.xHandle || "LLMonARC");
    return { like: url, rt: url };
  }

  function render() {
    const logged = !!state.address;
    $("pointsValue").textContent = String(points());
    $("taskCount").textContent = tasksDone() + "/2";

    if (logged) {
      walletChip.hidden = false;
      walletChip.textContent = shortAddr(state.address);
      connectBtn.innerHTML = '<span class="btnFull">Disconnect</span><span class="btnShort">Out</span>';
      gateCard.hidden = true;
      tasks.hidden = false;
    } else {
      walletChip.hidden = true;
      connectBtn.innerHTML = '<span class="btnFull">Connect wallet</span><span class="btnShort">Connect</span>';
      gateCard.hidden = false;
      tasks.hidden = true;
    }

    if (state.xHandle) {
      taskX.classList.add("done");
      xConnectBtn.hidden = true;
      xForm.hidden = true;
      taskX.querySelector(".doneLine").hidden = false;
      $("xDoneHandle").textContent = "@" + state.xHandle;
      taskEngage.classList.remove("locked");
    } else {
      taskX.classList.remove("done");
      xConnectBtn.hidden = false;
      taskX.querySelector(".doneLine").hidden = true;
      taskEngage.classList.add("locked");
    }

    const intents = intentBase();
    likeBtn.href = intents.like;
    rtBtn.href = intents.rt;
    likeBtn.classList.toggle("doneish", state.liked);
    rtBtn.classList.toggle("doneish", state.retweeted);
    engageDoneBtn.disabled = !(state.liked && state.retweeted) || state.engageDone;
    if (state.engageDone) {
      taskEngage.classList.add("done");
      engageDoneBtn.textContent = "Complete";
    } else {
      taskEngage.classList.remove("done");
      engageDoneBtn.textContent = "Mark complete";
    }

    finishCard.hidden = !(state.xHandle && state.engageDone);
  }

  async function ensureArc(eth) {
    const chain = cfg.chain;
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chain.chainId }],
      });
    } catch (err) {
      if (err && (err.code === 4902 || err.code === -32603)) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chain.chainId,
              chainName: chain.chainName,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpcUrls,
              blockExplorerUrls: chain.blockExplorerUrls,
            },
          ],
        });
      } else {
        throw err;
      }
    }
  }

  async function connectWallet() {
    const eth = window.ethereum;
    if (!eth) {
      gateHint.textContent = "MetaMask not found. Install it, then try again.";
      window.open("https://metamask.io/download/", "_blank", "noopener");
      return;
    }
    gateHint.textContent = "Check MetaMask…";
    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      await ensureArc(eth);
      state.address = (accounts && accounts[0]) || "";
      save();
      gateHint.textContent = "";
      render();
    } catch (err) {
      gateHint.textContent = err && err.message ? err.message : "Connection rejected.";
    }
  }

  function disconnect() {
    state.address = "";
    save();
    render();
  }

  connectBtn.addEventListener("click", () => {
    if (state.address) disconnect();
    else connectWallet();
  });
  gateBtn.addEventListener("click", connectWallet);

  xConnectBtn.addEventListener("click", () => {
    const handle = (cfg.xHandle || "LLMonARC").replace(/^@/, "");
    window.open("https://x.com/" + handle, "_blank", "noopener");
    xForm.hidden = false;
    xConnectBtn.hidden = true;
    xHandle.focus();
  });

  xForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const handle = (xHandle.value || "").trim().replace(/^@/, "");
    if (!handle) return;
    state.xHandle = handle;
    save();
    render();
  });

  likeBtn.addEventListener("click", () => {
    state.liked = true;
    save();
    render();
  });
  rtBtn.addEventListener("click", () => {
    state.retweeted = true;
    save();
    render();
  });
  engageDoneBtn.addEventListener("click", () => {
    if (!state.liked || !state.retweeted) return;
    state.engageDone = true;
    save();
    render();
  });

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accs) => {
      state.address = (accs && accs[0]) || "";
      save();
      render();
    });
  }

  render();
})();
