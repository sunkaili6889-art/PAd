const toast = document.querySelector(".toast");
const loginForm = document.querySelector(".login-form");
const loginView = document.querySelector('[data-view="login"]');
const homeView = document.querySelector('[data-view="home"]');
const aiMenuView = document.querySelector('[data-view="ai-menu"]');
const aiChatView = document.querySelector('[data-view="ai-chat"]');
const microGenView = document.querySelector('[data-view="micro-gen"]');
const experimentListView = document.querySelector('[data-view="experiment-list"]');
const resourceOverviewView = document.querySelector('[data-view="resource-overview"]');
const quiz61View = document.querySelector('[data-view="quiz-61"]');
const quiz104View = document.querySelector('[data-view="quiz-104"]');
const quizResultView = document.querySelector('[data-view="quiz-result"]');
const quizExplainView = document.querySelector('[data-view="quiz-explain"]');
const experimentCanvasView = document.querySelector('[data-view="experiment-canvas"]');
const formError = document.querySelector(".form-error");
const chatForm = document.querySelector(".chat-composer");
const chatMessages = document.querySelector(".chat-messages");
const generationForm = document.querySelector(".generation-composer");
let timer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove("show"), 1800);
};

const showView = (view) => {
  loginView.classList.toggle("active", view === "login");
  homeView.classList.toggle("active", view === "home");
  aiMenuView.classList.toggle("active", view === "ai-menu");
  aiChatView.classList.toggle("active", view === "ai-chat");
  microGenView.classList.toggle("active", view === "micro-gen");
  experimentListView.classList.toggle("active", view === "experiment-list");
  resourceOverviewView.classList.toggle("active", view === "resource-overview");
  quiz61View.classList.toggle("active", view === "quiz-61");
  quiz104View.classList.toggle("active", view === "quiz-104");
  quizResultView.classList.toggle("active", view === "quiz-result");
  quizExplainView.classList.toggle("active", view === "quiz-explain");
  experimentCanvasView.classList.toggle("active", view === "experiment-canvas");
};

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const studentId = loginForm.studentId.value.trim();
  const password = loginForm.password.value.trim();

  if (!studentId || !password) {
    formError.textContent = "请输入账号和密码";
    return;
  }

  formError.textContent = "";
  showView("home");
  showToast("登录成功，欢迎回来");
});

loginForm.addEventListener("reset", () => {
  formError.textContent = "";
  setTimeout(() => loginForm.studentId.focus(), 0);
});

document.querySelectorAll("[data-message]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(button.dataset.message);
  });
});

document.querySelectorAll("[data-navigate]").forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.navigate);
  });
});

document.querySelectorAll(".quiz-options button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest(".quiz-options");
    group.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    showToast(`已选择 ${button.dataset.answer}`);
  });
});

document.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
    showToast(`${button.textContent.trim()}${button.classList.contains("active") ? "已开启" : "已关闭"}`);
  });
});

const unitLessons = {
  "物质的变化": ["蜡烛的燃烧", "生锈与防锈", "颜色的变化", "单元回顾"],
  "田野的生物": ["田野里的生物", "植物乐园", "昆虫观察", "单元回顾"],
  "天气的成因": ["天气的变化", "云和降水", "风的形成", "单元回顾"],
  "自然资源": ["各种各样的自然资源", "煤、石油和天然气", "风能和水能", "单元回顾"],
  "建造植物工厂": ["认识植物工厂", "植物生长条件", "设计植物工厂", "单元回顾"],
};

const unitList = document.querySelector(".unit-list");
const lessonList = document.querySelector(".lesson-list");

const renderUnitLessons = (unitName) => {
  lessonList.innerHTML = unitLessons[unitName].map((lesson) => `
    <article>
      <div><h2>${lesson}</h2><p>12人正在实验</p></div>
      <button type="button" data-lesson="${lesson}">进入实验空间</button>
    </article>
  `).join("");
  lessonList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (unitName === "自然资源") {
        showView("resource-overview");
      } else {
        showToast(`正在进入“${button.dataset.lesson}”实验`);
      }
    });
  });
};

const selectUnit = (button, announce = false) => {
  unitList.querySelectorAll("[data-unit]").forEach((unit) => unit.classList.remove("active"));
  button.classList.add("active");
  renderUnitLessons(button.dataset.unit);
  if (announce) showToast(`已选择${button.dataset.unit}`);
};

unitList.querySelectorAll("[data-unit]").forEach((button) => {
  button.addEventListener("click", () => {
    button.scrollIntoView({ behavior: "smooth", block: "center" });
    selectUnit(button, true);
  });
});

renderUnitLessons(unitList.querySelector(".unit-card.active").dataset.unit);

let unitScrollTimer;
unitList.addEventListener("scroll", () => {
  clearTimeout(unitScrollTimer);
  unitScrollTimer = setTimeout(() => {
    const listCenter = unitList.getBoundingClientRect().top + unitList.clientHeight / 2;
    const closest = [...unitList.querySelectorAll("[data-unit]")].reduce((best, unit) => {
      const rect = unit.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - listCenter);
      return distance < best.distance ? { unit, distance } : best;
    }, { unit: null, distance: Infinity }).unit;
    if (closest && !closest.classList.contains("active")) selectUnit(closest);
  }, 90);
}, { passive: true });

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatForm.question.value.trim();
  if (!question) {
    showToast("请输入你的科学疑问");
    return;
  }

  chatMessages.innerHTML = `
    <div class="message user">${question.replace(/[<>&]/g, "")}</div>
    <div class="message assistant">这是一个很棒的问题！我正在认真思考，我们可以一起从观察和实验开始探索。</div>
  `;
  chatForm.reset();
});

generationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const prompt = generationForm.prompt.value.trim();
  if (!prompt) {
    showToast("请输入生成提示词");
    return;
  }

  document.querySelector(".generation-title").textContent = "AI 3D形象";
  document.querySelector(".generation-copy").textContent = prompt;
  showToast("已提交生成任务");
  generationForm.reset();
});

document.querySelector(".profile").addEventListener("click", () => {
  showView("login");
  loginForm.reset();
  showToast("已退出登录");
});
