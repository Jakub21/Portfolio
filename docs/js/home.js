const SCROLL_MARGIN = 0.05;

let init = () => {
  initSnowflakes();
  buildProjects();

  setTimeout(() => {
    $.get('#Canvas')._s.remove('Intro');
    $.get('.Title')._s.remove('Intro');
    $.get('img', $.get('.Main').elm)._s.remove('Intro');
  }, 500);

  $.get('#ProjectsButton').on('click', () => {
    window.scroll({top:window.innerHeight});
  });

  $.get('#ContactButton').on('click', () => {
    window.scroll({top:document.body.scrollHeight});
  });

  $.get('body').on('wheel', (evt) => {
    let delta = window.innerHeight * ((evt.deltaY > 0) ? 1 : -1);
    let current = window.scrollY / window.innerHeight;
    let screenNo = Math.floor(current);
    if ((current-screenNo > 1-SCROLL_MARGIN && delta>0) ||
        (current-screenNo > SCROLL_MARGIN && delta<0))
      screenNo += 1;
    let scroll = delta + screenNo * window.innerHeight;
    window.scroll({top: scroll});
    evt.preventDefault();
  }, {passive: false});
}
