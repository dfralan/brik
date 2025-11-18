import { brikLogo } from "./src/components/logoComponent.js";
import { observeChanges } from "./src/core/brik.js";

// We gonna change this content later fetching content from welcomeContent.json file
var welcomeContent = {
    title: "titleString",
    subtitle: "subtitleString",
    counter: 0
};

let welcome = (identifier) =>
    `
    <div class="w-full flex rounded flex-col gap-2xl">
        <div class="flex items-center flex-col full-center width-100 gap-sm">
            ${brikLogo(40)}
            <h1 id=${'title-' + identifier} class="font-bold color-primary">${welcomeContent.title}</h1>
            <h4 id=${'subtitle-' + identifier} class="color-secondary font-normal">${welcomeContent.subtitle}</h4>
            <p id=${'counter-' + identifier} class="font-bold color-primary">${welcomeContent.counter}</p>
            <button id=${'buttonAddCounter-' + identifier} class='bg-primary text-body py-xs px-sm border-none rounded-lg text-sm' type='button'>Add +</button>
        </div>
    </div>
`

// Here we access the stored value associated with the key "welcome" in the localStorage,
// which could be used to identify the specific component.
window.addEventListener('welcome', function (event) {
    
    let identifier = event.detail.id
    let thisComponent = document.getElementById(identifier)
    let classes = ["w-full", "max-w-screen-sm", "flex", "flex-col", "text-center", "p-xl"]
    let buttonCounter = document.getElementById(`buttonAddCounter-${identifier}`)

    // Here we assign styling classes to the component container
    thisComponent.classList.add(...classes);

    // You can observe changes, and do some when it happen, in this case we 'update' the content
    // It will launch an event with 'brikChange' as header if you want to make some other actions from other component
    // You have to pass the main component identifier, the object that you want to observe, and the action you want to do when some of the values change
    observeChanges(identifier, welcomeContent, 'update');

    // Here we make a fetch with the content that we want to put in our component
    fetch('./src/content/welcomeContent.json')
        .then((response) => response.json())
        .then((json) => {
            welcomeContent.title = json.title
            welcomeContent.subtitle = json.subtitle
        });

    // Here we add one to the counter on each click, simple as that, thanks to the 'observeChanges' function
    buttonCounter.addEventListener("click", function(){
        welcomeContent.counter++
    });

});

export { welcome };

