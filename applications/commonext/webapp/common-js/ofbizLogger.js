(function(window) {
    var logger = window.ofbizLogger || {};
    var warnedMessages = logger.warnedMessages || {};

    function warn(message) {
        if (!message || !window.console || typeof window.console.warn !== 'function') {
            return false;
        }
        window.console.warn(message);
        return true;
    }

    function warnOnce(key, message) {
        var warningKey = key || message;
        if (!warningKey || warnedMessages[warningKey]) {
            return false;
        }
        warnedMessages[warningKey] = true;
        return warn(message);
    }

    logger.warnedMessages = warnedMessages;
    logger.warn = warn;
    logger.warnOnce = warnOnce;
    window.ofbizLogger = logger;
})(window);
