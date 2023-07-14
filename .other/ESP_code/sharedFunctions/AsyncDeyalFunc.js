function delay(ms, callback) {
    const intervalId = setInterval(() => {
        clearInterval(intervalId);
        callback();
    }, ms)
}

module.exports = {
    delay
}