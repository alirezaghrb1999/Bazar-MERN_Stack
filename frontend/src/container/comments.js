import React, { Component } from 'react';
import NewComment from './newcomment';
import SingleComment from './singlecomment'
import './comment.css'
import axios from 'axios';
import { withRouter } from "react-router";
import ErrorModal from '../materialUI/errormodal';
import Progress from '../materialUI/progress';
import Button from '@material-ui/core/Button';

class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            isloading: true,
            iserror: false,
            ErrorMessage: ""
        }
    }

    componentDidMount() {
        let { itemid } = this.props.match.params;
        axios.get(`http://localhost:5000/comments/${itemid}`)
            .then(response => {
                const { comments } = response.data;
                this.setState({ comments: comments, isloading: false })
            })
            .catch((response) => {
                this.setState({ iserror: true, ErrorMessage: response.response.data.message })
            });
    }

    errorHandler = () => {
        this.setState({ iserror: false })
    }

    gobackHandler = () => {
        let { userid } = this.props.match.params;
        const { history } = this.props;
        history.push(`/${userid}/items`)
    }

    render() {
        return (
            <React.Fragment>
                {this.state.iserror && <ErrorModal text={this.state.ErrorMessage} errorfunction={this.errorHandler} />}
                <section class="content-item" id="comments" style={{ marginTop: "40px" }}>
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-8">
                                <NewComment />
                                <h3>{this.state.comments.length} Comments</h3>
                                {
                                    this.state.isloading ? <Progress /> :
                                        this.state.comments.map((row, index) => (
                                            <div key={index} style={{ padding: "10px" }}>
                                                <SingleComment information={row} />
                                            </div>
                                        ))
                                }
                            </div>
                        </div>
                    </div>
                </section>
                <Button onClick={this.gobackHandler} variant="contained" component="label" color="secondary" style={{ width: "200px", margin: "20px 10px" }} > go to user items </Button>
            </React.Fragment>
        )
    }
}

export default withRouter(Comments);