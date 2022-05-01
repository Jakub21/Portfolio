let projects = {};
let sc;

let buildProjects = () => {
  let parent = $.get('#ListingContainer');
  console.log(projects);
  sc = new $toggle.SingleChoice();
  for (let [key, info] of Object.entries(projects)) {
    buildProjectElement(parent, key, info);
    sc.addToggle(key, info.toggle);
  }
  sc.goto(Object.keys(projects)[0]);
}

let buildProjectElement = (parent, key, info) => {
  parent.appendShp(`
    $div[#${key}_choice .Project] {
      $div[.Content] {
        $h2 { ${info.name} }
        $div[#${key}_body .ProjectBody] {
          ${info.short}
        }
      }
      $div[#${key}_more .ButtonMore] {$div{ $span[.Symbol] {▶} More }}
    }`)
  info.toggle = new $toggle.CssClass($.get(`#${key}_choice`), 'on', 'off', .3);
  info.toggle.off();
  $.get(`#${key}_choice`).on('click', () => { sc.goto(key); })
  $.get(`#${key}_more`).on('click', () => {
    window.location.href = `/about=${key}`;
  });
}
