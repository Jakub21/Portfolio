
let buildLinksShp = (links) => {
  let names = {
    repo: 'Repository', host: 'Deployment', docs: 'Documentation',
  }
  shp = '';
  for (let [key, link] of Object.entries(links)) {
    shp += `$div[.Row] {
    $a[.Button .ProjectLink href '${link}' target _blank] {
      %img[.PropertyIcon src '/img/link_${key}.png']
      ${names[key]}
    }}`;
  }
  return shp;
}

let buildTagsShp = (tags) => {
  let shp = '';
  for (let tag of tags) {
    shp += `$div[.Tag] {${tag}} `;
  }
  return shp;
}

let buildTimelineShp = (timeData) => {
  let text;
  switch (timeData.latest) {
    case undefined:
      text = `Developed in ${timeData.start}`; break;
    case '+':
      text = `Development started in ${timeData.start}`; break;
    default:
      text = `Developed from ${timeData.start} to ${timeData.latest}`; break;
  }
  return `$div[.ProjectProperty] {
    %img[.PropertyIcon src '/img/timeline.png']
    ${text}
  }`
}
