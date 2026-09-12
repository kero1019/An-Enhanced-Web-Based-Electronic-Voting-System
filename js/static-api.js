const KEY = "voting-system.github-demo.v1";
const SESSION_KEY = "voting-system.github-demo.session";
const DAY = 86400000;

const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const issue = (status, message) => Promise.reject(Object.assign(new Error(message), { status }));
const copy = (value) => JSON.parse(JSON.stringify(value));
const days = (number) => new Date(Date.now() + number * DAY).toISOString();

function freshState() {
  const candidates = (electionId) => [
    ["Omar Hassan", "Student First", "Computer Science", "More study spaces, practical workshops, and a stronger connection between students and faculty."],
    ["Nour Adel", "Together Forward", "Information Systems", "Accessible campus services, student wellbeing, and transparent council updates."],
    ["Youssef Ali", "New Perspective", "Business Administration", "More clubs, community projects, and opportunities to develop real-world skills."],
  ].map(([name, party, education, manifesto], index) => ({
    id: `${electionId}-${index}`,
    election_id: electionId,
    name,
    age: 22 + index,
    party,
    education,
    manifesto,
    image: "",
  }));
  const elections = [
    { id: "student-council", name: "Student Council Election", description: "Choose the voice that will represent our student community this academic year.", start: days(-1), end: days(14), max_choices: 1, published: true, demo: true, created_at: now() },
    { id: "tech-committee", name: "Technology Committee", description: "Select up to two representatives to shape campus technology and digital learning.", start: days(7), end: days(21), max_choices: 2, published: true, demo: true, created_at: now() },
    { id: "community-fund", name: "Community Fund Committee", description: "The community has chosen its representatives for student-led initiatives.", start: days(-30), end: days(-7), max_choices: 1, published: true, demo: true, created_at: now() },
  ];
  const allCandidates = elections.flatMap((e) => candidates(e.id));
  const users = [
    { id: "demo-admin", name: "Election Administrator", email: "admin@voting.local", password: "Admin@12345", nationalId: "20000000000001", mobile: "01000000000", dob: "2000-01-01", gender: "Female", role: "ADMIN", verified: true, image: "" },
    { id: "demo-voter", name: "Mariam Ahmed", email: "voter@voting.local", password: "Voter@12345", nationalId: "20000000000002", mobile: "01000000000", dob: "2000-01-01", gender: "Female", role: "USER", verified: true, image: "" },
  ];
  const ballots = Array.from({ length: 12 }, (_, index) => ({ id: `sample-ballot-${index}`, election_id: "community-fund", user_id: `sample-${index}`, created_at: days(-10) }));
  const selections = ballots.map((ballot, index) => ({ ballot_id: ballot.id, candidate_id: `community-fund-${index < 6 ? 0 : index < 10 ? 1 : 2}` }));
  return { users, elections, candidates: allCandidates, ballots, selections, feedback: [], challenges: [] };
}

function state() {
  try { return JSON.parse(localStorage.getItem(KEY)) || freshState(); }
  catch { return freshState(); }
}
function save(value) { localStorage.setItem(KEY, JSON.stringify(value)); return value; }
function currentUser(data) { const id = localStorage.getItem(SESSION_KEY); return data.users.find((user) => user.id === id && user.verified) || null; }
function publicUser(user) { const { password, ...safe } = user; return copy(safe); }
function electionStatus(election) { return !election.published ? "draft" : election.start > now() ? "upcoming" : election.end <= now() ? "closed" : "active"; }
function electionData(data, election, user) {
  const candidates = data.candidates.filter((candidate) => candidate.election_id === election.id).sort((a, b) => a.name.localeCompare(b.name));
  return { ...copy(election), status: electionStatus(election), candidates, ballotCount: data.ballots.filter((ballot) => ballot.election_id === election.id).length, alreadyVoted: Boolean(user && data.ballots.some((ballot) => ballot.election_id === election.id && ballot.user_id === user.id)) };
}
function requireUser(data) { const user = currentUser(data); if (!user) throw Object.assign(new Error("Please log in to continue."), { status: 401 }); return user; }
function requireAdmin(data) { const user = requireUser(data); if (user.role !== "ADMIN") throw Object.assign(new Error("Administrator access is required."), { status: 403 }); return user; }
function findElection(data, id) { const election = data.elections.find((item) => item.id === id); if (!election) throw Object.assign(new Error("Election not found."), { status: 404 }); return election; }
function checkPassword(value) { if (typeof value !== "string" || value.length < 8 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) throw Object.assign(new Error("Password needs 8 characters including uppercase, lowercase, and a number."), { status: 400 }); }
function challenge(data, user, purpose) { const value = uuid(); const code = String(Math.floor(100000 + Math.random() * 900000)); data.challenges = data.challenges.filter((entry) => !(entry.userId === user.id && entry.purpose === purpose)); data.challenges.push({ value, code, userId: user.id, purpose, expires: Date.now() + 600000, attempts: 0 }); save(data); return { challenge: value, demoCode: code, expiresIn: 600, email: user.email }; }
function verifyChallenge(data, body, purpose) { const entry = data.challenges.find((item) => item.value === body.challenge && item.purpose === purpose); if (!entry || entry.expires < Date.now() || entry.attempts >= 5) throw Object.assign(new Error("This verification has expired or is unavailable. Request a new code."), { status: 400 }); if (entry.code !== body.code) { entry.attempts++; save(data); throw Object.assign(new Error("Incorrect verification code."), { status: 400 }); } return entry; }
function results(data, election) {
  if (electionStatus(election) !== "closed") throw Object.assign(new Error("Results become available after the election closes."), { status: 409 });
  const candidates = data.candidates.filter((candidate) => candidate.election_id === election.id).map((candidate) => ({ ...candidate, votes: data.selections.filter((selection) => selection.candidate_id === candidate.id).length })).sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0); let previous = -1; let rank = 0;
  candidates.forEach((candidate, index) => { if (candidate.votes !== previous) rank = index + 1; previous = candidate.votes; candidate.rank = rank; candidate.percent = totalVotes ? candidate.votes * 100 / totalVotes : 0; });
  return { election: electionData(data, election), totalVotes, ballotCount: data.ballots.filter((ballot) => ballot.election_id === election.id).length, candidates, winners: totalVotes ? candidates.filter((candidate) => candidate.rank === 1).map((candidate) => candidate.id) : [] };
}

export async function staticApi(path, { method = "GET", body = {} } = {}) {
  const data = state();
  try {
    if (path === "/health") return { mode: "github-pages-demo", emailDelivery: "on-screen-demo", storage: "browser-localStorage", version: 1 };
    if (path === "/me" && method === "GET") return publicUser(requireUser(data));
    if (path === "/me" && method === "PATCH") { const user = requireUser(data); user.name = String(body.name || "").trim(); user.mobile = String(body.mobile || "").trim(); if (!user.name || !/^01[0125]\d{8}$/.test(user.mobile)) return issue(400, "Enter a valid name and Egyptian mobile number."); if (body.image !== undefined) user.image = body.image; save(data); return publicUser(user); }
    if (path === "/auth/login" && method === "POST") { const user = data.users.find((item) => item.email.toLowerCase() === String(body.email || "").toLowerCase()); if (!user || user.password !== body.password) return issue(401, "Incorrect email or password."); if (!user.verified) return issue(403, "Verify your email before logging in."); localStorage.setItem(SESSION_KEY, user.id); return publicUser(user); }
    if (path === "/auth/logout" && method === "POST") { localStorage.removeItem(SESSION_KEY); return { message: "Logged out." }; }
    if (path === "/auth/register" && method === "POST") { checkPassword(body.password); const email = String(body.email || "").trim().toLowerCase(); const nationalId = String(body.nationalId || ""); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{14}$/.test(nationalId) || !/^01[0125]\d{8}$/.test(body.mobile || "") || !["Male", "Female"].includes(body.gender) || String(body.name || "").trim().length < 2) return issue(400, "Complete all registration fields with valid details."); if (data.users.some((user) => user.email === email || user.nationalId === nationalId)) return issue(409, "Email or ID is already registered."); const user = { id: uuid(), name: body.name.trim(), email, password: body.password, nationalId, mobile: body.mobile, dob: body.dob, gender: body.gender, role: "USER", verified: false, image: "" }; data.users.push(user); return challenge(data, user, "verify"); }
    if (path === "/auth/resend" && method === "POST") { const user = data.users.find((item) => item.email === String(body.email || "").toLowerCase() && !item.verified); return user ? challenge(data, user, "verify") : { challenge: uuid(), email: body.email, expiresIn: 600 }; }
    if (path === "/auth/verify" && method === "POST") { const entry = verifyChallenge(data, body, "verify"); data.users.find((user) => user.id === entry.userId).verified = true; data.challenges = data.challenges.filter((item) => item !== entry); save(data); return { message: "Email verified." }; }
    if (path === "/auth/forgot" && method === "POST") { const user = data.users.find((item) => item.email === String(body.email || "").toLowerCase() && item.verified); return user ? { ...challenge(data, user, "reset"), message: "A reset code is ready." } : { challenge: uuid(), email: body.email, expiresIn: 600, message: "If a verified account exists, a reset code is ready." }; }
    if (path === "/auth/reset/verify" && method === "POST") { const entry = verifyChallenge(data, body, "reset"); const resetToken = uuid(); data.challenges = data.challenges.filter((item) => item !== entry); data.challenges.push({ value: resetToken, userId: entry.userId, purpose: "change", expires: Date.now() + 600000 }); save(data); return { resetToken }; }
    if (path === "/auth/reset" && method === "POST") { checkPassword(body.password); const entry = data.challenges.find((item) => item.value === body.resetToken && item.purpose === "change" && item.expires > Date.now()); if (!entry) return issue(400, "Reset link expired or already used."); data.users.find((user) => user.id === entry.userId).password = body.password; data.challenges = data.challenges.filter((item) => item !== entry); localStorage.removeItem(SESSION_KEY); save(data); return { message: "Password changed." }; }
    if (path === "/elections" && method === "GET") { const user = currentUser(data); return data.elections.filter((election) => user?.role === "ADMIN" || election.published).sort((a, b) => b.start.localeCompare(a.start)).map((election) => electionData(data, election, user)); }
    if (path === "/history" && method === "GET") { const user = requireUser(data); return data.ballots.filter((ballot) => ballot.user_id === user.id).sort((a, b) => b.created_at.localeCompare(a.created_at)).map((ballot) => ({ id: ballot.id, createdAt: ballot.created_at, election: electionData(data, findElection(data, ballot.election_id), user), candidates: data.selections.filter((selection) => selection.ballot_id === ballot.id).map((selection) => data.candidates.find((candidate) => candidate.id === selection.candidate_id)).map((candidate) => ({ id: candidate.id, name: candidate.name })) })); }
    if (path === "/elections" && method === "POST") { requireAdmin(data); const election = { id: uuid(), name: String(body.name || "").trim(), description: String(body.description || "").trim(), start: body.start, end: body.end, max_choices: Number(body.maxChoices), published: false, demo: false, created_at: now() }; if (election.name.length < 5 || !Number.isInteger(election.max_choices) || election.max_choices < 1 || election.max_choices > 5 || !Date.parse(election.start) || !Date.parse(election.end) || election.start >= election.end) return issue(400, "Enter valid election details."); data.elections.push(election); save(data); return electionData(data, election); }
    if (path === "/feedback" && method === "POST") { const user = requireUser(data); if (String(body.message || "").trim().length < 5) return issue(400, "Feedback must contain at least 5 characters."); data.feedback.push({ id: uuid(), user_id: user.id, name: user.name, message: body.message.trim(), created_at: now() }); save(data); return { message: "Thank you. Your feedback has been saved." }; }
    if (path === "/feedback" && method === "GET") { requireAdmin(data); return copy(data.feedback).reverse(); }
    const match = /^\/elections\/([^/]+)(?:\/(results|vote|publish|close|candidates))?$/.exec(path);
    if (match) { const [, electionId, action] = match; const election = findElection(data, electionId); const user = currentUser(data);
      if (method === "GET" && !action) { if (!election.published && user?.role !== "ADMIN") return issue(404, "Election not found."); return electionData(data, election, user); }
      if (method === "GET" && action === "results") return results(data, election);
      if (method === "POST" && action === "vote") { const voter = requireUser(data); if (electionStatus(election) !== "active") return issue(409, "Voting is not open for this election."); const ids = body.candidateIds; if (!Array.isArray(ids) || !ids.length || ids.length > election.max_choices || new Set(ids).size !== ids.length || ids.some((id) => !data.candidates.some((candidate) => candidate.id === id && candidate.election_id === election.id))) return issue(400, "Choose valid candidates within the ballot limit."); if (data.ballots.some((ballot) => ballot.user_id === voter.id && ballot.election_id === election.id)) return issue(409, "You have already voted in this election."); const receipt = uuid(); data.ballots.push({ id: receipt, election_id: election.id, user_id: voter.id, created_at: now() }); ids.forEach((candidateId) => data.selections.push({ ballot_id: receipt, candidate_id: candidateId })); save(data); return { receipt, message: "Your ballot has been recorded." }; }
      requireAdmin(data); if (election.published && ["PATCH", "DELETE"].includes(method)) return issue(409, "Only draft elections can be edited or deleted.");
      if (method === "PATCH" && !action) { Object.assign(election, { name: body.name, description: body.description, start: body.start, end: body.end, max_choices: Number(body.maxChoices) }); save(data); return electionData(data, election); }
      if (method === "DELETE" && !action) { data.elections = data.elections.filter((item) => item.id !== election.id); data.candidates = data.candidates.filter((candidate) => candidate.election_id !== election.id); save(data); return { message: "Draft deleted." }; }
      if (method === "POST" && action === "candidates") { if (election.published) return issue(409, "Only draft elections can be edited."); const candidate = { id: uuid(), election_id: election.id, name: String(body.name || "").trim(), age: Number(body.age), party: String(body.party || "").trim(), education: String(body.education || "").trim(), manifesto: String(body.manifesto || "").trim(), image: body.image || "" }; if (candidate.name.length < 2 || !Number.isInteger(candidate.age) || candidate.age < 18 || candidate.party.length < 2 || candidate.education.length < 2) return issue(400, "Enter valid candidate details."); data.candidates.push(candidate); save(data); return copy(candidate); }
      if (method === "POST" && action === "publish") { if (election.published) return issue(409, "Election is already published."); if (election.end <= now() || data.candidates.filter((candidate) => candidate.election_id === election.id).length < election.max_choices) return issue(400, "Add enough candidates and use a future end date before publishing."); election.published = true; save(data); return electionData(data, election); }
      if (method === "POST" && action === "close") { if (electionStatus(election) !== "active") return issue(409, "Only an active election can be closed."); election.end = now(); save(data); return results(data, election); }
    }
    const candidateMatch = /^\/candidates\/([^/]+)$/.exec(path);
    if (candidateMatch) { requireAdmin(data); const candidate = data.candidates.find((item) => item.id === candidateMatch[1]); if (!candidate) return issue(404, "Candidate not found."); const election = findElection(data, candidate.election_id); if (election.published) return issue(409, "Only draft candidates can be edited."); if (method === "DELETE") { data.candidates = data.candidates.filter((item) => item.id !== candidate.id); save(data); return { message: "Candidate removed." }; } if (method === "PATCH") { Object.assign(candidate, { name: body.name, age: Number(body.age), party: body.party, education: body.education, manifesto: body.manifesto, image: body.image || "" }); save(data); return copy(candidate); } }
    return issue(404, "API endpoint not found.");
  } catch (error) { return issue(error.status || 500, error.message || "An unexpected error occurred."); }
}
