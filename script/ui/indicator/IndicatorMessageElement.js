export class IndicatorMessageElement {
    el;
    constructor(text, type, state) {
        const indicator = document.createElement('indicator-message-element');
        const msg = document.createElement('content-card');
        msg.className = `${type}`;
        msg.innerHTML = text;
        indicator.appendChild(msg);
        this.el = indicator;
        if (state)
            this.UpdateState(state.state, state.active);
    }
    UpdateState(state, active) {
        this.el.dataset.state = state;
        if (active)
            this.el.classList.add("animate");
        else
            this.el.classList.remove("animate");
    }
    DisplayState(state, active, delay = 3000) {
        this.UpdateState(state, active);
        setTimeout(() => {
            this.ClearState();
        }, delay);
    }
    ClearState() {
        this.el.removeAttribute("data-state");
        this.el.classList.remove("animate");
    }
}
