let sc;

let buildProjects = () => {
  new wu.Request('allProjects').on(data => {
    if (!data.success) {
      console.error('Could not load projects list');
      return;
    }
    let projects = data.projects;
    let parent = $.get('#ListingContainer');
    sc = new $toggle.SingleChoice();
    let sorted = [];
    for (let [ID, project] of Object.entries(projects)) {
      project.ID = ID;
      sorted.push(project);
    }
    sorted.sort((a,b) => {return b.value - a.value});
    console.log(sorted);
    for (let project of sorted) {
      buildProjectElement(parent, project);
      sc.addToggle(project.ID, project.toggle);
    }
    sc.goto(sorted[0].ID);
  }).onerr(e=>{console.error(e);}).get();
}

let buildProjectElement = (parent, project) => {
  parent.appendShp(`
    $div[#${project.ID}_choice .Project] {
      $div[.Content] {
        $h2 { ${project.name} }
        $div[#${project.ID}_body .ProjectBody] {
          $div[.Short] {${project.short}}
          $div[.Tags] {${buildTagsShp(project.tags)}}
        }
      }
      $div[#${project.ID}_more .ButtonMore] {$div{ $span[.Symbol] {▶} More }}
    }`)
  let container = $.get(`#${project.ID}_choice`);
  project.toggle = new $toggle.CssClass(
    container, 'on', 'off', .3);
  project.toggle.off();
  container.on('click', () => { sc.goto(project.ID); })
  $.get(`#${project.ID}_more`).on('click', () => {
    window.location.href = `/about=${project.ID}`;
  });
}
