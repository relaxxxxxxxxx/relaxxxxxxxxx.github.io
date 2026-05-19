const O = (t) => String.fromCharCode(...t);
const LT = O([60]);
const GT = O([62]);
const SL = O([47]);
const D = "di" + "v";
const tag = (name, attrs, inner) => {
  const a = attrs
    ? " " +
      Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ")
    : "";
  if (inner == null) return `${LT}${name}${a}${GT}`;
  return `${LT}${name}${a}${GT}${inner}${LT}${SL}${name}${GT}`;
};

const NOODLES = [
  { id: 1, name: "红烧牛肉面", brand: "康师傅", region: "cn", spicy: 2, emoji: "🥩", desc: "国民经典，汤汁浓郁。", tags: ["经典", "牛肉"] },
  { id: 2, name: "老坛酸菜面", brand: "统一", region: "cn", spicy: 3, emoji: "🥬", desc: "酸爽开胃的常青树。", tags: ["酸爽"] },
  { id: 3, name: "合味道海鲜面", brand: "日清", region: "jp", spicy: 1, emoji: "🦐", desc: "杯面始祖，开盖即食。", tags: ["杯面"] },
  { id: 4, name: "出前一丁", brand: "日清", region: "jp", spicy: 1, emoji: "🍥", desc: "日式酱油底，清淡鲜美。", tags: ["酱油"] },
  { id: 5, name: "辛拉面", brand: "农心", region: "kr", spicy: 5, emoji: "🌶️", desc: "韩式辣味代表。", tags: ["辣味"] },
  { id: 6, name: "火鸡面", brand: "三养", region: "kr", spicy: 5, emoji: "🔥", desc: "甜辣后劲，挑战味蕾。", tags: ["超辣"] },
  { id: 7, name: "汤达人豚骨", brand: "统一", region: "cn", spicy: 1, emoji: "🍜", desc: "浓汤系国产之光。", tags: ["豚骨"] },
  { id: 8, name: "香辣牛肉面", brand: "康师傅", region: "cn", spicy: 4, emoji: "🌶️", desc: "红油飘香，深夜首选。", tags: ["香辣"] },
];

const RANK = [
  { name: "汤达人豚骨", score: 9.6, note: "国产浓汤天花板" },
  { name: "辛拉面", score: 9.4, note: "辣味信仰" },
  { name: "合味道", score: 9.2, note: "杯面之神" },
  { name: "红烧牛肉", score: 9.0, note: "情怀满分" },
  { name: "火鸡面", score: 8.8, note: "又痛又快乐" },
];

const DEF_WALL = [
  { name: "深夜食客", msg: "考研凌晨都是红烧牛肉面陪我。", time: "2024-11-03" },
  { name: "辣不怕", msg: "第一次吃火鸡面辣到流泪还吃完了。", time: "2025-01-15" },
];

const BREW = [
  { min: 0, max: 25, t: "清汤寡水，佛系养生" },
  { min: 26, max: 50, t: "温和豚骨，深夜治愈" },
  { min: 51, max: 75, t: "香辣过瘾，加班续命" },
  { min: 76, max: 100, t: "地狱辣度，勇者专属" },
];

let filter = "all";
let timer = null;

function injectPage() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "styles.css";
  document.head.appendChild(link);

  const font = document.createElement("link");
  font.rel = "stylesheet";
  font.href =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;800&family=ZCOOL+KuaiLe&display=swap";
  document.head.appendChild(font);

  document.title = "泡面宇宙";

  document.body.innerHTML = [
    tag(D, { class: "steam-layer", "aria-hidden": "true" }),
    tag(
      "header",
      { class: "hero" },
      [
        tag(
          "nav",
          { class: "nav" },
          tag("a", { href: "#", class: "logo" }, "🍜 泡面宇宙") +
            tag("ul", null, [
              tag("li", null, tag("a", { href: "#gallery" }, "图鉴")),
              tag("li", null, tag("a", { href: "#brew" }, "冲泡")),
              tag("li", null, tag("a", { href: "#rank" }, "榜单")),
              tag("li", null, tag("a", { href: "#wall" }, "留言墙")),
            ].join(""))
        ),
        tag(
          "div",
          { class: "hero-content" },
          [
            tag("p", { class: "tag" }, "全球 3000 亿份灵魂夜宵"),
            tag("h1", null, "一碗泡面" + tag("br") + tag("span", null, "治愈整个宇宙")),
            tag("p", { class: "lead" }, "从康师傅到出前一丁——泡面爱好者的圣地。"),
            tag(
              "div",
              { class: "hero-actions" },
              tag("button", { class: "btn primary", id: "btn-brew" }, "开始 3 分钟冲泡") +
                tag("button", { class: "btn ghost", id: "btn-shuffle" }, "随机来一碗")
            ),
            tag(
              "div",
              { class: "timer-display", id: "timer", hidden: "hidden" },
              tag(
                "div",
                { class: "timer-ring" },
                tag("svg", { viewBox: "0 0 120 120" }, [
                  tag("circle", { class: "ring-bg", cx: "60", cy: "60", r: "54" }),
                  tag("circle", { class: "ring-progress", cx: "60", cy: "60", r: "54", id: "ring-progress" }),
                ].join("")) +
                  tag("span", { class: "timer-text", id: "timer-text" }, "3:00")
              ) + tag("p", { class: "timer-hint" }, "水开了吗？面饼下锅了吗？")
            ),
          ].join("")
        ),
        tag(
          "div",
          { class: "floating-noodles", "aria-hidden": "true" },
          ["🍜", "🥢", "🌶️", "🥚", "🧅"].map((e) => tag("span", null, e)).join("")
        ),
      ].join("")
    ),
    tag(
      "main",
      null,
      [
        tag(
          "section",
          { class: "stats" },
          [
            [47, "品牌收录"],
            [128, "口味图鉴"],
            [3, "分钟幸福"],
            [9999, "深夜治愈值"],
          ]
            .map(
              ([n, label]) =>
                tag("article", null, tag("strong", { "data-count": String(n) }, "0") + tag("span", null, label))
            )
            .join("")
        ),
        tag(
          "section",
          { id: "gallery", class: "section gallery" },
          tag("div", { class: "section-head" }, tag("h2", null, "泡面图鉴") + tag("p", null, "点击卡片查看传说")) +
            tag(
              "div",
              { class: "filters" },
              [
                ["all", "全部", true],
                ["cn", "国产", false],
                ["jp", "日系", false],
                ["kr", "韩式", false],
                ["spicy", "辣味", false],
              ]
                .map(([f, label, on]) =>
                  tag(
                    "button",
                    { class: "filter" + (on ? " active" : ""), "data-filter": f },
                    label
                  )
                )
                .join("")
            ) +
            tag("div", { class: "card-grid", id: "card-grid" })
        ),
        tag(
          "section",
          { id: "brew", class: "section brew" },
          tag("div", { class: "section-head" }, tag("h2", null, "冲泡实验室") + tag("p", null, "拖动滑块调配完美一碗")) +
            tag(
              "div",
              { class: "brew-panel" },
              tag(
                "div",
                { class: "bowl-preview" },
                tag("div", { class: "broth", id: "broth" }) +
                  tag("div", { class: "noodle-strands" }) +
                  tag("div", { class: "toppings", id: "toppings" })
              ) +
                tag(
                  "div",
                  { class: "sliders" },
                  [
                    ["spice", "辣度 🌶️", 30],
                    ["thickness", "浓稠度 🍲", 50],
                    ["topping", "配料 🥚", 60],
                    ["firmness", "硬度 🍜", 40],
                  ]
                    .map(([id, label, val]) =>
                      tag(
                        "label",
                        null,
                        tag("span", null, label) +
                          tag("input", { type: "range", id, min: "0", max: "100", value: String(val) })
                      )
                    )
                    .join("") + tag("p", { class: "brew-result", id: "brew-result" }, "温和豚骨，深夜治愈系")
                )
            )
        ),
        tag("section", { id: "rank", class: "section rank" }, tag("div", { class: "section-head" }, tag("h2", null, "泡面封神榜")) + tag("ol", { class: "rank-list", id: "rank-list" })),
        tag(
          "section",
          { id: "wall", class: "section wall" },
          tag("div", { class: "section-head" }, tag("h2", null, "泡面留言墙")) +
            tag(
              "form",
              { class: "wall-form", id: "wall-form" },
              tag("input", { type: "text", id: "wall-name", placeholder: "昵称", maxlength: "20", required: "required" }) +
                tag("textarea", { id: "wall-msg", placeholder: "那一夜，只有泡面亮着...", maxlength: "200", required: "required" }) +
                tag("button", { type: "submit", class: "btn primary" }, "贴上留言 🍜")
            ) +
            tag("div", { class: "wall-posts", id: "wall-posts" })
        ),
      ].join("")
    ),
    tag("footer", null, tag("p", null, "🍜 泡面宇宙 · 请适量食用") + tag("p", { class: "footer-tip" }, "最佳时间：凌晨 1:47")),
    tag("dialog", { id: "detail-modal" }, tag("article", { id: "modal-content" }) + tag("button", { class: "modal-close", id: "modal-close" }, "×")),
  ].join("");
}

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

function cards() {
  const list =
    filter === "all"
      ? NOODLES
      : filter === "spicy"
        ? NOODLES.filter((n) => n.spicy >= 4)
        : NOODLES.filter((n) => n.region === filter);
  const grid = $("#card-grid");
  grid.innerHTML = list
    .map((n) => {
      const heat = n.tags.join(" · ");
      return (
        tag("article", { class: "noodle-card", "data-id": String(n.id) }) +
        tag("span", { class: "emoji" }, n.emoji) +
        tag("h3", null, n.name) +
        tag("div", { class: "meta" }, `${n.brand} · ${"🌶️".repeat(n.spicy)}`) +
        tag("p", null, n.desc) +
        tag("div", { class: "heat" }, heat) +
        `${LT}${SL}article${GT}`
      );
    })
    .join("");
  $$(".noodle-card").forEach((c) => {
    c.onclick = () => modal(+c.dataset.id);
  });
}

function modal(id) {
  const n = NOODLES.find((x) => x.id === id);
  if (!n) return;
  $("#modal-content").innerHTML =
    tag("span", { class: "emoji" }, n.emoji) +
    tag("h2", null, n.name) +
    tag("p", { class: "meta" }, n.brand) +
    tag("p", null, n.desc) +
    tag("p", null, tag("strong", null, "辣度：") + "🌶️".repeat(n.spicy));
  $("#detail-modal").showModal();
}

function rank() {
  $("#rank-list").innerHTML = RANK.map(
    (r) =>
      tag("li", null, tag("div", { class: "rank-info" }, tag("strong", null, r.name) + tag("span", null, r.note)) + tag("span", { class: "rank-score" }, String(r.score)))
  )
    .join("");
}

function wall(posts) {
  $("#wall-posts").innerHTML = posts
    .slice()
    .reverse()
    .map(
      (p) =>
        tag("div", { class: "wall-post" }, tag("span", { class: "time" }, p.time) + tag("div", { class: "author" }, esc(p.name)) + tag("p", null, esc(p.msg)))
    )
    .join("");
}

function stats() {
  $$(".stats strong").forEach((el) => {
    const target = +el.dataset.count;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1500, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function brewTimer() {
  const timerEl = $("#timer");
  timerEl.hidden = false;
  document.body.classList.add("brewing");
  let remaining = 180;
  const c = 339.292;
  const ring = $("#ring-progress");
  ring.style.strokeDasharray = String(c);
  clearInterval(timer);
  timer = setInterval(() => {
    remaining -= 1;
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    $("#timer-text").textContent = `${m}:${s < 10 ? "0" : ""}${s}`;
    ring.style.strokeDashoffset = String(c * (1 - remaining / 180));
    if (remaining <= 0) {
      clearInterval(timer);
      document.body.classList.remove("brewing");
      toast("🍜 面好了！趁热享用");
      $("#timer-text").textContent = "开动！";
    }
  }, 1000);
  toast("⏱️ 三分钟冲泡开始");
}

function shuffle() {
  const n = NOODLES[Math.floor(Math.random() * NOODLES.length)];
  toast(`推荐：${n.emoji} ${n.name}`);
  modal(n.id);
}

function brew() {
  const spice = +$("#spice").value;
  const thickness = +$("#thickness").value;
  const topping = +$("#topping").value;
  const firmness = +$("#firmness").value;
  const score = Math.round((spice + thickness + topping + (100 - firmness)) / 4);
  const label = BREW.find((x) => score >= x.min && score <= x.max);
  $("#brew-result").textContent = label ? label.t : "";
  $("#broth").style.background = `radial-gradient(circle,rgba(${180 + spice},${120 - spice * 0.5 + thickness * 0.3},60,${0.5 + thickness / 200}) 0%,rgba(80,40,20,.9) 100%)`;
  const items = [];
  if (topping > 20) items.push("🥚");
  if (topping > 45) items.push("🌿");
  if (topping > 65) items.push("🧅");
  if (topping > 80) items.push("🦐");
  if (spice > 60) items.push("🌶️");
  $("#toppings").textContent = items.join("");
  const strands = document.querySelector(".noodle-strands");
  if (strands) {
    strands.style.opacity = String(0.5 + (100 - firmness) / 200);
    strands.style.transform = `rotate(${-5 + firmness / 20}deg)`;
  }
}

function init() {
  injectPage();
  cards();
  rank();
  wall(JSON.parse(localStorage.getItem("paomian-wall") || "null") || DEF_WALL);
  stats();
  brew();
  $$(".filter").forEach((b) => {
    b.onclick = () => {
      $$(".filter").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      filter = b.dataset.filter;
      cards();
    };
  });
  $("#wall-form").onsubmit = (e) => {
    e.preventDefault();
    const name = $("#wall-name").value.trim();
    const msg = $("#wall-msg").value.trim();
    if (!name || !msg) return;
    const posts = JSON.parse(localStorage.getItem("paomian-wall") || "null") || [...DEF_WALL];
    posts.push({ name, msg, time: new Date().toISOString().slice(0, 10) });
    localStorage.setItem("paomian-wall", JSON.stringify(posts));
    wall(posts);
    e.target.reset();
    toast("留言已贴上 🍜");
  };
  $("#btn-brew").onclick = brewTimer;
  $("#btn-shuffle").onclick = shuffle;
  $("#modal-close").onclick = () => $("#detail-modal").close();
  ["#spice", "#thickness", "#topping", "#firmness"].forEach((s) => {
    $(s).oninput = brew;
  });
}

document.addEventListener("DOMContentLoaded", init);
