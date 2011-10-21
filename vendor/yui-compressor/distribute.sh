#!/bin/sh

#set the same order of showcase.html
cat ../../src/Message.js >> Cuore-one.js
cat ../../src/Debuggable.js >> Cuore-one.js
cat ../../src/Bus.js >> Cuore-one.js
cat ../../src/Service.js >> Cuore-one.js
cat ../../src/Page.js >> Cuore-one.js 
cat ../../src/Handler.js >> Cuore-one.js
cat ../../src/NullService.js >> Cuore-one.js
cat ../../src/LabelsService.js >> Cuore-one.js
cat ../../src/ButtonService.js >> Cuore-one.js
cat ../../src/Renderer.js >> Cuore-one.js
cat ../../src/ExecutorHandler.js >> Cuore-one.js
cat ../../src/PrintHandler.js >> Cuore-one.js
cat ../../src/SetTextHandler.js >> Cuore-one.js 
cat ../../src/Journey.js >> Cuore-one.js
cat ../../src/Component.js >> Cuore-one.js
cat ../../src/NestableComponent.js >> Cuore-one.js
cat ../../src/Input.js >> Cuore-one.js
cat ../../src/InputRenderer.js >> Cuore-one.js
cat ../../src/Button.js >> Cuore-one.js 
cat ../../src/ButtonRenderer.js >> Cuore-one.js
cat ../../src/TimeRange.js >> Cuore-one.js
cat ../../src/TimeRangeRenderer.js >> Cuore-one.js
cat ../../src/SwitchButton.js >> Cuore-one.js
cat ../../src/SwitchButtonRenderer.js >> Cuore-one.js
cat ../../src/NumericSelector.js >> Cuore-one.js
cat ../../src/NumericSelectorRenderer.js >> Cuore-one.js
cat ../../src/SwitchCollapseAndUncollapseHandler.js >> Cuore-one.js
cat ../../src/CollapsablePanel.js >> Cuore-one.js
cat ../../src/CollapsableRenderer.js >> Cuore-one.js
cat ../../src/LabelPanel.js >> Cuore-one.js
cat ../../src/NumericSelectorRenderer.js >> Cuore-one.js

java -jar yuicompressor-2.4.6.jar --type js Cuore-one.js -o ../../Cuore-min.js
rm Cuore-one.js