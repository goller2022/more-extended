// main.js

require("items");
require("blocks");

Events.on(ContentInitEvent, () => {
    try {
        Vars.content
            .block("more-extended-clay-water")
            .set(Vars.content.block("water"), Vars.content.block("more-extended-clay-floor"));

        Vars.content.blocks().each((e) => {
            if (
                e.shownPlanets.get(Vars.content.planet("serpulo")) ||
                e.shownPlanets.get(Vars.content.planet("erekir"))
            )
                e.shownPlanets.add(Vars.content.planet("more-extended-veridia"));
        });
        Vars.content.items().each((e) => {
            if (
                e.shownPlanets.get(Vars.content.planet("serpulo")) ||
                e.shownPlanets.get(Vars.content.planet("erekir"))
            )
                e.shownPlanets.add(Vars.content.planet("more-extended-veridia"));
        });
        Vars.content.liquids().each((e) => {
            if (
                e.shownPlanets.get(Vars.content.planet("serpulo")) ||
                e.shownPlanets.get(Vars.content.planet("erekir"))
            )
                e.shownPlanets.add(Vars.content.planet("more-extended-veridia"));
        });
        Vars.content.units().each((e) => {
            if (
                e.shownPlanets.get(Vars.content.planet("serpulo")) ||
                e.shownPlanets.get(Vars.content.planet("erekir"))
            )
                e.shownPlanets.add(Vars.content.planet("more-extended-veridia"));
        });
    } catch (e) {
        print(e);
    }
});

print("mod 加载成功!");
