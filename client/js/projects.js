let sc;

let buildProjects = () => {
  new wu.Request('allProjects').on(data => {
    if (!data.success) {
      console.error('Could not load projects list');
      return;
    }
    let projects = data.projects;
    let parent = $.get('#ProjectsContainer');
    let sorted = [];
    for (let [ID, project] of Object.entries(projects)) {
      project.ID = ID;
      sorted.push(project);
    }
    sorted.sort((a,b) => {return b.value - a.value});
    for (let project of sorted) {
      parent.appendShp(`
        $div[.Project .Page] {
          $div[.Content] {
            $div[.ProjectTitle] {
              %img[.Language src '/img/${project.language}.png']
              $div[.Name] {${project.name}}
            }
            $div[.ProjectDetails] {
              $div[.Short] {${project.short}}
              $div[.Tags] {${buildTagsShp(project.tags)}}
              $div[.Timeline] {${buildTimelineShp(project.timeline)}}
            }
            $div[.ProjectBody] {${project.long}}
            $div[.PageButtons] {${buildLinksShp(project.links)}}
          }
        }
      `);
    }
  }).onerr(e=>{console.error(e);}).get();
}
