// blocks.js

const { weathers } = require("lib");

const weatherController = extend(Block, "weather-controller", {});
weatherController.buildType = () =>
    extend(Building, {
        showMenu() {
            let time = Infinity;
            const getActives = () =>
                weathers
                    .getActives()
                    .map((w) => weathers.getName(w))
                    .join(", ");
            const buttons = {};

            const dialog = new Dialog();
            dialog.title.setText(Core.bundle.get("block.more-extended-weather-controller.name"));
            const cont = dialog.cont;
            const activesLabel = cont.add("").center().padBottom(10).color(Color.yellow);
            cont.row();

            const timeTable = new Table().center();
            timeTable.add(Core.bundle.get("message.more-extended-life-time") + ": ").center();
            timeTable
                .field(Core.bundle.get("message.more-extended-life-time"), (str) => {
                    time = parseFloat(str) || Infinity;
                })
                .center()
                .get()
                .setText("Infinity");
            cont.add(timeTable);
            cont.row();

            const pane = new ScrollPane(new Table());
            const table = pane.getWidget();
            table.center();

            const reflush = () => {
                activesLabel
                    .get()
                    .setText(
                        Core.bundle.get("message.more-extended-weather-current") +
                            ": " +
                            (getActives() || Core.bundle.get("none")),
                    );
                weathers.getAll().forEach((w) => {
                    buttons[weathers.getId(w)]
                        .get()
                        .setText(
                            (weathers.getStatus(w) ? "[yellow]" : "[white]") +
                                weathers.getName(w) +
                                " " +
                                Core.bundle.get("message.more-extended-life-time") +
                                ": " +
                                (isFinite(weathers.getTime(w))
                                    ? parseInt(weathers.getTime(w))
                                    : weathers.getTime(w)),
                        );
                });
            };

            weathers.getAll().forEach((w) => {
                buttons[weathers.getId(w)] = table
                    .button("", () => {
                        weathers.setStatus(w, !weathers.getStatus(w), time, 0);
                        reflush();
                    })
                    .center()
                    .padBottom(5)
                    .width(400)
                    .height(50);
                table.row();
            });
            cont.add(pane).fillX().padBottom(10);
            cont.row();

            const bottomTable = new Table();
            bottomTable
                .button(Core.bundle.get("message.more-extended-all-off"), () => {
                    weathers.clearAll();
                    reflush();
                })
                .size(100, 40)
                .center();
            bottomTable
                .button(Core.bundle.get("message.more-extended-all-on"), () => {
                    weathers.getAll().forEach((w) => weathers.setStatus(w, true, time, 0));
                    reflush();
                })
                .size(100, 40)
                .center();
            bottomTable
                .button(Core.bundle.get("message.more-extended-reverse"), () => {
                    weathers
                        .getAll()
                        .forEach((w) => weathers.setStatus(w, !weathers.getStatus(w), time, 0));
                    reflush();
                })
                .size(100, 40)
                .center();
            cont.add(bottomTable).fillX();

            dialog.buttons
                .button(Core.bundle.get("close"), () => {
                    dialog.hide();
                })
                .center();
            reflush();
            dialog.show();
        },
        buildConfiguration(table) {
            table
                .button(
                    Icon.upOpen,
                    Styles.cleari,
                    run(() => {
                        this.configure(0);
                    }),
                )
                .size(50)
                .tooltip(Core.bundle.get("message.more-extended-open-menu"));
        },
        configured(player, value) {
            switch (value) {
                case 0: {
                    this.showMenu();
                    break;
                }
                default: {
                }
            }
        },
    });

const waterCollector = extend(LiquidRouter, "water-collector", {
    setStats() {
        this.super$setStats();
        this.stats.add(Stat.output, StatValues.liquid(Vars.content.liquid("water"), 0, true));
        this.stats.add(Stat.booster, StatValues.content(weathers.getClass("snowing")));
        this.stats.add(Stat.booster, StatValues.string("+[accent]0.8[]"));
        this.stats.add(Stat.booster, StatValues.content(weathers.getClass("rain")));
        this.stats.add(Stat.booster, StatValues.string("+[accent]1.0[]"));
    },
    setBars() {
        this.super$setBars();
        this.addBar("more-extended-weather-boost", (building) => {
            print(building);
            return new Bar(
                prov(() =>
                    Core.bundle.format(
                        "bar.more-extended-weatherboost",
                        building.delegee.outputAmount,
                    ),
                ),
                prov(() => Pal.accent),
                () => building.delegee.outputAmount / 1.8,
            );
        });
    },
});
waterCollector.buildType = () =>
    extend(LiquidRouter.LiquidRouterBuild, waterCollector, {
        outputAmount: 0,
        updateTile() {
            this.outputAmount = 0;
            if (weathers.getStatus(weathers.getClass("rain"))) {
                this.outputAmount += 1.0;
            }
            if (weathers.getStatus(weathers.getClass("snowing"))) {
                this.outputAmount += 0.8;
            }

            this.liquids.add(Vars.content.liquid("water"), this.outputAmount * this.edelta());
            if (this.liquids.currentAmount() > waterCollector.liquidCapacity) {
                this.liquids.set(Vars.content.liquid("water"), waterCollector.liquidCapacity);
            }

            this.super$updateTile();
        },
        /*display(table) {
            this.super$display(table);

            const weatherBar = new Bar(
                prov(() => "天气加成: " + this.outputAmount),
                prov(() => Pal.accent),
                () => this.outputAmount / 1.8,
            );
            table.getChildren().get(1).add(weatherBar);
        },*/
    });
