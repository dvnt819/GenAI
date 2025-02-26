import React, { useState } from "react";
import { AutoAwesome } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "./button";
import TextInput from "./TextInput";
import { CreatePost, GenerateAIImage } from "../api/index.js";

const Form = styled.div`
    flex: 1;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 9%;
    justify-content: center;
`;

const Top = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Title = styled.div`
    font-size: 28px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.div`
    font-size: 17px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary};
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary};
`;

const Actions = styled.div`
    flex: 1;
    display: flex;
    gap: 8px;
`;

const GenerateImageForm = ({
    post,
    setPost,
    createPostLoading,
    generateImageLoading,
    setGenerateImageLoading,
    setCreatePostLoading
}) => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const generateImageFun = async () => {
        setGenerateImageLoading(true);
        try {
            const res = await GenerateAIImage({ prompt: post.prompt });
            setPost({ ...post, photo: `data:image/jpeg;base64,${res?.data?.photo}` });
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to generate image.");
        }
        setGenerateImageLoading(false);
    };

    const createPostFun = async () => {
        setCreatePostLoading(true);
        try {
            await CreatePost(post);
            navigate("/");
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to create post.");
        }
        setCreatePostLoading(false);
    };

    return (
        <Form>
            <Top>
                <Title>Generate Image with Prompt</Title>
                <Desc>Write your prompt according to the image you want to generate</Desc>
            </Top>
            <Body>
                <TextInput 
                    label="Author"
                    placeholder="Enter your name"
                    name="name"
                    value={post?.name || ""}
                    handleChange={(e) => setPost({ ...post, name: e.target.value })}
                />
                <TextInput 
                    label="Prompt" 
                    placeholder="Write a detailed prompt about the image" 
                    name="prompt" 
                    rows="8" 
                    textArea
                    value={post?.prompt || ""}
                    handleChange={(e) => setPost({ ...post, prompt: e.target.value })}
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </Body>
            <p>You can post AI Generated Image to the Community...</p>
            <Actions>
                <Button 
                    text="Generate Image" 
                    flex 
                    leftIcon={<AutoAwesome />}
                    isLoading={generateImageLoading}
                    isDisabled={!post?.prompt}
                    onClick={generateImageFun}
                />
                <Button 
                    text="Post Image" 
                    flex 
                    type="secondary" 
                    leftIcon={<AutoAwesome />}
                    isLoading={createPostLoading}
                    isDisabled={!post?.name || !post?.prompt || !post?.photo}
                    onClick={createPostFun}
                />
            </Actions>
        </Form>
    );
};

export default GenerateImageForm;
