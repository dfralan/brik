import * as components from "./components.js";

// Assign components to window object
Object.entries(components).forEach(([key, value]) => {
    window[key] = value;
});

// Ephemeral Hash
const genHex = (a) => Math.random().toString(16).slice(2, (a + 2));

// Función para definir getters y setters para cada propiedad del objeto
function observeChanges(id, obj, action) {
    for (var prop in obj) {
        let identification = prop+'-'+id
        if (obj.hasOwnProperty(prop)) {
            defineProperty(obj, prop, identification, action);
        }
    }
}

// Function to do actions, native used for update a variable that change
function reactor(id, value, action) {
    let element = document.getElementById(id)
    if (action === 'update') {
        element.innerHTML = value
    }
    if (action === 'log') {
        console.log(value)
    }
}

// Function to define getters and setters for a specific property
function defineProperty(obj, prop, id, action) {
    var value = obj[prop];
    Object.defineProperty(obj, prop, {
        get: function() {
            return value;
        },
        set: function(newValue) {
            value = newValue;
            const someBrikChange = new CustomEvent('brikChange', {
                detail: {
                  id: id,
                  value: newValue
                },
              });
            window.dispatchEvent(someBrikChange);
            reactor(id, newValue, action)
            
        }
    });
}

(function () {

    // Construct briks
    const briks = document.getElementsByTagName("brik")
    if (briks) {
        for (let i = 0; i < briks.length; i++) {
            const attributes = briks[i].attributes;
            for (let j = 0; j < attributes.length; j++) {
                const attributeName = attributes[j].name;
                const brikIdentifier = attributeName + '-' + genHex(8)
                briks[i].removeAttribute(attributeName);
                briks[i].innerHTML = eval(`${attributeName}('${brikIdentifier}')`);                addEventListener("DOMContentLoaded", () => {
                    briks[i].id = brikIdentifier
                    const brikCreationEvent = new CustomEvent(attributeName, {
                        detail: {
                          id: brikIdentifier,
                        },
                      });
                    window.dispatchEvent(brikCreationEvent);
                })
            }
        }
    }

})();

export { genHex, observeChanges, reactor };