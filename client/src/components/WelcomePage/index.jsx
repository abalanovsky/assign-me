import React, {useState} from 'react';
import './WelcomePage.css'
import {Button, Form, Input, message, Modal, Steps} from "antd";
import {signIn, signUp} from "../../api/api";
import {setCurrUser} from "../../redux/redux";
import {useDispatch} from "react-redux";
import {LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";

const initialSignupState = {
    name: '',
    surname: '',
    username: '',
    password: ''
}
function WelcomePage() {
    const dispatch = useDispatch()
    const [signUpValues,setSignUpValues] = useState(initialSignupState)
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const operationMessage = async (type, content) => {
        await messageApi.open({
            type,
            content,
            duration: 4,
            style: {
                marginTop: '10vh',
            },
        });
    };

    const onSignInFinish = async (values) => {
        await signIn(values).then((response) => dispatch(setCurrUser(response.data)))
            .catch(e => operationMessage('error', e.response.data))
    };
    const [form] = Form.useForm();
    const showSignUpModal = () => {
        setIsSignUpModalOpen(true);
    };
    const handleSignUpOk = async () => {
        await signUp(signUpValues).then(() => {
            operationMessage('success', 'You are successfully signed up! Now you can Sign In')
            setIsSignUpModalOpen(false);
            form.resetFields();
            setSignUpValues(initialSignupState);
        }).catch(e => operationMessage('error', e.response.data))
    };
    const handleCancelSignUp = () => {
        form.resetFields();
        setIsSignUpModalOpen(false);
        form.resetFields();
        setSignUpValues(initialSignupState);
    };

    return (
        <div className="welcome-page-container">
            <div className="welcome-text-container">
                <h1>Welcome to AssignMe</h1>
                <h4>A quick guide to using the app</h4>
                <Steps
                    style={{padding: 15}}
                    items={[
                        {
                            title: 'Login',
                            status: 'finish',
                            icon: <UserOutlined />,
                            description: 'Log in or sign up'
                        },
                        {
                            title: 'Meet the tasks',
                            status: 'finish',
                            icon: <SolutionOutlined />,
                            description: 'See all and assigned to you tasks'
                        },
                        {
                            title: 'Make some actions',
                            status: 'finish',
                            icon: <LoadingOutlined />,
                            description: 'Complete assigned to you tasks, or create your own'
                        },
                        {
                            title: 'Done',
                            status: 'process',
                            icon: <SmileOutlined />,
                            description: 'Congrats! That`s it!'
                        },
                    ]}
                />
            </div>
            <div className="auth-container">
                {contextHolder}
                <h2>Sign in or <span className="sign-up-button" onClick={showSignUpModal}>Sign up</span></h2>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onSignInFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Password"/>
                    </Form.Item>
                    <div className="sign-up-button-container">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
                <Modal title="SIGN UP"
                       open={isSignUpModalOpen}
                       onOk={handleSignUpOk}
                       onCancel={handleCancelSignUp}
                       footer={null}
                >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        form={form}
                        onFinish={handleSignUpOk}
                        onValuesChange={(newValue) => setSignUpValues({ ...signUpValues, ...newValue })}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Last name"
                            name="surname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your last name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <div className="sign-up-button-container">
                            <Button type="primary" size="large" htmlType="submit">
                                SIGN UP
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default WelcomePage;
