import React, { useContext, useState } from 'react';
import './comment.css'
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../auth-context';
import ErrorModal from '../materialUI/errormodal';


const SingleComment = (props) => {
    const auth = useContext(AuthContext);

    const [iserror, setiserror] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");

    const errorHandler = () => {
        setiserror(false);
    }

    const commentDelete = (event) => {
        event.preventDefault();
        let commentid = props.information._id;
        console.log(commentid)
        axios({
            method: "delete",
            url: `http://localhost:5000/comments/${commentid}`,
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
        })
            .then((response) => {
                window.location.reload()
                auth.newmessage("comment deleted successfully!")
            })
            .catch((response) => {
                setErrorMessage(response.response.data.message);
                setiserror(true);
            });
    }
    var a = new Date(Date.parse(props.information.createdat))
    let year = a.getFullYear()
    let month = a.getMonth()
    let day = a.getDay()

    return (
        <div class="media">
            {iserror && <ErrorModal text={ErrorMessage} errorfunction={errorHandler} />}
            <a class="pull-left" href="#"><img class="media-object" src={props.information.creator.image} /></a>
            <div class="media-body">
                <h4 class="media-heading">{props.information.creator.name}</h4>
                <p>{props.information.content}</p>
                <ul class="list-unstyled list-inline media-detail pull-left">
                    <li><i class="fa fa-calendar"></i>{day + "/" + month + "/" + year}</li>
                </ul>
                {auth.userId === props.information.creator._id && ( 
                    <ul class="list-unstyled list-inline media-detail pull-right">
                        <li>
                            <Button onClick={(event) => commentDelete(event)} size="small" color="secondary">
                                Delete comment
                            </Button>
                        </li>
                    </ul>)
                }
            </div>
        </div >
    )
}

export default SingleComment;