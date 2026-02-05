import { IndexLogic } from "./chat-room.logic.js";
import { CommandClass } from "../../lib/command/CommandClass.js";
//>> Components
const messagesEl = document.querySelector('message-container');
const inputEl = document.getElementById('messageInput');
const txtSenderName = document.getElementById('sender-name');
//>> Define
const command = new CommandClass();
command.Handler = ActionRequest_Handler;
//>> Init
document.querySelectorAll("[data-command]").forEach(el => {
    if (el.dataset.isInitialized)
        return;
    el.addEventListener("click", e => command.run(el));
    el.dataset.isInitialized = "true";
});
document.querySelectorAll("[data-action]").forEach(el => {
    if (el.dataset.isInitialized)
        return;
    el.addEventListener("click", e => command.run(el));
    el.dataset.isInitialized = "true";
});
//onclick="PostMessage()"
// ## ToolBar
//>> Constructor
const Logic = new IndexLogic();
Logic.messagesEl = messagesEl;
function ActionRequest_Handler(route) {
    route.On("chat/command", "create", () => Logic.PostMessage(inputEl, txtSenderName));
    route.On("display/command", "panel-settings-open", () => {
        var form = document.getElementById("form-1a6b75a5");
        form.classList.add("active");
        var input = document.getElementById("input-4eca11e2");
        input.value = txtSenderName.innerHTML;
        input.focus();
        input.select();
        input.oninput = () => {
            var txt = input.value.trim();
            txt = txt.replace(/[^a-zA-Z0-9\s]/g, '');
            txtSenderName.innerHTML = txt;
            if (txt.length < 3)
                txtSenderName.innerHTML = "user-" + txt;
            if (txt.length == 0)
                txtSenderName.innerHTML = sessionStorage.getItem("username");
            console.log(txtSenderName.innerHTML);
        };
    });
    route.On("display/command", "panel-settings-close", () => {
        var form = document.getElementById("form-1a6b75a5");
        form.classList.remove("active");
        sessionStorage.setItem("username", txtSenderName.innerHTML);
    });
}
//>> Event Handler
// ارسال با Enter
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter')
    Logic.PostMessage(inputEl, txtSenderName); });
//>> Username
function generateRandomUsername() {
    // تولید یک عدد تصادفی بین 100 و 999
    const randomNumber = Math.floor(Math.random() * 900) + 100; // این مقدار همیشه 3 رقمی خواهد بود
    return `user-${randomNumber}`;
}
if (sessionStorage.getItem("username"))
    txtSenderName.innerHTML = sessionStorage.getItem("username");
else {
    txtSenderName.innerHTML = generateRandomUsername();
    sessionStorage.setItem("username", txtSenderName.innerHTML);
}
Logic.LoadData(txtSenderName.innerText);
