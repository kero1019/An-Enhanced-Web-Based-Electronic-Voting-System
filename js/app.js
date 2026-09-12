import {
  api,
  escape as esc,
  formatDate,
  formatDateTime,
  localDateTime,
  readImage,
} from "./api.js";

const root = new URL("../", import.meta.url);
const app = document.getElementById("app");
let user = null;
let mode = null;
let renderVersion = 0;
let flash = "";
let afterLogin = "/elections";
let filters = { status: "all", search: "" };
const icons = {
  check: '<path d="m5 12 4 4L19 6"/>',
  ballot: '<path d="M9 3h6v8H9zM9 7 3 12v9h18v-9l-6-5M3 12h18M9 16h6"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  people:
    '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 4v3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-5"/>',
  trophy:
    '<path d="M7 3h10v6a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 4 4M17 5h4v3a4 4 0 0 1-4 4M12 14v6M7 21h10"/>',
};
const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
    icons[name] || icons.ballot
  }</svg>`;
const routeLink = (route, label, classes = "") =>
  `<a href="#${route}"${classes ? ` class="${classes}"` : ""}>${label}</a>`;
const badge = (status, label) =>
  `<span class="badge ${status}"><span class="badge-dot"></span>${esc(
    label ||
      {
        active: "Voting open",
        upcoming: "Upcoming",
        closed: "Closed",
        draft: "Draft",
      }[status] ||
      status
  )}</span>`;
const avatar = (person) =>
  `<span class="avatar">${
    person.image
      ? `<img src="${esc(person.image)}" alt="${esc(
          person.name
        )}" loading="lazy">`
      : esc(
          person.name
            .split(/\s+/)
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
        )
  }</span>`;
const empty = (
  title,
  description,
  route = "/elections",
  label = "Browse elections"
) =>
  `<div class="empty">${icon("ballot")}<h2>${esc(title)}</h2><p>${esc(
    description
  )}</p>${route ? routeLink(route, esc(label), "btn secondary") : ""}</div>`;
const notice = (message, type = "info") =>
  `<div class="notice ${type}" role="status">${esc(message)}</div>`;
const dateInfo = (e) =>
  `<div class="detail-summary"><div><span class="label">Opens</span><b>${formatDateTime(
    e.start
  )}</b></div><div><span class="label">Closes</span><b>${formatDateTime(
    e.end
  )}</b></div><div><span class="label">Ballot</span><b>Up to ${e.max_choices} ${
    e.max_choices === 1 ? "candidate" : "candidates"
  }</b></div><div><span class="label">Candidates</span><b>${
    e.candidates.length
  } standing</b></div></div>`;
function navigate(route, message = "") {
  flash = message;
  if (location.hash === "#" + route) render();
  else location.hash = route;
}
function legacyRoute() {
  const path = location.pathname.toLowerCase();
  const eid =
    new URLSearchParams(location.search).get("id") ||
    localStorage.getItem("ip");
  if (path.includes("forgot_enter_code")) return "/reset-code";
  if (path.includes("forgot_password")) return "/forgot";
  if (path.includes("re-enter_password")) return "/reset";
  if (path.includes("register_enter_code") || path.includes("verification"))
    return "/verify";
  if (path.includes("registration.html")) return "/register";
  if (path.includes("login.html")) return "/login";
  if (path.includes("create_election")) return "/admin/elections/new";
  if (
    path.includes("edit_election") ||
    path.includes("voting_panel_admin") ||
    path.includes("candidate_profile")
  )
    return eid ? `/admin/elections/${encodeURIComponent(eid)}` : "/admin";
  if (path.includes("admin")) return "/admin";
  if (path.includes("personal_info")) return "/profile";
  if (path.includes("voting_history")) return "/history";
  if (path.includes("voting_results"))
    return eid ? `/results/${encodeURIComponent(eid)}` : "/results";
  if (path.includes("voting_panel"))
    return eid ? `/elections/${encodeURIComponent(eid)}` : "/elections";
  if (path.includes("elections.html")) return "/elections";
  if (path.includes("welcome_email")) return "/login";
  return "/";
}
function shell(route) {
  const nav = (path, label) =>
    `<a href="#${path}" ${
      route === path || (path !== "/" && route.startsWith(path + "/"))
        ? 'aria-current="page"'
        : ""
    }>${label}</a>`;
  app.innerHTML = `<a class="skip" href="#main-content">Skip to content</a>
    ${
      mode
        ? `<div class="demo-strip"><strong>${mode === "github-pages-demo" ? "GITHUB PAGES DEMO" : "LOCAL DEMO"}</strong> Sample elections · ${mode === "github-pages-demo" ? "Data is saved in this browser only" : "Data is saved on this computer"} · No real election or email delivery</div>`
        : ""
    }
    <header class="site-header"><div class="nav-wrap">
      <a class="brand" href="#/"><img src="${root}imgs/logo.png" alt=""><span>Voting System<small>Every voice matters</small></span></a>
      <button class="nav-toggle" type="button" aria-controls="navigation" aria-expanded="false" aria-label="Open navigation">Menu ☰</button>
      <nav id="navigation" class="nav-links" aria-label="Main navigation">
      ${nav("/elections", "Elections")}${nav("/results", "Results")}${
    user ? nav("/history", "My votes") + nav("/profile", "My profile") : ""
  }${user?.role === "ADMIN" ? nav("/admin", "Administration") : ""}
      ${
        user
          ? '<button type="button" id="logout">Log out</button>'
          : nav("/login", "Log in") +
            '<a class="nav-cta" href="#/register">Register</a>'
      }</nav>
    </div></header><main id="main-content" class="main" tabindex="-1"><div class="loading" role="status"><span class="spinner"></span>Loading…</div></main>
    <footer class="site-footer"><div class="footer-inner"><span>Voting System · Graduation project ${
      mode ? "· Local demo" : ""
    }</span><span>${routeLink("/help", "How voting works")}${routeLink(
    "/feedback",
    "Send feedback"
  )}</span></div></footer>
    <dialog id="confirmation" aria-labelledby="dialog-title"></dialog>`;
  document.querySelector(".skip").onclick = (event) => {
    event.preventDefault();
    document.getElementById("main-content").focus();
  };
  document.querySelector(".nav-toggle").onclick = (event) => {
    const button = event.currentTarget;
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );
    document.getElementById("navigation").classList.toggle("open", open);
  };
  document
    .getElementById("logout")
    ?.addEventListener("click", async (event) => {
      event.currentTarget.disabled = true;
      try {
        await api("/auth/logout", { method: "POST" });
        user = null;
        navigate("/login", "You have been logged out.");
      } catch (error) {
        showError(error.message);
        event.target.disabled = false;
      }
    });
}
function showError(
  message,
  container = document.getElementById("main-content")
) {
  let node = container.querySelector("[data-error]");
  if (!node) {
    node = document.createElement("div");
    node.dataset.error = "";
    container.prepend(node);
  }
  node.className = "notice error";
  node.setAttribute("role", "alert");
  node.setAttribute("tabindex", "-1");
  node.textContent = message;
  node.hidden = false;
  node.focus();
}
function setPage(title, html, version) {
  if (version !== renderVersion) return false;
  document.title = `${title} | Voting System`;
  const main = document.getElementById("main-content");
  main.innerHTML = (flash ? notice(flash, "success") : "") + html;
  flash = "";
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
  return true;
}
function downloadResultsCsv(data) {
  const safeCell = (value) => {
    const text = String(value ?? "");
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  };
  const quote = (value) => `"${safeCell(value).replaceAll('"', '""')}"`;
  const rows = [
    ["Election", data.election.name],
    ["Status", data.election.status],
    [],
    ["Rank", "Candidate", "Party", "Votes", "Percent"],
    ...data.candidates.map((candidate) => [
      candidate.rank,
      candidate.name,
      candidate.party,
      candidate.votes,
      `${candidate.percent.toFixed(1)}%`,
    ]),
  ];
  const blob = new Blob([rows.map((row) => row.map(quote).join(",")).join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${data.election.id}-results.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
function handleActionError(error, container) {
  if (error.status === 401 && user && location.hash !== "#/login") {
    afterLogin = location.hash.slice(1) || "/elections";
    user = null;
    navigate("/login", "Your session has expired. Log in to continue.");
  } else showError(error.message, container);
}
function bindForm(formId, action) {
  const form = document.getElementById(formId);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.busy || !form.reportValidity()) return;
    form.dataset.busy = "true";
    const submit = form.querySelector("[type=submit]");
    const original = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Please wait…";
    form.querySelector("[data-error]")?.setAttribute("hidden", "");
    try {
      await action(Object.fromEntries(new FormData(form)), form);
    } catch (error) {
      handleActionError(error, form);
    } finally {
      delete form.dataset.busy;
      submit.disabled = false;
      submit.textContent = original;
    }
  });
}
function bindAction(selector, action) {
  document.querySelectorAll(selector).forEach((button) =>
    button.addEventListener("click", async () => {
      if (button.disabled) return;
      button.disabled = true;
      try {
        await action(button);
      } catch (error) {
        handleActionError(error);
      } finally {
        button.disabled = false;
        if (button.isConnected && document.activeElement === document.body)
          button.focus({ preventScroll: true });
      }
    })
  );
}
function confirmAction(title, body, confirmLabel = "Confirm", danger = false) {
  const dialog = document.getElementById("confirmation");
  dialog.innerHTML = `<h2 id="dialog-title">${esc(
    title
  )}</h2>${body}<div class="dialog-actions"><button type="button" class="btn secondary" data-cancel>Go back</button><button type="button" class="btn ${
    danger ? "danger" : ""
  }" data-confirm>${esc(confirmLabel)}</button></div>`;
  return new Promise((resolve) => {
    const finish = (value) => {
      dialog.close();
      resolve(value);
    };
    dialog.querySelector("[data-cancel]").onclick = () => finish(false);
    dialog.querySelector("[data-confirm]").onclick = () => finish(true);
    dialog.oncancel = (event) => {
      event.preventDefault();
      finish(false);
    };
    dialog.showModal();
    dialog.querySelector("[data-cancel]").focus();
  });
}
const field = (
  name,
  label,
  type = "text",
  value = "",
  extra = "",
  wide = false
) =>
  `<div class="field ${
    wide ? "wide" : ""
  }"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${esc(
    value
  )}" ${extra}></div>`;
const passwordField = (name = "password", label = "Password", create = false) =>
  `<div class="field wide"><label for="${name}">${label}</label><div class="password-wrap"><input id="${name}" name="${name}" type="password" required ${
    create
      ? 'minlength="8" maxlength="72" autocomplete="new-password"'
      : 'maxlength="72" autocomplete="current-password"'
  }><button type="button" data-password="${name}" aria-label="Show ${label.toLowerCase()}">Show</button></div>${
    create && name === "password"
      ? "<small>8–72 characters, including uppercase, lowercase, and a number.</small>"
      : ""
  }</div>`;
function passwordToggles() {
  document.querySelectorAll("[data-password]").forEach(
    (button) =>
      (button.onclick = () => {
        const input = document.getElementById(button.dataset.password);
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.textContent = show ? "Hide" : "Show";
        button.setAttribute(
          "aria-label",
          `${show ? "Hide" : "Show"} ${
            button.dataset.password === "confirmPassword"
              ? "confirmation password"
              : "password"
          }`
        );
      })
  );
}
function authLayout(title, subtitle, form) {
  return `<div class="auth-layout"><aside class="auth-aside"><span class="eyebrow">Your vote. Your voice.</span><h2>A better future<br>starts with you.</h2><p>Take part in your community’s decisions.</p><ol class="steps"><li>Create and verify your account</li><li>Explore elections and candidates</li><li>Cast your ballot and follow results</li></ol><p class="aside-bottom">${
    mode
      ? "This is a local demonstration. Use fictional personal details when trying registration."
      : "One account. One ballot per election."
  }</p></aside><section class="auth-form"><h1>${title}</h1><p>${subtitle}</p>${form}</section></div>`;
}
function saveChallenge(data, purpose) {
  sessionStorage.setItem(
    "voting.challenge",
    JSON.stringify({ ...data, purpose })
  );
}
function getChallenge() {
  try {
    return JSON.parse(sessionStorage.getItem("voting.challenge") || "null");
  } catch {
    return null;
  }
}
function demoCode(data) {
  return data?.demoCode
    ? `<div class="notice warning"><strong>Demo verification code</strong><span class="code-display">${esc(
        data.demoCode
      )}</span>No email is sent in local mode. This code expires in 10 minutes.</div>`
    : "";
}

async function authPage(route, version) {
  if (route === "/login") {
    if (
      !setPage(
        "Log in",
        authLayout(
          "Welcome back",
          "Log in to vote and manage your account.",
          `<form id="login-form"><div class="form-grid">${field(
            "email",
            "Email address",
            "email",
            "",
            'required autocomplete="email"',
            true
          )}${passwordField()}</div><div class="form-actions"><button type="submit" class="btn">Log in ${icon(
            "arrow"
          )}</button></div><div class="form-links">${routeLink(
            "/forgot",
            "Forgot password?"
          )}${routeLink(
            "/verify",
            "Verify email"
          )}</div></form><p class="small-text" style="margin-top:22px">New here? ${routeLink(
            "/register",
            "Create an account"
          )}</p>${
            mode
              ? `<details class="demo-accounts" open><summary>Try a demo account</summary><div class="demo-account-grid"><div class="demo-account"><b>Voter</b>voter@voting.local<br><code>Voter@12345</code><button class="btn small secondary" data-demo="voter" type="button">Fill voter account</button></div><div class="demo-account"><b>Administrator</b>admin@voting.local<br><code>Admin@12345</code><button class="btn small secondary" data-demo="admin" type="button">Fill admin account</button></div></div></details>`
              : ""
          }`
        ),
        version
      )
    )
      return;
    passwordToggles();
    bindForm("login-form", async (data) => {
      user = await api("/auth/login", { method: "POST", body: data });
      const target =
        afterLogin === "/elections" && user.role === "ADMIN"
          ? "/admin"
          : afterLogin;
      afterLogin = "/elections";
      navigate(target, `Welcome back, ${user.name.split(" ")[0]}.`);
    });
    bindAction("[data-demo]", (button) => {
      document.getElementById(
        "email"
      ).value = `${button.dataset.demo}@voting.local`;
      document.getElementById("password").value =
        button.dataset.demo === "admin" ? "Admin@12345" : "Voter@12345";
    });
    return;
  }
  if (route === "/register") {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 16);
    if (
      !setPage(
        "Register",
        authLayout(
          "Create your account",
          "Register, verify your email, and take part.",
          `<form id="register-form"><div class="form-grid">${field(
            "name",
            "Full name",
            "text",
            "",
            'required minlength="2" maxlength="80" autocomplete="name"',
            true
          )}${field(
            "email",
            "Email address",
            "email",
            "",
            'required maxlength="254" autocomplete="email"',
            true
          )}${field(
            "dob",
            "Date of birth",
            "date",
            "",
            'required max="' +
              today.toISOString().slice(0, 10) +
              '" autocomplete="bday"'
          )}<div class="field"><label for="gender">Gender</label><select id="gender" name="gender" required><option value="">Select gender</option><option>Male</option><option>Female</option></select></div>${field(
            "nationalId",
            "Demo national ID",
            "text",
            "",
            'required inputmode="numeric" pattern="[0-9]{14}" maxlength="14" title="14 digits; use a fictional ID"'
          )}${field(
            "mobile",
            "Mobile number",
            "tel",
            "",
            'required pattern="01[0125][0-9]{8}" maxlength="11" autocomplete="tel" title="11-digit Egyptian mobile number"'
          )}${passwordField("password", "Password", true)}${passwordField(
            "confirmPassword",
            "Confirm password",
            true
          )}</div><div class="form-actions"><button type="submit" class="btn">Create account ${icon(
            "arrow"
          )}</button></div><p class="help">Local demo: use fictional identity details. The ID is checked for format and uniqueness only.</p><div class="form-links"><span>Already registered? ${routeLink(
            "/login",
            "Log in"
          )}</span></div></form>`
        ),
        version
      )
    )
      return;
    passwordToggles();
    bindForm("register-form", async (data) => {
      if (data.password !== data.confirmPassword)
        throw new Error("Passwords do not match.");
      const result = await api("/auth/register", {
        method: "POST",
        body: data,
      });
      saveChallenge(result, "verify");
      navigate("/verify");
    });
    return;
  }
  if (route === "/forgot") {
    if (
      !setPage(
        "Forgot password",
        authLayout(
          "Forgot your password?",
          "Enter your registered email to start a password reset.",
          `<form id="forgot-form">${field(
            "email",
            "Email address",
            "email",
            "",
            'required autocomplete="email"'
          )}<div class="form-actions"><button type="submit" class="btn">Get reset code</button></div><div class="form-links">${routeLink(
            "/login",
            "Back to log in"
          )}</div></form>`
        ),
        version
      )
    )
      return;
    bindForm("forgot-form", async (data) => {
      const result = await api("/auth/forgot", { method: "POST", body: data });
      saveChallenge(result, "reset");
      navigate("/reset-code", result.message);
    });
    return;
  }
  if (route === "/verify" || route === "/reset-code") {
    const purpose = route === "/verify" ? "verify" : "reset";
    const pending = getChallenge();
    const current = pending?.purpose === purpose ? pending : null;
    const form = `${demoCode(current)}${
      current
        ? `<form id="code-form"><p class="small-text">Verification for <strong>${esc(
            current.email
          )}</strong></p>${field(
            "code",
            "6-digit verification code",
            "text",
            "",
            'required inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="one-time-code"'
          )}<div class="form-actions"><button type="submit" class="btn">Verify code</button></div></form>`
        : ""
    }<form id="resend-form" style="margin-top:25px">${field(
      "email",
      current ? "Request a new code" : "Registered email address",
      "email",
      current?.email || "",
      'required autocomplete="email"'
    )}<div class="form-actions"><button type="submit" class="btn secondary">${
      current ? "Resend code" : "Get verification code"
    }</button></div></form><div class="form-links">${routeLink(
      "/login",
      "Back to log in"
    )}</div>`;
    if (
      !setPage(
        "Verify email",
        authLayout(
          purpose === "reset"
            ? "Verify your reset request"
            : "Verify your email",
          "Enter the code to continue. Codes expire after 10 minutes.",
          form
        ),
        version
      )
    )
      return;
    if (current)
      bindForm("code-form", async (data) => {
        const result = await api(
          purpose === "reset" ? "/auth/reset/verify" : "/auth/verify",
          {
            method: "POST",
            body: { challenge: current.challenge, code: data.code },
          }
        );
        sessionStorage.removeItem("voting.challenge");
        if (purpose === "reset") {
          sessionStorage.setItem("voting.reset", result.resetToken);
          navigate("/reset");
        } else navigate("/login", "Email verified. Log in to start voting.");
      });
    bindForm("resend-form", async (data) => {
      const result = await api(
        purpose === "reset" ? "/auth/forgot" : "/auth/resend",
        { method: "POST", body: data }
      );
      saveChallenge(result, purpose);
      navigate(route, "If the account is eligible, a new code is ready.");
    });
    return;
  }
  if (route === "/reset") {
    const resetToken = sessionStorage.getItem("voting.reset");
    if (!resetToken) {
      setPage(
        "Reset password",
        empty(
          "Start a password reset",
          "Request and verify a reset code before choosing a new password.",
          "/forgot",
          "Request reset code"
        ),
        version
      );
      return;
    }
    if (
      !setPage(
        "New password",
        authLayout(
          "Choose a new password",
          "Your existing sessions will be signed out.",
          `<form id="reset-form"><div class="form-grid">${passwordField(
            "password",
            "New password",
            true
          )}${passwordField(
            "confirmPassword",
            "Confirm password",
            true
          )}</div><div class="form-actions"><button type="submit" class="btn">Save new password</button></div></form>`
        ),
        version
      )
    )
      return;
    passwordToggles();
    bindForm("reset-form", async (data) => {
      if (data.password !== data.confirmPassword)
        throw new Error("Passwords do not match.");
      await api("/auth/reset", {
        method: "POST",
        body: { resetToken, password: data.password },
      });
      sessionStorage.removeItem("voting.reset");
      user = null;
      navigate("/login", "Password changed. Log in with your new password.");
    });
  }
}

function electionCard(e, index, adminView = false) {
  const target = adminView
    ? `/admin/elections/${e.id}`
    : e.status === "closed"
    ? `/results/${e.id}`
    : `/elections/${e.id}`;
  const label = adminView
    ? "Manage election"
    : e.status === "closed"
    ? "View results"
    : e.alreadyVoted
    ? "View your ballot status"
    : e.status === "active"
    ? "View candidates & vote"
    : "Explore candidates";
  return `<article class="card election-card ${
    e.status
  }"><div class="card-top">${badge(e.status)}<span class="card-number">${
    e.demo ? "DEMO" : "ELECTION"
  } ${String(index + 1).padStart(2, "0")}</span></div><h2>${esc(
    e.name
  )}</h2><p class="description">${esc(
    e.description || "Review the candidates and take part in this election."
  )}</p><div class="meta"><div class="meta-row">${icon(
    "calendar"
  )}<span>${formatDate(e.start)} – ${formatDate(
    e.end
  )}</span></div><div class="meta-row">${icon("people")}<span>${
    e.candidates.length
  } candidates · Choose up to ${e.max_choices}</span></div>${
    e.alreadyVoted ? `<div>${badge("voted", "Ballot recorded")}</div>` : ""
  }</div>${routeLink(
    target,
    esc(label) + " " + icon("arrow"),
    "btn full " + (e.status === "active" ? "" : "secondary")
  )}</article>`;
}
function stats(elections) {
  return `<div class="stats"><div class="stat"><div class="stat-icon">${icon(
    "ballot"
  )}</div><b>${
    elections.filter((e) => e.status === "active").length
  }</b><span>Open for voting</span></div><div class="stat"><div class="stat-icon">${icon(
    "calendar"
  )}</div><b>${
    elections.filter((e) => e.status === "upcoming").length
  }</b><span>Upcoming elections</span></div><div class="stat"><div class="stat-icon">${icon(
    "trophy"
  )}</div><b>${
    elections.filter((e) => e.status === "closed").length
  }</b><span>Published results</span></div></div>`;
}
async function electionsPage(route, version) {
  const elections = await api("/elections");
  const adminView = route === "/admin";
  const resultsOnly = route === "/results";
  const title = adminView
    ? "Election administration"
    : resultsOnly
    ? "Election results"
    : "Elections";
  if (route === "/") {
    const active = elections.find((e) => e.status === "active");
    const html = `<section class="hero-home"><div><span class="eyebrow">Take part in what comes next</span><h1>Your community.<br>Your choice.</h1><p>Meet the candidates, cast your vote, and follow the results. Every decision starts with participation.</p><div class="actions">${routeLink(
      "/elections",
      "Explore elections " + icon("arrow"),
      "btn light"
    )}${
      !user ? routeLink("/register", "Create an account", "btn secondary") : ""
    }</div></div><div class="hero-vote">${
      active
        ? `${badge("active")}<h2>${esc(
            active.name
          )}</h2><p>Voting closes ${formatDate(active.end)}. Review ${
            active.candidates.length
          } candidates and make your choice.</p>${routeLink(
            `/elections/${active.id}`,
            active.alreadyVoted
              ? "Ballot recorded — view election"
              : "Meet the candidates " + icon("arrow"),
            "btn light"
          )}`
        : `${icon(
            "calendar"
          )}<h2>Be ready for the next vote</h2><p>Browse upcoming elections and learn about your candidates.</p>`
    }</div></section>${stats(
      elections
    )}<div class="section-heading"><h2>Explore your elections</h2>${routeLink(
      "/elections",
      "View all →"
    )}</div><div class="grid">${
      elections
        .filter((e) => e.published)
        .slice(0, 3)
        .map((e, i) => electionCard(e, i))
        .join("") ||
      empty("No elections yet", "Published elections will appear here.", null)
    }</div><div class="support-row">${icon(
      "shield"
    )}<p><strong>One account. One ballot per election.</strong><br>Review your choices before submitting. Results are available when voting closes.</p></div>`;
    setPage("Home", html, version);
    return;
  }
  const statuses = resultsOnly
    ? ["closed"]
    : adminView
    ? ["all", "draft", "active", "upcoming", "closed"]
    : ["all", "active", "upcoming", "closed"];
  if (!statuses.includes(filters.status)) filters.status = statuses[0];
  const labels = {
    all: "All elections",
    active: "Open",
    upcoming: "Upcoming",
    closed: "Closed",
    draft: "Drafts",
  };
  const html = `<div class="page-top"><div><span class="eyebrow">${
    adminView
      ? "Administrator workspace"
      : resultsOnly
      ? "The votes are in"
      : "Your voting workspace"
  }</span><h1>${title}</h1><p>${
    adminView
      ? "Create a draft, add candidates, and publish when everything is ready."
      : resultsOnly
      ? "Final results from completed elections. Vote counts are calculated from recorded ballots."
      : `Explore what’s open, see what’s next, and make your voice heard.`
  }</p></div>${
    adminView
      ? `<div class="actions">${routeLink(
          "/admin/elections/new",
          "+ Create election",
          "btn"
        )}${routeLink("/admin/feedback", "Feedback", "btn secondary")}</div>`
      : ""
  }</div>${stats(
    elections
  )}<div class="toolbar"><div class="tabs" role="group" aria-label="Filter elections">${statuses
    .map(
      (status) =>
        `<button type="button" data-filter="${status}" aria-pressed="${
          filters.status === status
        }">${labels[status]}</button>`
    )
    .join(
      ""
    )}</div><label class="search"><span class="field-label" hidden>Search elections</span>${icon(
    "search"
  )}<input id="election-search" type="search" aria-label="Search elections" placeholder="Search elections…" value="${esc(
    filters.search
  )}"></label></div><p id="result-count" class="small-text muted" aria-live="polite"></p><div class="grid" id="election-grid"></div><div class="support-row">${icon(
    "shield"
  )}<p><strong>${
    adminView ? "Keep the ballot consistent." : "Make an informed choice."
  }</strong><br>${
    adminView
      ? "Candidates and election settings are locked after publishing. Close an active election to release its results."
      : "Read each candidate’s statement before voting. You can submit only one ballot per election."
  }</p></div>`;
  if (!setPage(title, html, version)) return;
  function update() {
    const list = elections.filter(
      (e) =>
        (adminView || e.published) &&
        (filters.status === "all" || e.status === filters.status) &&
        (e.name + " " + e.description)
          .toLowerCase()
          .includes(filters.search.toLowerCase())
    );
    document.getElementById("election-grid").innerHTML =
      list.map((e, i) => electionCard(e, i, adminView)).join("") ||
      empty(
        "No elections found",
        "Try a different search or filter. Published elections will appear here.",
        null
      );
    document.getElementById("result-count").textContent = `${list.length} ${
      list.length === 1 ? "election" : "elections"
    }`;
    document
      .querySelectorAll("[data-filter]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.filter === filters.status)
        )
      );
  }
  document.getElementById("election-search").oninput = (event) => {
    filters.search = event.target.value;
    update();
  };
  document.querySelectorAll("[data-filter]").forEach(
    (button) =>
      (button.onclick = () => {
        filters.status = button.dataset.filter;
        update();
      })
  );
  update();
}

async function ballotPage(eid, version) {
  const e = await api(`/elections/${encodeURIComponent(eid)}`);
  const available = e.status === "active" && !e.alreadyVoted;
  const html = `<div class="breadcrumb">${routeLink(
    "/elections",
    "Elections"
  )}<span>/</span><span>Election details</span></div><div class="page-top"><div>${badge(
    e.status
  )}<h1 style="margin-top:16px">${esc(e.name)}</h1><p class="long-text">${esc(
    e.description
  )}</p></div>${
    e.status === "closed"
      ? routeLink(
          `/results/${e.id}`,
          "View final results " + icon("arrow"),
          "btn"
        )
      : ""
  }</div>${dateInfo(e)}${
    e.alreadyVoted
      ? notice(
          "Your ballot has been recorded. You cannot vote again in this election.",
          "success"
        )
      : e.status === "upcoming"
      ? notice(
          `Voting opens on ${formatDateTime(
            e.start
          )}. You can read about the candidates now.`
        )
      : e.status === "closed"
      ? notice("Voting has closed. Final results are now available.")
      : !user
      ? notice("Log in to select candidates and submit your ballot.")
      : notice(
          `${
            e.max_choices === 1
              ? "Select one candidate."
              : `Select between 1 and ${e.max_choices} candidates.`
          } You will review your choices before submitting.`
        )
  }<div class="section-heading"><h2>Meet the candidates</h2><span class="muted small-text">${
    e.candidates.length
  } candidates</span></div><div class="grid">${
    e.candidates
      .map(
        (c) =>
          `<article class="card candidate-card" data-candidate="${
            c.id
          }"><div class="candidate-heading">${avatar(c)}<div><h3>${esc(
            c.name
          )}</h3><p>${esc(
            c.party
          )}</p></div></div><div class="qualifications">Age ${c.age} · ${esc(
            c.education
          )}</div><p class="statement">${esc(
            c.manifesto || "No candidate statement has been added."
          )}</p>${
            available && user
              ? `<label class="choice"><input type="checkbox" name="candidate" value="${
                  c.id
                }"><span>Select ${esc(c.name)}</span></label>`
              : ""
          }</article>`
      )
      .join("") ||
    empty(
      "Candidates will appear here",
      "The administrator has not added candidates yet.",
      null
    )
  }</div>${
    available
      ? `<div class="ballot-bar"><div><strong id="selection-count" aria-live="polite">${
          user ? "0 selected" : "Ready to participate?"
        }</strong><p>${
          user
            ? `Choose up to ${e.max_choices} ${
                e.max_choices === 1 ? "candidate" : "candidates"
              }. Your vote is final once submitted.`
            : "Log in or register to cast your vote."
        }</p></div><div class="actions">${
          user
            ? `<button type="button" id="review-vote" class="btn" disabled>Review ballot ${icon(
                "arrow"
              )}</button>`
            : `<button type="button" id="login-to-vote" class="btn">Log in to vote</button>${routeLink(
                "/register",
                "Register",
                "btn secondary"
              )}`
        }</div></div>`
      : ""
  }`;
  if (!setPage(e.name, html, version)) return;
  bindAction("#login-to-vote", () => {
    afterLogin = `/elections/${e.id}`;
    navigate("/login");
  });
  const selected = new Set();
  document.querySelectorAll("input[name=candidate]").forEach(
    (input) =>
      (input.onchange = () => {
        if (input.checked && selected.size >= e.max_choices) {
          input.checked = false;
          showError(
            `You can select up to ${e.max_choices} candidates. Deselect someone before choosing another.`
          );
          return;
        }
        input.checked
          ? selected.add(input.value)
          : selected.delete(input.value);
        document.querySelector("[data-error]")?.setAttribute("hidden", "");
        input
          .closest(".candidate-card")
          .classList.toggle("selected", input.checked);
        document.getElementById(
          "selection-count"
        ).textContent = `${selected.size} of ${e.max_choices} selected`;
        document.getElementById("review-vote").disabled = selected.size === 0;
      })
  );
  bindAction("#review-vote", async () => {
    const chosen = e.candidates.filter((c) => selected.has(c.id));
    if (!chosen.length) throw new Error("Select at least one candidate.");
    if (
      !(await confirmAction(
        "Review your ballot",
        `<p>You are voting in <strong>${esc(
          e.name
        )}</strong> for:</p><ul>${chosen
          .map((c) => `<li>${esc(c.name)}</li>`)
          .join(
            ""
          )}</ul><p>You cannot change your choices after submitting.</p>`,
        "Submit ballot"
      ))
    )
      return;
    const result = await api(`/elections/${e.id}/vote`, {
      method: "POST",
      body: { candidateIds: [...selected] },
    });
    navigate(
      "/history",
      `Your ballot was recorded. Receipt: ${result.receipt}`
    );
  });
}

async function resultsPage(eid, version) {
  const data = await api(`/elections/${encodeURIComponent(eid)}/results`);
  const { election: e, candidates, winners } = data;
  const leading = candidates.filter((c) => winners.includes(c.id));
  const html = `<div class="breadcrumb">${routeLink(
    "/results",
    "Results"
  )}<span>/</span><span>Final results</span></div><div class="page-top"><div><span class="eyebrow">Final election results</span><h1>${esc(
    e.name
  )}</h1><p>Voting closed ${formatDateTime(e.end)}.${
    e.demo ? " This election contains sample data." : ""
  }</p></div><div class="actions">${
    mode === "github-pages-demo"
      ? '<button class="btn secondary" type="button" id="download-results">Download results CSV</button>'
      : `<a class="btn secondary" href="/api/elections/${e.id}/results.csv" download>Download results CSV</a>`
  }</div></div><div class="result-hero"><div class="result-emblem">${icon(
    "trophy"
  )}</div><div><span class="eyebrow">${
    !leading.length
      ? "No votes recorded"
      : leading.length > 1
      ? "Joint first place"
      : "Highest vote count"
  }</span><h2>${
    leading.length
      ? esc(leading.map((c) => c.name).join(" & "))
      : "No winner declared"
  }</h2><p>${
    leading.length
      ? `${leading[0].votes} ${leading[0].votes === 1 ? "vote" : "votes"}${
          leading.length > 1 ? " each" : ""
        } · ${leading[0].percent.toFixed(1)}% of all selections${
          leading.length > 1 ? " · Tied result" : ""
        }`
      : "All candidates received zero votes."
  }</p></div></div><div class="stats"><div class="stat"><b>${
    data.ballotCount
  }</b><span>Ballots submitted</span></div><div class="stat"><b>${
    data.totalVotes
  }</b><span>Candidate selections</span></div><div class="stat"><b>${
    candidates.length
  }</b><span>Candidates</span></div></div><div class="section-heading"><h2>Results by candidate</h2><span class="small-text muted">Share of all selections</span></div><div class="card results-list">${
    candidates
      .map(
        (c) =>
          `<div class="result-row"><span class="rank">${
            c.rank
          }</span><div class="result-person">${avatar(c)}<div><b>${esc(
            c.name
          )}</b><small>${esc(
            c.party
          )}</small></div></div><div class="bar" role="meter" aria-label="${esc(
            c.name
          )} share" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${c.percent.toFixed(
            1
          )}"><span style="width:${
            c.percent
          }%"></span></div><div class="vote-count">${c.percent.toFixed(
            1
          )}%<small>${c.votes} ${
            c.votes === 1 ? "vote" : "votes"
          }</small></div></div>`
      )
      .join("") ||
    empty(
      "No candidates",
      "No candidates were entered for this election.",
      null
    )
  }</div><p class="help" style="margin-top:18px">Percentages use total candidate selections, not total voters. A ballot may contain up to ${
    e.max_choices
  } ${
    e.max_choices === 1 ? "choice" : "choices"
  }. Equal vote counts share the same rank.</p>`;
  if (!setPage("Final results", html, version)) return;
  document
    .getElementById("download-results")
    ?.addEventListener("click", () => downloadResultsCsv(data));
}

async function historyPage(version) {
  const history = await api("/history");
  setPage(
    "My votes",
    `<div class="page-top"><div><span class="eyebrow">Your participation</span><h1>My voting history</h1><p>A record of the ballots you have submitted. Your choices are final.</p></div>${routeLink(
      "/elections",
      "Browse elections " + icon("arrow"),
      "btn secondary"
    )}</div><div class="history-list">${
      history
        .map(
          (h) =>
            `<article class="card history-card"><div>${badge(
              "voted",
              "Ballot recorded"
            )}<h2>${esc(h.election.name)}</h2><p>Selected: <strong>${esc(
              h.candidates.map((c) => c.name).join(", ")
            )}</strong></p><p>Submitted ${formatDateTime(
              h.createdAt
            )}</p><code>Receipt: ${esc(
              h.id
            )}</code></div><div class="actions">${routeLink(
              h.election.status === "closed"
                ? `/results/${h.election.id}`
                : `/elections/${h.election.id}`,
              h.election.status === "closed" ? "View results" : "View election",
              "btn secondary"
            )}</div></article>`
        )
        .join("") ||
      empty(
        "Your first vote starts here",
        "Once you submit a ballot, its receipt and election will appear here."
      )
    }</div>`,
    version
  );
}

async function profilePage(version) {
  const u = await api("/me");
  user = u;
  const html = `<div class="page-top"><div><span class="eyebrow">Your account</span><h1>My profile</h1><p>Keep your name, phone number, and profile photo up to date.</p></div></div><div class="profile-layout"><aside class="card profile-card">${avatar(
    u
  )}<h2>${esc(u.name)}</h2><p>${esc(u.email)}</p>${badge(
    "voted",
    "Email verified"
  )}<p style="margin-top:18px">${
    u.role === "ADMIN" ? "Election administrator" : "Registered voter"
  }</p></aside><section class="card profile-form"><h2>Personal information</h2><form id="profile-form"><div class="form-grid">${field(
    "name",
    "Full name",
    "text",
    u.name,
    'required minlength="2" maxlength="80" autocomplete="name"',
    true
  )}${field(
    "mobile",
    "Mobile number",
    "tel",
    u.mobile,
    'required pattern="01[0125][0-9]{8}" maxlength="11" autocomplete="tel"'
  )}${field("email", "Verified email", "email", u.email, "readonly")}${field(
    "dob",
    "Date of birth",
    "date",
    u.dob,
    "readonly"
  )}${field("gender", "Gender", "text", u.gender, "readonly")}${field(
    "nationalId",
    "Demo national ID",
    "text",
    u.nationalId,
    "readonly",
    true
  )}<div class="field wide"><label for="image">Profile photo</label><input class="file-input" id="image" name="image" type="file" accept="image/png,image/jpeg,image/webp"><small>PNG, JPEG, or WebP. Maximum 300 KB.</small></div></div><div class="form-actions"><button type="submit" class="btn">Save changes</button>${routeLink(
    "/forgot",
    "Reset password",
    "btn secondary"
  )}</div></form></section></div>`;
  if (!setPage("My profile", html, version)) return;
  bindForm("profile-form", async (data) => {
    user = await api("/me", {
      method: "PATCH",
      body: {
        name: data.name,
        mobile: data.mobile,
        image: (await readImage(data.image)) ?? u.image,
      },
    });
    navigate("/profile", "Your profile has been updated.");
  });
}

async function editorPage(eid, version) {
  const isNew = eid === "new";
  const e = isNew ? null : await api(`/elections/${encodeURIComponent(eid)}`);
  const locked = e?.published;
  const fields = `${field(
    "name",
    "Election name",
    "text",
    e?.name || "",
    'required minlength="5" maxlength="120"',
    true
  )}<div class="field wide"><label for="description">Description</label><textarea id="description" name="description" maxlength="1500">${esc(
    e?.description || ""
  )}</textarea></div>${field(
    "start",
    "Voting opens (your local time)",
    "datetime-local",
    localDateTime(e?.start || new Date(Date.now() + 3600000)),
    "required"
  )}${field(
    "end",
    "Voting closes (your local time)",
    "datetime-local",
    localDateTime(e?.end || new Date(Date.now() + 7 * 86400000)),
    "required"
  )}${field(
    "maxChoices",
    "Maximum choices per ballot",
    "number",
    e?.max_choices || 1,
    'required min="1" max="5" step="1"',
    true
  )}`;
  const candidateForm = `<form id="candidate-form"><input type="hidden" name="candidateId" id="candidateId"><div class="candidate-editor">${field(
    "candidateName",
    "Full name",
    "text",
    "",
    'required minlength="2" maxlength="80"'
  )}${field(
    "age",
    "Age",
    "number",
    "22",
    'required min="18" max="120" step="1"'
  )}${field(
    "party",
    "Party / group",
    "text",
    "",
    'required minlength="2" maxlength="80"'
  )}${field(
    "education",
    "Education",
    "text",
    "",
    'required minlength="2" maxlength="120"'
  )}<div class="field wide"><label for="manifesto">Candidate statement</label><textarea id="manifesto" name="manifesto" maxlength="1500"></textarea></div><div class="field wide"><label for="image">Candidate photo (optional)</label><input class="file-input" id="image" name="image" type="file" accept="image/png,image/jpeg,image/webp"><small>PNG, JPEG, or WebP. Maximum 300 KB.</small></div></div><div class="form-actions"><button type="submit" class="btn" id="candidate-submit">Add candidate</button><button type="button" class="btn secondary" id="cancel-candidate" hidden>Cancel edit</button></div></form>`;
  const html = `<div class="editor"><div class="breadcrumb">${routeLink(
    "/admin",
    "Administration"
  )}<span>/</span><span>${
    isNew ? "Create election" : esc(e.name)
  }</span></div><div class="page-top"><div><span class="eyebrow">${
    isNew ? "Start with a draft" : "Manage election"
  }</span><h1>${isNew ? "Create an election" : esc(e.name)}</h1><p>${
    isNew
      ? "Save your election, add its candidates, then publish."
      : "Review the ballot and manage the election lifecycle."
  }</p></div>${e ? badge(e.status) : ""}</div>${
    locked
      ? notice(
          "This election is published. Its settings and candidates are locked to keep the ballot consistent."
        )
      : ""
  }<section class="card"><h2>Election details</h2>${
    locked
      ? dateInfo(e) + `<p class="long-text">${esc(e.description)}</p>`
      : `<form id="election-form"><div class="form-grid">${fields}</div><div class="form-actions"><button type="submit" class="btn">${
          isNew ? "Save draft & add candidates" : "Save election details"
        }</button>${routeLink(
          "/admin",
          "Back to elections",
          "btn secondary"
        )}</div></form>`
  }</section>${
    !isNew
      ? `<section class="card"><div class="editor-heading"><h2>Candidates (${
          e.candidates.length
        })</h2><span class="small-text muted">Ballot allows up to ${
          e.max_choices
        } ${
          e.max_choices === 1 ? "choice" : "choices"
        }</span></div><div class="candidate-list">${
          e.candidates
            .map(
              (c) =>
                `<div class="candidate-item"><div class="candidate-heading">${avatar(
                  c
                )}<div><b>${esc(c.name)}</b><p>${esc(c.party)} · ${esc(
                  c.education
                )}</p></div></div>${
                  !locked
                    ? `<div class="actions"><button type="button" class="btn small secondary" data-edit="${
                        c.id
                      }">Edit<span class="sr-only" hidden> ${esc(
                        c.name
                      )}</span></button><button type="button" class="btn small danger" data-delete-candidate="${
                        c.id
                      }" aria-label="Remove ${esc(
                        c.name
                      )}">Remove</button></div>`
                    : ""
                }</div>`
            )
            .join("") ||
          '<p class="muted">No candidates yet. Add your first candidate below.</p>'
        }</div>${
          !locked
            ? `<h3 id="candidate-form-title">Add a candidate</h3>${candidateForm}`
            : ""
        }</section><section class="card"><h2>Election actions</h2><p class="small-text">${
          !locked
            ? "Publishing locks the candidates, voting dates, and maximum choices. Check all details first."
            : e.status === "active"
            ? "Close voting to publish the final results. Closing cannot be undone."
            : e.status === "upcoming"
            ? "Voting opens automatically at the scheduled start time."
            : "Voting has ended. Final results are available."
        }</p><div class="actions">${
          !locked
            ? '<button type="button" id="publish-election" class="btn">Publish election</button><button type="button" id="delete-election" class="btn danger">Delete draft</button>'
            : e.status === "active"
            ? '<button type="button" id="close-election" class="btn danger">Close voting & publish results</button>'
            : ""
        }${routeLink(
          e.status === "closed" ? `/results/${e.id}` : `/elections/${e.id}`,
          e.status === "closed" ? "View final results" : "Preview election",
          "btn secondary"
        )}</div></section>`
      : ""
  }</div>`;
  if (!setPage(isNew ? "Create election" : "Manage election", html, version))
    return;
  if (!locked)
    bindForm("election-form", async (data) => {
      const start = new Date(data.start),
        end = new Date(data.end);
      if (
        !Number.isFinite(start.getTime()) ||
        !Number.isFinite(end.getTime()) ||
        start >= end ||
        end <= new Date()
      )
        throw new Error(
          "End time must be after the start time and in the future."
        );
      const result = await api(isNew ? "/elections" : `/elections/${e.id}`, {
        method: isNew ? "POST" : "PATCH",
        body: {
          name: data.name,
          description: data.description,
          start: start.toISOString(),
          end: end.toISOString(),
          maxChoices: Number(data.maxChoices),
        },
      });
      navigate(
        `/admin/elections/${result.id}`,
        isNew
          ? "Draft created. Add candidates before publishing."
          : "Election details saved."
      );
    });
  if (isNew) return;
  let candidateImage = "";
  if (!locked) {
    bindForm("candidate-form", async (data) => {
      const body = {
        name: data.candidateName,
        age: Number(data.age),
        party: data.party,
        education: data.education,
        manifesto: data.manifesto,
        image: (await readImage(data.image)) ?? candidateImage,
      };
      await api(
        data.candidateId
          ? `/candidates/${data.candidateId}`
          : `/elections/${e.id}/candidates`,
        { method: data.candidateId ? "PATCH" : "POST", body }
      );
      navigate(
        `/admin/elections/${e.id}`,
        data.candidateId ? "Candidate updated." : "Candidate added."
      );
    });
    bindAction("[data-edit]", (button) => {
      const c = e.candidates.find(
        (candidate) => candidate.id === button.dataset.edit
      );
      const form = document.getElementById("candidate-form");
      form.reset();
      const values = {
        candidateId: c.id,
        candidateName: c.name,
        age: c.age,
        party: c.party,
        education: c.education,
        manifesto: c.manifesto,
      };
      for (const [key, value] of Object.entries(values))
        form.elements.namedItem(key).value = value;
      candidateImage = c.image;
      document.getElementById(
        "candidate-form-title"
      ).textContent = `Edit ${c.name}`;
      document.getElementById("candidate-submit").textContent =
        "Save candidate";
      document.getElementById("cancel-candidate").hidden = false;
      document.getElementById("candidateName").focus();
    });
    bindAction("#cancel-candidate", () => {
      document.getElementById("candidate-form").reset();
      document.getElementById("candidateId").value = "";
      candidateImage = "";
      document.getElementById("candidate-form-title").textContent =
        "Add a candidate";
      document.getElementById("candidate-submit").textContent = "Add candidate";
      document.getElementById("cancel-candidate").hidden = true;
    });
    bindAction("[data-delete-candidate]", async (button) => {
      const c = e.candidates.find(
        (candidate) => candidate.id === button.dataset.deleteCandidate
      );
      if (
        await confirmAction(
          "Remove candidate?",
          `<p>Remove <strong>${esc(c.name)}</strong> from this draft?</p>`,
          "Remove candidate",
          true
        )
      ) {
        await api(`/candidates/${c.id}`, { method: "DELETE" });
        navigate(`/admin/elections/${e.id}`, "Candidate removed.");
      }
    });
  }
  bindAction("#publish-election", async () => {
    if (
      await confirmAction(
        "Publish this election?",
        `<p><strong>${esc(e.name)}</strong> has ${e.candidates.length} ${
          e.candidates.length === 1 ? "candidate" : "candidates"
        } and allows up to ${e.max_choices} ${
          e.max_choices === 1 ? "choice" : "choices"
        }.</p><p>Voting opens ${formatDateTime(
          e.start
        )}. Settings and candidates will be locked.</p>`,
        "Publish election"
      )
    ) {
      await api(`/elections/${e.id}/publish`, { method: "POST" });
      navigate(`/admin/elections/${e.id}`, "Election published.");
    }
  });
  bindAction("#delete-election", async () => {
    if (
      await confirmAction(
        "Delete this draft?",
        `<p>Delete <strong>${esc(e.name)}</strong> and its candidates?</p>`,
        "Delete draft",
        true
      )
    ) {
      await api(`/elections/${e.id}`, { method: "DELETE" });
      navigate("/admin", "Draft deleted.");
    }
  });
  bindAction("#close-election", async () => {
    if (
      await confirmAction(
        "Close voting now?",
        `<p>Voting in <strong>${esc(
          e.name
        )}</strong> will end immediately and the final results will become visible.</p><p>This action cannot be undone.</p>`,
        "Close & publish results",
        true
      )
    ) {
      await api(`/elections/${e.id}/close`, { method: "POST" });
      navigate(
        `/results/${e.id}`,
        "Voting closed. These are the final results."
      );
    }
  });
}

async function feedbackPage(route, version) {
  if (route === "/admin/feedback") {
    const rows = await api("/feedback");
    setPage(
      "Feedback",
      `<div class="page-top"><div><span class="eyebrow">Administration</span><h1>Voter feedback</h1><p>Latest feedback submitted through the application.</p></div>${routeLink(
        "/admin",
        "Back to administration",
        "btn secondary"
      )}</div><div class="feedback-list">${
        rows
          .map(
            (f) =>
              `<article class="card"><p>${esc(f.message)}</p><small>${esc(
                f.name
              )} · ${formatDateTime(f.created_at)}</small></article>`
          )
          .join("") ||
        empty(
          "No feedback yet",
          "Feedback will appear here after a voter submits it.",
          null
        )
      }</div>`,
      version
    );
    return;
  }
  if (
    !setPage(
      "Feedback",
      `<div class="editor"><div class="page-top"><div><span class="eyebrow">Help us improve</span><h1>Send feedback</h1><p>Share a problem or suggestion with the election administrator.</p></div></div><section class="card"><form id="feedback-form"><label for="message">Your feedback</label><textarea id="message" name="message" required minlength="5" maxlength="2000" rows="6" placeholder="Tell us about your experience…"></textarea><p class="help">Do not include passwords or verification codes.</p><div class="form-actions"><button type="submit" class="btn">Send feedback</button></div></form></section></div>`,
      version
    )
  )
    return;
  bindForm("feedback-form", async (data) => {
    await api("/feedback", { method: "POST", body: data });
    navigate(
      "/feedback",
      "Thank you. Your feedback has been saved for the administrator."
    );
  });
}

async function render() {
  const version = ++renderVersion;
  if (location.hash === "#main-content") {
    document.getElementById("main-content")?.focus();
    return;
  }
  let route = location.hash.slice(1) || legacyRoute();
  if (!route.startsWith("/")) route = "/";
  shell(route);
  try {
    const protectedRoute =
      ["/profile", "/history", "/feedback"].includes(route) ||
      route.startsWith("/admin");
    if (protectedRoute) {
      try {
        user = await api("/me");
      } catch (error) {
        if (error.status === 401) {
          user = null;
          afterLogin = route;
          navigate("/login", "Please log in to continue.");
          return;
        }
        throw error;
      }
      if (version !== renderVersion) return;
      if (route.startsWith("/admin") && user.role !== "ADMIN") {
        setPage(
          "Access restricted",
          empty(
            "Administrator access required",
            "This page is available to election administrators. Your voter account can browse and vote in elections."
          ),
          version
        );
        return;
      }
    }
    if (
      [
        "/login",
        "/register",
        "/forgot",
        "/verify",
        "/reset-code",
        "/reset",
      ].includes(route)
    )
      await authPage(route, version);
    else if (["/", "/elections", "/results", "/admin"].includes(route))
      await electionsPage(route, version);
    else if (/^\/elections\/[^/]+$/.test(route))
      await ballotPage(decodeURIComponent(route.split("/")[2]), version);
    else if (/^\/results\/[^/]+$/.test(route))
      await resultsPage(decodeURIComponent(route.split("/")[2]), version);
    else if (/^\/admin\/elections\/[^/]+$/.test(route))
      await editorPage(decodeURIComponent(route.split("/")[3]), version);
    else if (route === "/history") await historyPage(version);
    else if (route === "/profile") await profilePage(version);
    else if (route === "/feedback" || route === "/admin/feedback")
      await feedbackPage(route, version);
    else if (route === "/help")
      setPage(
        "How voting works",
        `<div class="editor"><div class="page-top"><div><span class="eyebrow">A quick guide</span><h1>How voting works</h1><p>From your first registration to the final results.</p></div></div><div class="card"><h2>1. Register and verify</h2><p>Create an account using a unique email and 14-digit demo ID. In this local demo, the verification code is shown on screen. No email is sent, and identity is not checked against an official registry.</p><h2>2. Explore the elections</h2><p>Read each candidate’s profile. Only open elections accept votes. All dates and times are displayed in your device’s time zone.</p><h2>3. Review and submit</h2><p>Choose at least one candidate, up to the stated maximum. Review the confirmation and submit. One ballot is allowed per account per election, and a submitted ballot cannot be changed.</p><h2>4. Follow the results</h2><p>Your receipt appears in My votes. Final results are available after voting closes. Ties share the same rank; elections with no votes have no winner.</p><h2>About this demonstration</h2><p>The sample accounts and elections are fictional. Account changes, ballots, and feedback are saved on this computer. The demo stores your selections with your account for voting history; it does not implement a secret-ballot election protocol. Results show share of candidate selections, not turnout or identity-verified votes.</p><div class="actions">${routeLink(
          "/elections",
          "Browse elections",
          "btn"
        )}${routeLink(
          "/feedback",
          "Send feedback",
          "btn secondary"
        )}</div></div></div>`,
        version
      );
    else
      setPage(
        "Page not found",
        empty(
          "Page not found",
          "The link may be incomplete. Browse the available elections to continue."
        ),
        version
      );
  } catch (error) {
    if (version !== renderVersion) return;
    setPage(
      "Unable to load page",
      `<div class="empty"><h1>We couldn’t load this page</h1><p>${esc(
        error.message
      )}</p><div class="actions" style="justify-content:center"><button class="btn" type="button" id="retry-page">Try again</button>${routeLink(
        "/elections",
        "Back to elections",
        "btn secondary"
      )}</div></div>`,
      version
    );
    document.getElementById("retry-page").onclick = () => render();
  }
}

async function start() {
  shell("/");
  try {
    const [health, account] = await Promise.all([
      api("/health"),
      api("/me").catch((error) => {
        if (error.status === 401) return null;
        throw error;
      }),
    ]);
    if (!["local-demo", "github-pages-demo"].includes(health.mode))
      throw new Error("This frontend requires a voting service.");
    mode = health.mode;
    user = account;
    window.addEventListener("hashchange", render);
    // Old bearer tokens are no longer used. Sessions now use HttpOnly cookies.
    localStorage.removeItem("token");
    await render();
  } catch (error) {
    const version = ++renderVersion;
    setPage(
      "Connect to voting service",
      `<div class="empty"><h1>Connect to the voting service</h1><p>${esc(
        error.message
      )}</p><p>Start the local server from the Voting_System folder with <code>npm run start:local</code>, then open its local address.</p><button class="btn" id="retry-start" type="button">Try again</button></div>`,
      version
    );
    document.getElementById("retry-start").onclick = () => start();
  }
}
start();
