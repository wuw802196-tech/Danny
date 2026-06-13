const posts = [
  {
    title: "一日论文写作复盘：从选题规划到研究系统搭建",
    date: "2026-06-13",
    category: "学习日志",
    excerpt:
      "记录我围绕 MSc 论文完成的一轮系统推进：从研究范围、文献证据地图，到 Chapter 2 草稿、Chapter 3 方法蓝图和代码框架。",
    content: [
      {
        heading: "一日论文写作复盘：从选题规划到研究系统搭建",
        paragraphs: [
          "今天主要围绕我的硕士论文推进了一轮系统性的整理和写作。",
          "我的论文方向是 P2P Energy Trading Mechanism Design in Distribution Networks。一开始，这个题目对我来说仍然比较宽泛：它涉及 P2P 能源交易、机制设计、分布式光伏、储能、配电网、真实数据集和仿真实验。如果没有清晰边界，很容易在文献、方法和代码之间反复摇摆。",
          "因此，今天最重要的收获不是单独写出了某一段文字，而是把论文从一个模糊的大方向，逐步拆解成了可以执行、可以验证、可以继续推进的研究系统。",
        ],
      },
      {
        heading: "1. 明确论文范围：选择稳妥复现型路线",
        paragraphs: [
          "今天首先完成的是论文范围的重新确认。",
          "在参考老师给出的论文后，我将自己的研究路线确定为稳妥复现型：以参考论文中的 P2P 交易机制和 Market Share Pricing 思路为基础，先完成可复现的仿真实验，再在此基础上使用公开真实数据集进行扩展分析。",
          "这个选择避免了论文范围过大。相比直接加入复杂的配电网潮流计算或重新设计优化算法，稳妥复现型路线更适合当前硕士论文阶段：它更容易完成，也更容易形成清晰的实验结果。",
          "目前论文的核心思路可以概括为：复现已有 P2P 能源交易机制，使用真实家庭光伏与负荷数据进行仿真，并通过成本、储能、用户公平性和电网交互等指标分析机制表现。",
        ],
      },
      {
        heading: "2. 搭建论文规划文件，让想法变成可管理的任务",
        paragraphs: [
          "今天建立了一组论文规划文件，包括 project-overview.md、outline.md、chapter-architecture.md、experiment-protocol.md 和 progress.md。",
          "这些文件分别记录论文整体目标、章节结构、实验路线、数据与方法设计，以及每日推进记录。",
          "这一部分让我意识到，论文写作不能只依赖临时想法。尤其是硕士论文这种长周期写作，需要把研究计划、章节任务和实验流程都固定在文件中，方便后续不断回看和调整。",
          "这样做的好处是：后续写 Chapter 2、Chapter 3 或实验代码时，不需要每次从头思考“我到底要做什么”，而是可以沿着已有规划继续推进。",
        ],
      },
      {
        heading: "3. 整理参考文献：从收集论文到建立证据地图",
        paragraphs: [
          "我之前已经收集了一批相关参考文献。今天将工作区中的 20 篇 PDF 进行了初步整理，并生成了 literature-inventory.md 和 evidence-map.md。",
          "其中，literature-inventory.md 用来记录每篇文献的大致主题和用途；evidence-map.md 则进一步说明每篇文献可以支撑论文中的哪些论点，以及适合放在哪个章节。",
          "这是今天很重要的一个学习点：文献不是简单堆积，而是用来支撑论点的证据。",
          "以前整理文献时，我更容易停留在“这篇论文看起来相关”的层面。但真正写 Literature Review 时，需要回答更具体的问题：这篇文献支持什么观点？它证明了什么背景？它和我的研究空白有什么关系？它应该出现在 Introduction，还是 Literature Review，还是 Methodology 的 justification 中？",
          "通过 evidence map，我开始把文献从资料库转化成论证材料。",
        ],
      },
      {
        heading: "4. 推进 Chapter 2 Literature Review 第一版草稿",
        paragraphs: [
          "在文献整理的基础上，今天完成了 Chapter 2 Literature Review 的结构设计和第一版英文草稿。",
          "目前 Chapter 2 采用六节结构：Overview of P2P Energy Trading；P2P Trading in Community Microgrids and PV Prosumer Systems；Pricing and Market-Clearing Mechanisms；Energy Storage and Demand-Side Flexibility；Distribution Network, Network Fees, and Platform Constraints；Research Gap and Position of This Dissertation。",
          "这一结构的好处是，它不是按论文逐篇介绍，而是按主题组织文献。这样 Literature Review 会更接近真正的综述，而不是 annotated bibliography。",
          "目前已形成文件 chapters/02_Literature_Review.md。当前总词数约 3,309 words，其中包含一个中文阅读导览。英文正文仍然需要后续继续扩充、核查引用和润色，但它已经是一版可以继续修改的草稿。",
          "今天也对工具使用有了更清楚的认识。原本考虑使用 nature-reader 做中英文对照，但后来发现它更适合精读已有论文，而不是生成新的论文章节。因此最终采用英文正文为主、中文导览辅助理解的方式。",
        ],
      },
      {
        heading: "5. 确认数据来源：Ausgrid 作为主数据集",
        paragraphs: [
          "今天还对论文的数据来源进行了核查。",
          "目前较适合的主数据集是 Ausgrid Solar Home Electricity Data。它来自澳大利亚政府数据目录 data.gov.au，原始来源为 Ausgrid，包含约 300 户带屋顶光伏家庭的用电与发电数据，时间粒度为 30 分钟，覆盖 2010-07-01 至 2013-06-30。",
          "这个数据集并不是完美的。它的数据地点是澳大利亚 NSW，不是香港本地；时间也相对较早。但它的优势在于，它是真实家庭光伏与负荷数据，适合构造 prosumer community，用于 P2P energy trading 的复现实验和扩展分析。",
          "因此，目前可以将它作为论文的主数据集，同时在论文限制部分说明其地域和时间局限。",
        ],
      },
      {
        heading: "6. 规划 Chapter 3 Methodology 和实验代码框架",
        paragraphs: [
          "今天还开始推进 Chapter 3 Methodology。目前已经建立了方法章蓝图 plan/chapter-blueprints/03_Methodology-blueprint.md。",
          "其中包括 prosumer energy balance、buyer/seller classification、grid-only baseline、SDR pricing、Market Share pricing、order matching、community battery settlement、cost metrics、fairness metrics 和 implementation workflow。",
          "同时也搭建了初步 Python 代码框架，包括 src/p2p_energy/data/、src/p2p_energy/market/、src/p2p_energy/storage/、src/p2p_energy/metrics/、src/p2p_energy/experiments/ 和 config/default.yaml。",
          "这一步的意义在于，论文的方法设计和未来代码实现开始对齐。也就是说，Chapter 3 里描述的内容不只是文字，而是可以在代码框架中找到对应模块。",
          "目前还有一个技术限制：当前环境中的 Python 运行环境尚未配置好，因此暂时还不能进行代码编译检查。下一步需要配置可用 Python 环境，再下载和检查 Ausgrid 数据文件，继续实现真实数据读取与仿真实验。",
        ],
      },
      {
        heading: "7. 今天学到的几个论文写作方法",
        paragraphs: [
          "控制研究范围：硕士论文需要选择可完成、可验证、可解释的路线。范围过大反而会降低完成质量。",
          "先做 evidence map，再写 Literature Review：写综述之前，需要先明确每篇文献支撑什么论点，避免文献综述变成逐篇论文罗列。",
          "先设计章节蓝图，再写正文：Chapter blueprint 可以帮助控制章节逻辑，让正文围绕研究问题展开，而不是边写边找方向。",
          "让方法、实验和代码相互对应：Methodology 不能只是概念描述，最好能和实验协议、代码模块、评价指标形成对应关系。",
          "根据任务选择合适的写作工具：research-writing 更适合论文规划、章节结构和写作流程管理；nature-reader 更适合论文精读和中英文理解辅助。工具本身不是重点，关键是知道它们各自适合解决什么问题。",
        ],
      },
      {
        heading: "结语",
        paragraphs: [
          "今天的工作让我对论文有了更清晰的掌控感。",
          "在这一天里，我完成了从选题范围确认、文献整理、证据地图搭建，到 Chapter 2 草稿写作、Chapter 3 方法规划和实验代码框架搭建的一整轮推进。",
          "论文还远没有完成，但它已经不再只是一个模糊的题目。现在，它开始变成一个由章节、文献、数据、方法、实验和代码共同组成的研究项目。",
          "接下来最重要的任务，是配置 Python 环境，下载并检查 Ausgrid 数据集，然后继续推进真实数据处理和仿真实验实现。",
        ],
      },
    ],
  },
  {
    title: "为什么我要重新开始写博客",
    date: "2026-06-08",
    category: "写作",
    excerpt:
      "写作不只是输出，也是整理自己。第一篇文章先记录这个博客的起点和我希望坚持下去的理由。",
    content: [
      {
        heading: "为什么我要重新开始写博客",
        paragraphs: [
          "写作不只是输出，也是整理自己。",
          "这个博客会先从简短记录开始，慢慢积累成一个属于自己的学习和生活档案。",
        ],
      },
    ],
  },
  {
    title: "我的数字工具箱",
    date: "2026-06-08",
    category: "技术",
    excerpt:
      "从编辑器、笔记软件到自动化流程，梳理那些真正帮我省下注意力的工具。",
    content: [
      {
        heading: "我的数字工具箱",
        paragraphs: [
          "工具的意义不在于堆满屏幕，而在于减少重复劳动，把注意力留给真正需要思考的事情。",
        ],
      },
    ],
  },
  {
    title: "给日常留一点空白",
    date: "2026-06-08",
    category: "生活",
    excerpt:
      "很多答案不会在紧绷的时候出现。留白不是偷懒，而是让想法有机会浮上来。",
    content: [
      {
        heading: "给日常留一点空白",
        paragraphs: [
          "很多答案不会在紧绷的时候出现。留白不是偷懒，而是让想法有机会浮上来。",
        ],
      },
    ],
  },
];

const postGrid = document.querySelector("#postGrid");
const tagButtons = document.querySelectorAll("[data-filter]");
const year = document.querySelector("#year");
const articleReader = document.querySelector("#articleReader");
const articleContent = document.querySelector("#articleContent");
const closeArticle = document.querySelector("#closeArticle");

function renderPosts(filter = "全部") {
  const visiblePosts =
    filter === "全部" ? posts : posts.filter((post) => post.category === filter);

  postGrid.innerHTML = visiblePosts
    .map(
      (post, index) => `
        <article class="post-card">
          <div class="post-meta">
            <span class="post-category">${post.category}</span>
            <span>${post.date}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <button class="read-link" type="button" data-post-index="${posts.indexOf(post)}" aria-label="阅读文章：${post.title}">阅读全文</button>
        </article>
      `,
    )
    .join("");
}

function openArticle(postIndex) {
  const post = posts[Number(postIndex)];
  if (!post) return;

  articleContent.innerHTML = `
    <div class="article-meta">
      <span>${post.category}</span>
      <span>${post.date}</span>
    </div>
    ${post.content
      .map(
        (section, sectionIndex) => `
          <section class="article-section">
            ${sectionIndex === 0 ? `<h1>${section.heading}</h1>` : `<h2>${section.heading}</h2>`}
            ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          </section>
        `,
      )
      .join("")}
  `;
  articleReader.hidden = false;
  articleReader.scrollIntoView({ behavior: "smooth", block: "start" });
}

postGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-post-index]");
  if (!button) return;
  openArticle(button.dataset.postIndex);
});

closeArticle.addEventListener("click", () => {
  articleReader.hidden = true;
  articleContent.innerHTML = "";
  document.querySelector("#posts").scrollIntoView({ behavior: "smooth", block: "start" });
});

tagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    tagButtons.forEach((item) => item.classList.remove("is-active"));
    document
      .querySelectorAll(`[data-filter="${filter}"]`)
      .forEach((item) => item.classList.add("is-active"));
    articleReader.hidden = true;
    articleContent.innerHTML = "";
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
