
let brikStyleSheet = `

@import url('https://fonts.googleapis.com/css2?family=Edu+SA+Beginner:wght@500&family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

:root {
    --primary-color: #181A22;
    --primary-color-rgb: 24,26,34;
    --secondary-color: #898D9A;
    --tertiary-color: #F6F7F8;
    --white-color: #FFF;
    --black-color: #000;
    --black-color-rgb: 0, 0, 0;
    --white-color-rgb: 255, 255, 255;
    --grey-color: #898D9A;
    --red-color: #ff4444;
    --cyan-color: #44f6ff;
    --tint-color: #601CF2;
    --tint-color-rgb: 96, 28, 242;
    --shadow-opacity: 0.07;
    --shadow-opacity-hover: 0.1;
    --glow-opacity: 0.07;
    --bg-body-color: #FCFEFB;
    --bg-body-color-rgb: 252, 254, 251;

    --rounded-s: 1vh;
    --rounded-m: 1.5vh;
    --rounded-m-up: 1.5vh 1.5vh 0 0;
    --rounded-m-end: 0 1.5vh 1.5vh 0;
    --rounded-m-top-end: 0 1.5vh 0 0;
    --rounded-l: 2vh;
    --rounded-xl: 2.5vh;
    --rounded-xxl: 100vh;

    --padded-s: 5px;
    --padded-m: 10px;
    --padded-l: 15px;
    --padded-xl: 20px;
    --padded-xxl: 30px;
}

html[data-theme='light'] {
    --bg-body-color: #FCFEFB;
    --bg-body-color-rgb: 252, 254, 251; 
    --primary-color: #181A22;
    --primary-color-rgb: 24,26,34;
    --secondary-color: #898D9A;
    --tertiary-color: #F6F7F8;
    --tint-color: #601CF2;
    --tint-color-rgb: 96, 28, 242;
    --glow-opacity: 0.07;
}

html[data-theme='dark'] {
    --bg-body-color: #02040A;
    --bg-body-color-rgb: 2,4,10; 
    --primary-color: #EAEDF2;
    --primary-color-rgb: 234, 237, 242;
    --tertiary-color-rgb: 14,17,23;
    --secondary-color: #7C8590;
    --secondary-color-rgb: 124,133,144;
    --tertiary-color: #0E1117;
    --tint-color: #6e32f0;
    --tint-color-rgb: 110, 50, 240;
    --shadow-opacity: 0.3;
    --shadow-opacity-hover: 0.6;
    --glow-opacity: 0.15;
}

[data-theme='light'] .d-block-light,
[data-theme='dark'] .d-block-dark {
    display: block !important;
}

html {
    scroll-behavior: smooth;
}

* {
    font-family: 'IBM Plex Sans', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Custom scrollbar */

.customScrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px
}

.customScrollbar:hover::-webkit-scrollbar-thumb {
    background-color: rgba(var(--primary-color-rgb), var(--shadow-opacity));
    border-radius: 20px;
}
  
.customScrollbar::-webkit-scrollbar-track {
    background: transparent;
}
  
.customScrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(var(--primary-color-rgb), 0);
    border-radius: 20px;
}

/* Hided scrollbar */

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

*::-webkit-scrollbar {
    display: none;
}

*{
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Avatars */

.avatar-l {
    width: 50px;
    height: 50px;
}

.avatar-m {
    width: 30px;
    height: 30px;
}

.avatar-s {
    width: 22px;
    height: 22px;
}

/* Approaches */

.board {
    padding: 0;
}

.land {
    padding: 0 10% 0 10%;
}

/* Transitions */

.transition-smooth {
    transition: .2s;
}

/* Shadows */

.shadow-one {
    box-shadow: 0px 2px 10px rgba(var(--black-color-rgb), var(--shadow-opacity));
}

.shadow-two {
    box-shadow: 0px 5px 15px 5px rgba(var(--black-color-rgb), var(--shadow-opacity));
}

.shadow-dynamic {
    transition: .2s;
    box-shadow: 0px 0px 0px rgba(var(--black-color-rgb), 0);
}

.shadow-dynamic:hover {
    transition: .2s;
    box-shadow: 0px 0px 7px rgba(var(--black-color-rgb), var(--shadow-opacity));
}

/* Glows */

.glow-dynamic {
    transition: .2s;
    box-shadow: 0px 0px 10px rgba(var(--white-color-rgb), var(--glow-opacity));
}

.glow-dynamic:hover {
    transition: .2s;
    box-shadow: 0px 2px 13px rgba(var(--white-color-rgb), var(--glow-opacity-hover));
}

/* Overflows approaches */

.overflow-hidden {
    overflow: hidden;
}

.overflow-auto {
    overflow: auto;
}

.overflow-scroll {
    overflow: scroll;
}

/* Cursors */

.cursor-pointer {
    cursor: pointer;
}

.cursor-help {
    cursor: help;
}

/* Wrap approaches */

.no-wrap {
    white-space: nowrap;
}

.wrap {
    white-space: wrap;
}

/* List approaches */

.list-decoration-none {
    list-style-type: none;
}

/* Padding */

.xxs-padded {
    padding: 2px 10px 4px 10px;
}

.xs-padded {
    padding: 5px;
}

.s-padded {
    padding: 10px;
}

.s-padded-wide {
    padding: 5px 8px 5px 8px;
}

.padded-wide {
    padding: 7px 15px 8px 15px;
}

.padded {
    padding: 20px;
}

.x-padded {
    padding: 30px;
}

.no-padded-top {
    padding-top: 0;
}

.no-padded-bottom {
    padding-bottom: 0;
}

.no-padded-left {
    padding-left: 0;
}

.no-padded-right {
    padding-right: 0;
}

/* Position approaches */

.absolute {
    position: absolute;
}

.fixed {
    position: fixed;
}

.sticky {
    position: sticky;
}

.relative {
    position: relative;
}

.to-left {
    left: 0;
}

.to-right {
    right: 0;
}

.to-bottom {
    bottom: 0;
}

.to-top {
    top: 0;
}

/* Alignment disposals */

.to-start {
    align-items: start;
}

.to-center {
    align-items: center;
}

.to-end {
    align-items: end;
}

.flex-start {
    justify-content: flex-start;
}

.flex-end {
    justify-content: flex-end;
}

.flex-center {
    justify-content: center;
}

.spaced {
    justify-content: space-between;
}

.full-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vertical-center {
    align-self: center;
    justify-content: center;
}

/* Cover disposal */

.cover {
    object-fit: cover;
}

.cover-top {
    object-position: top;
}

.cover-left {
    object-position: left;
}

.cover-right {
    object-position: 0 0;
}

/* Paragraph */

.text-left {
    text-align: left;
}

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
}

/* Hovering colors */

.hover-fill-tint:hover {
    fill: var(--tint-color) !important;
}

.hover-fill-primary:hover {
    fill: var(--primary-color) !important;
}

.hover-color-tint:hover {
    color: var(--tint-color) !important;
}

.hover-color-primary:hover {
    color: var(--primary-color) !important;
}

.hover-bg-lighter:hover {
    background-color: rgba(var(--primary-color-rgb), var(--glow-opacity));
}

/* Background colors */

.bg-lighter {
    background-color: rgba(var(--primary-color-rgb), var(--glow-opacity));
}

.bg-tint-lighter {
    background-color: rgba(var(--tint-color-rgb), var(--glow-opacity));
}

.bg-tint {
    background-color: var(--tint-color);
}
.bg-white {
    background-color: var(--white-color);
}

.bg-black {
    background-color: var(--black-color);
}

.bg-grey {
    background-color: var(--grey-color);
}

.bg-body {
    background-color: var(--bg-body-color);
}

.bg-body-o {
    background-color: rgba(var(--bg-body-color-rgb) , 0.6);
}

.bg-primary {
    background-color: var(--primary-color);
}

.bg-secondary {
    background-color: var(--secondary-color);
}

.bg-tertiary {
    background-color: var(--tertiary-color);
}

.bg-none {
    background: none;
    background-color: none;
}

/* Focus assingments */

.focus-fill-tint:focus {
    fill: var(--tint-color) !important;
}

.focus-color-tint:focus {
    color: var(--tint-color) !important;
}

/* Colors assingments */

.color-black {
    color: var(--black-color);
}

.color-grey {
    color: var(--grey-color);
}

.color-white {
    color: var(--white-color);
}

.color-tint {
    color: var(--tint-color);
}

.color-body {
    color: var(--bg-body-color);
}

.color-primary {
    color: var(--primary-color);
}

.color-secondary {
    color: var(--secondary-color);
}

.color-tertiary {
    color: var(--tertiary-color);
}

.color-alert {
    color: var(--red-color);
}

.color-info {
    color: var(--blue-color);
}

.color-violet {
    color: var(--violet-color);
}

/* Fills assingments */

.fill-white {
    fill: var(--white-color);
}

.fill-black {
    fill: var(--black-color);
}

.fill-alert {
    fill: var(--red-color);
}

.fill-body {
    fill: var(--bg-body-color);
}

.fill-tint {
    fill: var(--tint-color);
}

.fill-primary {
    fill: var(--primary-color) !important;
}

.fill-secondary {
    fill: var(--secondary-color);
}

.fill-tertiary {
    fill: var(--tertiary-color);
}

/* Font weights */

.font-100 {
    font-weight: 100;
}

.font-200 {
    font-weight: 200;
}

.font-300 {
    font-weight: 300;
}

.font-400 {
    font-weight: 400;
}

.font-500 {
    font-weight: 500;
}

.font-600 {
    font-weight: 600;
}

.font-700 {
    font-weight: 700;
}

.font-800 {
    font-weight: 800;
}

.font-900 {
    font-weight: 900;
}

/* Font sizes */

.font-xs {
    font-size: smaller;
}

.font-s {
    font-size: small;
}

.font-m {
    font-size: medium;
}

.font-l {
    font-size: large;
}

.font-xl {
    font-size: larger;
}

.font-xxl {
    font-size: xx-large;
}

.font-xxxl {
    font-size: 50px
}

.font-max {
    font-size: 80px
}

/* Font styles */

.italic {
    font-style: italic;
}

/* Text styles */

.decoration-none {
    text-decoration: none;
}

.underlined {
    text-decoration: underline;
}

/* Gaps */

.xs-gap {
    grid-gap: 5px;
}

.no-gap {
    grid-gap: 0px;
}

.s-gap {
    grid-gap: 10px;
}

.m-gap {
    grid-gap: 20px;
}

.l-gap {
    grid-gap: 40px;
}

.responsive-l-gap {
    grid-gap: 40px;
}

/* Z Index */

.z-0 {
    z-index: 0;
}

.z-1 {
    z-index: 1;
}

.z-2 {
    z-index: 2;
}

.z-3 {
    z-index: 3;
}

.z-i {
    z-index: 999;
}

/* Opacities */

.o-2 {
    opacity: .2;
}

.o-4 {
    opacity: .4;
}

.o-6 {
    opacity: .6;
}

.o-8 {
    opacity: .8;
}

.o-0 {
    opacity: 0;
}

/* Tricks */

.on-mobile-hide {
    visibility: visible;
}

.on-desktop-hide {
    visibility: hidden;
}

.on-mobile-show {
    visibility: collapse;
    display: none;
}

.child {
    display: none;
    opacity: 0;
}

.show-my-child:hover .child {
    display: block;
    opacity: 1;
}

.border-box {
    box-sizing: border-box;
}

/* Limited width */

.max-width-100 {
    max-width: 100%;
}

/* Fit width */

.width-fit {
    width: fit-content;
}

.responsive-width-fit {
    width: fit-content;
}

/* Steady widths */

.width-100 {
    width: 100%;
}

.height-100 {
    height: 100vh;

}

.width-66 {
    width: calc(100% / 1.5);
}

.width-50 {
    width: 50%;
}
 
.width-33 {
    width: calc(100% / 3);
}

.width-25 {
    width: 25%;
}

.width-20 {
    width: 20%;
}

/* Responsive widths */

.responsive-width-66 {
    width: calc(100% / 1.5);
}

.responsive-width-50 {
    width: 50%;
}

.responsive-width-33 {
    width: calc(100% / 3);
}

.responsive-width-25 {
    width: 25%;
}

.responsive-width-20 {
    width: 20%;
}

.responsive-width-16 {
    width: calc(100% / 6);
}

@media only screen and (max-width: 1600px) {

    .land {
        padding: 0 15% 0 15%;
    }

    .responsive-l-gap {
        grid-gap: 30px;
    }

}

@media only screen and (max-width: 1200px) {

    .land {
        padding: 0 40px 0 40px;
    }

    .responsive-l-gap {
        grid-gap: 20px;
    }

}

@media only screen and (max-width: 1100px) {

    .land {
        padding: 0 30px 0 30px;
    }
}

@media only screen and (max-width: 900px) {

    .on-mobile-hide {
        visibility: collapse;
        display: none;
    }

    .on-desktop-hide {
        visibility: visible;
    }

    .on-mobile-show {
        visibility: visible;
        display: block;
    }

    .responsive-width-25 {
        width: 50%;
    }

    .responsive-width-20 {
        width: 50%;
    }

    .responsive-width-16 {
        width: calc(100% / 3);
    }

    .responsive-width-33 {
        width: 100%;
    }

    .responsive-width-66 {
        width: 100%;
    }
}

@media only screen and (max-width: 600px) {

    .responsive-l-gap {
        grid-gap: 10px;
    }

    .land {
        padding: 0 20px 0 20px;
    }

    .responsive-width-50 {
        width: 100%;
    }

    .responsive-width-33 {
        width: 100%;
    }

    .responsive-width-25 {
        width: 100%;
    }

    .responsive-width-20 {
        width: 100%;
    }

    .responsive-width-16 {
        width: 50%;
    }
}

/* Border radius */

.rounded-s {
    border-radius: var(--rounded-s);
}

.rounded {
    border-radius: var(--rounded-m);
}

.rounded-l {
    border-radius: var(--rounded-l);
}

.rounded-xl {
    border-radius: var(--rounded-xl);
}

.rounded-max {
    border-radius: var(--rounded-xxl);
}

.rounded-up {
    border-radius: var(--rounded-m-up);
}

.rounded-end {
    border-radius: var(--rounded-m-end);
}

.rounded-top-end {
    border-radius: var(--rounded-m-top-end);
}

/* Color effects radius */

.grayscale {
    filter: grayscale(100%);
}

/* Borders */

.border-top-none {
    border-top: none !important;
}

.border-bottom-none {
    border-bottom: none !important;
}

.border-left-none {
    border-left: none !important;
}

.border-right-none {
    border-right: none !important;
}

.border-none {
    border-width: 0px;
    border-color: transparent;
}

.border-solid {
    border-width: 0.8px;
    border-style: solid;
    border-color: transparent;
}

.border-solid-s {
    border-width: .5px;
    border-style: solid;
    border-color: transparent;
}

.border-solid-m {
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
}

.border-solid-l {
    border-width: 1.5px;
    border-style: solid;
    border-color: transparent;
}

.border-dashed {
    border-style: dashed;
    border-color: transparent;
}

.border-tint {
    border-color: var(--tint-color);
}

.border-black {
    border-color: var(--black-color);
}

.border-white {
    border-color: var(--white-color);
}

.border-body {
    border-color: var(--bg-body-color);
}

.border-red {
    border-color: var(--red-color);
}

.border-primary {
    border-color: var(--primary-color);
}

.border-secondary {
    border-color: var(--secondary-color);
}

.border-tertiary {
    border-color: var(--tertiary-color);
}

.border-violet {
    border-color: var(--violet-color);
}

.border-cyan {
    border-color: var(--cyan-color);
}

/* Blur */

.blur-behind {
    backdrop-filter: blur(5px);
}

.placeholder-secondary::placeholder {
    color: var(--secondary-color);
}

/* Dropdown constructor */

.dropdown-element {
    border-radius: var(--rounded-s);
    padding: 5px 10px 5px 10px;
}

.dropdown-element:hover {
    background-color: var(--tertiary-color);
}

.dropdown-element:focus {
    background-color: var(--tint-color);
}

.dropdown-element:active {
    background-color: var(--tint-color) !important;
    color: var(--white-color) !important;
    fill: var(--white-color) !important;
}

.inactive {
    cursor: default !important;
    background-color: transparent !important;
}

.selected {
    background-color: var(--tint-color) !important;
    color: var(--white-color) !important;
}

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    overflow: auto;
}

.drop-right{
    right: 0;
}

/* Flexing disposals */

.flex-wrap {
    flex-wrap: wrap;
}

.flex-row {
    flex-direction: row;
}

.flex-row-reverse {
    flex-direction: row-reverse;
}

.flex-col {
    flex-direction: column;
}

.flex-col-reverse {
    flex-direction: column-reverse;
}

/* Display disposal */

.display-block {
    display: block;
}

.display-flex {
    display: flex;
}

.display-inline-block {
    display: inline-block;
}

.display-none {
    display: none;
}

/* Tools for search bar */

.hideMeMan {
    display: none !important;
}
`;

function extractAllContentBetweenBrkTags(inputString) {
    const brkStart = '<brk>';
    const brkEnd = '</brk>';
    const contentArray = [];
    let startIndex = inputString.indexOf(brkStart);
  
    while (startIndex !== -1) {
      const endIndex = inputString.indexOf(brkEnd, startIndex);
  
      if (endIndex !== -1) {
        const content = inputString.substring(startIndex + brkStart.length, endIndex);
        contentArray.push(content);
        startIndex = inputString.indexOf(brkStart, endIndex + brkEnd.length);
      } else {
        break;
      }
    }
  
    return contentArray;
  }
  

  

(function () {

    // Append styles
    var styleElement = document.createElement("style");
    styleElement.textContent = brikStyleSheet
    document.head.appendChild(styleElement);

    // Construct briks
    const briks = document.getElementsByTagName("brik")
    if (briks) {
        for (let i = 0; i < briks.length; i++) {
            const attributes = briks[i].attributes;
            for (let j = 0; j < attributes.length; j++) {
                const attributeName = attributes[j].name;
                console.log(attributeName)
                briks[i].innerHTML = eval(attributeName)
                window.dispatchEvent(new Event("brikChange"));
            }
        }
    }

    // Set theme based on user preferences
    const currentTheme = localStorage.getItem("theme");
    let themeValue = currentTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    let sun = document.getElementById("sun")
    let moon = document.getElementById("moon")
    let themeButton = document.querySelector("#theme-btn")

    function reflectPreference() {
        localStorage.setItem("theme", themeValue)
        document.firstElementChild.setAttribute("data-theme", themeValue)
        themeButton?.setAttribute("aria-label", themeValue)
        if (sun) {sun.style.display = themeValue === "dark" ? "none" : "block";}
        if (moon) {moon.style.display = themeValue === "dark" ? "block" : "none";}
    }
    reflectPreference()
    
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches: e }) => {
        themeValue = e ? "dark" : "light"
        reflectPreference()
    });

    themeButton?.addEventListener("click", () => {
        themeValue = "light" === themeValue ? "dark" : "light"
        reflectPreference()
    })

})();
