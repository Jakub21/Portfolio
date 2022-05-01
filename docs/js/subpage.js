
let init = () => {
  console.log('init');
  setTimeout(() => {
    $.get('#Background')._s.remove('Intro');
    $.get('#Container')._s.remove('Intro');
  }, 500);
}

window.onbeforeunload = () => {
  $.get('#Background')._s.add('Intro');
  $.get('#Container')._s.add('Intro');
}
