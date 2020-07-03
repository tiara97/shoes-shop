import React from 'react'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

class NotFound extends React.Component {
    render() {
        return (
        <div style={styles.root}>
            <h1 style={styles.title}>404</h1>
            <h1>Oops, page not found.</h1>
            <Link to='/'>
                <Button variant='outlined'>Back to home</Button>
            </Link>
        </div>
        )
    }
}
const styles = {
    root: {
        height: 'calc(100vh-70px)',
        width: '100%',
        padding: '90px 10% 3% 10%',
        backgroundColor: '#f2f2f2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: '100px',
        marginBottom: '3%'
    }
}
export default NotFound