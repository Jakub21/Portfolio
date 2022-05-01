
let init = () => {
  let packageID = window.location.href.split('=')[1];
  new Request('/getInfo').body({packageID}).on((data) => {
    buildContent(data);
  }).post();
}

let buildContent = (data) => {
  console.log(data);
}
