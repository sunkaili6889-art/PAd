const screenOrder = [
  "overview",
  "preview-detail",
  "publish-preview",
  "class-experiment",
  "quiz-results",
  "publish-quiz",
  "quiz-detail",
  "after-class-homework",
  "after-homework-publish-empty",
  "after-homework-publish-selected",
  "after-homework-detail",
  "student-portraits",
  "student-portrait-detail",
  "teaching-resources",
  "question-empty",
  "question-result",
  "teaching",
];
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const subnav = document.querySelector(".subnav");

function setScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });

  navItems.forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".subnav-item").forEach((item) => item.classList.remove("active"));
  const teachingScreens = [
    "teaching",
    "preview-detail",
    "publish-preview",
    "class-experiment",
    "quiz-results",
    "publish-quiz",
    "quiz-detail",
    "after-class-homework",
    "after-homework-publish-empty",
    "after-homework-publish-selected",
    "after-homework-detail",
  ];
  subnav.classList.toggle("visible", teachingScreens.includes(id));

  if (id === "overview") {
    document.querySelector('[data-screen-target="overview"]').classList.add("active");
  } else if (id === "question-empty" || id === "question-result") {
    document.querySelector('[data-screen-target="question-empty"]').classList.add("active");
  } else if (id === "student-portraits" || id === "student-portrait-detail") {
    document.querySelector('[data-screen-target="student-portraits"]').classList.add("active");
  } else if (id === "teaching-resources") {
    document.querySelector('[data-screen-target="teaching-resources"]').classList.add("active");
  } else if (teachingScreens.includes(id)) {
    document.querySelector('[data-screen-target="teaching"]').classList.add("active");
    const activeSubnav =
      id === "class-experiment" || id === "quiz-results" || id === "publish-quiz" || id === "quiz-detail"
        ? document.querySelector('[data-screen-target="class-experiment"]')
        : id === "after-class-homework" ||
            id === "after-homework-publish-empty" ||
            id === "after-homework-publish-selected" ||
            id === "after-homework-detail"
          ? document.querySelector('[data-screen-target="after-class-homework"]')
          : document.querySelector(".subnav-item");
    activeSubnav?.classList.add("active");
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-screen-target]");
  if (!target) return;
  setScreen(target.dataset.screenTarget);
});

document.addEventListener("keydown", (event) => {
  const current = document.querySelector(".screen.active")?.id;
  const index = screenOrder.indexOf(current);

  if (event.key === "ArrowRight" && index < screenOrder.length - 1) {
    setScreen(screenOrder[index + 1]);
  }

  if (event.key === "ArrowLeft" && index > 0) {
    setScreen(screenOrder[index - 1]);
  }
});
