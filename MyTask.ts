import TaskQuery from "src/Models/Task/TaskQuery"
import GlobalQuery, { GlobalLogic } from "src/Models/Global/GlobalQuery"
import Notification from "src/Notification";

module.exports = async (taskData) => {

    new GlobalLogic().runDailyNotifications(); 
}