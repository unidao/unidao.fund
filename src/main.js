const documentWidth = document.documentElement.clientWidth;


let navIsOpen = false
let btn = document.querySelector('.burger-btn')
let nav = document.querySelector('.header-nav')
btn.addEventListener('click', function () {
  btn.classList.toggle('close')
  nav.classList.toggle('header-nav-open')
})
function navClose() {
  btn.classList.remove('close')
  nav.classList.remove('header-nav-open')
}
nav.addEventListener('click', navClose)



function updateSvg() {
  const docWidth = document.documentElement.clientWidth;
  const dynamicPath = document.getElementById("dynamic-path");
  const wave = `M0 3000L${docWidth} 3000L${docWidth} 16C${docWidth} 16 ${(docWidth * 0.85)} -20 ${(docWidth * 0.45)} 16C${(docWidth * 0.2)} 52 0 16 0 16L0 3000Z`
  dynamicPath.setAttribute("d", wave);
  if (docWidth > 1920) {
    const bumperFixed = document.getElementById("bumper-fixed");
    bumperFixed.setAttribute("d", wave)
    bumperFixed.innerHTML = `<animate attributeType="XML" attributeName="d" from="${wave}" dur="2s" repeatCount="indefinite"/>`
  }      
}
updateSvg()
window.addEventListener('resize', updateSvg)










function throttle(func, timeFrame) {
  let lastTime = 0;
  return function () {
    const now = new Date();
    if (now - lastTime >= timeFrame) {
      func();
      lastTime = now;
    }
  };
}


const container = document.querySelector('.fixed-bg-sections')
const sections = document.querySelectorAll('.practice-section')
const images = container.querySelectorAll('.fixed-img-wrap')

let vh = 1080, pc_offset = documentWidth < 1600 ? 0 : 100

function centr() {
  const px = documentWidth < 700 ? window.scrollY - 60 : window.scrollY
  images.forEach((el, i) => {
    let tr = px - sections[i].offsetTop + (i === 0 ? 0 : vh)
    if (tr < 0) return;
    if (i == 3 && tr > vh+pc_offset) return;
    el.style.transform = `translateY(${tr}px)`
  })
}

const scr = centr
const observer = new IntersectionObserver(([entry]) => {
  entry.isIntersecting ? window.addEventListener('scroll', scr) : window.removeEventListener('scroll', scr);
  if (entry.isIntersecting) {
    images[1].style.top = `-${vh}px`
    images[2].style.top = `-${vh}px`
    images[3].style.top = `-${vh}px`
  }
});
observer.observe(container)


// const wantSection = document.querySelector('.want-section')
// const obs2 = new IntersectionObserver(([entry])=>{
//   if(entry.isIntersecting) wantSection.classList.add('in-viewport')
// })
// obs2.observe(wantSection)