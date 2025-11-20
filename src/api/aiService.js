// src/api/aiService.js - OpenAI兼容模式
import axios from 'axios';

// 使用OpenAI兼容端点（与Python相同）
const API_URL = '/api/compatible-mode/v1/chat/completions';
const API_KEY = process.env.VUE_APP_QWEN_API_KEY;

// 立即检查配置
console.log('🔧 AI服务初始化检查:');
console.log('✓ API端点:', API_URL);
console.log('✓ API Key已配置:', !!API_KEY);

export async function callQwenAI(query, context = '') {
  if (!API_KEY) {
    return {
      success: false,
      error: 'API Key未配置',
      content: `
        <h3>⚠️ 配置错误</h3>
        <p>请在项目根目录创建 <code>.env</code> 文件，内容为：</p>
        <pre>VUE_APP_QWEN_API_KEY=sk-xxxxxxxxxxxx</pre>
        <p>然后重启服务：<code>npm run serve</code></p>
      `
    };
  }

  try {
    console.log('📡 [发送请求]', {
      url: API_URL,
      queryPreview: query.substring(0, 30) + '...'
    });

    const response = await axios.post(API_URL, {
      model: "qwen-turbo",
      messages: [
        {
          role: "system",
          content: `你是一个专业的疫情数据分析助手。请基于疫情数据回答用户问题，回答要简洁、准确、专业。当前对话上下文：${context}`
        },
        { role: "user", content: query }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'X-DashScope-SSE': 'disable'
      },
      timeout: 30000
    });

    console.log('✅ [请求成功]', response.status, response.data);

    return {
      success: true,
      content: response.data.choices[0].message.content,
      usage: response.data.usage || null
    };

  } catch (error) {
    console.error('❌ [请求失败]', error);

    // 精确错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      let errorMsg = `HTTP ${status}`;
      switch(status) {
        case 401:
          errorMsg = 'API Key无效或已过期，请检查配置';
          break;
        case 403:
          errorMsg = '无权访问此服务';
          break;
        case 404:
          errorMsg = '❌ 请求路径错误 - mock.js可能还在拦截请求';
          break;
        case 429:
          errorMsg = 'API请求频率超限，请稍后再试';
          break;
        default:
          errorMsg = data?.message || error.message;
      }
      
      return {
        success: false,
        error: errorMsg,
        content: `<h3>请求失败 (${status})</h3><p>${errorMsg}</p>`
      };
    } else if (error.request) {
      return {
        success: false,
        error: '网络错误',
        content: '<h3>网络错误</h3><p>无法连接到服务器（代理或网络问题）</p>'
      };
    }
    
    return {
      success: false,
      error: error.message,
      content: `错误: ${error.message}`
    };
  }
}