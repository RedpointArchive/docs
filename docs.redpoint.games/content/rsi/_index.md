---
title: "Replicated Sublevel Instances"
pageTitle: "Replicated Sublevel Instances for Unreal Engine 4"
apiName: rsi
menu:
  rsi:
    name: Documentation
    weight: 100
    pre: <li class="section">Replicated Sublevel Instances</li>
  main:
    weight: 300
---

If you've got a procedurally generated multiplayer game, {{< brand "rsi" >}} is the plugin for you. It allows you to spawn sublevel instances at runtime and have them replicated across the network to all clients. By default Unreal Engine 4 does not support this behaviour (dynamic sublevel instances are not replicated).

{{< brand "rsi" >}} works by introducing a new component you can use in actors: the Sublevel component. Attach this component to a replicated actor, set the level path and enable Level Active, and it will handle replicating a dynamic level instance to all clients. You can use as many sublevel components as you like, which makes this a great plugin if your game implements procedural generation by stitching sublevels together.

{{< api-index "rsi" >}}