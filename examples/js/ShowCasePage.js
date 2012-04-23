var ShowCasePage = CUORE.Class(CUORE.Page, {

    initializeServices: function() {
    },

    initializeComponents: function() {
        this.labelShowcase();
        this.inputShowcase();
        this.buttonShowcase();
        this.switchButtonShowcase();
        this.numericSelectorShowcase();
        this.collapsableShowcase();
        this.timeRangeShowcase();
        this.comboShowcase();
        this.nesteableShowcase();
    },

    labelShowcase: function() {
        var label = new CUORE.Components.LabelPanel('label.example');
        var noKey = new CUORE.Components.LabelPanel('key.not.solved');
        this.addComponent(label, 'labelExample', CUORE.Behaviours.REPLACE);
        this.addComponent(noKey, 'labelExample2', CUORE.Behaviours.REPLACE);
    },

    inputShowcase: function() {
        var input = new CUORE.Components.Input('input.label');

        var defaultValue = new CUORE.Components.Input('input.label');
        defaultValue.setValue('example value');

        var disabled = new CUORE.Components.Input('input.label');
        disabled.setValue('example value');
        disabled.disable()

        var password = new CUORE.Components.Input('input.label', 'password');
        password.setValue('example value');

        this.addComponent(input, 'inputExample', CUORE.Behaviours.REPLACE);
        this.addComponent(defaultValue, 'inputExample2', CUORE.Behaviours.REPLACE);
        this.addComponent(disabled, 'inputExample3', CUORE.Behaviours.REPLACE);
        this.addComponent(password, 'inputExample4', CUORE.Behaviours.REPLACE);
    },

    buttonShowcase: function() {
        var button = new CUORE.Components.Button();
        var i18N = new CUORE.Components.Button('buttonName', 'button.label');
        var disabled = new CUORE.Components.Button();
        disabled.disable();
        var image = new CUORE.Components.Button('imageButton', 'button.label');

        this.addComponent(button, 'buttonExample', CUORE.Behaviours.REPLACE);
        this.addComponent(i18N, 'buttonExample2', CUORE.Behaviours.REPLACE);
        this.addComponent(disabled, 'buttonExample3', CUORE.Behaviours.REPLACE);
        this.addComponent(image, 'buttonExample4', CUORE.Behaviours.REPLACE);
    },

    switchButtonShowcase: function() {
        var button = new CUORE.Components.SwitchButton();
        var i18N = new CUORE.Components.SwitchButton('anyName', 'switch.on', 'switch.off');
        var image = new CUORE.Components.SwitchButton('imageSwitch', 'switch.on', 'switch.off');

        this.addComponent(button, 'switchButtonExample', CUORE.Behaviours.REPLACE);
        this.addComponent(i18N, 'switchButtonExample2', CUORE.Behaviours.REPLACE);
        this.addComponent(image, 'switchButtonExample3', CUORE.Behaviours.REPLACE);
    },

    numericSelectorShowcase: function() {
        var selector = new CUORE.Components.NumericSelector();
        var negatives = new CUORE.Components.NumericSelector('numeric.label');
        negatives.setLimInf(-10);
        negatives.setLimSup(10);
        negatives.setValue(3);
        negatives.setIncrementer(3);
        var stylable = new CUORE.Components.NumericSelector('numeric.label');
        stylable.disable();
        this.addComponent(selector, 'numericSelectorExample', CUORE.Behaviours.REPLACE);
        this.addComponent(negatives, 'numericSelectorExample2', CUORE.Behaviours.REPLACE);
        this.addComponent(stylable, 'numericSelectorExample3', CUORE.Behaviours.REPLACE);
    },

    collapsableShowcase: function() {
        var panel = new CUORE.Components.Collapsable();
        panel.setPanelTextKey('collapsable.sample.key');

        var button = new CUORE.Components.SwitchButton('collapseButton', 'collapse', 'uncollapse');
        var handler = new CUORE.Handlers.SwitchCollapseAndUncollapse();
        panel.addHandler('BUTTON_collapseButton_CLICKED', handler);

        panel.uncollapse();
        panel.setText('collapsable.sample.key', 'Lorem ipsum dolor sit amet,consectetur adipiscing elit. Pellentesque vulputate congue elementum. Sed iaculis dapibus justo, at hendrerit neque pharetra et. Pellentesque vehicula, urna at vehicula tempus, leo odio posuere ligula, ac posuere odio nisi quis nulla. Fusce non odio sit amet ante iaculis lobortis eget at odio. Pellentesque venenatis metus a neque tincidunt  ');

        this.addComponent(panel, 'collapsableExample', CUORE.Behaviours.REPLACE);
        this.addComponent(button, 'collapsableExample2', CUORE.Behaviours.REPLACE);
    },


    timeRangeShowcase: function() {
        var control = new CUORE.Components.TimeRange('timerange.label');
        var grain = new CUORE.Components.TimeRange('timerange.label', 30);
        grain.setStartHour('4:00');
        grain.setEndHour('8:30');
        this.addComponent(control, 'timeRangeExample', CUORE.Behaviours.REPLACE);
        this.addComponent(grain, 'timeRangeExample2', CUORE.Behaviours.REPLACE);
    },

    comboShowcase: function() {
        var panel = new CUORE.Components.Collapsable();
        var handler = new CUORE.Handlers.SwitchCollapseAndUncollapse();
        panel.addHandler('BUTTON_comboCollapseButton_CLICKED', handler);

        var button = new CUORE.Components.SwitchButton('comboCollapseButton', 'uncollapse', 'collapse');
        var label = new CUORE.Components.LabelPanel('label.example');
        var input = new CUORE.Components.Input('input.label');
        var numeric = new CUORE.Components.NumericSelector('numeric.label');
        var range = new CUORE.Components.TimeRange('timerange.label');

        var printButton = new CUORE.Components.Button('print', 'Print');
        var theHandler = new CUORE.Handlers.Print();
        printButton.addHandler('BUTTON_print_CLICKED', theHandler);

        panel.host(label);
        panel.host(input);
        panel.host(numeric);
        panel.host(range);
        panel.host(printButton);

        this.addComponent(button, 'comboExample', CUORE.Behaviours.REPLACE);
        this.addComponent(panel, 'comboExample');
    },

    nesteableShowcase: function() {
        var aNestableComponent = new CUORE.Components.Nestable();

        var label = new CUORE.Components.LabelPanel('label.example.nested');
        var input = new CUORE.Components.Input('input.labelnested');

        aNestableComponent.host(label);
        aNestableComponent.host(input);

        var panel = new CUORE.Components.Collapsable();
        var button = new CUORE.Components.SwitchButton('collapseButtonNested', 'collapse', 'uncollapse');
        var handler = new CUORE.Handlers.SwitchCollapseAndUncollapse();
        panel.addHandler('BUTTON_collapseButtonNested_CLICKED', handler);

        panel.setPanelTextKey('collapsable.sample.key');
        panel.setText('collapsable.sample.key', 'Lorem ipsum dolor sit amet,consectetur adipiscing elit. Pellentesque vulputate congue elementum. Sed iaculis dapibus justo, at hendrerit neque pharetra et. Pellentesque vehicula, urna at vehicula tempus, leo odio posuere ligula, ac posuere odio nisi quis nulla. Fusce non odio sit amet ante iaculis lobortis eget at odio. Pellentesque venenatis metus a neque tincidunt  ');
        panel.uncollapse();


        aNestableComponent.host(panel);
        aNestableComponent.host(button);

        anotherNestableComponent = new CUORE.Components.Nestable();
        var buttonForInputApply = new CUORE.Components.Button('nestedButton', 'button.nested');
        anotherNestableComponent.host(buttonForInputApply);

        aNestableComponent.host(anotherNestableComponent);

        this.addComponent(aNestableComponent, 'ExampleNested', CUORE.Behaviours.REPLACE);
    }
});
