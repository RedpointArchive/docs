---
title: "Replicated Sublevel Instances Quickstart"
apiName: rsi
menu:
  rsi:
    name: Quickstart
    weight: 105
---
{{% toc %}}

This quickstart guide will walk you through installing and using {{< brand "rsi" >}} in your Unreal Engine 4 game.

## Install Replicated Sublevel Instances

If you haven't already done so, [purchase Replicated Sublevel Instances on the Unreal Engine Marketplace](https://www.unrealengine.com/marketplace/replicated-sublevel-instances).

Once you've purchased {{< brand "rsi" >}}, install it to your machine through the Epic Games Launcher:

{{< img "./launcher.png" >}}

## Open or create a new Unreal Engine project

Open or create the Unreal Engine project that you want to use {{< brand "rsi" >}} with. This quickstart will assume you're starting from a blank project, but the instructions should be applicable to existing projects as well.

## Enable {{< brand "rsi" >}}

Before you can start using {{< brand "rsi" >}}, you'll need to enable the plugin in your project. Open the plugin manager from the Settings menu:

{{< img "./plugins-open.png" >}}

Locate "ReplicatedSublevelInstances", and check the Enabled checkbox:

{{< img "./rsi-enable.png" >}}

When prompted to restart the editor, click "Restart Now":

{{< img "./restart-now.png" >}}

## Create two new levels

Once the editor has restarted, create two new levels in your Content Browser, one named "MyMainLevel" and one named "MySublevel". Then, open the "MySublevel" level in the editor.

{{< img "./levels.png" >}}

## Update the sublevel

Update the sublevel to contain a Cube actor and a Point light, as shown in the following image:

{{< img "./sublevel-update.png" >}}

## Create a new blueprint

Now we need to create the blueprint that will spawn the sublevel instance dynamically. Create a new Actor blueprint with the name "MapManager":

{{< img "./blueprint-create.png" >}}

{{< img "./actor-create.png" >}}

{{< img "./mapmanager-create.png" >}}

## Add the Sublevel component to the blueprint

In the blueprint editor for "MapManager", click Add Component and search for "Sublevel". Then click on "Sublevel" to add the component:

{{< img "./add-sublevel-component.png" >}}

## Set up the component to load the level on BeginPlay

Update the "MapManager" blueprint to set the path of the sublevel component and activate it when the "MapManager"'s BeginPlay event occurs:

{{< img "./blueprint-configure.png" >}}

## Enable the MapManager actor to replicate

In order for the MapManager actor to replicate to clients in a multiplayer game, you must enable "Replicates" on the actor. In addition, you must mark the actor as "Always Relevant", since we want the sublevel to propagate to all clients connected to the game.

{{< img "./enable-actor-replication.png" >}}

## Enable the Sublevel component to replicate

In order for the Sublevel component to replicate as part of the MapManager actor, you must enable "Component Replicates". Select "Sublevel" in the "Components" tab, then check "Component Replicates" under the "Details" tab:

{{< img "./enable-component-replication.png" >}}

## Add the MapManager to MyMainLevel

Open up MyMainLevel, and using the "Modes" pane, search for "MapManager" and drag it into the world. You should see the MapManager in the world like so:

{{< img "./mapmanager-add.png" >}}

## Test it in single player

You can now click Play in the Unreal Engine toolbar to test that the sublevel spawns in correctly. You should see the cube that was added to "MySublevel" appear in the game:

{{< img "./play-in-editor-1.png" >}}

## Test it in multiplayer

Once it's working in single player, you can try it out in multiplayer. Under the Play toolbar button, increase the number of players to 2 as shown in the following screenshot:

{{< img "./play-in-editor-2.png" >}}

Then click the "Play" button in the toolbar. You should see a second window open (the second client) and if you move the players around, you should be able to notice that they can both see the cube in the sublevel, and each other:

{{< img "./play-in-editor-3.png" >}}


{{% /toc %}}