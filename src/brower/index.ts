function queryAll(selector='') {
  return [...document.querySelectorAll(selector)]
}

function getHref(a:HTMLLinkElement) {
  return a.getAttribute('href')
}