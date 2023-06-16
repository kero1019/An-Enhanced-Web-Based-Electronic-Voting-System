let c = 0;

function pop() {
  if (c == 0) {
    document.getElementById('rules').style.display = 'block';
    c = 1;
  } else {
    document.getElementById('rules').style.display = 'none';
    c = 0;
  }
}
// checkbox
let checkbox = document.getElementById('check');

checkbox.onclick = function () {
  checkbox.toggleAttribute("checked")
}

document.getElementById('proceed').onclick = function () {
  if (checkbox.hasAttribute("checked")) {
    document.getElementById('rules').style.display = 'none';
    c = 0;
    checkbox.toggleAttribute("checked")
    checkbox.checked = false;
    // window.open("../voting_panel/voting_panel.html", 'Voting Panel');
    window.location.href = '../voting_panel/voting_panel.html';
  }
}
// Cancel Button
document.getElementById('cancel').onclick = () => {
  document.getElementById('rules').style.display = 'none';
  c = 0;
  checkbox.toggleAttribute("checked")
  checkbox.checked = false;
}