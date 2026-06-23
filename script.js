const posts = [
  {
    title: "论文工作日志：从数据集选择到第一版 P2P 能源交易实验",
    date: "2026-06-23",
    category: "学习日志",
    excerpt:
      "记录论文从方法设计推进到可运行实验的过程：LCL 与 PVGIS 数据组合、P2P 交易机制、Market Share Pricing、社区储能和第一版结果。",
    content: [
      {
        heading: "论文工作日志：从数据集选择到第一版 P2P 能源交易实验",
        paragraphs: [
          "这段时间，我的硕士论文从“章节规划和文献综述”继续推进到了更具体的实验阶段。",
          "上一篇学习日志主要记录了我如何确定论文方向、整理文献、搭建 Chapter 2 Literature Review 和 Chapter 3 Methodology 的基础框架。这一次，工作的重点进一步转向了三个问题：实验到底用什么数据？P2P 能源交易机制要怎么计算？论文里的方法论和代码实现如何对应起来？",
          "我的论文方向是 P2P Energy Trading Mechanism Design in Distribution Networks。简单来说，就是研究在一个由多个家庭组成的社区中，如果有些家庭能通过光伏发电，有些家庭需要用电，那么它们能否先在社区内部交易电力，再把剩余部分交给外部电网处理。这样做是否能降低成本？储能是否能进一步提高本地消纳？不同定价方式是否会影响每户收益分配？",
          "这次工作的核心，就是把这些问题从概念推进到可运行的第一版实验。",
        ],
      },
      {
        heading: "1. 数据集选择：从理想数据到可执行数据",
        paragraphs: [
          "最开始，我曾考虑使用 Ausgrid Solar Home Electricity Data。它是一个比较适合 P2P energy trading 研究的数据集，因为其中包含家庭级别的用电和屋顶光伏数据，能够直接构造 prosumer community。",
          "但是在后续实际推进中，我选择了另一条更可控的 first-run 路线：Low Carbon London 负荷数据 + PVGIS 光伏模拟数据。",
          "这样做的原因是：Low Carbon London 可以提供家庭半小时用电数据，而 PVGIS 可以根据具体地理位置生成标准化光伏发电曲线。两者结合后，我就能构造出一个小型但清晰的社区实验数据集。",
          "最终的数据逻辑是：用 Low Carbon London 作为 observed household load，也就是家庭实际用电负荷；用 PVGIS 生成 London 地点的 1 kWp 光伏发电曲线；将光伏曲线按不同装机容量分配给部分家庭；构造一个 20 户社区，其中 10 户是 prosumer，10 户是普通 consumer。",
          "这一步的意义在于：数据虽然是 first-run dataset，但它不是随便编造的。负荷来自真实智能电表数据，光伏来自 PVGIS 模型输出，二者组合后可以用于第一版 P2P 交易机制仿真。",
        ],
      },
      {
        heading: "2. PVGIS 光伏数据如何设置",
        paragraphs: [
          "为了让光伏数据和论文实验保持一致，我使用 PVGIS 生成 London 的标准化 PV profile。",
          "关键设置包括：Location = London；Latitude = 51.507；Longitude = -0.128；Database = PVGIS-SARAH3；PV technology = Crystalline Silicon；Installed peak PV power = 1 kWp；System loss = 14%；Slope = 35°；Azimuth = 0°；Year = 2013；Output = hourly CSV。",
          "这里最重要的是 Installed peak PV power = 1 kWp。这样做的好处是，PVGIS 输出的是一个标准化的 1 kWp 光伏系统发电曲线。之后在代码里，可以把它乘以不同家庭的光伏装机容量，例如 2 kWp、3 kWp 或 4 kWp。",
          "PVGIS 文件检查后确认可用：全年记录数为 8760 小时，目标实验周是 2013-07-01 到 2013-07-07，目标周记录数为 168 小时，最大 PV power 为 779.23 W，1 kWp 系统一周近似发电量为 29.354 kWh。",
          "需要注意的是，PVGIS 是小时级数据，而 Low Carbon London 是半小时级负荷数据。因此代码中需要把 hourly PV profile 转换成 half-hourly profile，再与负荷数据对齐。",
        ],
      },
      {
        heading: "3. 构造 first-run community dataset",
        paragraphs: [
          "数据预处理完成后，生成了一个标准化实验输入文件：data/processed/lcl_pvgis_first_run.csv。",
          "这个文件中的每一行表示：某一个家庭，在某一个半小时内，用了多少电，发了多少光伏电，净 surplus/deficit 是多少。",
          "核心字段包括 timestamp、household_id、pv_kwh、load_kwh、pv_capacity_kwp 和 net_kwh。",
          "其中最重要的公式是：<span class=\"formula\">net_kwh = pv_kwh - load_kwh</span>",
          "如果 net_kwh > 0，说明该家庭在这个时间段有多余光伏电，可以作为 seller；如果 net_kwh < 0，说明该家庭在这个时间段需要额外买电，是 buyer；如果 net_kwh = 0，说明该家庭供需刚好平衡，不参与交易。",
          "第一版数据集的验证结果是：households = 20，prosumers = 10，half-hour slots = 336，rows = 6720，missing values = 0，total load = 1268.874 kWh，total PV = 880.610 kWh。",
          "这里的 6720 行来自：<span class=\"formula\">20 户 × 7 天 × 每天 48 个半小时 = 6720</span>",
          "这说明 first-run dataset 已经具备了可运行实验所需的基本结构。",
        ],
      },
      {
        heading: "4. 实验总体思路：比较四类场景",
        paragraphs: [
          "有了数据之后，下一步就是设计 P2P 交易实验。",
          "第一版实验比较四种场景：S0 Grid-only baseline；S1 P2P with SDR pricing, no storage；S2 P2P with Market Share pricing, no storage；S3 P2P with Market Share pricing + community storage。",
          "Grid-only baseline 是对照组：所有家庭都只和外部电网交易。缺电时从电网买，发电多余时卖给电网。",
          "SDR pricing without storage 表示家庭之间可以进行 P2P 交易，价格采用 SDR 方式，但没有社区储能。",
          "Market Share pricing without storage 表示家庭之间可以进行 P2P 交易，价格采用 Market Share pricing，但没有社区储能。",
          "Market Share pricing with community storage 则是在 Market Share pricing 基础上加入社区储能。剩余光伏可以先存入电池，缺电时再由电池供给，最后才和外部电网交易。",
          "这样设计的好处是，论文可以逐步回答三个问题：P2P 交易相比 grid-only 是否能降低社区成本？不同 P2P 定价方式是否会改变收益分配？社区储能是否能进一步降低成本、减少外部电网依赖？",
        ],
      },
      {
        heading: "5. Buyer 和 Seller 如何生成订单",
        paragraphs: [
          "在每个半小时内，系统会根据每户的 net_kwh 判断它是 buyer 还是 seller。",
          "卖方电量：<span class=\"formula\">seller_quantity = max(net_kwh, 0)</span>",
          "买方电量：<span class=\"formula\">buyer_quantity = max(-net_kwh, 0)</span>",
          "举例来说，如果某户家庭在半小时内发电 1.5 kWh，用电 1.0 kWh，那么 net_kwh = 1.5 - 1.0 = 0.5，它就是 seller，可以卖出 0.5 kWh。",
          "如果另一户家庭发电 0 kWh，用电 0.8 kWh，那么 net_kwh = 0 - 0.8 = -0.8，它就是 buyer，需要购买 0.8 kWh。",
          "这一步把原始数据转化成了交易订单。",
        ],
      },
      {
        heading: "6. Market Share Pricing 的基本思路",
        paragraphs: [
          "Market Share Pricing 的核心思想是：不同买方和卖方在市场中的交易量占比不同，因此它们的报价也应该受到市场份额影响。",
          "买方市场份额：<span class=\"formula\">MS_b(n,t) = E_b(n,t) / sum(E_b(n,t))</span>",
          "卖方市场份额：<span class=\"formula\">MS_s(n,t) = E_s(n,t) / sum(E_s(n,t))</span>",
          "其中 E_b(n,t) 表示第 n 个 buyer 在 t 时段的购电需求，E_s(n,t) 表示第 n 个 seller 在 t 时段的售电量。",
          "例如某个时段社区总购电需求是 10 kWh，其中一个 buyer 需要 2 kWh，那么它的买方市场份额就是 MS_b = 2 / 10 = 0.2。这意味着它占这个时段总需求的 20%。",
        ],
      },
      {
        heading: "7. 报价公式如何设计",
        paragraphs: [
          "第一版实验中设定峰谷价格：P1 = peak price，P2 = valley price。同时设定用户偏好参数 u(n,t)，其中 0 <= u <= 1。第一版先使用统一值 u = 0.5。",
          "偏好调整量：<span class=\"formula\">ΔP(n,t) = u(n,t) × (P1 - P2)</span>",
          "买方基础报价：<span class=\"formula\">Pb(n,t) = P2 + ΔP(n,t)</span>",
          "卖方基础报价：<span class=\"formula\">Ps(n,t) = P1 - ΔP(n,t)</span>",
          "在此基础上，再用 Market Share 调整报价。",
          "买方报价：<span class=\"formula\">buyer_quote(n,t) = Pb(n,t) + [P1 - Pb(n,t)] × MS_b(n,t)</span>",
          "卖方报价：<span class=\"formula\">seller_quote(n,t) = Ps(n,t) - [Ps(n,t) - P2] × MS_s(n,t)</span>",
          "用更直观的话说：买方需求占比越高，它的报价会更接近较高价格；卖方供给占比越高，它的报价会更接近较低价格；这样设计的目的是让交易价格反映用户在当前时段的市场影响力。",
          "目前这还是 first-run implementation，后续正式写论文前，还需要继续和参考论文中的 Market Share 公式逐项校准。",
        ],
      },
      {
        heading: "8. 订单如何撮合",
        paragraphs: [
          "有了 buyer quote 和 seller quote 之后，就可以进行撮合。",
          "基本规则是：买方按报价从高到低排序，卖方按报价从低到高排序。",
          "如果 <span class=\"formula\">buyer_quote >= seller_quote</span>，则双方可以成交。",
          "成交电量：<span class=\"formula\">trade_quantity = min(buyer_remaining, seller_remaining)</span>",
          "成交价格：<span class=\"formula\">trade_price = (buyer_quote + seller_quote) / 2</span>",
          "也就是说，如果买方愿意支付的价格不低于卖方愿意接受的价格，那么交易成立，成交价取双方报价的平均值。",
        ],
      },
      {
        heading: "9. 剩余电量如何处理",
        paragraphs: [
          "撮合结束后，可能仍然有一部分电没有在社区内部完成交易。",
          "对于买方，剩余缺口需要从外部电网购买：<span class=\"formula\">grid_import_cost = remaining_buy_kwh × grid_import_price(t)</span>",
          "对于卖方，剩余光伏可以卖给电网：<span class=\"formula\">grid_export_revenue = remaining_sell_kwh × export_price</span>",
          "如果场景中包含社区储能，则会优先让剩余电量和电池交互。",
          "当社区有剩余光伏时，电池充电：<span class=\"formula\">battery_charge = min(remaining_surplus, capacity - SOC)</span>",
          "当社区有缺电时，电池放电：<span class=\"formula\">battery_discharge = min(remaining_deficit, SOC - SOC_min)</span>",
          "储能处理之后仍然无法平衡的部分，才继续和外部电网交易。",
        ],
      },
      {
        heading: "10. 成本与评价指标",
        paragraphs: [
          "每个家庭的最终成本可以概括为：<span class=\"formula\">cost_n = grid_import_payment + p2p_buy_payment + storage_buy_payment - p2p_sell_revenue - storage_sell_revenue - grid_export_revenue</span>",
          "社区总成本：<span class=\"formula\">community_cost = sum(cost_n)</span>",
          "相对 grid-only 的节省率：<span class=\"formula\">saving_rate = (grid_only_cost - scenario_cost) / grid_only_cost</span>",
          "除了成本之外，后续还会关注 total P2P traded energy、grid import、grid export、local PV utilisation、household-level cost saving、fairness index 和 battery SOC trajectory。",
          "公平性可以用 Jain’s fairness index 衡量：<span class=\"formula\">J = (sum(x_n))^2 / (N × sum(x_n^2))</span>",
          "其中 x_n 可以表示每户家庭的 cost saving。这个指标越接近 1，说明收益分配越均衡。",
        ],
      },
      {
        heading: "11. 第一版实验结果",
        paragraphs: [
          "目前 first-run scenario settlement 已经跑通，并生成了四类输出表：scenario_summary.csv、household_costs.csv、interval_metrics.csv 和 trades.csv。",
          "第一版结果摘要如下：grid_only total cost = 515.174；sdr_no_storage total cost = 392.278，saving = 23.855%；market_share_no_storage total cost = 392.278，saving = 23.855%；market_share_storage total cost = 381.940，saving = 25.862%。",
          "从结果可以初步看出：P2P 交易相比 grid-only 明显降低了社区总成本；加入社区储能后，总成本进一步下降；SDR 和 Market Share 在社区总成本上暂时相同，这是合理现象，因为 P2P 内部付款在 community-level 会互相抵消。",
          "因此，SDR 和 Market Share 的真正差异，后续应重点体现在 household-level cost distribution 和 fairness index 上。",
          "所以，第一版实验结果更适合用于确认流程和搭建 Chapter 4 结构。正式写入论文前，还需要继续校准 Market Share 公式，并增加 sensitivity analysis，例如不同 PV penetration、不同 storage size、不同价格参数下的结果变化。",
        ],
      },
      {
        heading: "12. 这次工作的阶段性意义",
        paragraphs: [
          "这次工作最大的进展，是论文从“方法设计”进一步变成了“可运行实验”。",
          "现在已经完成了：数据源确认；LCL 负荷与 PVGIS 光伏数据对齐；20 户、7 天、半小时粒度 first-run dataset；buyer/seller 判断逻辑；SDR 与 Market Share pricing 场景；community storage 场景；成本、节省率、交易量和公平性指标的初步框架；第一版可运行实验结果。",
          "这意味着后续 Chapter 3 Methodology 和 Chapter 4 Experiments 已经有了比较扎实的基础。",
          "下一步最重要的工作包括：校准 Market Share Pricing 公式，尽量贴近参考论文；增加 sensitivity analysis；检查每户家庭成本分布与公平性结果；将实验逻辑整理成正式 Methodology 文字；将 first-run results 扩展成论文中的图表和分析段落。",
          "这段工作的收获是：实验不是等论文写完之后才开始的附属部分。相反，它会反过来帮助我理解论文到底在回答什么问题。",
          "当数据、公式、代码和结果开始连在一起时，论文才真正从一个题目变成一个研究项目。",
        ],
      },
    ],
  },
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
      (post) => `
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
