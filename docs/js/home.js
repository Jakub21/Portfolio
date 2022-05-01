
let init = () => {
  initSnowflakes();
  setTimeout(() => {
    $.get('#Container')._s.remove('Intro');
    $.get('#Canvas')._s.remove('Intro');
  }, 1e3);

  $.get('#ButtonProjects').on('click', () => {
    $.get('#Container')._s.add('SlideRight');
    $.get('#Canvas')._s.add('SlideRight');
    onSlideButton();
    setTimeout(() => {window.location.href = '/projects'}, 1e3);
  });
  $.get('#ButtonContact').on('click', () => {
    $.get('#Container')._s.add('SlideLeft');
    $.get('#Canvas')._s.add('SlideLeft');
    onSlideButton();
    setTimeout(() => {window.location.href = '/contact'}, 1e3);
  });
}

onSlideButton = () => {
  $.get('#Container')._s.add('Outro');
  $.get('#Background')._s.add('Outro');
}

window.onbeforeunload = () => {
  $.get('#Container')._s.remove('SlideRight').remove('SlideLeft').remove('Outro');
  $.get('#Canvas')._s.remove('SlideRight').remove('SlideLeft');
  $.get('#Background')._s.remove('Outro');
}
