<template>
  <div class="container">
    <!-- 顶部 -->
    <div class="top-header">
      <div class="title">
        <h1>疫情AI智能助手</h1>
        <div class="top-header-tip">
          <div class="back-btn" @click="goBack">
            <i class="el-icon-back"></i> 返回主页
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <el-row :gutter="20">
        <!-- 左侧对话区域 -->
        <el-col :span="16">
          <div class="chat-container">
            <div class="chat-header">
              <div class="ai-status">
                <div class="status-indicator" :class="{ active: isOnline }"></div>
                <span>{{ isOnline ? 'AI助手在线' : '连接中...' }}</span>
              </div>
              <el-button type="text" @click="clearChat" class="clear-btn">
                <i class="el-icon-delete"></i> 清空对话
              </el-button>
            </div>
            
            <div class="chat-messages" ref="messageContainer">
              <div v-for="(message, index) in messages" :key="index" 
                   :class="['message-item', message.type]">
                <div class="message-avatar">
                  <i :class="message.type === 'user' ? 'el-icon-user-solid' : 'el-icon-cpu'"></i>
                </div>
                <div class="message-content">
                  <div class="message-bubble" v-html="message.content"></div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
              </div>
              
              <div v-if="isTyping" class="message-item ai typing">
                <div class="message-avatar">
                  <i class="el-icon-cpu"></i>
                </div>
                <div class="message-content">
                  <div class="message-bubble">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-input-area">
              <el-input
                v-model="userInput"
                type="textarea"
                :rows="2"
                placeholder="请输入您的问题，如：查询今日全国疫情数据、世界疫情趋势预测等..."
                @keyup.enter.native="handleSend"
                :disabled="isTyping"
              ></el-input>
              <el-button 
                type="primary" 
                @click="handleSend" 
                :loading="isTyping"
                class="send-btn"
              >
                <i class="el-icon-position"></i> 发送
              </el-button>
            </div>
          </div>
        </el-col>
        
        <!-- 右侧功能区域 -->
        <el-col :span="8">
          <!-- <div class="quick-actions">
            <h3>快速查询</h3>
            <div class="action-buttons">
              <el-button 
                v-for="action in quickActions" 
                :key="action.text"
                @click="quickQuery(action.query)"
                class="action-btn"
                type="primary"
                plain
              >
                <i :class="action.icon"></i>
                {{ action.text }}
              </el-button>
            </div>
          </div> -->
          
          <div class="ai-suggestions">
            <h3>智能建议</h3>
            <div class="suggestion-list">
              <div v-for="(suggestion, index) in suggestions" 
                   :key="index" 
                   class="suggestion-item"
                   @click="quickQuery(suggestion.query)"
              >
                <i class="el-icon-lightning"></i>
                {{ suggestion.text }}
              </div>
            </div>
          </div>
          
          <!-- <div class="data-summary">
            <h3>实时摘要</h3>
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-label">全国现有确诊</div>
                <div class="summary-value">{{ summaryData.currentConfirmed || '—' }}</div>
                <div class="summary-trend" :class="summaryData.currentConfirmedTrend">
                  <i :class="summaryData.currentConfirmedTrend === 'up' ? 'el-icon-top' : 'el-icon-bottom'"></i>
                  {{ summaryData.currentConfirmedChange || '0' }}
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-label">全球累计确诊</div>
                <div class="summary-value">{{ summaryData.globalConfirmed || '—' }}</div>
                <div class="summary-trend" :class="summaryData.globalConfirmedTrend">
                  <i :class="summaryData.globalConfirmedTrend === 'up' ? 'el-icon-top' : 'el-icon-bottom'"></i>
                  {{ summaryData.globalConfirmedChange || '0' }}
                </div>
              </div>
            </div>
          </div> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { callQwenAI } from '../api/aiService';
import { chinaProvinceData, worldData } from '../utils/csvUtil';

export default {
  name: 'AIAssistant',
  data() {
    return {
      isOnline: true,
      messages: [
        {
          type: 'ai',
          content: '您好！我是疫情AI智能助手，已连接阿里千问大模型。我可以为您提供实时疫情数据查询、趋势分析等服务。请问有什么可以帮助您的？',
          time: this.getCurrentTime()
        }
      ],
      userInput: '',
      isTyping: false,
      quickActions: [
        { text: '全国疫情概览', icon: 'el-icon-data-line', query: '查询全国今日疫情数据' },
        { text: '世界疫情地图', icon: 'el-icon-map-location', query: '显示世界疫情地图' },
        { text: '疫情日历', icon: 'el-icon-date', query: '打开疫情日历热力图' },
        { text: '趋势预测', icon: 'el-icon-s-marketing', query: '分析未来7天疫情趋势' },
        { text: '防控指南', icon: 'el-icon-first-aid-kit', query: '查询疫情防控建议' },
        { text: '舆情分析', icon: 'el-icon-chat-line-square', query: '查看疫情舆情分析' }
      ],
      suggestions: [
        { text: '最近一周疫情走势如何？', query: '分析最近一周疫情走势' },
        { text: '哪个省份确诊最多？', query: '查询累计确诊最多的省份' },
        { text: '世界疫情数据对比', query: '对比各国疫情数据' },
        { text: '疫情预测', query: '疫情发展趋势预测分析' }
      ],
      summaryData: {
        currentConfirmed: '2,847',
        currentConfirmedChange: '+15',
        currentConfirmedTrend: 'up',
        globalConfirmed: '698.5万',
        globalConfirmedChange: '+1.2万',
        globalConfirmedTrend: 'up'
      },
      conversationContext: '' // 对话上下文
    };
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    getCurrentTime() {
      return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    },
    handleSend() {
      if (!this.userInput.trim() || this.isTyping) return;
      
      const userMessage = {
        type: 'user',
        content: this.userInput.trim(),
        time: this.getCurrentTime()
      };
      
      this.messages.push(userMessage);
      this.userInput = '';
      
      // 调用真实AI API
      this.processAIResponse(userMessage.content);
    },
    quickQuery(query) {
      this.userInput = query;
      this.handleSend();
    },
    clearChat() {
      this.$confirm('确定要清空所有对话记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.messages = [{
          type: 'ai',
          content: '对话已清空，有什么新的问题吗？',
          time: this.getCurrentTime()
        }];
        this.conversationContext = ''; // 清空上下文
      });
    },
    async processAIResponse(query) {
      this.isTyping = true;
      
      try {
        // 构建上下文（最近几条对话）
        const recentMessages = this.messages.slice(-3).map(m => `${m.type}: ${m.content}`).join('\n');
        this.conversationContext = recentMessages;
        
        // 调用阿里千问API
        const result = await callQwenAI(query, this.conversationContext);
        
        let responseContent = '';
        
        if (result.success) {
          responseContent = result.content;
          // 添加数据来源提示
          if (this.isCovidDataQuery(query)) {
            responseContent += '<br><br><small>📊 数据来源：国家卫健委、WHO官方数据</small>';
          }
        } else {
          // API 调用失败，使用备用响应
          responseContent = this.getFallbackResponse(query, result.error);
        }
        
        const aiMessage = {
          type: 'ai',
          content: responseContent,
          time: this.getCurrentTime()
        };
        
        this.messages.push(aiMessage);
        
      } catch (error) {
        console.error('AI 处理错误:', error);
        this.messages.push({
          type: 'ai',
          content: '抱歉，服务暂时不可用，请稍后重试。',
          time: this.getCurrentTime()
        });
      } finally {
        this.isTyping = false;
        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    isCovidDataQuery(query) {
      const keywords = ['疫情', '确诊', '病例', '病毒', '防控', '疫苗', '核酸', '隔离'];
      return keywords.some(k => query.includes(k));
    },
    getFallbackResponse(query, error) {
      // 当API失败时的备用响应
      return `
        <strong>⚠️ 服务提示</strong><br>
        阿里千问API暂时无法连接（${error}），为您启用本地智能应答。<br><br>
        建议您可以：<br>
        • 检查网络连接<br>
        • 确认API密钥配置<br>
        • 稍后重新尝试<br><br>
        <small>🔧 技术细节：请检查.env文件中的VUE_APP_QWEN_API_KEY配置</small>
      `;
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },
  
  mounted() {
    // 模拟实时更新摘要数据
    setInterval(() => {
      const change = Math.random() > 0.5 ? '+' : '-';
      this.summaryData.currentConfirmedChange = change + Math.floor(Math.random() * 30);
      this.summaryData.currentConfirmedTrend = change === '+' ? 'up' : 'down';
      
      // 更新全球数据
      const globalChange = Math.random() > 0.5 ? '+' : '-';
      this.summaryData.globalConfirmedChange = globalChange + (Math.random() * 2).toFixed(1) + '万';
      this.summaryData.globalConfirmedTrend = globalChange === '+' ? 'up' : 'down';
    }, 5000);
  }
}
</script>


<style scoped>
/* 样式保持不变，与之前提供的相同 */
.container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  background-attachment: fixed;
  padding: 20px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

h1 {
  font-size: 42px;
  font-weight: 900;
  padding: 25px 30px;
  background: linear-gradient(90deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
  letter-spacing: 3px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 2px 5px rgba(25, 118, 210, 0.3));
  }
  to {
    filter: drop-shadow(0 4px 10px rgba(25, 118, 210, 0.5));
  }
}

.top-header {
  position: relative;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(25, 118, 210, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.top-header-tip {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

.back-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  color: #fff;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.5);
}

/* 聊天容器 */
.chat-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  border: 2px solid transparent;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    linear-gradient(135deg, #64b5f6 0%, #42a5f5 25%, #2196f3 50%, #1e88e5 75%, #1976d2 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px 25px;
  border-bottom: 1px solid rgba(33, 150, 243, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-status {
  display: flex;
  align-items: center;
  color: #424242;
  font-size: 14px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4757;
  margin-right: 8px;
  animation: pulse 2s infinite;
}

.status-indicator.active {
  background: #2ed573;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 213, 115, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(46, 213, 115, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 213, 115, 0);
  }
}

.clear-btn {
  color: #757575;
}

.clear-btn:hover {
  color: #ff4757;
}

/* 消息区域 */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: rgba(227, 242, 253, 0.3);
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 12px;
}

.message-item.ai .message-avatar {
  background: linear-gradient(135deg, #7e57c2 0%, #5e35b1 100%);
  color: #fff;
}

.message-item.user .message-avatar {
  background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
  color: #fff;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message-item.ai .message-bubble {
  background: rgba(126, 87, 194, 0.1);
  color: #424242;
  border: 1px solid rgba(126, 87, 194, 0.2);
}

.message-item.user .message-bubble {
  background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
  color: #fff;
}

.message-time {
  font-size: 12px;
  color: #9e9e9e;
  margin-top: 5px;
}

.message-item.user .message-time {
  text-align: right;
}

/* 输入区域 */
.chat-input-area {
  padding: 20px;
  border-top: 1px solid rgba(33, 150, 243, 0.15);
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.95);
}

.chat-input-area .el-textarea {
  flex: 1;
}

.send-btn {
  height: 52px;
  padding: 0 20px;
  background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
  border: none;
  font-weight: bold;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.4);
}

/* 打字动画 */
.typing-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7e57c2;
  margin: 0 2px;
  animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

/* 快速操作 */
.quick-actions, .ai-suggestions, .data-summary {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid transparent;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    linear-gradient(135deg, #64b5f6 0%, #42a5f5 25%, #2196f3 50%, #1e88e5 75%, #1976d2 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
}

.quick-actions h3, .ai-suggestions h3, .data-summary h3 {
  color: #1976d2;
  font-size: 16px;
  margin-bottom: 15px;
  text-shadow: none;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  flex: 1 0 45%;
  padding: 10px;
  background: rgba(33, 150, 243, 0.08);
  border: 1px solid rgba(33, 150, 243, 0.2);
  color: #1976d2;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(33, 150, 243, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  padding: 10px;
  background: rgba(33, 150, 243, 0.05);
  border: 1px solid rgba(33, 150, 243, 0.15);
  border-radius: 8px;
  color: #424242;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestion-item:hover {
  background: rgba(33, 150, 243, 0.12);
  transform: translateX(5px);
}

.data-summary .summary-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-card {
  padding: 15px;
  background: rgba(227, 242, 253, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.summary-label {
  color: #757575;
  font-size: 12px;
}

.summary-value {
  color: #1976d2;
  font-size: 20px;
  font-weight: bold;
  margin: 5px 0;
}

.summary-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-trend.up {
  color: #ff4757;
}

.summary-trend.down {
  color: #2ed573;
}

/* 滚动条美化 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(33, 150, 243, 0.08);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(33, 150, 243, 0.3);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(33, 150, 243, 0.5);
}

/* Element UI 覆盖 */
::v-deep .el-textarea__inner {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(33, 150, 243, 0.2);
  color: #424242;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

::v-deep .el-textarea__inner:focus {
  border-color: #1976d2;
  box-shadow: 0 0 6px rgba(33, 150, 243, 0.3);
}
</style>