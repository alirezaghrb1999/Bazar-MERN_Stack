import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';


const ImageAvatar = (props) => {
  return (
    <div>
      <Avatar style={{ height: '150px', width: '150px' }} src={props.photo}/>
    </div>
  );
}

export default ImageAvatar;
