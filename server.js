const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const OpenAI = require("openai");
const cors = require('cors');

const app = express();
const port = 4000;

// CORS 配置
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // 按需开启
};

// 应用 CORS 中间件
app.use(cors(corsOptions));

// 解析 JSON 请求体
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  next();
});

// 显式处理所有 OPTIONS 请求
app.options('*', cors(corsOptions));

// 显式处理 /generate-content 的 OPTIONS 请求（可选）
// app.options('/generate-content', cors(corsOptions), (req, res) => {
//   res.sendStatus(204);
// });

// OpenAI 配置
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.OPENAI_API_KEY,
});

// AI 生成内容接口
app.post('/generate-content', cors(corsOptions), async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      model: "deepseek-chat",
    });

    res.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('请求失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在运行，地址：http://localhost:${port}`);
});