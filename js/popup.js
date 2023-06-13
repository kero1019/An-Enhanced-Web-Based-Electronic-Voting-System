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