class DataHandler {
    constructor(db) {
        this.db = db;
    }

    newTodo(value) {
        const [login_user_id, todo] = value.split('&');
        const newID = Math.floor(Math.random() * 10000) + 1;
        const user_idx = this.getIdxOfUser(login_user_id);

        this.db.get(`users[${user_idx}].todos`).push({
            todo_id : newID,
            title   : todo,
            complete: false,
        }).write();
        return todo;
    }

    getTodo(login_user_id) {
        return this.db.get('users').find({'id': login_user_id}).value().todos;
    }

    deleteTodo(value) {
        const [login_user_id, todo_idx] = value.split('&');
        const user_idx = this.getIdxOfUser(login_user_id);

        // delete the item
        const deletedItem = this.db.get(`users[${user_idx}].todos[${todo_idx - 1}].title`).value();
        const deletedItemID = this.db.get(`users[${user_idx}].todos[${todo_idx - 1}].todo_id`).value();
        this.db.get(`users[${user_idx}].todos`).remove({todo_id: deletedItemID}).write();
        return deletedItem;
    }

    updateTodo(value) {
        const [login_user_id, todo_idx, UpdatedTitle] = value.split('&');
        const user_idx = this.getIdxOfUser(login_user_id);
        const previousTitle = this.db.get(`users[${user_idx}].todos[${todo_idx - 1}.title]`).value();
        this.db.get(`users[${user_idx}].todos`).find({title: `${previousTitle}`}).assign({title: UpdatedTitle}).write();
        return {previousTitle, updatedTitle: UpdatedTitle}
    }

    completeTodo(value) {
        const [login_user_id, todo_idx] = value.split('&');
        const user_idx = this.getIdxOfUser(login_user_id);

        this.db.set(`users[${user_idx}].todos[${todo_idx - 1}].complete`, true).write();
        return this.db.get(`users[${user_idx}].todos[${todo_idx - 1}].title`).value()
    }

    undo_completeTodo(value) {
        const [login_user_id, todo_idx] = value.split('&');
        const user_idx = this.getIdxOfUser(login_user_id);

        this.db.set(`users[${user_idx}].todos[${todo_idx - 1}].complete`, false).write();
        return this.db.get(`users[${user_idx}].todos[${todo_idx - 1}].title`).value()
    }

    getIdxOfUser(login_user_id) {
        const ID_fromDB = this.db.get('users').find({'id': login_user_id}).value();
        return this.db.get('users').value().indexOf(ID_fromDB)
    }

    checkTodoLength(login_user_id) {
        const user_idx = this.getIdxOfUser(login_user_id);
        return this.db.get(`users[${user_idx}].todos`).value().length;
    }

    getCompleteState(value) {
        const [login_user_id, todo_idx] = value.split('&');
        const user_idx = this.getIdxOfUser(login_user_id);
        return this.db.get(`users[${user_idx}].todos[${todo_idx - 1}].complete`).value()
    }

    checkID_PW(login_user_id, login_user_pw) {
        console.log(login_user_id, login_user_pw);
        const user_info = this.db.get('users').find({'id': login_user_id}).value();
        console.log(user_info);
        if (user_info === undefined || user_info.id !== login_user_id) return false;
        else return user_info.pw === login_user_pw;
    }

    checkDuplicatedID(id) {
        const user_info = this.db.get('users').find({'id': id}).value();
        return user_info !== undefined;
    }
}

module.exports = DataHandler;