
let brikStyleSheet = `
@import url('https://fonts.googleapis.com/css2?family=Edu+SA+Beginner:wght@500&family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

:root {
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
    --primary-color: #181A22;
    --primary-color-rgb: 24,26,34;

    --secondary-color: #898D9A;
    --tertiary-color: #F6F7F8;

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
    background-color: var(--bg-body-color);
    scroll-behavior: smooth;
}

* {
    font-family: 'IBM Plex Sans', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

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

.avatar-l {
    width: 50px;
    height: 50px;
    border-radius: 25px;
}

.avatar-m {
    width: 30px;
    height: 30px;
    border-radius: 15px;
}

.avatar-s {
    width: 22px;
    height: 22px;
    border-radius: 11px;
}

.min-w-250{
    min-width: 250px;
}

.min-w-350{
    min-width: 350px;
}

.w-auto {
    width: auto
}

.max-w-350{
    max-width: 350px;
}

.max-w-50{
    max-width: 50% !important;
}

.max-width-100 {
    max-width: 100%;
}

.w-fit {
    width: max-content;
}

.w-100 {
    width: 100%;
}

.h-56{
    height: 56.25%;
}

.board {
    padding: 0;
}

.land {
    padding: 0 10% 0 10%;
}

.transition-smooth {
    transition: .2s;
}

.shadow-one {
    box-shadow: 0px 2px 10px rgba(var(--black-color-rgb), var(--shadow-opacity));
}

.shadow-dynamic {
    transition: .2s;
    box-shadow: 0px 0px 0px rgba(var(--black-color-rgb), 0);
}

.shadow-dynamic:hover {
    transition: .2s;
    box-shadow: 0px 0px 7px rgba(var(--black-color-rgb), var(--shadow-opacity));
}

.glow-dynamic {
    transition: .2s;
    box-shadow: 0px 0px 10px rgba(var(--white-color-rgb), var(--glow-opacity));
}

.glow-dynamic:hover {
    transition: .2s;
    box-shadow: 0px 2px 13px rgba(var(--white-color-rgb), var(--glow-opacity-hover));
}

.shadow-two {
    box-shadow: 0px 5px 15px 5px rgba(var(--black-color-rgb), var(--shadow-opacity));
}

.overflow-hidden {
    overflow: hidden;
}

.overflow-auto {
    overflow: auto;
}

.overflow-scroll {
    overflow: scroll;
}

.overflow-y-hidden {
    overflow-y: hidden !important;
}

.cursor-pointer {
    cursor: pointer;
}

.cursor-help {
    cursor: help;
}

.block-mode {
    display: block;
    white-space: nowrap;
}

.no-wrap {
    white-space: nowrap;
}

.wrap {
    white-space: wrap;
}

.no-bullets {
    list-style-type: none;
}

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

.xs-margin {
    margin: 5px;
}

.s-margin {
    margin: 10px;
}

.margin {
    margin: 20px;
}

.x-margin {
    margin: 30px;
}

.absolute {
    position: absolute;
}
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

.fixed {
    position: fixed;
}

.sticky {
    position: sticky;
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

.full-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.spaced {
    justify-content: space-between;
}

.flex-start {
    justify-content: flex-start;
}

.flex-end {
    justify-content: flex-end;
}

.justify-center {
    justify-content: center;
}

.vertical-center {
    align-self: center;
    justify-content: center;
}

.text-left {
    text-align: left;
}

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
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

.bg-lighter {
    background-color: rgba(var(--primary-color-rgb), var(--glow-opacity));
}

.bg-tint-lighter {
    background-color: rgba(var(--tint-color-rgb), var(--glow-opacity));
}

.bg-tint {
    background-color: var(--tint-color);
}

.focus-fill-tint:focus {
    fill: var(--tint-color) !important;
}

.focus-color-tint:focus {
    color: var(--tint-color) !important;
}

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

.color-rock {
    color: var(--violet-color);
}

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

.italic {
    font-style: italic;
}

.land-flag {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10% 0 10%;
    margin: auto;
    width: auto;
    height: auto;
}

.margin-auto {
    margin: auto
}

.flex-wrap {
    flex-wrap: wrap;
}

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

.fixed-bottom {
    position: fixed;
    bottom: 0;
}

.decoration-none {
    text-decoration: none;
}

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

.child {
    opacity: 0;
}

.show-my-child:hover .child {
    opacity: 1;
}

.brick {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
}

brik {
    width: 100%;
    box-sizing: border-box
}

.border-box {
    box-sizing: border-box;
}

.responsive-1 {
    height: fit-content;
    width: 100%;
}

.responsive-2 {
    height: fit-content;
    width: 50%;
}

.responsive-3 {
    height: fit-content;
    width: 33.33333333%;
}

.responsive-4 {
    height: fit-content;
    width: 25%;
}

.responsive-5 {
    height: fit-content;
    width: 20%;
}

.responsive-6 {
    height: fit-content;
    width: 16.66666667%;
}

.steady-33 {
    display: flex;
    width: calc(100% / 3);
}

.steady-66 {
    display: flex;
    width: calc(100% / 1.5);
}

.responsive-33 {
    display: flex;
    width: calc(100% / 3);
}

.responsive-66 {
    display: flex;
    width: calc(100% / 1.5);
}

.steady-1 {
    display: flex;
    width: 100%;
}

.steady-2 {
    display: flex;
    width: 50%;
}

.steady-3 {
    display: flex;
    width: 33.33%;
}

.steady-4 {
    display: flex;
    width: 25%;
}

.steady-5 {
    display: flex;
    width: 20%;
}

.min-height-50 {
    min-height: 50vh;
}

.height-100 {
    height: 100%;
}

.on-mobile-pass {
    visibility: visible;
}

.on-mobile-show {
    visibility: collapse;
    display: none;
}

@media only screen and (max-width: 1600px) {
    .land-flag {
        padding: 0 15% 0 15%;
    }

    .land {
        padding: 0 15% 0 15%;
    }

    .responsive-l-gap {
        grid-gap: 30px;
    }
}

@media only screen and (max-width: 1200px) {
    .land-flag {
        padding: 0 40px 0 40px;
    }

    .land {
        padding: 0 40px 0 40px;
    }

    .responsive-l-gap {
        grid-gap: 20px;
    }
}

@media only screen and (max-width: 1100px) {
    .land-flag {
        padding: 0 30px 0 30px;
    }

    .land {
        padding: 0 30px 0 30px;
    }
}

@media only screen and (max-width: 900px) {

    .on-mobile-pass {
        visibility: collapse;
        display: none;
    }


    .on-mobile-show {
        visibility: visible;
        display: block;
    }

    .responsive-4 {
        width: 50%;
    }

    .responsive-5 {
        width: 50%;

    }

    .responsive-6 {
        width: 33.33333333%;
    }

    .responsive-33 {
        display: flex;
        width: 100%;
    }

    .responsive-66 {
        display: flex;
        width: 100%;
    }
}

@media only screen and (max-width: 600px) {

    .land-flag {
        padding: 0 20px 0 20px;
    }

    .responsive-l-gap {
        grid-gap: 10px;
    }

    .land {
        padding: 0 20px 0 20px;
    }

    .brick {
        min-width: 250px;
    }

    .responsive-2 {
        width: 100% !important;
    }

    .responsive-3 {
        width: 100%;
    }

    .responsive-4 {
        width: 100% - 20px;
    }

    .responsive-5 {
        width: 100% - 20px;
    }

    .responsive-6 {
        width: 50% - 20px;
    }
}

.float-left {
    float: left;
}

.float-right {
    float: right;
}

.btn {
    background: transparent;
    display: flex;
    text-decoration: none;
    border: none;
    font-size: small;
    cursor: pointer;
    justify-content: center;
    align-items: center;
}

.btn-primary {
    background-color: var(--primary-color);
    padding: var(--padded-m);
    border-radius: var(--rounded-s);
    color: var(--bg-body-color);
    fill: var(--bg-body-color);
    border: solid .7px var(--secondary-color);
}

.btn-primary:hover {
    border: solid .7px var(--primary-color);
}

.btn-secondary {
    background-color: var(--bg-body-color);
    padding: var(--padded-m);
    border-radius: var(--rounded-s);
    color: var(--secondary-color);
    fill: var(--secondary-color);
}

.btn-secondary:hover {
    color: var(--primary-color);
    fill: var(--primary-color);
}

.btn-tint {
    background-color: var(--tint-color);
    padding: 10px;
    border-radius: var(--rounded-s);
    color: var(--white-color);
}

.btn-danger {
    background-color: var(--red-color);
    padding: 10px;
    border-radius: var(--rounded-s);
    color: var(--white-color);
}

.btn-rock {
    background-color: var(--violet-color);
    padding: 10px;
    border-radius: var(--rounded-s);
    color: var(--white-color);
}


.btn-tertiary {
    background-color: var(--tertiary-color);
    padding: 10px;
    border-radius: var(--rounded-s);
    color: var(--primary-color);
}

.rounded-s {
    border-radius: var(--rounded-s);
}

.rounded {
    border-radius: var(--rounded-m);
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

.rounded-l {
    border-radius: var(--rounded-l);
}

.rounded-xl {
    border-radius: var(--rounded-xl);
}

.rounded-max {
    border-radius: var(--rounded-xxl);
}

.bg-none {
    background: none;
    background-color: none;
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


.underlined {
    text-decoration: underline;
}

.grayscale {
    filter: grayscale(100%);
}

.flow {
    filter: hue-rotate(200deg);
}

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

.border-rock {
    border-color: var(--violet-color);
}

.border-cyan {
    border-color: var(--cyan-color);
}

.hideMeMan {
    display: none !important;
}

.modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.modal-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.notification-modal {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
}

.blur-behind {
    backdrop-filter: blur(5px);
}

.placeholder-secondary::placeholder {
    color: var(--secondary-color);
}

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

.dropdown {
    position: relative;
    display: inline-block;
}

.position-relative {
    position: relative;
}

.h-center {
    align-items: center;
}

.h-bottom {
    align-items: end;
}

.h-top {
    align-items: start;
}

.dropdown-content {
    display: none;
    overflow: auto;
}

.drop-right{
    right: 0;
}

.display-block {
    display: block;
}

.display-flex {
    display: flex;
}

.display-none {
    display: none;
}

.display-inline-block {
    display: inline-block;
}


.divider{
    border-bottom: 1px solid var(--tertiary-color);
    width: auto;
    margin: 4px 10px 4px 10px;
}

.selected {
    background-color: var(--tint-color) !important;
    color: var(--white-color) !important;
}

.pastel-1 {
    background-color: #ffd6ff;
    color: black;
    fill: black;
}

.pastel {
    background-color: rgba(var(--tint-color-rgb), var(--shadow-opacity));
    color: var(--tint-color-rgb);
    fill: var(--tint-color-rgb);
}

.pastel-3 {
    background-color: #c8b6ff;
    color: black;
    fill: black;
}

.pastel-4 {
    background-color: #b8c0ff;
    color: black;
    fill: black;
}

.pastel-5 {
    background-color: #bbd0ff;
    color: black;
    fill: black;
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

