
let buildProject = () => {
  const pid = window.location.href.split('=')[1];
  new wu.Request(`project=${pid}`).on((data) => {
    if (!data.success) {
      console.error('Could not load project info');
      return;
    }
    let project = data.project;
    document.title = document.title.split('|')[0] + ` | ${project.name}`;
    $.get('#ProjectContainer').appendShp(`
      $div[.ProjectHead] {
        $div[.Title] {
          %img[.Language src '/img/${project.language}.png']
          $div[.Name] {${project.name}}
        }
        $div[.Details] {
          $div[.ShortDesc] {${project.short}}
          $div[.Links] {${buildLinksShp(project.links)}}
          $div[.Timeline] {${buildTimelineShp(project.timeline)}}
          $div[.Tags] {${buildTagsShp(project.tags)}}
        }
      }
      $div[.ProjectBody] {${project.long}}
    `);
  }).onerr(e=>{console.error(e);}).get();
}
