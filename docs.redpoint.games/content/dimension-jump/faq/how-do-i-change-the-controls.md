---
title: "How do I change the controls? (Advanced)"
apiName: dimension-jump
weight: 40
menu:
  dimension-jump:
    name: How do I change the controls? (Advanced)
    weight: 140
---
{{% toc %}}

Follow the steps below to change your controls in Dimension Jump: 

1. Download the "[input_mappings.json](../input-mappings.json)" file.
2. Place file in `C:\Users\<your username>\AppData\Local\dimension_jump`.
3. Edit the file to your liking.

To add or change controls for each function you can follow the guide below.

## Modifying keys

Each function is listed like so:

```
"jump_held": {
    "keyboard_check": [
        "vk_up"
    ],
    "gamepad_button_check": [
        "gp_face1"
    ],
    "keyboard_hint": "spr_tutorial_keyboard_up",
    "gamepad_hint": "spr_tutorial_gamepad_a"
}
```

To change or add new keys, you can to the list under "keyboard_check":

```
"keyboard_check": [
    "vk_up",
    "J"
],
```

This example adds the "J" key while retaining the up key's functionality.

## List of modifiable controls

The list of controls and relevant identifiers are below:

- Move left: "left_held"
- Move right: "right_held"
- Move up: "up_held"
- Move down: "down_held"
- Jump: "jump_held", "jump_press_not_held" and "jump_release"
- Dimension Jump: "dimension_jump_press_not_held"
- Teleport: "teleport_held", "teleport_press_not_held" and - "teleport_release"
- Back / Exit: "back_press_not_held", "back_at_menu_press_not_held", "back_at_main_menu_press_not_held" and "main_menu_quick_escape"
- Restart: "restart_press_not_held"
- Start level / Select menu item: "start_press_not_held" and "start_at_main_menu_press_not_held"
- Swap leaderboard list: "level_select_leaderboard_swap"

Be sure to change all relevant identifiers.

There are other functions regarding the level editor which may be altered the same way.

{{% /toc %}}