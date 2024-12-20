// 获取URL参数中的角色ID
const urlParams = new URLSearchParams(window.location.search);
const characterId = urlParams.get('id') || '1'; // 默认使用ID 1

// 获取DOM元素
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const characterName = document.getElementById('characterName');

// 定义全局character变量
let character = null;

// 获取角色数据
function initCharacter() {
    const id = parseInt(characterId);
    console.log('Looking for character with ID:', id);
    console.log('Available characters:', window.AI_CHARACTERS);
    character = window.AI_CHARACTERS.find(char => char.id === id);
    return character;
}

// 添加消息到聊天界面
async function addMessage(text, sender) {
    console.log('Adding message:', text, sender); // 调试日志
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    // 添加头像
    const avatar = document.createElement('img');
    avatar.classList.add('message-avatar');
    avatar.src = sender === 'ai' ? "images/2.jpg" : 'images/user-avatar.jpg';
    avatar.alt = sender === 'ai' ? character.name : 'User';

    // 添加消息内容
    const content = document.createElement('div');
    content.classList.add('message-content');
    content.textContent = text;
    
    if (sender === 'user') {
        messageDiv.appendChild(content);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 与后端通信获取AI回复
async function getAIResponse(message) {
    console.log('Sending message to backend:', message); // 调试日志
    try {
        const response = await fetch('https://你的后端服务器地址/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                characterId: '1',
                context: getRecentMessages()
            })
        });

        console.log('Backend response status:', response.status); // 调试日志

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Backend response data:', data); // 调试日志
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return "抱歉，我现在有点困惑...";
    }
}

// 获取最近的对话记录用于上下文
function getRecentMessages() {
    const messages = [];
    const messageElements = chatMessages.querySelectorAll('.message');
    messageElements.forEach(element => {
        const content = element.querySelector('.message-content').textContent;
        const isAI = element.classList.contains('ai-message');
        messages.push({
            content,
            sender: isAI ? 'ai' : 'user'
        });
    });
    return messages.slice(-5); // 返回最近5条消息
}

// 发送消息
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        console.log('User sending message:', message); // 调试日志
        // 显示用户消息
        await addMessage(message, 'user');
        chatInput.value = '';
        
        // 获取并显示AI回复
        const response = await getAIResponse(message);
        console.log('AI response:', response); // 调试日志
        await addMessage(response, 'ai');
    }
}

// 初始化页面
async function initializePage() {
    console.log('Initializing page...'); // 调试日志
    
    // 初始化角色数据
    if (initCharacter()) {
        console.log('Found character:', character);
        characterName.textContent = character.name;
        
        // 直接显示开场白，不等待后端响应
        const defaultGreeting = "你好啊！我是" + character.name + "，很高兴见到你！今天想聊些什么呢？";
        await addMessage(defaultGreeting, 'ai');
        
        // 然后尝试从后端获取更多回复
        try {
            const response = await getAIResponse('你好');
            if (response && response !== "抱歉，我现在有点困惑...") {
                await addMessage(response, 'ai');
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
        }
    } else {
        console.error('Character not found for ID:', characterId);
        characterName.textContent = 'AI虚拟恋人';
        await addMessage("抱歉，我现��有点困惑...", 'ai');
    }
}

// 页面加载完成后初始化
window.onload = function() {
    console.log('Page loaded, starting initialization...'); // 调试日志
    initializePage();
    
    // 添加发送按钮点击事件
    const sendButton = document.querySelector('.send-message');
    if (sendButton) {
        sendButton.onclick = sendMessage;
        console.log('Send button listener added'); // 调试日志
    }
    
    // 添加输入框回车事件
    if (chatInput) {
        chatInput.onkeypress = function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        };
        console.log('Chat input listener added'); // 调试日志
    }
};

// 确保sendMessage函数可以全局访问
window.sendMessage = sendMessage; 