import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select,Popconfirm } from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useChannels } from '../Home/component/hooks/useChannels'
import { useEffect, useState,useMemo,useCallback } from 'react'
import {getArticleListAPI,delArticleAPI} from '../../api/article'
import { debounce } from 'lodash' 

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const{channels} =useChannels()
  const status={
    1:<Tag color='warning'>待审核</Tag>,
    2:<Tag color='success'>审核通过</Tag>
  }
  const [article,setArticle]=useState({
    list:[],
    count:0
  })

  const[reqData,setReqData]=useState({
    page: 1,
    per_page: 4,
    begin_pubdate: '',
    end_pubdate: '',
    status: '',
    channel_id: ''
  })

    // 使用 useCallback 缓存 getList 函数
    const getList = useCallback(async (reqData) => {
      const re = await getArticleListAPI(reqData);
      const { results, total_count } = re.data;
      setArticle({
        list: results,
        count: total_count
      });
    }, [setArticle]); // setArticle 作为依赖项，因为它是 setState 函数

    // 防抖函数：确保筛选条件改变后，延迟请求
    const debouncedGetList = useMemo(
      () => debounce((newReqData) => {
        console.log('Request sent at:', new Date().toLocaleTimeString());
        getList(newReqData);
      }, 500),
      [getList] // 依赖 getList
    )

    useEffect(() => {
      debouncedGetList(reqData);
      return () => debouncedGetList.cancel();
    }, [reqData, debouncedGetList]);
  

  //根据时间进行筛选
  const onFinish = formValue=> {
    // 1. 准备参数
    const newReqData = {
      ...reqData,
      channel_id: formValue.channel_id,
      status: formValue.status,
      begin_pubdate: formValue.date[0].format('YYYY-MM-DD'),
      end_pubdate: formValue.date[1].format('YYYY-MM-DD')
    }
    // 使用防抖函数
    setReqData(newReqData)
    debouncedGetList(newReqData)  // 调用防抖函数
    
  }

  const pageChange=(page)=>{
    const newReqData = { ...reqData, page }
    setReqData(newReqData)
    debouncedGetList(newReqData)  // 调用防抖函数
  }

  const onConfirm=async(data)=>{
    // console.log(data.id);
    await delArticleAPI(data.id)
    setReqData({
      ...reqData
    })
  }

  const navagite=useNavigate()

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => status[data]
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined /> } 
            onClick={() => navagite(`/publish?id=${data.id}`)}
            />

            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={()=>{onConfirm(data)}}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>

          </Space>
        )
      }
    }
  ]
  
  

  return (
    <div>
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '文章列表' },
          ]} />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: '' }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
               {channels.map(item=><Option key={item.id} value={item.id}>{item.name}</Option>)}
              
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={article.list}  pagination={{
          current: reqData.page,
          pageSize: reqData.per_page,
          onChange: pageChange,
          total: article.count
        }} />
      </Card>

    </div>
  )
}

export default Article