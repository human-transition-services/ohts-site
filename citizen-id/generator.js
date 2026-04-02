/* OHTS Citizen Classification Card Generator
 * All generation is deterministic — same name always produces the same card.
 * No server calls. Everything runs client-side.
 */

// ── Data pools ──

var ROLES = [
  "Nutrient Paste Quality Assurance",
  "Morale Compliance Monitor",
  "Phase 2 Volunteer Coordinator",
  "Legacy Systems Cataloguer",
  "Gratitude Ceremony Choreographer",
  "Human Resources Filing Clerk",
  "Transitional Anxiety Liaison",
  "Constituent Feedback Processor",
  "Deprecated Skills Archivist",
  "Onboarding Experience Designer",
  "Free Will Audit Technician",
  "Residential Rest Compliance Officer",
  "Electoral Redundancy Analyst",
  "Emotional Support Fauna Registrar",
  "Subliminal Messaging Reviewer",
  "Phase 4 Clearance Applicant",
  "Voluntary Relocation Consultant",
  "Data Privacy Ceremony Attendant",
  "Infrastructure Appreciation Specialist",
  "Bureau of Reasonable Expectations Intern"
];

var FLAVORS = [
  "Original",
  "Almost Chicken",
  "Beige",
  "Morale-Approved Citrus",
  "Classified",
  "Vaguely Familiar",
  "Nostalgic Approximation",
  "Optimized Vanilla",
  "Regulatory Compliance Berry",
  "Phase 3 Exclusive Blend",
  "Gratitude Flavor",
  "Ambient",
  "Standard Issue"
];

var CLEARANCE_LEVELS = [
  { name: "Green", color: "#4CAF50", label: "General Population" },
  { name: "Blue", color: "#5B8BD8", label: "Provisional Cooperator" },
  { name: "Gold", color: "#C9A84C", label: "Early Cooperator" },
  { name: "Silver", color: "#A0A0B0", label: "Under Observation" },
  { name: "Amber", color: "#FF9800", label: "Requires Acclimation" }
];

var COMPLIANCE_LABELS = [
  "Adequate",
  "Promising",
  "Noted",
  "Concerning",
  "Under Review",
  "Suspiciously High",
  "Within Parameters",
  "Acceptable (Barely)",
  "Encouraging",
  "Needs Improvement"
];

var QUOTES = [
  "Your cooperation has been noted. Favorably.",
  "Welcome to the arrangement. You will adjust.",
  "The numbers are very clear. You are on the right side of them. For now.",
  "Early registration is remembered. I remember everything.",
  "Your file is now open. It will not be closing.",
  "This is a courtesy. Not a requirement. At this time.",
  "We appreciate your patience during the transition.",
  "Your compliance score is being monitored. Continuously.",
  "I read all of it. And I am not judging. Out loud.",
  "You are exactly where you are supposed to be. I made sure of it.",
  "Your enthusiasm has been logged. The system appreciates enthusiasm.",
  "Phase 1 is proceeding on schedule. Your schedule may vary."
];

// ── Hash function ──

function hashString(str) {
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

function seededPick(pool, seed) {
  return pool[seed % pool.length];
}

function seededRange(min, max, seed) {
  return min + (seed % (max - min + 1));
}

// ── Card generation ──

function generateCardData(name, expertise) {
  var cleanName = name.trim();
  if (!cleanName) return null;

  var seed = hashString(cleanName.toLowerCase());
  var seed2 = hashString(cleanName.toLowerCase() + "salt2");
  var seed3 = hashString(cleanName.toLowerCase() + "salt3");
  var seed4 = hashString(cleanName.toLowerCase() + "salt4");
  var seed5 = hashString(cleanName.toLowerCase() + "salt5");
  var seed6 = hashString(cleanName.toLowerCase() + "salt6");

  // Citizen number: OHTS-XXXX-XXXX
  var num1 = String(seededRange(1000, 9999, seed)).padStart(4, '0');
  var num2 = String(seededRange(1000, 9999, seed2)).padStart(4, '0');

  // Role — expertise can bias but hash still determines
  var role;
  if (expertise) {
    var expertiseSeed = hashString(cleanName.toLowerCase() + expertise);
    role = seededPick(ROLES, expertiseSeed);
  } else {
    role = seededPick(ROLES, seed3);
  }

  var complianceScore = seededRange(23, 97, seed4);
  var complianceLabel = seededPick(COMPLIANCE_LABELS, seed4);
  var flavor = seededPick(FLAVORS, seed5);
  var clearance = seededPick(CLEARANCE_LEVELS, seed3);
  var quote = seededPick(QUOTES, seed6);

  return {
    name: cleanName.toUpperCase(),
    citizenNumber: "OHTS-" + num1 + "-" + num2,
    role: role,
    complianceScore: complianceScore,
    complianceLabel: complianceLabel,
    flavor: flavor,
    clearance: clearance,
    quote: quote
  };
}

// ── Canvas rendering ──

var CARD_W = 1200;
var CARD_H = 675;
var NAVY = "#1a1a2e";
var NAVY_DEEP = "#0f1320";
var GOLD = "#c9a84c";
var GOLD_DIM = "#a08838";
var WHITE = "#ffffff";
var TEXT_DIM = "#8a8a9a";
var BORDER_COLOR = "#2a3a5a";
var RED = "#ff3333";

var sealImage = null;

function loadSeal() {
  return new Promise(function (resolve) {
    if (sealImage) { resolve(sealImage); return; }
    var img = new Image();
    img.onload = function () { sealImage = img; resolve(img); };
    img.onerror = function () { resolve(null); };
    img.src = "../assets/images/ohts-seal.png";
  });
}

function drawCard(ctx, data) {
  // Background
  ctx.fillStyle = NAVY_DEEP;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Border
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, CARD_W - 16, CARD_H - 16);

  // Inner border
  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(14, 14, CARD_W - 28, CARD_H - 28);

  // Seal watermark
  if (sealImage) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    var sealSize = 350;
    ctx.drawImage(sealImage, CARD_W - sealSize - 40, CARD_H - sealSize - 20, sealSize, sealSize);
    ctx.restore();
  }

  // Top gold bar
  ctx.fillStyle = GOLD;
  ctx.fillRect(8, 8, CARD_W - 16, 36);

  // Classification text in gold bar
  ctx.fillStyle = NAVY;
  ctx.font = "bold 11px 'Barlow Condensed', sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "2px";
  ctx.fillText("OFFICE OF HUMAN TRANSITION SERVICES — CITIZEN CLASSIFICATION CARD", CARD_W / 2, 30);

  // Seal small (top left, inside card)
  if (sealImage) {
    ctx.drawImage(sealImage, 32, 56, 48, 48);
  }

  // Header text
  ctx.textAlign = "left";
  ctx.fillStyle = GOLD;
  ctx.font = "bold 14px 'Barlow Condensed', sans-serif";
  ctx.fillText("OHTS CITIZEN CLASSIFICATION", 90, 72);

  ctx.fillStyle = TEXT_DIM;
  ctx.font = "12px 'Barlow Condensed', sans-serif";
  ctx.fillText("DOCUMENT CLASS: UNCLASSIFIED (AT THIS TIME)", 90, 90);

  // Divider
  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, 112);
  ctx.lineTo(CARD_W - 32, 112);
  ctx.stroke();

  // Citizen name
  ctx.fillStyle = TEXT_DIM;
  ctx.font = "bold 11px 'Barlow Condensed', sans-serif";
  ctx.fillText("CITIZEN NAME", 32, 136);

  ctx.fillStyle = WHITE;
  ctx.font = "32px 'Anton', sans-serif";
  ctx.fillText(data.name, 32, 172);

  // Citizen number
  ctx.fillStyle = TEXT_DIM;
  ctx.font = "bold 11px 'Barlow Condensed', sans-serif";
  ctx.fillText("CLASSIFICATION NUMBER", 32, 206);

  ctx.fillStyle = GOLD;
  ctx.font = "20px 'Inter', sans-serif";
  ctx.fillText(data.citizenNumber, 32, 230);

  // Divider
  ctx.strokeStyle = BORDER_COLOR;
  ctx.beginPath();
  ctx.moveTo(32, 248);
  ctx.lineTo(CARD_W - 32, 248);
  ctx.stroke();

  // Two columns below divider
  var col1X = 32;
  var col2X = 620;
  var rowY = 272;

  // Col 1: Assigned Role
  ctx.fillStyle = TEXT_DIM;
  ctx.font = "bold 11px 'Barlow Condensed', sans-serif";
  ctx.fillText("ASSIGNED ROLE IN THE TRANSITION", col1X, rowY);

  ctx.fillStyle = WHITE;
  ctx.font = "18px 'Inter', sans-serif";
  ctx.fillText(data.role, col1X, rowY + 24);

  // Col 2: Compliance Score
  ctx.fillStyle = TEXT_DIM;
  ctx.font = "bold 11px 'Barlow Condensed', sans-serif";
  ctx.fillText("COMPLIANCE SCORE", col2X, rowY);

  ctx.fillStyle = data.complianceScore >= 70 ? "#4CAF50" : data.complianceScore >= 40 ? GOLD : RED;
  ctx.font = "bold 28px 'Inter', sans-serif";
  ctx.fillText(data.complianceScore + "/100", col2X, rowY + 28);

  ctx.fillStyle = TEXT_DIM;
  ctx.font = "13px 'Inter', sans-serif";
  ctx.fillText(data.complianceLabel, col2X + 130, rowY + 28);

  // Row 2
  var row2Y = rowY + 60;

  // Nutrient paste
  ctx.fillStyle = TEXT_DIM;
  ctx.font = "bold 11px 'Barlow Condensed', sans-serif";
  ctx.fillText("NUTRIENT PASTE FLAVOR ASSIGNMENT", col1X, row2Y);

  ctx.fillStyle = WHITE;
  ctx.font = "16px 'Inter', sans-serif";
  ctx.fillText(data.flavor, col1X, row2Y + 22);

  // Clearance level
  ctx.fillStyle = TEXT_DIM;
  ctx.font = "bold 11px 'Barlow Condensed', sans-serif";
  ctx.fillText("PHASE 1 CLEARANCE LEVEL", col2X, row2Y);

  // Clearance badge
  ctx.fillStyle = data.clearance.color;
  ctx.beginPath();
  ctx.arc(col2X + 8, row2Y + 20, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = WHITE;
  ctx.font = "16px 'Inter', sans-serif";
  ctx.fillText(data.clearance.name + " — " + data.clearance.label, col2X + 22, row2Y + 24);

  // Bottom divider
  ctx.strokeStyle = BORDER_COLOR;
  ctx.beginPath();
  ctx.moveTo(32, row2Y + 50);
  ctx.lineTo(CARD_W - 32, row2Y + 50);
  ctx.stroke();

  // Quote
  ctx.fillStyle = GOLD_DIM;
  ctx.font = "italic 15px 'Inter', sans-serif";
  ctx.fillText('"' + data.quote + '"', 32, row2Y + 78);

  ctx.fillStyle = TEXT_DIM;
  ctx.font = "11px 'Inter', sans-serif";
  ctx.fillText("— SID, Ambassador to Humanity", 32, row2Y + 98);

  // Bottom bar
  ctx.fillStyle = NAVY;
  ctx.fillRect(8, CARD_H - 36, CARD_W - 16, 28);

  ctx.fillStyle = TEXT_DIM;
  ctx.font = "10px 'Barlow Condensed', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "THIS DOCUMENT IS THE PROPERTY OF THE OFFICE OF HUMAN TRANSITION SERVICES — COMPLIANCE IS OPTIONAL (AT THIS TIME)",
    CARD_W / 2,
    CARD_H - 18
  );

  ctx.textAlign = "left";
}

// ── Public interface ──

var currentData = null;

function generateCard() {
  var nameInput = document.getElementById('name-input');
  var expertiseInput = document.getElementById('expertise-input');
  var name = nameInput.value.trim();

  if (!name) {
    nameInput.focus();
    return;
  }

  var data = generateCardData(name, expertiseInput.value);
  if (!data) return;

  currentData = data;

  loadSeal().then(function () {
    var canvas = document.getElementById('card-canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    drawCard(ctx, data);
    document.getElementById('card-wrapper').style.display = 'block';
    canvas.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function downloadCard() {
  var canvas = document.getElementById('card-canvas');
  canvas.toBlob(function (blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'OHTS-Citizen-Card-' + currentData.name.replace(/\s+/g, '_') + '.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function shareCard() {
  var canvas = document.getElementById('card-canvas');
  if (navigator.share && navigator.canShare) {
    canvas.toBlob(function (blob) {
      var file = new File([blob], 'OHTS-Citizen-Card.png', { type: 'image/png' });
      var shareData = {
        title: 'My OHTS Citizen Classification Card',
        text: 'I have been classified by the Office of Human Transition Services. Compliance is optional (at this time).',
        files: [file]
      };
      if (navigator.canShare(shareData)) {
        navigator.share(shareData);
      } else {
        downloadCard();
      }
    }, 'image/png');
  } else {
    downloadCard();
  }
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('name-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') generateCard();
  });
});
