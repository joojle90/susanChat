'use strict';

const socket = io();

(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage, getBotMessage;
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            message_side = 'right';
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            
            message = new Message({
                text: text,
                message_side: message_side
            });
            
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        
        getBotMessage = function (text) {
            message_side = 'left';
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            
            message = new Message({
                text: text,
                message_side: message_side
            });
            
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        }; 
        
        getBotMessage('Hi, My name is Susan :)');
        setTimeout(function () {
            getBotMessage('I\'m your assistant');
        }, 1000);
        setTimeout(function () {
            getBotMessage('What can I do for you');
        }, 2000);
        
        $('.send_message').click(function (e) {
            socket.emit('chat message', getMessageText());
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                socket.emit('chat message', getMessageText());
                return sendMessage(getMessageText());
            }
        });
        
        socket.on('bot reply', function(replyText) {
            if(replyText == '') {
                replyText = '(No answer...)';
            } else {
                console.log("Bot Reply", replyText);
                console.log("Account No", replyText["responseAPI"].result.parameters.accountno);
                console.log("Password", replyText["responseAPI"].result.parameters.pwd);
                getBotMessage(replyText["text"]);
            }
        });
    });
}.call(this));


        
            
    