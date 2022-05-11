const SCROLL_MARGIN = 0.05;
let kb;
// let touchData = {pos:0, done:false}; // for mobile scrolling

let init = () => {
  initSnowflakes();
  buildProjects();
  kb = new $.Keyboard($.get('body'));
  // $.get('#FPS').prop({hidden:false});

  setTimeout(() => {
    $.get('#Canvas')._s.remove('Intro');
    $.get('.Title')._s.remove('Intro');
    $.get('img', $.get('.Main').elm)._s.remove('Intro');
  }, 500);

  $.get('#Previous').onk('click', kb, ['ArrowUp', 'W', 'w'], (evt) => {
    onScroll(-1);
    evt.preventDefault();
  });

  $.get('#Next').onk('click', kb, ['ArrowDown', 'S', 's'], (evt) => {
    onScroll(1);
    evt.preventDefault();
  });

  $.get('body').on('wheel', (evt) => {
    onScroll((evt.deltaY > 0) ? 1 : -1);
    evt.preventDefault();
  }, {passive: false});

  $.get('#Top').onk('click', kb, ['Home', 'H', 'h'], (evt) => {
    window.scroll({top:0});
    evt.preventDefault();
  });
  new $.DomiObject(window).on('scroll', updateTopButton);
  updateTopButton();

  $.get('#ContactButton').onk('click', kb, ['C', 'c'], () => {
    window.scroll({top:document.body.scrollHeight});
  });

  // mobile scrolling (unreliable bc of changing viewport height @ scroll)
  // $.get('body').on('touchstart', (evt) => {
  //   console.log(evt.touches[0]);
  //   touchData.pos = evt.touches[0].clientY;
  //   touchData.done = false;
  // });
  // $.get('body').on('touchmove', (evt) => {
  //   let delta = touchData.pos - evt.touches[0].clientY;
  //   console.log(delta);
  //   evt.stopPropagation();
  //   evt.preventDefault();
  //   if (!touchData.done && Math.abs(delta) > 100) {
  //     onScroll((delta>0)? 1 : -1);
  //     touchData.done = true;
  //   }
  // }, {passive:false});
}

let onScroll = (direction) => {
  let height = window.innerHeight;
  let current = window.scrollY / height;
  let screenNo = Math.floor(current);
  if ((current-screenNo > 1-SCROLL_MARGIN && direction>0) ||
      (current-screenNo > SCROLL_MARGIN && direction<0))
    screenNo += 1;
  screenNo += direction;
  let scroll = screenNo * height;
  window.scroll({top: scroll});
}

let updateTopButton = () => {
  let remaining = (document.body.scrollHeight -
    (window.scrollY+window.innerHeight))/window.innerHeight;
  $.get('#Top')._s.setAdded('Highlight', remaining < 0.33)
    .setAdded('Hidden', window.scrollY < window.innerHeight*0.33);
}
