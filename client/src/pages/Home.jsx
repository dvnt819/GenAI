import React from 'react'
import styled from 'styled-components'
import SearchBar from '../components/SearchBar'
import ImageCard from '../components/ImageCard'
import { useState, useEffect } from 'react'
import { GetPosts } from '../api'

const Container = styled.div`
    height:100%;
    overflow-y:scroll;
    background: ${({theme})=> theme.bg};
    padding: 30px 30px;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:20px;
    @media (max-width: 768){
    padding: 6px 10px;
    }
`
const Headline = styled.div`
    font-size:34px;
    font-weight:500;
    color: ${({theme})=> theme.text_primary};
    display:flex;
    align-items:center;
    flex-direction:column;

    @media (max-width: 600px){
        font-size:22px;
    }
`

const Span = styled.div`
    font-size: 30px;
    font-weight:800;
    color:${({theme})=>theme.secondary};
`

const Wrapper=styled.div`
    width:100%;
    max-width: 1400px;
    padding:32px 0px;
    display:flex;
    justify-content:center;
`

const CardWrapper=styled.div`
    display:grid;
    gap: 20px;

    @media(min-width: 1200px){
        grid-template-columns: repeat(4,1fr); 
    }
    @media(min-width: 640px) and (max-width:1199px){
        grid-template-columns: repeat(3,1fr); 
    }
    @media(max-width: 639px) {
        grid-template-columns: repeat(2,1fr); 
    }
`

const Home=()=>{
    const [posts,setPosts] = useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const [search,setSearch]= useState("");
    const [filteredPosts,setFilteredPosts]=useState([]);

    const getPosts = async()=>{
        setLoading(true)
        await GetPosts().then((res)=>{
            setLoading(false)
            setPosts(res?.data?.data);
            setFilteredPosts(res?.data?.data)
        })
        .catch((error)=>{
            setError(error?.response?.data?.message);
            setLoading(false);
        })
    }
    
    useEffect(()=>{
        getPosts();
    },[])

    useEffect(()=>{
        if(!search){
            setFilteredPosts(posts);
        }
        const SearchfilteredPosts= posts.filter((post)=>{
            const promptMatch=post?.prompt?.toLowerCase().includes(search);
            const authorMatch=post?.name?.toLowerCase().includes(search);

            return promptMatch || authorMatch;
        });

        if(search){
            setFilteredPosts(SearchfilteredPosts);
        }
    },[posts,search])

    return (
        <Container>
            <Headline>
                Explore popular posts in the Community!!!
                <Span>Generated with AI</Span>
            </Headline>
            <SearchBar search={search} setSearch={setSearch} />
            <Wrapper>
                <CardWrapper>
                    {filteredPosts.length === 0 ? <>No Posts Found</>:
                    <>
                        {filteredPosts.slice().reverse().map((ListItem,index)=>(
                            <ImageCard key={index} item={ListItem}/>
                        ))}
                    </>
                    }
                </CardWrapper>
            </Wrapper>
        </Container>
    )
}

export default Home