const posts = [
  {
    title: "如何建立持续学习习惯",
    date: "2026-02-01",
    readTime: "5 分钟",
    summary: "拆解一个可执行的学习系统：输入、输出与复盘。",
    tags: ["成长", "学习方法"],
  },
  {
    title: "从零搭建个人博客的最小方案",
    date: "2026-01-22",
    readTime: "8 分钟",
    summary: "不依赖框架，使用 HTML/CSS/JS 快速上线个人博客。",
    tags: ["前端", "博客"],
  },
  {
    title: "我常用的效率工具清单",
    date: "2025-12-14",
    readTime: "4 分钟",
    summary: "记录我在写作、任务管理与时间规划中的常用工具。",
    tags: ["效率", "工具"],
  },
  {
    title: "写作不是灵感，是流程",
    date: "2025-11-30",
    readTime: "6 分钟",
    summary: "从选题库到初稿、编辑到发布，分享我的写作流程。",
    tags: ["写作", "思考"],
  },
];

const postList = document.querySelector("#postList");
const postTemplate = document.querySelector("#postTemplate");
const searchInput = document.querySelector("#searchInput");
const themeButton = document.querySelector("#themeButton");

function createPostCard(post) {
  const node = postTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector(".post-date").textContent = post.date;
  node.querySelector(".post-read-time").textContent = post.readTime;
  node.querySelector(".post-title").textContent = post.title;
  node.querySelector(".post-summary").textContent = post.summary;

  const tags = node.querySelector(".post-tags");
  post.tags.forEach((tag) => {
    const el = document.createElement("span");
    el.className = "tag";
    el.textContent = `#${tag}`;
    tags.appendChild(el);
  });

  return node;
}

function renderPosts(keyword = "") {
  const query = keyword.trim().toLowerCase();
  const filtered = posts.filter((post) => {
    const haystack = `${post.title} ${post.tags.join(" ")}`.toLowerCase();
    return haystack.includes(query);
  });

  postList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "没有找到相关文章，试试其他关键词。";
    postList.appendChild(empty);
    return;
  }

  filtered.forEach((post) => postList.appendChild(createPostCard(post)));
}

function setTheme(mode) {
  const isDark = mode === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  themeButton.textContent = isDark ? "☀️ 日间模式" : "🌙 夜间模式";
  localStorage.setItem("theme", mode);
}

searchInput.addEventListener("input", (event) => {
  renderPosts(event.target.value);
});

themeButton.addEventListener("click", () => {
  const dark = document.documentElement.classList.contains("dark");
  setTheme(dark ? "light" : "dark");
});

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme || "light");
renderPosts();
document.querySelector("#year").textContent = new Date().getFullYear();
