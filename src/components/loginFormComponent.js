
import { brikLogo } from "./src/components/logoComponent.js";

var loginFormContent = {
    formHeader: {
        title: "Welcome to brik",
        subtitle: "Unleashing Creativity, One Brik at a Time",
    },
    formInput: {
        title: "password",
    }
};

let loginform = () =>
    `
    <form class="w-full flex rounded flex-col gap-2xl">
        <div class="flex items-center flex-col full-center width-100 gap-sm">
            ${brikLogo(40)}
            <h1 id='variableValue' class="font-600 color-primary">${loginFormContent.formHeader.title}</h1>
            <h4 class="color-secondary font-normal">${loginFormContent.formHeader.subtitle}</h4>
        </div>

        <div class="flex flex-col items-start width-full gap-sm">
            <label class="color-secondary font-normal" for="email">Email</label>
            <input
                class="w-full border outline-none border-secondary border-solid color-primary bg-tertiary rounded-md p-sm"
                type="text" name="" id="email" placeholder="Type your username" autocomplete="username">
        </div>
        <div class="flex flex-col items-start width-full gap-sm">
            <label class="color-secondary font-normal" for="password">Password</label>
            <div
                class="w-full relative">
                <input class="w-full border outline-none border-secondary border-solid color-primary bg-tertiary rounded-md p-sm" type="password" name="" id="password" autocomplete="current-password"
                    placeholder="6+ strong characters">
                <div class="absolute pointer-events-none right-0 top-0 fill-secondary z-20 h-full w-fit flex px-sm items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18">
                        <path id="hidePass" d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                        <path id="showPass" class="hidden" d="m644-428-58-58q11-53-27.5-90.5T466-606l-58-58q17-8 35-12t37-4q75 0 127.5 52.5T660-500q0 19-4 37t-12 35Zm128 126-58-56q38-29 68-64.5t50-77.5q-50-101-144.5-160.5T480-720q-29 0-56.5 4T368-704l-62-62q42-17 85.5-25.5T480-800q137 0 250.5 72T904-534q4 8 6 16.5t2 17.5q0 9-1.5 17.5T905-466q-22 49-56 90.5T772-302ZM480-200q-134 0-245-72.5T60-463q-5-8-7.5-17.5T50-500q0-10 2-19t7-18q20-40 46.5-76.5T166-680l-83-84q-11-12-10.5-28.5T84-820q11-11 28-11t28 11l680 680q11 11 11.5 27.5T820-84q-11 11-28 11t-28-11L624-222q-35 11-71 16.5t-73 5.5ZM222-624q-29 26-53 57t-41 67q50 101 144.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                    </svg>

                </div>
                
            </div>
        </div>
        <a style="font-size: small;" class="subheadline color-primary font-m" href="">Forgot your password?</a>
        <button class="bg-primary border-none color-body font-semibold text-lg rounded-full p-xs">
            Login
        </button>
        <p class="subheadline color-secondary font-m">Don't have an account? 
            <a
                class="font-500 color-primary decoration-none" href="">Sign up
            </a>
        </p>

    </form>
`

// Here we access the stored value associated with the key "loginform" in the localStorage,
// which could be used to identify the specific component.
window.addEventListener('loginform', function (event) {

    let identifier = event.detail.id
    let thisComponent = document.getElementById(identifier)
    let classes = ["w-full", "max-w-screen-sm", "flex", "flex-col", "text-center", "p-xl"]

    thisComponent.classList.add(...classes);

});

export { loginform };

