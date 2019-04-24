3/18
cloc src --exclude-dir=data --ignore-whitespace
      73 text files.
      73 unique files.                              
       1 file ignored.

github.com/AlDanial/cloc v 1.80  T=0.39 s (187.6 files/s, 19398.3 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Vuejs Component                 57            352             59           6140
JavaScript                      15             88             76            808
EJS                              1              1              3             21
-------------------------------------------------------------------------------
SUM:                            73            441            138           6969 ( n i c e )
-------------------------------------------------------------------------------

4/8
     118 text files.
     118 unique files.                                          
       0 files ignored.
github.com/AlDanial/cloc v 1.80  T=0.38 s (309.8 files/s, 31673.3 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Vuejs Component                 79            482            143           9173
TypeScript                      38            149            116           1975
EJS                              1              1              3             21
-------------------------------------------------------------------------------
SUM:                           118            632            262          11169
-------------------------------------------------------------------------------


search for:
“   ”
‘   ’
1/round
--
ﬀ
ﬂ
ﬁ

[^\x00-\x7F]

>//[A: bbbb]

Additional actions:
```json
actions: [
  {
    "action": "quick",
    "name": "Smoke Charge",
    "effect": "The blast area grants soft cover to all characters and objects inside. Lasts until the end of your next turn, then disperses."
    "tags": [
      {
        "id": "grenade"
      },
      {
        "id": "range",
        "val": 5
      },
      {
        "id": "burst",
        "val": 3
      }
    ]
  }
]
```



# Base Actions :
move + 2 quick actions OR 1 full action
no duped actions, unless free or overcharged
## MOVE
  Move your character up to its speed in any direction.
## QUICK ACTION
  SKIRMISH - Attack with one weapon from your mech.
  BOOST - Move your speed
  RAM - Attempt to knock down or knock back your target
  GRAPPLE - Attempt to grab on your target, potentially immobilizing it or riding it. QUICK TECH - Perform quick electronic warfare or systems-boosting activities HIDE- Attempt to hide
  SEARCH - Look for a hidden target
  SHUT DOWN (quick action) - Shut down your mech as a desperate measure, to end system attacks, regain control of AI, and cool your mech
  SELF DESTRUCT (quick action) - As a last ditch measure, set your reactor to go critical and explode
  PREPARE (quick action) - Hold a quick action for a specified trigger
## FULL ACTION
  BARRAGE - Attack with two weapons, or attack with a single superheavy weapon.
  FULL TECH - Choose and perform two options from the tech list, or perform a full tech action 
  IMPROVISED ATTACK - Attack with a fist, rifle butt, or improvised weapon in melee. 
  STABILIZE- Heal and cool down your mech, reload, or attempt to end conditions affecting it 
  DISENGAGE - Move safely, avoiding reactions and engagement
  BOOT UP - Fire up your mech from Shut Down
  MOUNT/DISMOUNT - Get in or out of your mech
  SKILL CHECK - Perform an activity with a clear goal that would take a skill check
## OVERCHARGE
  OVERCHARGE - spend heat and gain free quick action
## SAVE
  SAVE - roll save vs skill
## REACTION
  BRACE - Brace your mech for impact, reducing damage at the cost of your next turn’s actions
  OVERWATCH - Attack a close-by target attempting to move
## MELEE ATTACKS
- threat range, grit vs evasion
- ignore cover
## RANGED ATTACKS
- grit vs evasion
## CRIT
- roll twice take highest
## TECH ATTACKS
- sensor range, tech attack vs. e-def

## Base Modifiers:
## Difficult Terrain
  half movement
## Dangerous Terrain
  start of turn: eng save or 5 var damage
## Engaged
  +1 diff on ranged attack rolls
## Soft Cover
  +1 diff on ranged attacks made against
## Hard Cover
  +2 diff on ranged attacks made against
## Invisible
  50% chance to miss any attack


# Actions: #
## Fly when X
 - cb all theater movement: move, boost // 1 heat
## Adaptive Reactor
 - cb adaptive: 3 repairs in stabilize = -1 reactor stress
## Initiative
 - everest trait: free quick action FIRST TURN ONLY
## Replacable Parts
 - everest trait: 1 repair = 1pt structure, REST ONLY
## Power Up
 - everest CS active: free FA or 2 free QAs
## Cable Grapple
 - blackbeard trait: init grapple up to 5 away


# Output modifiers: #
## +X Mount Accuracy
 - cb hardpoints: +1 accuracy (mount)
## +X Mount Damage
 - cb burnout: +1d6 damage (mount)
## Roll to replenish CORE power
 - cb reserve capacitors
## Max structure roll
 - cb briareos (2d6)
## Extra free X action on success X
 - cb titanomachy: ram or grapple
## + Knockback
 - cb titanomachy: +1
## + Speed when X
 - cb nerveweave: +2, boosting
## + Weapon Range for X
 - cb gyges: +1, threat
 - cb neurolinked: +3, all ranged
## Add X on Y
 - cb opendoor: 1 heat on target fails save
 - cb tomorrow's thought: +1 melle acc on successful attack ON THAT TARGET
## + Limited
 - cb ammofeeds: +2

# Input modifiers: #
## Damage resistance
 - cb briareos: ALL when < 2 pts structure remain
 - cb stasis: ALL when gaining reactor stress, untill EONT
## Resist status
## Immune to status
 - cb superior: Impaired
## +X check ATTRIBUTE
 - cb gyges: +1, HULL
 - cb kai: +1, AGI
 - cb disbelief: +1 SYS
 - cb sculpted: +1 ENG
 - blackbeard trait: -1 ENG
## Heat Limit
 - cb heatfall: 1d6 max on overcharge

# Turn modifiers #
## Invisibility, breaks on X
 - cb ghostweave: on **NOT** move, hide, boost
## Disappear
 - cb transub: on structure damage
## Soft Cover
 - cb sculpted: until next turn on overcharge