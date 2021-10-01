import React, { useContext, useState } from 'react';
import './comment.css'
import { AuthContext } from '../auth-context';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ErrorModal from '../materialUI/errormodal';


const NewComment = () => {
    const auth = useContext(AuthContext);
    const { itemid } = useParams();

    const [iserror, setiserror] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [content, setcontent] = useState("");

    const contenthandler = (event) => {
        setcontent(event.target.value);
    }
    const errorHandler = () => {
        setiserror(false);
    }

    const submitComment = (event) => {
        event.preventDefault();
        let newDate = new Date()
        axios({
            method: "post",
            url: `http://localhost:5000/comments/create`,
            data: JSON.stringify({
                content: content,
                creator: auth.userId,
                relateditem: itemid,
                createdat: newDate
            }),
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
        })
            .then((response) => {
                window.location.reload()
                auth.newmessage("comment sent successfully!")
            })
            .catch((response) => {
                setErrorMessage(response.response.data.message);
                setiserror(true);
            });
    }

    return (
        <form>
            {iserror && <ErrorModal text={ErrorMessage} errorfunction={errorHandler} />}
            {auth.token && (
                <div class="media">
                    <h3 class="pull-left">New Comment</h3>
                    <br />
                    <fieldset>
                        <div class="row">
                            <div class="col-sm-3 col-lg-2 hidden-xs">
                                <img class="media-object" src={auth.photo} alt="" />
                            </div>
                            <div class="form-group col-xs-12 col-sm-9 col-lg-10">
                                <textarea onChange={(event) => contenthandler(event)} class="form-control" id="message" placeholder="Your Comment" required=""></textarea>
                            </div>
                        </div>
                    </fieldset>
                    <div class="pull-right">
                        <Button onClick={(event) => submitComment(event)} variant="contained" component="label" color="primary" style={{ width: "100px", margin: "20px 0px", textAlign: "center" }} > submit </Button>
                    </div>
                </div>)
            }
        </form>
    )
}


export default NewComment;