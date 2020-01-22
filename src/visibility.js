import * as generalAction from './store/actions/GeneralState';

export default function initVisibilityNotif(store) {
    store.dispatch(generalAction.setGeneralState('hidden', false));
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    function handleVisibilityChange() {
        if (document[hidden]) {
            store.dispatch(generalAction.setGeneralState('hidden', true));
        } else {
            store.dispatch(generalAction.setGeneralState('hidden', false));
        }
    }

    if (typeof document.addEventListener === "undefined" || hidden === undefined) {
        console.log("Browser does not support Visibility API.");
    } else {
        // Handle page visibility change
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
}