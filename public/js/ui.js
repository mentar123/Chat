import Tamplate from './template';
import User from './user';
export default class UI{
    constructor(){
        this._template = new Tamplate();
        this._userInstance = User.instance;
        this.loginForm = $('.login-form');
        this.messageForm  = $(`form[name="send-message"]`);
        this.messageTextFiled = this.messageForm.find('#message');
        this._loginBlock = $('.login');
        this._autorizeBlock = $('.authorized');
        this._userNameField = $('.user-name');
        this._messageContainer = $('.message-container');
        this._userList= $('.users-list');
    }
userLoggenIn(name){
    this._userNameField.text(name);
    this._loginBlock.hide();
    this._autorizeBlock.show();
}
addUser(name){
    const template = this._template.getNewUser(name);
    this._messageContainer.append(template);
    this.loginForm[0].reset();
}
_updateUsersList(users){
    this._userList.text('');
    Object.keys(users).forEach(name=>{
        if(users[name].id !== this._userInstance.id){
            this._userList.append(this._template.getUserToList({
                name:name,
                id:users[name].id
            }));
        }
    });

}
addChatMessage(message){
    const template = this._template.getChatMessage(message);
    this._messageContainer.append(template);
    this.messageForm[0].reset();

}
showTypingMessage(userName){
    this._typingTemplate = $(this._template.getTypingTemplate(userName));
    this._messageContainer.append(this._typingTemplate)
}
hideTypingMessage(){
    this._typingTemplate.remove();
}


}