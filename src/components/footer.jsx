import React from 'react'
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';

function Footer () {
    return (
        <div style={styles.root}>
            <h1 style={styles.copyright}>Copyright 2020 @ Tiara Hanindita</h1>
            <ul>
                <li style={styles.li}><FacebookIcon/></li>
                <li style={styles.li}><GitHubIcon/></li>
            </ul>
        </div>
    )
}
const styles = {
    root: {
        height: "70px",
        width: '100%',
        backgroundColor: '#130f40',
        padding: '2% 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItem: 'center'
    },
    copyright: {
        fontSize: 16,
        color: 'white',
        fontWeight: 400
    },
    ul: {
        textDecoration: 'none'
    },
    li: {
        display: 'inline-block',
        color: 'white',
        cursor: 'pointer',
        marginLeft: 20
    }
}
export default Footer