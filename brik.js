
let brikStyleSheet = `


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

