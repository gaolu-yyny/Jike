// import {
//   message,
//   Card,
//   Breadcrumb,
//   Form,
//   Button,
//   Radio,
//   Input,
//   Upload,
//   Space,
//   Select
// } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
// import { Link, useSearchParams } from 'react-router-dom'
// import './index.scss'
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
// import { useState,useEffect } from 'react'
// import { createArticleAPI, getArticleById, updateArticleAPI } from '@/api/article'
// import { useChannels } from '../Home/component/hooks/useChannels'
// import axios from 'axios'

// const { Option } = Select

// const Publish = () => {
//   const{channels} =useChannels()

//   const onFinish=async(formValue)=>{
//     if (imageType !== imageList.length) return message.warning('图片类型和数量不一致')
//     const { channel_id, content, title } = formValue
//     const params = {
//       channel_id,
//       content,
//       title,
//       type: imageType,
//       cover: {
//         type: imageType,
//         images: imageList.map(item=>{
//           if(item.response){
//             return item.response.data.url
//           }
//           else{
//             return item.url
//           }
//         })
//       }
//     }
//     if(articleId){
//         await updateArticleAPI({...params,id:articleId})
//     }
//     else{
//       await createArticleAPI(params)
//     }
      
//   }
//   const[imageList,setImageList]=useState([])
//   const onUploadChange=(info)=>{
//     // console.log(info);
//     setImageList(info.fileList)
//   }
//   const [imageType, setImageType] = useState(1)
//   const onTypeChange = (e) => {
//     // console.log(e)
//     setImageType(e.target.value)
//   }
  
//   const[searchParams]=useSearchParams();
//   const articleId=searchParams.get('id')
//   const[form]=Form.useForm()
//   useEffect(() => {
//     async function getArticle () {
//       const res = await getArticleById(articleId)
//       const { cover, ...formValue } = res.data
//       // 设置表单数据
//       form.setFieldsValue({ ...formValue, type: cover.type })
//     // 2. 回填封面图片
//       setImageType(cover.type) // 封面类型
//       setImageList(cover.images.map(url=>{return {url}})) // 封面list
//     }
//     if (articleId) {
//       // 拉取数据回显
//       getArticle()
//     }
//   }, [articleId, form])


//   return (
//     <div className="publish">
//       <Card
//         title={
//           <Breadcrumb items={[
//             { title: <Link to={'/'}>首页</Link> },
//             { title: `${articleId?"修改文章":"发布文章"}` },
//           ]}
//           />
//         }
//       >
//         <Form
//           labelCol={{ span: 4 }}
//           wrapperCol={{ span: 16 }}
//           initialValues={{ type: 1 }}
//           onFinish={onFinish}
//           form={form}
//         >
//           <Form.Item
//             label="标题"
//             name="title"
//             rules={[{ required: true, message: '请输入文章标题' }]}
//           >
//             <Input placeholder="请输入文章标题" style={{ width: 400 }} />
//           </Form.Item>
//           <Form.Item
//             label="频道"
//             name="channel_id"
//             rules={[{ required: true, message: '请选择文章频道' }]}
//           >
//             <Select placeholder="请选择文章频道" style={{ width: 400 }}>
//               {channels.map(item=><Option key={item.id} value={item.id}>{item.name}</Option>)}
              
//             </Select>
//           </Form.Item>
          
//           <Form.Item label="封面">
//             <Form.Item name="type">
//               <Radio.Group onChange={onTypeChange}>

//                 <Radio value={1}>单图</Radio>
//                 <Radio value={3}>三图</Radio>
//                 <Radio value={0}>无图</Radio>
                
//               </Radio.Group>
//             </Form.Item>
//             {imageType>0 &&
//                   <Upload
//                   name='image'
//                   listType="picture-card"
//                   maxCount={imageType}
//                   showUploadList
//                   action={'http://geek.itheima.net/v1_0/upload'}
//                   onChange={onUploadChange}
//                   fileList={imageList}
//                 >
//                   <div style={{ marginTop: 8 }}>
//                     <PlusOutlined />
//                   </div>
//                 </Upload>
//               }
          
//           </Form.Item>


//           <Form.Item
//             label="内容"
//             name="content"
//             rules={[{ required: true, message: '请输入文章内容' }]}
//           >
//              <ReactQuill
//               className="publish-quill"
//               theme="snow"
//               placeholder="请输入文章内容"
//             />

//           </Form.Item>

//           <Form.Item wrapperCol={{ offset: 4 }}>
//             <Space>
//               <Button size="large" type="primary" htmlType="submit" >
//                 发布文章
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   )
// }

// export default Publish

import {
  message,
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  Modal
} from 'antd';
import { PlusOutlined, RocketOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import './index.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { createArticleAPI, getArticleById, updateArticleAPI } from '@/api/article';
import { useChannels } from '../Home/component/hooks/useChannels';
import axios from 'axios';
// import OpenAI from "openai";

const { Option } = Select;

const Publish = () => {
  const { channels } = useChannels();

  const onFinish = async (formValue) => {
    if (imageType !== imageList.length) return message.warning('图片类型和数量不一致');
    const { channel_id, content, title } = formValue;
    const params = {
      channel_id,
      content,
      title,
      type: imageType,
      cover: {
        type: imageType,
        images: imageList.map(item => {
          if (item.response) {
            return item.response.data.url;
          } else {
            return item.url;
          }
        })
      }
    };
    if (articleId) {
      await updateArticleAPI({ ...params, id: articleId });
    } else {
      await createArticleAPI(params);
    }
  };

  const [imageList, setImageList] = useState([]);
  const onUploadChange = (info) => {
    setImageList(info.fileList);
  };
  const [imageType, setImageType] = useState(1);
  const onTypeChange = (e) => {
    setImageType(e.target.value);
  };

  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('id');
  const [form] = Form.useForm();

  const [aiPrompt, setAiPrompt] = useState(''); // 输入框的状态
  const [aiModalVisible, setAiModalVisible] = useState(false); // 控制输入框显示的状态

  useEffect(() => {
    async function getArticle() {
      const res = await getArticleById(articleId);
      const { cover, ...formValue } = res.data;
      form.setFieldsValue({ ...formValue, type: cover.type });
      setImageType(cover.type);
      setImageList(cover.images.map(url => { return { url }; }));
    }
    if (articleId) {
      getArticle();
    }
  }, [articleId, form]);

  // 调用 AI 写作功能
  const handleAIWrite = async () => {
    if (!aiPrompt) return message.warning('请输入写作提示');
    try {
      // 向后端发送请求，获取生成的内容
      const response = await axios.post('http://localhost:4000/generate-content', {
        prompt: aiPrompt, // 使用用户输入的提示
      });

      const aiText = response.data.content;

      // 将生成的文本插入到 ReactQuill 编辑器中
      const quill = form.getFieldInstance('content').editor;
      const currentLength = quill.getLength();
      quill.insertText(currentLength, aiText);

      setAiModalVisible(false);
      setAiPrompt('');
    } catch (error) {
      console.error('AI 写作请求失败:', error);
      message.error('生成内容失败');
    }
  };


  // 显示AI写作输入框的弹出框
  const showAIPromptModal = () => {
    setAiModalVisible(true);
  };
  
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: `${articleId ? "修改文章" : "发布文章"}` },
          ]} />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>

          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channels.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 &&
              <Upload
                name="image"
                listType="picture-card"
                maxCount={imageType}
                showUploadList
                action={'http://geek.itheima.net/v1_0/upload'}
                onChange={onUploadChange}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            }
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
              {/* 添加 AI 帮我写按钮 */}
              <Button size="large" onClick={showAIPromptModal} icon={<RocketOutlined />} type="default">
                AI帮我写
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* AI 输入框的弹出框 */}
      <Modal
        title="请输入写作提示"
        visible={aiModalVisible}
        onCancel={() => setAiModalVisible(false)}
        onOk={handleAIWrite}
      >
        <Input.TextArea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="请输入生成文章的提示词"
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default Publish;
