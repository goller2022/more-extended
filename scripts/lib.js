// lib.js

exports.weathers = {
    setStatus(weather, enable, time, fadeTime /*WeatherState.fadeTime*/) {
        const isCurrentlyActive = this.getStatus(weather);
        if (enable) {
            if (!isCurrentlyActive) {
                Tmp.v1.setToRandomDirection();
                Call.createWeather(weather, 1, time, Tmp.v1.x, Tmp.v1.y);
            } else {
                weather.instance().life = time;
            }
        } else {
            if (!isCurrentlyActive) return;

            const instance = weather.instance();
            if (instance.life > fadeTime) {
                instance.life = fadeTime;
            }
        }
    },
    getStatus(weather) {
        return weather.isActive() && weather.instance().life > 0;
    },
    getTime(weather) {
        const inst = weather.instance();
        if (!inst) return 0;
        return inst.life;
    },
    setTime(weather, time) {
        weather.instance().life = time;
    },
    getClass(name) {
        return Vars.content.weather(name);
    },
    getName(weather) {
        return weather.localizedName;
    },
    getId(weather) {
        return weather.name;
    },
    getAll() {
        return Vars.content.weathers().toArray();
    },
    getActives() {
        return this.getAll().filter((w) => this.getStatus(w));
    },
    clearAll() {
        this.getAll().forEach((w) => this.setStatus(w, false, 0, 0));
    },
};

exports.setBuilding = function (blockType, buildingCreator) {
    blockType.buildType = prov(() => buildingCreator(blockType));
};
