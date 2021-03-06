jest.mock("src/Models/Database");
jest.mock('src/Notification');

import React from "react";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAllIn, destroyAll,
    createTasks,
} from "src/common/test-utils";
import TaskScreen from "src/Screens/Tasks/TaskScreen";
import { TaskQuery, Task, ITask, ActiveTaskQuery } from "src/Models/Task/TaskQuery";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";
import DB from "src/Models/Database";
import { TaskParentTypes } from "src/Models/Task/Task";


afterEach(cleanup);

test("User has access to the complete button and more button", async() => {
    const opts = await setup();
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(
        <TaskScreen navigation={makeNavigation({id: opts.parentId})}>

        </TaskScreen>
    );
    await wait(async () => {
        const moreButton = getByLabelText("input-task-more-button");
        fireEvent.press(moreButton);
    })

    await wait(async () => {
        const completeButton = getByLabelText("input-task-complete-button");
    })

    await teardown();

    async function setup() {
        const opts = {
            parentId: ""
        }
        await DB.get().action(async () => {
            const parent = (await DB.get().collections.get('tasks').create((task: Task & ITask) => {
                task.title = "Parent";
                task.active = true;
                task.state = 'open';
            })) as Task;

            opts.parentId = parent.id

            const child = (await DB.get().collections.get('tasks').create((task: Task) => {
                task.parent = {
                    id: parent.id,
                    type: TaskParentTypes.TASK,
                }
                task.title= "Child";
                task.active = true;
                task.state = 'open';
            }));
        });

        return opts;
    }

    async function teardown() {
        await destroyAll();
    }
}, 10000);

test("User can mark a task (and its children) as Complete/Inactive in the database", async () => {
    const opts = await setup();

    let activeTasks: Task[] = await new ActiveTaskQuery().all();
    expect(activeTasks.length).toEqual(2);

    {
        const { queryAllByLabelText } = render(
            <ConnectedTaskList
                navigation={makeNavigation({})}
                parentId={""}
                type={"active"}
                onTaskAction={() => {}}
                id={undefined}
            ></ConnectedTaskList>
        );

        await wait(async() => {
            const items = queryAllByLabelText("task-list-item");
            expect(items.length).toEqual(2);
        })
    }

    {
        const { getByLabelText } = render(
            <TaskScreen navigation={makeNavigation({id: opts.parentId})}></TaskScreen>
        );

        await wait(() => {
            const moreButton = getByLabelText("input-task-more-button");
            fireEvent.press(moreButton);
        })
        await wait(() => {
            const completeButton = getByLabelText("input-task-complete-button");
            fireEvent.press(completeButton);
        })
    } 

    await wait(async() => {
        const completedTasks: Task[] = await new TaskQuery().completedTasks();
        expect(completedTasks.length).toEqual(2);
        const inactiveTasks: Task[] = await new TaskQuery().inactiveTasks();
        expect(inactiveTasks.length).toEqual(2);
    })

    await wait(async () => {
        activeTasks = await new ActiveTaskQuery().all();
        expect(activeTasks.length).toEqual(0);
    })

    {
        const { queryAllByLabelText } = render(
            <ConnectedTaskList
                navigation={makeNavigation({})}
                parentId={""}
                type={"active"}
                onTaskAction={() => {}}
                id={undefined}
            ></ConnectedTaskList>
        );

        await wait(async() => {
            const items = queryAllByLabelText("task-list-item");
            expect(items.length).toEqual(0);
        })
    }

    await teardown();

    async function setup() {
        const opts = {
            parentId: ""
        }
        await DB.get().action(async () => {
            const parent = (await DB.get().collections.get('tasks').create((task: Task & ITask) => {
                task.title = "Parent";
                task.active = true;
                task.state = 'open';
            })) as Task;

            opts.parentId = parent.id

            const child = (await DB.get().collections.get('tasks').create((task: Task) => {
                task.parent = {
                    id: parent.id,
                    type: TaskParentTypes.TASK,
                }
                task.title= "Child";
                task.active = true;
                task.state = 'open';
            }));
        });

        return opts;
    }

    async function teardown() {
        const tasks = await DB.get().collections.get('tasks').query().fetch();

        await DB.get().action(async() => {
            tasks.forEach(async (task: Task) => {
                await task.destroyPermanently();
            });
        });
    }
}, 20000);

test.skip("User can view both active and inactive tasks", async () => {
    const opts = await setup();

    const { getByLabelText, queryAllByLabelText } = render(
        <TaskScreen
            navigation={makeNavigation({id: opts.parentId})}
        ></TaskScreen>
    );

    {
        await wait(() => {
            const active = queryAllByLabelText("task-list-item");
            expect(active.length).toEqual(3);
        })
    }

    {
        const viewTwo = getByLabelText("input-view-2-tasks");
        fireEvent.press(viewTwo);
        await wait(() => {
            const inactive = queryAllByLabelText("task-list-item");
            expect(inactive.length).toEqual(2);
        })
    }

    {
        const viewOne = getByLabelText("input-view-1-tasks");
        fireEvent.press(viewOne);
        await wait(() => {
            const active = queryAllByLabelText("task-list-item");
            expect(active.length).toEqual(3);
        });
    }

    await teardown();

    async function setup() {
        const opts = {
            parentId: ""
        }
        await DB.get().action(async () => {
            const parent = (await DB.get().collections.get('tasks').create((task: Task & ITask) => {
                task.title = "Parent";
                task.active = true;
                task.state = 'open';
            })) as Task;

            opts.parentId = parent.id

            for(let i = 0; i < 3; i++) {
                (await DB.get().collections.get('tasks').create((task: Task) => {
                    task.parent = {
                        id: parent.id,
                        type: TaskParentTypes.TASK,
                    }
                    task.title= "Active Child " + i.toString();
                    task.active = true;
                    task.state = 'open';
                }));
            }

            for(let i = 0; i < 2; i++) {
                (await DB.get().collections.get('tasks').create((task: Task) => {
                    task.parent = {
                        id: parent.id,
                        type: TaskParentTypes.TASK,
                    }
                    task.title= "Inactive Child " + i.toString();
                    task.active = false;
                    task.state = 'open';
                }));
            }
        });

        return opts;
    }

    async function teardown() {
        await destroyAllIn('tasks')
    }
}, 20000)

describe("list interactions", () => {
    afterEach(async () => {
        destroyAll();
    })

    test("Can complete an active subtask without the task disappearing from screen", async () => {
        const { parentId, taskId } = await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <TaskScreen navigation={makeNavigation({id: parentId})}></TaskScreen>
        );

        let taskComplete;
        await wait(async () => {
            taskComplete = await getByLabelText("input-complete-" + taskId);
            fireEvent.press(taskComplete);
        })

        await wait(async () => {
            const tasks = queryAllByLabelText("task-list-item");
            expect(tasks.length).toEqual(2);
        })

        const activeTasks = await new ActiveTaskQuery().queryHasParent(parentId).fetch();
        expect(activeTasks.length).toEqual(1);

        async function setup() {
            const opts = {
                taskId: "",
                parentId: "",
            }

            await DB.get().action(async () => {
                opts.parentId = (await createTasks({
                    active: true,
                }, 1))[0].id;

                opts.taskId=(await createTasks({
                    parent : {
                        id: opts.parentId,
                        type: TaskParentTypes.TASK,
                    },
                    active: true,
                }, 2))[0].id
            });

            return opts;
        }
    }, 10000)

    test("Can fail an active subtask without the task disappearing from screen", async () => {
        const { parentId, taskId } = await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <TaskScreen navigation={makeNavigation({id: parentId})}></TaskScreen>
        );

        let taskFail;
        await wait(async () => {
            taskFail = await getByLabelText("input-fail-" + taskId);
            fireEvent.press(taskFail);
        })

        await wait(async () => {
            const tasks = queryAllByLabelText("task-list-item");
            expect(tasks.length).toEqual(2);
        })

        const activeTasks = await new ActiveTaskQuery().queryHasParent(parentId).fetch();
        expect(activeTasks.length).toEqual(1);

        async function setup() {
            const opts = {
                taskId: "",
                parentId: "",
            }

            await DB.get().action(async () => {
                opts.parentId = (await createTasks({
                    active: true,
                }, 1))[0].id;

                opts.taskId=(await createTasks({
                    parent : {
                        id: opts.parentId,
                        type: TaskParentTypes.TASK,
                    },
                    active: true,
                }, 2))[0].id
            });

            return opts;
        }
    }, 10000)
})