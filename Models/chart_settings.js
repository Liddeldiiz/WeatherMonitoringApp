class ChartSettings {
    constructor(timerange, devicesArray) {
        this.timerange = timerange;
        this.devicesArray = devicesArray;
    }

    getChartSettings() {
        return this;
    }

    setTimeRange(timerange) {
        this.timerange = timerange;
    }

    setDevicesArray(devicesArray) {
        this.devicesArray = devicesArray;
    }
}

const chartSettings = new ChartSettings([], []);

module.exports = chartSettings;