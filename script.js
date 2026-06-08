const posts = [
  {
    title: "为什么我要重新开始写博客",
    date: "2026-06-08",
    category: "写作",
    excerpt:
      "写作不只是输出，也是整理自己。第一篇文章先记录这个博客的起点和我希望坚持下去的理由。",
  },
  {
    title: "我的数字工具箱",
    date: "2026-06-08",
    category: "技术",
    excerpt:
      "从编辑器、笔记软件到自动化流程，梳理那些真正帮我省下注意力的工具。",
  },
  {
    title: "给日常留一点空白",
    date: "2026-06-08",
    category: "生活",
    excerpt:
      "很多答案不会在紧绷的时候出现。留白不是偷懒，而是让想法有机会浮上来。",
  },
];

const postGrid = document.querySelector("#postGrid");
const tagButtons = document.querySelectorAll("[data-filter]");
const year = document.querySelector("#year");

function renderPosts(filter = "全部") {
  const visiblePosts =
    filter === "全部" ? posts : posts.filter((post) => post.category === filter);

  postGrid.innerHTML = visiblePosts
    .map(
      (post) => `
        <article class="post-card">
          <div class="post-meta">
            <span class="post-category">${post.category}</span>
            <span>${post.date}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <a class="read-link" href="#" aria-label="阅读文章：${post.title}">阅读全文</a>
        </article>
      `,
    )
    .join("");
}

tagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    tagButtons.forEach((item) => item.classList.remove("is-active"));
    document
      .querySelectorAll(`[data-filter="${filter}"]`)
      .forEach((item) => item.classList.add("is-active"));
    renderPosts(filter);
  });
});

document.querySelector(".subscribe-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  if (!input.value) {
    input.focus();
    return;
  }
  event.currentTarget.reset();
  alert("已记录订阅入口。之后可以接入真实邮件服务。");
});

year.textContent = new Date().getFullYear();
renderPosts();
