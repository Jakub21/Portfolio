
let buildLinksShp = (links) => {
  let data = {
    repo: { name: 'Repository',
      title: 'View the repository on GitHub'
    },
    host: { name: 'Deployment',
      title: 'View the deployment of this project'
    },
    docs: { name: 'Documentation',
      title: 'View the documentation page of this project'
    },
    npm: { name: 'Published',
      title: 'View this project on NPM'
    },
    pypi: { name: 'Published',
      title: 'View this project on PYPI'
    },
  }
  shp = '';
  for (let [key, link] of Object.entries(links)) {
    shp += `$div[.Row] {
    $a[.Button .ProjectLink href '${link}' target _blank
        title '${data[key].title}'] {
      %img[.PropertyIcon src '/img/link_${key}.png']
      ${data[key].name}
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
