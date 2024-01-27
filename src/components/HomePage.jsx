
import React from 'react';
import { styled } from '@mui/material';
import homepageimg from '../assets/homepageimg.png';

// const Header = styled(Box)`
//     margin: 50px;
//     & > div {
//         margin-top: 50px;
//     }
    
// `;

const Image = styled('img')({
    width: '80%',
    height: '850px',
});

const HomePage = () => {

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundImage: "url(bggif.gif)",
            backgroundColor:'rgb(4, 2, 21)',
            backgroundSize: "cover",
        }}>
            <Image src={homepageimg} style={{height:'750px'}}/>
        </div>
        
    )
}

export default HomePage;