// 主题切换
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// AI角色数据
const AI_CHARACTERS = [
    {
        id: 1,
        name: "小雨 / Xiaoyu",
        avatar: "images/2.jpg",  // 更新为相对路径
        personality: "INTJ",
        tags: [
            "温婉知性 / Gentle & Intellectual", 
            "清雅脱俗 / Elegant", 
            "文学少女 / Literary Girl",
            "恬静优雅 / Graceful"
        ],
        description: "温柔似水的文学少女，知性优雅的气质让人心动 / A gentle literary girl with elegant charm"
    }
];

// 确保全局可访问
window.AI_CHARACTERS = AI_CHARACTERS;

// 渲染AI角色列表
function renderCharacters() {
    const mainContainer = document.querySelector('main');
    mainContainer.innerHTML = `
        <h1 class="main-title">AI虚拟恋人</h1>
        <p class="subtitle">宇宙无垠的数字，指引着我们的相遇</p>
        <div class="character-list">
            ${AI_CHARACTERS.map(char => `
                <div class="character-card">
                    <img src="${char.avatar}" alt="${char.name}" class="character-avatar">
                    <h2 class="character-name">${char.name}</h2>
                    <div class="personality-tags">
                        <span class="tag personality">${char.personality}</span>
                        ${char.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <p class="character-desc">${char.description}</p>
                    <button class="chat-button" data-id="${char.id}">开始聊天</button>
                </div>
            `).join('')}
        </div>
    `;

    // 添加点击事件
    document.querySelectorAll('.chat-button').forEach(button => {
        button.addEventListener('click', () => {
            const charId = button.dataset.id;
            window.location.href = `character.html?id=${charId}`;
        });
    });
}

// 添加浮动粒子效果
function createParticles() {
    const container = document.createElement('div');
    container.className = 'floating-particles';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机大小
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // 随机位置
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // 随机动画延迟
        particle.style.animationDelay = `${Math.random() * 20}s`;
        
        container.appendChild(particle);
    }
}

// 在页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    renderCharacters();
    createParticles();
});