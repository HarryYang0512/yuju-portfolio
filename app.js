'use strict';
const caseStudies = {
  rag: {
    en: {
      category: 'EVALUATION & FAILURE ANALYSIS', title: 'Find the real failure.',
      deck: 'Quality analysis and failure attribution for a banking RAG question-answering system.',
      role: 'Designed and implemented the feedback-labeling pipeline and four-stage LLM analyzer.',
      stack: 'Python · pandas · on-premise LLM · RAG evaluation · structured prompts',
      sections: [
        ['The problem', '<p>Negative feedback tells you that an answer failed. It does not tell you whether the question, retrieved material, refusal behavior, or generated answer caused the failure. Treating every issue as a generation problem can send engineering effort to the wrong place.</p><p>The work connected two paths: automated screening of production feedback, then a more precise analyzer using evaluation data with known source documents.</p>'],
        ['The decision', '<p>Separate the judgment into four stages. Each stage receives only the context it needs, returns a structured result, and stops the chain when it identifies a failure.</p><div class="case-flow">Query quality → Retrieval quality → Refusal check → Generation quality</div><p>Compare the expected source document with the retrieved documents and chunks. A missing document calls for retrieval work; a retrieved document with no answer-bearing passage calls for chunking and Top-K investigation.</p>'],
        ['What I built', '<ul><li>Automated business-domain classification and failure labels for 4,400+ negative feedback records.</li><li>A rules-based classifier with seven priority tiers, 15 domains, and 80+ subcategories, compared against an LLM classifier.</li><li>Checkpointing, incremental output, exponential-backoff retries, JSON recovery, and structured analysis reports.</li><li>A failure taxonomy that maps each label to a concrete action: improve retrieval, revise chunking, maintain content, or adjust a prompt.</li></ul>'],
        ['What the evidence showed', '<p>In a 16-record pilot, retrieval received 6.25% of failure attribution in the single-stage analysis and 43.75% in the multi-stage analysis. The change exposed a potential retrieval bottleneck that the combined judgment had obscured.</p><div class="case-evidence"><div><strong>4,400+</strong><span>Production feedback records classified and labeled</span></div><div><strong>50 / 64</strong><span>Actual versus full-chain API calls in the 16-record pilot</span></div></div><p class="case-note">The attribution comparison is a small pilot, not an accuracy benchmark. Early stopping reduced calls by about 22% in that pilot. The change from roughly three days of manual screening to a batch run plus half a day of calibration is an effort estimate, not a timed measurement.</p>'],
        ['The lesson', '<p>The LLM classifier did not outperform the rules engine. That result supported keeping rules for initial screening and using model-generated reasons to aid human review. More sophisticated modeling is useful only when the evidence supports it.</p><p>A larger, human-labeled evaluation set is the next step for measuring agreement and validating the attribution method.</p>']
      ]
    },
    zh: {
      category: '評測與失效分析', title: '找出問題，改善才有方向。',
      deck: '銀行 RAG 智能問答系統的品質分析與失效歸因框架。',
      role: '負責正式環境回饋的分類與標註流程，並設計、實作四階段 LLM 失效分析器。',
      stack: 'Python · pandas · 地端 LLM · RAG 評測 · 結構化 Prompt',
      sections: [
        ['問題背景', '<p>負面回饋只能告訴我們「回答不好」，卻無法直接指出問題來自提問、檢索、拒答策略或生成內容。如果把所有錯誤都歸於生成層，就可能把工程資源投入錯誤的改善方向。</p><p>這個專案串起兩條路徑：先自動初篩正式環境的使用者回饋，再以已知標準文件的評測資料，建立更精確的歸因流程。</p>'],
        ['關鍵決策', '<p>將判斷拆成四個獨立階段，每階段只取得該層所需的資訊，輸出結構化結果，並在找到失效原因時提早停止。</p><div class="case-flow">問題品質 → 檢索品質 → 拒答檢查 → 生成品質</div><p>比對標準答案所屬文件、實際召回文件及段落內容。「未召回正確文件」應改善檢索；「召回文件但段落缺少答案」則應檢查 Chunking 與 Top-K。</p>'],
        ['實作內容', '<ul><li>自動處理 4,400+ 筆不滿意回饋的業務場景分類與失效標註。</li><li>建立七層優先序、15 類業務場景及 80+ 問題面向的規則引擎，並與 LLM 分類器對照。</li><li>加入斷點續跑、批次落檔、指數退避重試、JSON 修復及結構化分析報告。</li><li>讓每個失效標籤都能指向具體改善動作，包括檢索優化、切塊調整、內容維護或 Prompt 修改。</li></ul>'],
        ['驗證結果', '<p>在同一組 16 筆先導樣本中，單階段分析將 6.25% 的失效歸於檢索層；多階段分析則為 43.75%。這個差異揭露了混合判斷可能掩蓋的檢索瓶頸。</p><div class="case-evidence"><div><strong>4,400+</strong><span>筆使用者回饋完成分類與標註</span></div><div><strong>50 / 64</strong><span>16 筆樣本的實際 API 呼叫數／全階段呼叫數</span></div></div><p class="case-note">歸因對照僅為小樣本先導驗證，並非準確率基準。在該樣本中，早停約減少 22% 的 API 呼叫。人工初篩從約三天變為批次執行加半天校準，屬經驗工時估算，非計時量測。</p>'],
        ['工程啟示', '<p>LLM 分類器並未優於規則引擎，因此保留規則作為初篩主路徑，讓 LLM 的判斷理由協助人工覆核。是否採用更複雜的模型，應由證據決定。</p><p>下一步是建立更大的人工標註資料集，量測一致率，進一步驗證歸因方法。</p>']
      ]
    }
  },
  api: {
    en: {
      category: 'API ENGINEERING & DEPLOYMENT', title: 'Answers. By design.',
      deck: 'A retrieval-only customer-service API for a bank-merger customer-rights information service.',
      role: 'End-to-end ownership: API design and development, container deployment, evaluation, and load testing.',
      stack: 'Python · FastAPI · asyncio / aiohttp · Docker / Compose · Nginx · TLS',
      sections: [
        ['The problem', '<p>Merger-related questions needed consistent answers grounded in approved customer-facing material. Free-form generation would make it harder to trace each response back to that approved wording.</p>'],
        ['The decision', '<p>Use retrieval and a confidence router, returning approved knowledge verbatim. Four score bands turn uncertainty into an explicit product behavior.</p><div class="case-flow">High confidence → Approved answer<br>Medium confidence → Suggested questions<br>Low confidence → Ask to rephrase<br>Out of scope → Redirect to existing service</div><p>The intermediate suggestion path offers candidate questions instead of forcing a potentially incorrect answer. This avoids generated paraphrases, but retrieval and routing can still make mistakes, so evaluation remains essential.</p>'],
        ['What I built', '<ul><li>An asynchronous FastAPI router with a shared aiohttp connection pool managed through application lifespan.</li><li>Consistent JSON error responses, semantic error categories, configurable thresholds, and auditable decision logs.</li><li>Docker deployment with Nginx TLS termination and internal CA certificate verification.</li><li>Repeatable black-box evaluation against the deployed API and segmented load tests to distinguish router work from downstream retrieval latency.</li></ul>'],
        ['Evaluation', '<p>On the 100-question business acceptance set, enabling the reranker increased directly correct answers from 40% to 72%. Later threshold tuning reached 76% directly correct and 6% successful candidate-list responses.</p><div class="case-evidence"><div><strong>40% → 72%</strong><span>Directly correct answers before and after enabling the reranker</span></div><div><strong>76%</strong><span>Directly correct after further threshold tuning</span></div></div><p class="case-note">These results describe the supplied 100-question acceptance set, not a general accuracy guarantee. Direct answers and candidate-list hits are separate outcomes. Final tuning favored safer fallback behavior over maximizing the combined response rate.</p>'],
        ['Capacity, not guesswork', '<p>Load testing located the saturation point near five concurrent requests, at roughly 12.5 successful requests per second. Ten concurrent requests remained within the tested P95 &lt; 1 second target; higher concurrency increased latency without improving throughput.</p><p>Segment timing showed that the router’s own processing was a small fraction of end-to-end latency. The evidence directed optimization toward the downstream retrieval service.</p><p class="case-note">Capacity figures describe the tested deployment and workload. They are not a universal throughput claim.</p>']
      ]
    },
    zh: {
      category: 'API 工程與部署', title: '每次回覆，都有依據。',
      deck: '為雙銀合併客戶權益專區打造檢索式智能客服 API。',
      role: '獨立負責 API 設計、開發、容器部署、準確率評測與容量壓力測試。',
      stack: 'Python · FastAPI · asyncio / aiohttp · Docker / Compose · Nginx · TLS',
      sections: [
        ['問題背景', '<p>銀行合併相關問題需要一致且有核可依據的回答。若採自由生成或改寫，就難以逐字對應已審核的對客文案。</p>'],
        ['關鍵決策', '<p>採用檢索加信心分數路由，直接回傳核可知識原文。以四段分數將不確定性轉為明確的產品行為。</p><div class="case-flow">高信心 → 核可原文答案<br>中信心 → 推薦候選問題<br>低信心 → 請使用者重新描述<br>超出範圍 → 導向既有客服</div><p>中間的推薦路徑提供候選問題，避免強行給出不確定的答案。這能避免生成式改寫，但檢索和路由仍可能出錯，因此評測不可省略。</p>'],
        ['實作內容', '<ul><li>以 FastAPI 與 aiohttp 實作非同步路由，透過 lifespan 管理共用連線池。</li><li>統一 JSON 錯誤回覆、語意化錯誤分類、外部化門檻參數與可追溯決策日誌。</li><li>透過 Docker 與 Nginx 部署，使用 TLS termination 及內部 CA 憑證驗證。</li><li>直接對部署後 API 執行可重複的黑箱評測，並以分段壓測區分路由層處理與下游檢索等待時間。</li></ul>'],
        ['評測結果', '<p>在業務單位提供的 100 題驗收題組中，啟用 reranker 後，直接答對率由 40% 提升至 72%。後續門檻調校達到 76% 直接答對，另有 6% 推薦清單命中。</p><div class="case-evidence"><div><strong>40% → 72%</strong><span>啟用 reranker 前後的直接答對率</span></div><div><strong>76%</strong><span>進一步調校門檻後的直接答對率</span></div></div><p class="case-note">以上結果僅描述 100 題驗收題組，不代表所有情境的準確率保證。直接答對與推薦清單命中是不同結果。最終調校優先選擇安全的 fallback 行為，而非單純追求合併命中率。</p>'],
        ['以量測決定容量', '<p>壓測顯示飽和點約在併發五個請求，吞吐量約每秒 12.5 個成功請求。併發十個請求仍符合測試設定的 P95 小於一秒目標；繼續提高併發只會增加延遲，沒有提升吞吐量。</p><p>分段計時顯示，路由層自身處理僅占端到端延遲的一小部分，讓後續優化資源能正確投向下游檢索服務。</p><p class="case-note">容量數字僅適用於該次部署環境與測試工作負載，不是通用吞吐量保證。</p>']
      ]
    }
  },
  sdk: {
    en: {
      category: 'DEVELOPER TOOLING & GOVERNANCE', title: 'Prompts. With history.',
      deck: 'A PostgreSQL-backed Python SDK for centralized prompt management and explicit version selection.',
      role: 'Owned data models, CRUD semantics, version rules, packaging, and the public SDK API. A collaborator owned database operations and the Gradio admin UI.',
      stack: 'Python · PostgreSQL · psycopg 3 · JSONB · dataclasses · uv · wheel',
      sections: [
        ['The problem', '<p>Prompts embedded in application code become difficult to audit and reuse across projects. Editing a shared prompt can also change runtime behavior unexpectedly if applications always fetch the latest content.</p>'],
        ['The decision', '<p>Store structured role/content messages as JSONB and create a new row for every version update. Applications explicitly choose which version to read.</p><div class="case-flow">Read existing version → Increment version → Insert new row → Preserve history</div><p>The initial in-place update was replaced with append-only semantics. Existing versions remain available for comparison and rollback. A version-pinned application changes only when its caller chooses to adopt another version.</p>'],
        ['What I built', '<ul><li>Separate input and persisted data models, making system-generated identity explicit.</li><li>Parameterized SQL and public functions for creation, retrieval, version updates, and deletion.</li><li>Centralized logging for developer feedback and deeper investigation.</li><li>A wheel package for team installation, with a stable public interface shared by applications and the collaborator’s admin UI.</li></ul>'],
        ['Applied across projects', '<p>The SDK served 8+ internal projects, including customer-service agents, knowledge-management analysis, and LLM-as-a-Judge evaluation prompts.</p><div class="case-evidence"><div><strong>8+</strong><span>Internal projects using the shared SDK</span></div><div><strong>Version-pinned</strong><span>Explicit reads preserve reproducible prompt selection</span></div></div><p>Versioning judge prompts matters as much as versioning application prompts: an unrecorded evaluator change can undermine comparison between evaluation runs.</p>'],
        ['Boundaries & next steps', '<p>My ownership was the SDK and its data contracts. Database provisioning and operations, plus the Gradio management interface, belonged to my collaborator.</p><p>Further hardening includes environment-injected connection settings, uniqueness constraints and indexes, and connection pooling for higher-frequency use. Local caching is a natural extension because a preserved version does not change.</p><p class="case-note">Append-only describes version-update behavior. The SDK also includes explicit deletion functions; it is not an immutable archival storage system.</p>']
      ]
    },
    zh: {
      category: '開發工具與治理', title: '每次調整，都有版本可循。',
      deck: '以 PostgreSQL 為後端的 Python SDK，集中管理 Prompt 並提供明確的版本選擇。',
      role: '負責資料模型、CRUD 語意、版本規則、套件封裝與公開 API；協作者負責資料庫維運與 Gradio 管理介面。',
      stack: 'Python · PostgreSQL · psycopg 3 · JSONB · dataclasses · uv · wheel',
      sections: [
        ['問題背景', '<p>嵌入應用程式碼的 Prompt 難以跨專案重用與稽核。如果應用總是讀取最新內容，共用 Prompt 的修改也可能在未預期的情況下改變執行行為。</p>'],
        ['關鍵決策', '<p>以 JSONB 保存結構化的 role/content 訊息，每次更新都新增一筆版本資料，由應用端明確指定讀取版本。</p><div class="case-flow">讀取既有版本 → 遞增版本 → 新增資料列 → 保留歷史</div><p>將初版的原地覆寫改為 append-only 更新語意，保留舊版本供比較與回滾。鎖定版本的應用程式，只有在呼叫端決定升版時才會採用新內容。</p>'],
        ['實作內容', '<ul><li>分離建立用與持久化資料模型，明確表達 ID 由系統產生的規則。</li><li>封裝參數化 SQL，以及建立、讀取、版本更新和刪除等公開 API。</li><li>集中日誌，兼顧開發者即時回饋與事後調查。</li><li>封裝 wheel 供團隊安裝，讓應用程式和協作者的管理介面使用同一套公開介面。</li></ul>'],
        ['跨專案應用', '<p>SDK 供 8+ 內部專案使用，涵蓋客服 Agent、知識管理分析，以及 LLM-as-a-Judge 評測 Prompt。</p><div class="case-evidence"><div><strong>8+</strong><span>個內部專案共用 SDK</span></div><div><strong>指定版本</strong><span>明確讀取，讓 Prompt 選擇可重現</span></div></div><p>評測 Prompt 的版本管理與應用 Prompt 同樣重要：若 judge prompt 無紀錄地改變，前後兩次評測就可能失去可比性。</p>'],
        ['分工與下一步', '<p>我負責 SDK 與資料契約；資料庫建置維運，以及 Gradio 管理介面由協作者負責。</p><p>後續強化方向包括環境變數注入連線設定、唯一約束與索引，以及高頻使用情境的連線池。保留版本的內容不變，也讓本地快取成為自然的擴充方向。</p><p class="case-note">Append-only 指的是版本更新行為。SDK 同時提供明確的刪除函式，並非不可刪除的封存系統。</p>']
      ]
    }
  }
};
const dialog = document.getElementById('case-dialog');
const languageButton = document.getElementById('language-toggle');
let language = document.documentElement.lang === 'zh-Hant' ? 'zh' : 'en';
let currentProject = null;
let lastTrigger = null;
function renderCase(id) {
  const data = caseStudies[id][language];
  document.getElementById('case-label').textContent = data.category;
  document.getElementById('case-content').innerHTML = `<header class="case-header"><p>${language==='en'?'TAISHIN INTERNATIONAL BANK / ENGINEERING CASE STUDY':'台新國際商業銀行 / 工程專案'}</p><h2 id="case-title">${data.title}</h2><p class="case-deck">${data.deck}</p></header><div class="case-facts"><div><strong>${language==='en'?'MY ROLE':'我的角色'}</strong><p>${data.role}</p></div><div><strong>${language==='en'?'TECHNOLOGY':'技術'}</strong><p>${data.stack}</p></div></div>${data.sections.map(([title,body])=>`<section class="case-section"><h3>${title}</h3><div>${body}</div></section>`).join('')}`;
  dialog.scrollTop=0;
}
function setLanguage(next) {
  language=next;
  document.documentElement.lang=next==='zh'?'zh-Hant':'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(element => element.innerHTML=element.dataset[next]);
  document.querySelectorAll('[data-aria-en][data-aria-zh]').forEach(element => element.setAttribute('aria-label',element.dataset[next==='zh'?'ariaZh':'ariaEn']));
  languageButton.textContent=next==='en'?'中文':'EN';
  languageButton.lang=next==='en'?'zh-Hant':'en';
  languageButton.setAttribute('aria-label',next==='en'?'切換至繁體中文':'Switch to English');
  languageButton.hreflang=next==='en'?'zh-Hant':'en';
  languageButton.href=(next==='en'?'zh.html':'index.html')+window.location.hash;
  document.querySelectorAll('[data-resume]').forEach(link=>link.href=next==='en'?'assets/Yu-Ju_Yang_Resume.pdf':'assets/Yu-Ju_Yang_Resume_ZH.pdf');
  document.querySelector('nav').setAttribute('aria-label',next==='en'?'Main navigation':'主要導覽');
  document.querySelector('.circle-link').setAttribute('aria-label',next==='en'?'Explore selected work':'瀏覽精選專案');
  document.title=next==='en'?'Yu-Ju Yang | AI / LLM Application Engineer':'楊侑儒 Harry Yang｜AI / LLM 應用工程師';
  if(currentProject) renderCase(currentProject);
  updateMotionLabel();
}
// Each language has a real static entry: correct initial copy, metadata, and no-JS navigation.
window.addEventListener('hashchange',()=>{languageButton.href=(language==='en'?'zh.html':'index.html')+window.location.hash;});
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  currentProject=button.dataset.project;lastTrigger=button;renderCase(currentProject);
  dialog.showModal();document.body.classList.add('dialog-open');
  document.getElementById('close-dialog').focus();
}));
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');currentProject=null;lastTrigger?.focus({preventScroll:true});});
document.getElementById('next-project').addEventListener('click',()=>{const order=['rag','api','sdk'];currentProject=order[(order.indexOf(currentProject)+1)%order.length];renderCase(currentProject);document.getElementById('close-dialog').focus();});
let paused=false;
const motionButton=document.getElementById('motion-toggle');
function updateMotionLabel(){motionButton.innerHTML=`<span aria-hidden="true">${paused?'▶':'Ⅱ'}</span> <span>${language==='en'?(paused?'Resume motion':'Pause motion'):(paused?'繼續動畫':'暫停動畫')}</span>`;motionButton.setAttribute('aria-pressed',String(paused));}
motionButton.addEventListener('click',()=>{paused=!paused;document.body.classList.toggle('motion-paused',paused);window.dispatchEvent(new CustomEvent('portfolio-motion',{detail:{paused}}));updateMotionLabel();});
document.getElementById('year').textContent=new Date().getFullYear();
setLanguage(language);
