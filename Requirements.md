# Business Requirements

This document outlines the user and business requirements for the Spice project.

**Table of Contents**
- [Tasks](#Tasks)
- [Goals](#Goals)
    - [Adding a Goal](#Adding-a-Goal)
- [Rewards](#Rewards)
- [Penalties](#Penalties)

## Dashboard

The dashboard is key because, to a first approximation, it allows users to quickly view and access the highly relevant information about their goals, tasks, etc. Thus, it is focused on sharing information that the user should know for now and the near future:

- [ ] Check that dates are initialized with time to the correct value, if the user **is not allowed** to choose them. Should be midnight.
    - [ ] Due dates should be initialized to 11:59 PM of the date they are started on.
    - [ ] Start dates should be initialized to 12:00 AM of the date they are started on.
    - [ ] How can we make this timezone agnostic? If you change timezone so that you gain 3 hours extra, the due stuff should reflect that.
    - [ ] Prevent start date from being after due date
- [ ] Tasks for Today, which is composed of
    - [T] Active tasks that are actually due today or overdue
        - [ ] if the parent is also due today or overdue, then the child does not show
    - [ ] Overdue active tasks
        - [T] Should appear in list
        - [ ] Icon should mark these as overdue
        - [ ] Titles should be highlighted in red
    - [T] Active goals that are due today or overdue
        - [T] If the parent is also due today or overdue, then the child does not show
    - [ ] Overdue goals
        - [ ] Icon should mark these as overdue
        - [ ] Titles should be highlighted in red
    - [ ] **Goals should be easily distinguishable from tasks**. Goals should have a greater dignity to them.
- [ ] In Progress Tasks, which is composed of
    - [T] Active In Progress tasks (where the start has passed, but the due date is after today)
    - [T] Active In Progress goals (where the start has passed, but the due date is after today)
    - [T] If the parent task/goal is also in the list, then the child does not show.
    - [ ] Group not just by goal, but also by date, since a given day could have a ton of tasks that make this list way too long.
- [ ] Menu that provides access to other lists that are necessary for application domain functionality. Links to the following:
    - [T] Upcoming tasks
    - [T] List of rewards
    - [T] List of penalties
    - [ ] List of earned rewards
    - [ ] List of earned penalties
- [ ] Reporting
    - [ ] User can see progress over last month?
    - [ ] User can add/subtract widgets?

## Tasks

As you would expect with any Todo app, Tasks are ubiquitous within Spice. Whenever something needs to be done, a Task contains the details about _what_ needs to be done. Thus, it typically includes the following data:

- Title of the task
- Instructions on how to complete the task
- Date the task should start
- Date the task should have been completed

### User Stories - Adding a Task
- [ ] General
    - [ ] Mandatory fields
        - [ ] Indicate
        - [ ] Enforce
            - [ ] Name
    - [ ] Field validation - mandatory is just a variant of field validation
        - [ ] Indicate
        - [ ] Enforce
            - [ ] If task is child of Goal
                - [ ] Start date is within range of Goal Start to Goal Due
                - [ ] Due date is within range of Goal Start to Goal Due
    - [ ] Form validation
        - [ ] Check mandatory fields
        - [ ] Validate all fields
            - [ ] Start date is before end date
- [ ] User should be able to fill out and submit a form with data about a new task.
    - [ ] User should be able to associate the created task with a goal
        - [X] By adding the new task from the goal
        - [ ] By dragging and dropping a task onto a goal
    - [ ] User should be able to click "Save" and return to previous screen
    - [X] After "Save" is clicked, the Task should be available
        - [X] In the list of all Tasks.
        - [X] In the list of tasks for the associated Goal, if there is one.
        - [X] In the list of tasks for the associated Task, if there is one.
    - [ ] User should be able to scroll through the form's fields when they overrun the page.

- [ ] Add/Edit Task form should have following fields
    - [ ] Name
    - [ ] Description
    - [ ] Start Date
    - [ ] Due Date
    - [ ] Recurring

- [ ] User should be able to edit an existing task in a form
    - [ ] Mandatory fields
        - [ ] Indicate
        - [ ] Enforce
    - [X] User should be ablet to click "Save"
    - [X] After "Save" is clicked, changes should be persisted to the database, and available
        - [X] In the list of all Tasks.
        - [X] In the list of tasks for the associated Goal, if there is one.
        - [X] In the list of tasks for the associated Task, if there is one.
    - [ ] User should be able to scroll through form's fields.

### User Stories - Viewing Tasks

- [ ] User should be able to view a list of tasks
    - [X] At minimum, all tasks
    - [X] User should be able to see attributes on tasks:
        - [X] Title
        - [X] Start date
        - [X] Due date
        - [ ] Percentage or fraction of completed subtasks.
    - [ ] User should have several modes available for interacting with the list.
        - [ ] View mode. In this mode, clicking on a task item takes you to the task itself.
        - [ ] Grab mode. In this mode, pressing and holding on a task item will pick it up. It can be moved up and down.
        - [ ] Select mode.
            - [ ] In this mode, clicking on a task item will select it. One or more can be selected.
            - [ ] A menu appears with options for what to do with the selected items.
                - [ ] Deselect all
                - [ ] Select all
                - [ ] Delete selected
                - [ ] Move selected
    - [ ] Users should be able to delete one or more tasks from the full list
        - [ ] Deleting goals should delete associated subtasks
        - [ ] User should be able to toggle a Delete Mode
        - [ ] User should be able to mark multiple tasks for deletion
        - [ ] User should be prompted to confirm deletes

- [X] User should be able to view specific Task
    - [X] In its own screen
    - [X] With a list of associated tasks (its children)
    - [T] User should be able to mark task as complete
        - [T] Complete button should be available
        - [T] When clicked, Complete button should mark task as Complete and Inactive
        - [T] When clicked, Complete button should mark subtasks as Complete and Inactive
        - [ ] When clicked, Complete button should mark grandchildren tasks as Complete and Inactive
    - [T] User should be able to see the past, the present, and the future of the task:
        - [T] User should be able to view currently active tasks in their own view
        - [T] User should be able to view inactive tasks in their own view

- [ ] User should have screen to view the list of upcoming tasks:
        - [ ] Active Open tasks (where the start has not yet passed)
        - [ ] Active Open goals (where the start has not yet passed)
        - [ ] The tasks are stored under the parent goals/tasks if the relationship exists

## Goals

Goals are a fundamental part of Spice, because a Goal comes with Rewards. There are several goal types, but each typically comes with several typical data items:

- Title of the goal
- Date of start
- Date of expiration (you got to commit to completing the goal at some point, you know?)
- Data on how often the goal recurs
- What kind of Reward should be generated when the Goal is completed
- Tier of the goal, since some goals are more important or difficult than others, and deserve to marked as such


### User Stories - Adding a Goal

- [ ] User should be able fill out and submit a form with data about goals
    - [ ] Mandatory fields
        - [ ] Indication icon
        - [ ] Enforce
            - [ ] Summary
    - [ ] Field validation
        - [ ] Indication icon
        - [ ] Enforce
            - [ ] Streak minimum cannot be lower than 2 after blur
    - [ ] Form validation upon saving
        - [ ] All mandatory fields are present.
        - [ ] All fields pass validation
    - [T] Normal goal fields are available:
        - [T] Summary
        - [T] Goal Type
        - [T] Start Date
        - [T] Due Date
        - [ ] Reward
            - [T] Field is visible
            - [ ] Two Dice
            - [ ] Specific
            - [ ] Coin
            - [ ] Wheel
            - [ ] None
        - [T] Penalty
        - [T] Recurring
    - [ ] User should be able to fill out data about recurrence of the goal.
    - [XT] User should be able to fill out data about whether the goal is a streak.
        - [T] Minimum streak count
        - [T] Streak type (daily, weekly, monthly)
            - [T] Daily shows when type is Daily
            - [ ] Weekly shows when type is Weekly
            - [ ] Monthly shows when type is Monthly
        - [T] Time if daily streak
        - [X] Day if weekly streak
        - [X] Day of month if monthly streak
    - [X] User should be able to click "Save" and return to previous screen
    - [X] After "Save" is clicked, the new Goal should available in the GoalList.
    - [X] After "Save" is clicked, all fields of the Goal should be saved to the database as a new goal.
        - [T] Summary
        - [T] Goal Type
        - [ ] Start Date
        - [ ] Due Date
        - [T] Reward Type
    - [ ] User should be able to scroll through the form's fields when they overrun the page.

- [ ] User should be able to edit an existing Goal through a form
    - [ ] Mandatory fields
        - [ ] Indicate
        - [ ] Enforce
    - [ ] User should be able to edit data about recurrence of the goal.
    - [ ] User should be able to edit data about whether the goal is a streak.
    - [X] User should be able to click "Save"
    - [X] Saving should actually update the Goal in the database.
    - [X] After "Save" is clicked, the edited Goal, with all changes, should available after navigating back to the GoalList.
    - [ ] User should be able to scroll through the form's fields when they overrun the page

- [ ] User should be able to delete a Goal while in the Goal's form
    - [ ] User should be prompted for confirmation about the deletion

### User Stories - Viewing Goals

- [X] Users should be able to view all existing goals
    - [ ] Goals should be organized according to parent/child relationships.
    - [X] User should be able to see basic information on the goal
        - [X] Title
        - [X] Due Date
        - [X] Type (for example, some goals are streaks)
        - [ ] Start Date (so they can know what's coming).
        - [ ] Percentage or fraction of completed tasks or subgoals
    - [ ] User should be able to scroll through goals when they overrun the page.
- [ ] Users should be able to sort on
    - [ ] Title
    - [ ] Due Date
    - [ ] Start Date
- BACKLOG [ ] Users should be able to filter on
    - [ ] Title
    - [ ] Due Date
    - [ ] Type
- [ ] Users should be able to delete one or more goals from the full list
    - [ ] Deleting goals should delete associated subtasks and subgoals
    - [ ] User should be able to toggle a Delete Mode
    - [ ] User should be able to mark multiple goals for deletion
    - [ ] User should be prompted to confirm deletes

- [ ] Users should be able to view an existing goal with 
    - [X] In its own screen
    - [ ] A summary of the goal and its tasks at the top
        - [X] Title
        - [ ] Due date
        - [ ] Task count
    - [X] A list of the child tasks below with
        - [X] Only the tasks that belong to the goal
        - [X] Title
        - [X] Start Date
        - [X] Due Date
    - [ ] A list of the child goals below with
        - [ ] Only the goals that belong to the parent goal
        - [ ] Title
        - [ ] Start Date
        - [ ] Due Date
    - [ ] A list of the child tasks below with
        - [ ] Only the goals that belong to the parent goal
        - [ ] Title
        - [ ] Start Date
        - [ ] Due Date
    - [X] User should be able to edit the goal by clicking a button to go to the edit screen.
    - [X] User should be able to click a button to go to a screen for adding a new task to the goal
        - [X] Clicking the button takes the user to the Add Task screen.
        - [X] Using the Add Task Screen adds the task to the goal within the database
    - [T] User should be able to mark goal as complete
        - [T] Complete button should be available
        - [T] When clicked, Complete button should mark task as Complete and Inactive
        - [T] When clicked, Complete button should mark subtasks as Complete and Inactive
        - [T] When clicked, Complete button should generate corresponding reward
            - [T] If reward was Two Dice, a Two Dice earned reward should be generated a
            - [T] If reward was Lootbox, a Lootbox earned reward should be generated 
            - [T] If reward was Coin Flip, an earned reward/penalty should be generated.
            - [T] If reward was Spin the Wheel, an earned reward/penalty should be generated.
            - [T] If reward was Specific reward, a Specific earned reward should be generated.
            - [T] If reward was None, no reward or penalty should be generated.
        - [T] If the goal is a streak goal, complete will show an fail if the streak minimum cannot be met.
            - [T] Error message.
            - [T] Complete will not complete anything.
    - [T] For streak goals, all tasks that were created and NOT DELETED in the last cycle will be regenerated according to the streak schedule
        - [T] Background tasks for generating the last cycle need to when the app is open in background
        - [T] Background tasks for generating the last cycle need to run when the app is open in foreground
        - [T] Background tasks for generating the last cycle need to run when the app is closed.
    - [T] User should be able to see the past, the present, and the future of the goal:
        - [T] User should be able to view currently active tasks in their own view
        - [T] User should be able to view inactive tasks in their own view
- [ ] Users should be able to re-order tasks within a goal by drag-and-drop.
- [ ] Users should be able to click on a task to view it, and its sub-tasks, in more detail.
- [ ] Users should be able to sort the tasks by
    - [ ] Order
    - [ ] Start Date
    - [ ] Due Date

## Rewards

Rewards are part of what makes Spice different from the usual task planner application. When a user completes one of their goals, typically they will earn a reward. Rewards can come in different flavors, but core rewards include the following:

- A specific reward
- A randomly chosen reward from some non-strict subset of all rewards
    - by group, if the user has organized some of the rewards into groups
    - by Tier, if the user has assigned Tiers to his goals
- A selection of rewards -- the user can choose just 1
    - by group
    - by Tier
    - by a random selection from groups, tiers, or the entire pool of rewards

Rewards typically come with the following data items:

- Title of the reward
- Date of expiration (you got to take advantage of the reward at some point -- don't be a workaholic!)
- Data on how often the reward recurs. Is the reward available just once, once per month? Or every Friday the 13th? Having a variety of recurring rewards will make your experience Spicier.
- Tier of the reward, since some rewards are more fitting for certain goal tiers.
- Points - points will typically be automatically calculated (formula to be determined), but they provide you with a way to view your efforts over time.

### User Stories - Adding Rewards

- [ ] User should be able to fill out form with details about new Reward.
    - [ ] Mandatory fields
        - [ ] Indicate
        - [ ] Enforce
    - [ ] User should be able to click "Save" button and go back to previous page.
    - [X] After clicking "Save", changes should persist to database
    - [ ] Form should be scrollable

- [ ] User should be able to edit existing Reward in a form.
    - [ ] Mandatory fields
        - [ ] Indicate
        - [ ] Enforce
    - [ ] User should be able to click "Save" button and go back to previous page.
    - [X] After clicking "Save", changes should persist to database
    - [ ] Form should be scrollable.


### User Stories - Viewing Rewards

- [X] User should be able to view all rewards
    - [X] User should be able to view the following reward attributes at a glance
        - [X] Title
        - [X] Expiration Date
    - [ ] Rewards should filterable
        - [ ] Active rewards
        - [ ] Inactive rewards
    - [ ] Rewards should be sortable by
        - [ ] Title
        - [ ] Start date
        - [ ] Expiration date

- [ ] User should be able to view an existing reward
    - [ ] Summary should be available at top
    - [ ] Edit button should be available if user wants to make edits
    - [ ] If Active, Retire button should be available if user wants to retire the reward.
    - [ ] If Inactive, Unretire button should be available if user wants to unretire the reward.

### User Stories - Viewing Reward Info

- [X] User should be able to view all reward types and read their descriptions
    - [X] Dice (2 six-sided, one number is a penalty)
    - [X] Lootbox (3 choices of loot, all are rewards)
    - [X] Coin (50-50 chance of a chosen reward or a chosen penalty)
    - [X] Specific ( Choose the reward beforehand. Prevents deletion of the reward)
    - [X] Random (Randomly chooses from all available rewards. Small chance of penalty instead)
    - [ ] Still need to **typeset** the line spacing correctly.

## Earned Rewards (ER for short)

When a goal is completed, the associated Reward is earned, if any. The user can then choose to claim these at any time. Ideally, these earned Rewards would have an attached expiration date, so that the user would be forced to take advantage of one of these. But this would be somewhat complicated to make into a good user experience -- most users will want to have complete freedom when it comes to what they've earned. So for now, no implementation of expiration for Earned Rewards will be implemented.

### User Stories - Viewing ER

- [ ] User should be able to view all ER
    - [ ] The following attributes should be available at a glance:
        - [ ] Type
        - [ ] Icon
        - [ ] Earned Date
        - [ ] Tier
    - [T] All ER should be available in list.
    - [ ] ER should be filterable
        - [ ] Unclaimed (that is, not yet opened)
        - [ ] Claimed

- [ ] User should be able to view one particular ER
    - [ ] The following details should be available:
        - [T] Type
        - [T] Icon
        - [T] Earned Date
        - [T] Source Goal
        - [ ] Tier
    - [ ] If the user has not claimed the ER, the wizard for the ER should be available
        - [T] Two Dice
        - [ ] Coin
        - [ ] Wheel
        - [ ] Specific
        - [ ] Lootbox
    - [ ] If the user __has__ claimed the ER, the resulting reward/penalty should be available in the Claimed Rewards

### User Stories - Claiming an ER

- [ ] From the view of a particular ER, the user should be able to
    - [ ] Click the "Claim" button, which should take them to a screen based on the type of earned reward:
        - [ ] Two Dice
            - [T] Claim button is available, which rolls the dice
            - [ ] User should be able to view which numbers correspond to which rewards.
            - [T] After Claim is clicked, the ClaimedReward is created with the corresponding
                        Penalty or Reward.
            - [ ] After Claim is clicked, user should be shown a modal of 
                    the reward that they claimed, with a link to go to the reward if they so desire
            - [ ] General polish of the dice-rolling portion, which currently looks horrible.

### User Stories - Adding ER

The only way to create ER is to complete a goal that is associated with a reward. Once an ER is earned, there is no way to edit it, except perhaps by setting an expiration date (no plans to implement this, however).

## Penalties

Penalties are part of what makes Spice different from the usual task planner application. They are intended to be constructive, not punitive. Here are several example penalties:

- Cleaning your apartment
- Starting to exercise regularly 
- Confronting one of your fears
- Asking for some change at work

Penalties should be things that are ultimately good for you, but unpleasant enough that you put them off. They range from minor things like spring cleaning and exercising to large things like confronting your fears. They should also be things that you can afford to put off -- don't forget to file your taxes on time because you didn't get Penalized while using Spice! (Make filing your taxes early a Goal instead)

Penalties may be incurred for several reasons:

- When a user fails to complete one of their goals by the established deadline (deadlines are encouraged for that reason)
- When a user completes one of their goals, a penalty may be occasionally assigned. This is part of life's Spice - good is not always rewarded, and sometimes doing unpleasant things is ultimately rewarding.

Penalties typically come with the following data items:

- Title of the penalty
- Due date (you earned the penalty -- now own it!)
- Data on how often the penalty occurs. Although it's easiest to think of one-time penalties, having recurring penalties will keep your chances to push through the hard stuff, up.
- Tier of the penalty, since some penalties are harder than others.
- Points - points will typically be automatically calculated (formula to be determined). Completing penalties will also boost your scores over time.
- Whether this penalty has been converted to a goal, since some penalties are just goals that we have been putting off because they seem to disruptive to our current lifestyle.

### User Stories - Viewing Penalties

- [ ] User can view all existing penalties in a list
    - [T] Each penalty from the database is present
    - [ ] Each penalty list item shows the following attributes:
        - [ ] Title
        - [ ] Expiration date

### User Stories - Adding/Editing a Penalty

- [ ] User can fill out a form with the new penalty's informtion
    - [ ] Mandatory fields should be marked
    - [T] Title
    - [T] Expiration Date
    - [T] Details
    - [T] Save button is available
    - [T] After clicking save, a new Penalty is created in the database.

- [ ] User can edit a form with an existing penalty's information
    - [ ] Mandatory fields should be marked
    - [T] Title
    - [T] Expiration Date
    - [T] Details
    - [T] Save button is available
    - [T] After clicking Save, the existing table is edited in the database.


## Claimed Rewards/Penalties


### User Stories - Viewing Claimed Items

- [T] User should be able to view all claimed rewards
- [T] User should be able to view all claimed penalties


## Streaks

How to represent a Streak Goal? Like any goal, this should have a start and end date. The date indicates the starting date of the streak's cycles, and the end date represents the estimated last cycle (off by a fudge factor is permissible).

What becomes more difficult here is how to represent the tasks that make up a cycle in the streak (whether daily, weekly, or monthly). What makes this tough is that, unlike with Recurring Goals, which have just one goal per cycle, the tasks of a Streak Goal may be spread throughout a cycle. How do we capture that information, while also allowing the user to add new goals to a cycle that get persisted to the next cycle?

One way to do this is to calculate everything. If we know the start date, then perhaps we know other things about the cycle:

- daily means the cycle starts every day at midnight
- weekly means the cycle starts every week on the same weekday as the start date
- monthly meanst he cycle starts every month on the same month day as the start date (rounded if necessary).

Indeed, if we know this information, we can calculate the range of valid dates for a new task that the user adds to the streak -- the dates must fall in the current cycle or the next cycle. If it falls in the next cycle, when we calculate the next cycle, we take what is in the current cycle and add it to what is in the next cycle, no questions asked.

An alternative way of doing this is to create streak templates. But if we use streak templates, we have to represent in the templates how the template falls in the cycle. If daily, what times are the tasks? If weekly, what days are the tasks ( and what times?). If monthly, what month days are the tasks (and what times)? This might seem like more trouble than it is worth, but one benefit is that it is easy for the user to see what tasks are being generated per cycle. On the other hand, it is more complex and it raises questions -- if the user adds a task to the templates, does it get put in the current cycle? It is far less complex to let the user choose where the tasks are in the current or next cycle.

