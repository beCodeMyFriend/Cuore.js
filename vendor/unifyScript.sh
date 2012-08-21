#!/bin/sh

cd ./src
rm -f cuore.unified.js

UNIFIED=cuore.unified.js

cat Cuore.js >> $UNIFIED
cat Cuore.Core.js >> $UNIFIED
cat Cuore.Class.js >> $UNIFIED
cat Cuore.Dom.js >> $UNIFIED
cat Cuore.Dom.Event.js >> $UNIFIED
cat Cuore.Bus.js >> $UNIFIED
cat Cuore.State.js >> $UNIFIED
cat Cuore.Page.js >> $UNIFIED
cat Cuore.Message.js >> $UNIFIED
cat Cuore.Component.js >> $UNIFIED
cat Cuore.Renderer.js >> $UNIFIED
cat Cuore.Handler.js >> $UNIFIED
cat Cuore.Directory.js >> $UNIFIED
cat Cuore.HandlerSet.js >> $UNIFIED
cat Cuore.Registry.js >> $UNIFIED
cat Cuore.Service.js >> $UNIFIED
cat Cuore.Journey.js >> $UNIFIED
cat Cuore.Decoration.js >> $UNIFIED

cat Components/Cuore.Components.Nestable.js >> $UNIFIED
cat Components/Cuore.Components.Input.js >> $UNIFIED
cat Components/Cuore.Components.Button.js >> $UNIFIED
cat Components/Cuore.Components.TimeRange.js >> $UNIFIED
cat Components/Cuore.Components.Collapsable.js >> $UNIFIED
cat Components/Cuore.Components.SwitchButton.js >> $UNIFIED
cat Components/Cuore.Components.LabelPanel.js >> $UNIFIED
cat Components/Cuore.Components.NumericSelector.js >> $UNIFIED
cat Components/Cuore.Components.Link.js >> $UNIFIED
cat Components/Cuore.Components.List.js >> $UNIFIED

cat Handlers/Cuore.Handlers.SetText.js >> $UNIFIED
cat Handlers/Cuore.Handlers.Executor.js >> $UNIFIED
cat Handlers/Cuore.Handlers.Print.js >> $UNIFIED
cat Handlers/Cuore.Handlers.SwitchCollapseAndUncollapse.js >> $UNIFIED

cat Renderers/Cuore.Renderers.Input.js >> $UNIFIED
cat Renderers/Cuore.Renderers.Button.js >> $UNIFIED
cat Renderers/Cuore.Renderers.LabelPanel.js >> $UNIFIED
cat Renderers/Cuore.Renderers.TimeRange.js >> $UNIFIED
cat Renderers/Cuore.Renderers.Collapsable.js >> $UNIFIED
cat Renderers/Cuore.Renderers.SwitchButton.js >> $UNIFIED
cat Renderers/Cuore.Renderers.NumericSelector.js >> $UNIFIED
cat Renderers/Cuore.Renderers.Link.js >> $UNIFIED
cat Renderers/Cuore.Renderers.List.js >> $UNIFIED

cat Services/Cuore.Services.Button.js >> $UNIFIED
cat Services/Cuore.Services.Label.js >> $UNIFIED
cat Services/Cuore.Services.Null.js >> $UNIFIED

echo $UNIFIED refreshed!